<template>
  <section>
    <challenge-description
      :ebirdLocIds="ebirdLocIds"
      :ebirdHotspots="ebirdHotspots"
      :locationSpecies="locationSpecies"
      :filteredLocationSpecies="filteredLocationSpecies"
      :challengeFamilies="challengeFamilies"
    />

    <b-loading v-model="isLoading"></b-loading>

    <challenge-controls
      :image="image"
      :recording="recording"
      :setNextRecording="setNextRecording"
      :taxonMaps="taxonMaps"
      :settings="settings"
    />

    <game-form
      v-if="recording"
      ref="gameForm"
      :locationSpecies="filteredLocationSpecies"
      :recording="recording"
      :image="image"
      :imageURLMaps="imageURLMaps"
      :taxonMaps="taxonMaps"
      :settings="settings"
      @answer:species-correct="(value) => (answerIsCorrectSpecies = value)"
    />

    <reveal-area
      v-if="answerIsCorrectSpecies"
      :image="image"
      :recording="recording"
      :recordings="otherRecordings"
      :settings="settings"
    />
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import {
  fetchEbirdHotspots,
  ebirdSpecies,
  fetchLocationSpecies,
  fetchRecentObservations,
  fetchSpeciesImages,
  fetchEbirdHotspotsByLatLng,
} from "./ebird";
import { fetchRecordings, isSong } from "./xeno-canto";
import { isDefaultSelectedFamily } from "./birds";
import RecordingPlayer from "./RecordingPlayer.vue";
import {
  LocationRequest,
  ChallengeFamily,
  EbirdHotspot,
  EbirdObservation,
  EbirdSpecies,
  TaxonMaps,
  ImageMaps,
  Recording,
  Settings,
  SpeciesImages,
  XenoCantoRecording,
} from "./types";
import GameForm from "./GameForm.vue";

import eventBus from "./event-bus";
import RevealArea from "./RevealArea.vue";
import ChallengeDescription from "./ChallengeDescription.vue";
import ChallengeControls from "./ChallengeControls.vue";

export default Vue.extend({
  name: "Home",
  components: {
    RecordingPlayer,
    GameForm,
    RevealArea,
    ChallengeDescription,
    ChallengeControls,
  },
  props: {
    locationRequest: Object as PropType<LocationRequest>,
    settings: Object as PropType<Settings>,
  },

  data() {
    return {
      ebirdLocIds: [] as string[],
      ebirdHotspots: [] as EbirdHotspot[],
      locationSpecies: [] as EbirdSpecies[],
      filteredLocationSpecies: [] as EbirdSpecies[],
      speciesCode2SciName: new Map([]) as Map<string, string>,
      commonSpecies: new Set([]) as Set<string>,
      recentObservations: [] as EbirdObservation[],
      challengeFamilies: new Map([]) as Map<string, ChallengeFamily>,
      selectedFamilies: new Set([]) as Set<string>,
      speciesImages: [] as SpeciesImages[],
      taxonMaps: makeTaxonMaps([]),
      imageURLMaps: makeImageMaps([], []),
      challengeRecordingsIterator: makeEmptyRecordingsIterator() as AsyncGenerator<
        [Recording, Recording[]]
      >,
      recording: null as Recording | null,
      otherRecordings: [] as Recording[],
      haveLocationData: false,
      challengeActive: false,
      image: "",
      answerIsCorrectSpecies: false,
    };
  },

  created: async function () {
    if (!this.settings.disableNetworkRequests) {
      await this.fetchLocationData();
    }
    this.haveLocationData = true;
    this.imageURLMaps = makeImageMaps(this.speciesImages, this.locationSpecies);
    this.taxonMaps = makeTaxonMaps(this.locationSpecies);
    this.commonSpecies = new Set(
      this.recentObservations
        .map((obs) => this.speciesCode2SciName.get(obs.speciesCode))
        .filter(Boolean) as any
    );
    this.challengeFamilies = makeChallengeFamilies(this.locationSpecies);
    eventBus.$emit("set:challenge-families", this.challengeFamilies);
    this.applyFamilyFilter();
    this.challengeRecordingsIterator = this.makeChallengeRecordingsIterator();
  },

  mounted: function () {
    eventBus.$on("family:select", this.handleFamilySelection);
    eventBus.$on(
      "ready:challenge-recording",
      () => (this.challengeActive = true)
    );
  },

  computed: {
    isLoading(): Boolean {
      return !this.haveLocationData;
    },
  },

  methods: {
    async fetchLocationData(): Promise<void> {
      try {
        // Determine locations from request parameters
        if (this.locationRequest.ebirdLocId) {
          this.ebirdLocIds = [this.locationRequest.ebirdLocId];
        } else if (this.locationRequest.latlng) {
          this.ebirdHotspots = await fetchEbirdHotspotsByLatLng(
            this.locationRequest.latlng
          );
          this.ebirdLocIds = this.ebirdHotspots.map((h) => h.locId);
        } else {
          throw "Expected ebird ebirdLocId or coordinates";
        }
        // In parallel: given locations, fetch combined species list, hotspot info, and recent observations.
        [
          this.locationSpecies,
          this.ebirdHotspots,
          this.recentObservations,
        ] = await Promise.all([
          fetchLocationSpecies(this.ebirdLocIds),
          this.ebirdHotspots.length > 0
            ? Promise.resolve(this.ebirdHotspots)
            : fetchEbirdHotspots(this.ebirdLocIds),
          fetchRecentObservations(this.ebirdLocIds),
        ]);
        // In parallel: given species list, fetch recording and image URLs
        this.speciesImages = await fetchSpeciesImages(this.locationSpecies);
        console.log(`Fetched data for ${this.ebirdLocIds.length} locIds:`);
        console.log(`hotspots: ${this.ebirdHotspots.length}`);
        console.log(`species: ${this.locationSpecies.length}`);
        console.log(`images: ${this.speciesImages.length}`);
        console.log(`recent observations: ${this.recentObservations.length}`);
      } catch (err) {
        console.log("Error fetching location species and recordings: ", err);
      }
    },

    applyFamilyFilter(): void {
      this.selectedFamilies = new Set(
        Array.from(this.challengeFamilies.entries())
          .filter(([_, { selected }]) => selected)
          .map(([family, _]) => family)
      );
      this.filteredLocationSpecies = this.locationSpecies.filter((sp) =>
        this.selectedFamilies.has(
          this.taxonMaps.species2familyEn.get(sp.sciName) || ""
        )
      );
    },

    handleFamilySelection(family: string, selected: boolean): void {
      var challengeFamily = this.challengeFamilies.get(family);
      if (challengeFamily) {
        challengeFamily.selected = selected;
      }
      this.applyFamilyFilter();
    },

    makeChallengeRecordingsIterator: async function* (): AsyncGenerator<
      [Recording, Recording[]]
    > {
      for (let sp of _.shuffle(this.locationSpecies)) {
        const recordings = await fetchRecordings(sp, this.ebirdHotspots);
        // TODO: type
        for (let recording of this.makeSpeciesRecordingsIterator(
          recordings
        ) as any) {
          yield [recording, recordings];
          break;
        }
      }
    },

    makeSpeciesRecordingsIterator: function* (
      recordings: Recording[]
    ): Iterator<Recording> {
      for (let recording of _.shuffle(recordings)) {
        if (this.recordingMatchesFilters(recording.raw, this.settings)) {
          yield recording;
        }
      }
    },

    recordingMatchesFilters(
      xcRec: XenoCantoRecording,
      settings: Settings
    ): boolean {
      if (settings.songsOnly && !isSong(xcRec.type)) {
        return false;
      }
      const species = `${xcRec.gen} ${xcRec.sp}`;
      if (settings.commonSpeciesOnly && !this.commonSpecies.has(species)) {
        return false;
      }
      if (
        !new Set(this.filteredLocationSpecies.map((sp) => sp.sciName)).has(
          species
        )
      ) {
        return false;
      }
      return true;
    },

    async setNextRecording(): Promise<void> {
      (this.$refs.gameForm as any)?.clear();
      this.image = "";
      const rec = await this.challengeRecordingsIterator.next();
      if (!rec.done) {
        [this.recording, this.otherRecordings] = rec.value;
        let images = this.imageURLMaps.speciesSciName2images.get(
          this.recording.speciesSci
        );
        if (images) {
          let image = images.values().next();
          if (!image.done && image.value.urls[0]) {
            this.image = image.value.urls[0];
          } else {
            alert("No images for species!");
          }
        }
      } else {
        alert("No more recordings!");
      }
    },
  },
});

function makeChallengeFamilies(
  challengeSpecies: EbirdSpecies[]
): Map<string, ChallengeFamily> {
  const family2order = new Map(
    challengeSpecies.map((sp) => [sp.familyComName, sp.order])
  );

  return new Map(
    Object.entries(_.groupBy(challengeSpecies, (sp) => sp.familyComName)).map(
      ([family, spp]) => [
        family,
        {
          n: spp.length,
          selected: isDefaultSelectedFamily(family, family2order),
        },
      ]
    )
  );
}

export function makeTaxonMaps(species: EbirdSpecies[]): TaxonMaps {
  const speciesCode2SciName = new Map();
  const species2familySci = new Map();
  const species2familyEn = new Map();
  const familyEn2Sci = new Map();
  const familySci2En = new Map();
  const genus2familySci = new Map();
  const speciesSci2genus = new Map();
  const speciesSci2En = new Map();
  const speciesEn2Sci = new Map();

  for (let sp of species) {
    speciesCode2SciName.set(sp.speciesCode, sp.sciName);
    species2familySci.set(sp.sciName, sp.familySciName);
    species2familyEn.set(sp.sciName, sp.familyComName);
    familyEn2Sci.set(sp.familyComName, sp.familySciName);
    familySci2En.set(sp.familySciName, sp.familyComName);
    genus2familySci.set(ebirdSpecies.getGenus(sp), sp.familySciName);
    speciesSci2genus.set(sp.sciName, ebirdSpecies.getGenus(sp));
    speciesSci2En.set(sp.sciName, sp.comName);
    speciesEn2Sci.set(sp.comName, sp.sciName);
  }

  return {
    speciesCode2SciName,
    species2familySci,
    species2familyEn,
    familyEn2Sci,
    familySci2En,
    genus2familySci,
    speciesSci2genus,
    speciesSci2En,
    speciesEn2Sci,
  };
}

function makeImageMaps(
  speciesImages: SpeciesImages[],
  locationSpecies: EbirdSpecies[]
): ImageMaps {
  var speciesSciName2images: Map<string, SpeciesImages[]> = new Map();
  var genus2images: Map<string, SpeciesImages[]> = new Map();
  var familySci2images: Map<string, SpeciesImages[]> = new Map();
  var familyEn2images: Map<string, SpeciesImages[]> = new Map();

  const species2images = new Map(
    speciesImages.map((obj) => [obj.species, obj])
  );

  for (let sp of locationSpecies) {
    let genus = ebirdSpecies.getGenus(sp);
    let speciesSci = ebirdSpecies.getSpeciesSci(sp);
    let haveSeenGenus = true;
    let images = species2images.get(sp.sciName);
    if (images) {
      speciesSciName2images.set(speciesSci, [images]);

      if (!genus2images.has(genus)) {
        genus2images.set(genus, []);
        haveSeenGenus = false;
      }
      genus2images.get(genus)?.push(images);
      if (!haveSeenGenus) {
        let familySci = ebirdSpecies.getFamilySci(sp);
        let familyEn = ebirdSpecies.getFamilyEn(sp);
        if (!familySci2images.has(familySci)) {
          familySci2images.set(familySci, []);
        }
        if (!familyEn2images.has(familyEn)) {
          familyEn2images.set(familyEn, []);
        }
        familySci2images.get(familySci)?.push(images);
        familyEn2images.get(familyEn)?.push(images);
      }
    }
  }

  return {
    speciesSciName2images,
    genus2images,
    familySci2images,
    familyEn2images,
  };
}

async function* makeEmptyRecordingsIterator(): AsyncGenerator<
  [Recording, Recording[]]
> {}
</script>
