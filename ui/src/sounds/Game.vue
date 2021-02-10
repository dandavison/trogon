<template>
  <section>
    <challenge-description
      :ebirdLocIds="ebirdLocIds"
      :ebirdHotspots="ebirdHotspots"
      :locationSpecies="locationSpecies"
      :challengeRecordings="challengeRecordings"
      :challengeFamilies="challengeFamilies"
    />

    <b-loading v-model="isLoading"></b-loading>

    <challenge-controls
      :image="image"
      :recording="recording"
      :setNextRecording="setNextRecording"
      :settings="settings"
      @play:challenge-recording="challengeActive = true"
    />

    <game-form
      v-if="challengeActive"
      ref="gameForm"
      :locationSpecies="locationSpecies"
      :recording="recording"
      :imageURLMaps="imageURLMaps"
      :settings="settings"
    />

    <reveal-area
      v-if="
        $refs.gameForm &&
        ($refs.gameForm.isSpeciesEnCorrect() ||
          $refs.gameForm.isSpeciesSciCorrect())
      "
      :image="image"
      :recording="recording"
      :recordings="recordings"
      :settings="settings"
    />
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { EbirdHotspot, EbirdObservation } from "types";
import {
  fetchEbirdHotspots,
  ebirdSpecies,
  fetchLocationSpecies,
  fetchRecentObservations,
  fetchSpeciesImages,
  fetchEbirdHotspotsByLatLng,
} from "./ebird";
import { fetchAllRecordings, isSong } from "./xeno-canto";
import { isDefaultSelectedFamily } from "./birds";
import RecordingPlayer from "./RecordingPlayer.vue";
import {
  LocationRequest,
  ChallengeFamily,
  EbirdSpecies,
  ImageURLMaps,
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
      speciesCode2SciName: new Map([]) as Map<string, string>,
      species2familySci: new Map([]) as Map<string, string>,
      species2familyEn: new Map([]) as Map<string, string>,
      commonSpecies: new Set([]) as Set<string>,
      recentObservations: [] as EbirdObservation[],
      challengeFamilies: new Map([]) as Map<string, ChallengeFamily>,
      selectedFamilies: new Set([]) as Set<string>,
      speciesImages: [] as SpeciesImages[],
      imageURLMaps: makeImageURLMaps([], []),
      recordings: new Map([]) as Map<string, Recording[]>, // sciName
      challengeRecordings: [] as Recording[],
      challengeRecordingsIterator: makeRecordingsIterator(
        []
      ) as Iterator<Recording>,
      recording: null as Recording | null,
      haveLocationData: false,
      challengeActive: false,
      image: "",
    };
  },

  created: async function () {
    await this.fetchLocationData();
    this.haveLocationData = true;
    this.imageURLMaps = makeImageURLMaps(
      this.speciesImages,
      this.locationSpecies
    );
    this.speciesCode2SciName = new Map(
      this.locationSpecies.map((sp) => [sp.speciesCode, sp.sciName])
    );
    this.species2familySci = new Map(
      this.locationSpecies.map((sp) => [sp.sciName, sp.familySciName])
    );
    this.species2familyEn = new Map(
      this.locationSpecies.map((sp) => [sp.sciName, sp.familyComName])
    );
    this.commonSpecies = new Set(
      this.recentObservations
        .map((obs) => this.speciesCode2SciName.get(obs.speciesCode))
        .filter(Boolean) as any
    );
    this.challengeFamilies = makeChallengeFamilies(this.locationSpecies);
    this.selectedFamilies = new Set(
      Array.from(this.challengeFamilies.entries())
        .filter(([_, { selected }]) => selected)
        .map(([family, _]) => family)
    );
    this.setChallengeRecordings();
  },

  mounted: function () {
    eventBus.$on("family:select", this.handleFamilySelection);
  },

  watch: {
    settings: {
      deep: true,
      handler: function (_newVal: Settings) {
        this.setChallengeRecordings();
      },
    },
    challengeFamilies: {
      deep: true,
      handler: function (_newVal: Map<string, ChallengeFamily>) {
        this.setChallengeRecordings();
      },
    },
  },

  computed: {
    isLoading(): Boolean {
      return !this.haveLocationData;
    },
  },

  methods: {
    setChallengeRecordings(): void {
      this.challengeRecordings = this.makeChallengeRecordings(
        this.locationSpecies
      );
      this.challengeRecordingsIterator = makeRecordingsIterator(
        this.challengeRecordings
      );
    },

    handleFamilySelection(family: string, selected: boolean): void {
      var challengeFamily = this.challengeFamilies.get(family);
      if (challengeFamily) {
        challengeFamily.selected = selected;
      }
    },

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
        [this.recordings, this.speciesImages] = await Promise.all([
          fetchAllRecordings(this.locationSpecies, this.ebirdHotspots),
          fetchSpeciesImages(this.locationSpecies),
        ]);
        console.log(`Fetched data for ${this.ebirdLocIds.length} locIds:`);
        console.log(`hotspots: ${this.ebirdHotspots.length}`);
        console.log(`species: ${this.locationSpecies.length}`);
        console.log(`images: ${this.speciesImages.length}`);
        console.log(`recordings: ${this.recordings.size}`);
        console.log(`recent observations: ${this.recentObservations.length}`);
      } catch (err) {
        console.log("Error fetching location species and recordings: ", err);
      }
    },

    makeChallengeRecordings: function (species: EbirdSpecies[]): Recording[] {
      var challengeRecordings = [];
      for (let sp of _.shuffle(species)) {
        const recordings = this.recordings.get(sp.sciName) || [];
        // TODO: type
        for (let recording of this.makeSpeciesRecordingsIterator(
          recordings
        ) as any) {
          challengeRecordings.push(recording);
          break;
        }
      }
      return challengeRecordings;
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
        !this.selectedFamilies.has(this.species2familyEn.get(species) || "")
      ) {
        return false;
      }
      return true;
    },

    setNextRecording(): void {
      (this.$refs.gameForm as any)?.clearInput();
      this.image = "";
      const rec = this.challengeRecordingsIterator.next();
      if (!rec.done) {
        this.recording = rec.value;
        let images = this.imageURLMaps.speciesSciName2images.get(
          this.recording.speciesSci
        );
        if (images) {
          let image = images.values().next();
          if (!image.done) {
            this.image = image.value;
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

function makeImageURLMaps(
  speciesImages: SpeciesImages[],
  locationSpecies: EbirdSpecies[]
): ImageURLMaps {
  var speciesSciName2images: Map<string, Set<string>> = new Map();
  var genus2images: Map<string, Set<string>> = new Map();
  var familySci2images: Map<string, Set<string>> = new Map();
  var familyEn2images: Map<string, Set<string>> = new Map();

  const species2images = new Map(
    speciesImages.map((obj) => [obj.species, obj.urls])
  );

  for (let sp of locationSpecies) {
    let genus = ebirdSpecies.getGenus(sp);
    let speciesSci = ebirdSpecies.getSpeciesSci(sp);
    let haveSeenGenus = true;
    let images = species2images.get(sp.sciName) || [];
    if (images[0]) {
      speciesSciName2images.set(speciesSci, new Set(images));

      if (!genus2images.has(genus)) {
        genus2images.set(genus, new Set());
        haveSeenGenus = false;
      }
      genus2images.get(genus)?.add(images[0]);
      if (!haveSeenGenus) {
        let familySci = ebirdSpecies.getFamilySci(sp);
        let familyEn = ebirdSpecies.getFamilyEn(sp);
        if (!familySci2images.has(familySci)) {
          familySci2images.set(familySci, new Set());
        }
        if (!familyEn2images.has(familyEn)) {
          familyEn2images.set(familyEn, new Set());
        }
        familySci2images.get(familySci)?.add(images[0]);
        familyEn2images.get(familyEn)?.add(images[0]);
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

function* makeRecordingsIterator(recordings: Recording[]): Iterator<Recording> {
  for (let rec of recordings) {
    yield rec;
  }
}
</script>
