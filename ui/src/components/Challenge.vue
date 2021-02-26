<template>
  <section>
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <challenge-description
            :ebirdLocIds="ebirdLocIds"
            :ebirdHotspots="ebirdHotspots"
            :locationSpecies="locationSpecies"
            :filteredLocationSpecies="filteredLocationSpecies"
            :challengeFamilies="challengeFamilies"
            :commonSpecies="commonSpecies"
            :recentObservations="recentObservations"
            :settings="settings"
          />
        </div>
      </div>
      <div v-if="state > ChallengeState.StartedChallenge" class="level-right">
        <div class="level-item">
          {{ score.correct.size }} / {{ score.nPrompts }}
        </div>
      </div>
    </div>

    <b-loading :active="isLoading"></b-loading>

    <challenge-controls
      :image="image"
      :recording="recording"
      :state="state"
      @challenge:play="nextPrompt"
      @challenge:next="nextPrompt"
      :taxonMaps="taxonMaps"
      :settings="settings"
    />

    <challenge-form
      v-if="state >= ChallengeState.StartedChallenge"
      ref="challengeForm"
      :locationSpecies="filteredLocationSpecies"
      :recording="recording"
      :image="image"
      :imageURLMaps="imageURLMaps"
      :taxonMaps="taxonMaps"
      :settings="settings"
      @answer:species-correct="handleAnswerSpeciesCorrect"
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
  fetchLocationSpecies,
  fetchRecentObservations,
  fetchSpeciesImages,
  fetchEbirdHotspotsByLatLng,
} from "../ebird";
import { fetchRecordings, isSong } from "../xeno-canto";
import { isDefaultSelectedFamily } from "../birds";
import RecordingPlayer from "./RecordingPlayer.vue";
import {
  LocationRequest,
  ChallengeFamily,
  ChallengeState,
  EbirdHotspot,
  EbirdObservation,
  TaxonMaps,
  ImageMaps,
  Recording,
  Settings,
  Species,
  SpeciesImages,
  XenoCantoRecording,
} from "../types";
import ChallengeForm from "./ChallengeForm.vue";

import eventBus from "../event-bus";
import RevealArea from "./RevealArea.vue";
import ChallengeDescription from "./ChallengeDescription.vue";
import ChallengeControls from "./ChallengeControls.vue";

export default Vue.extend({
  name: "Home",
  components: {
    RecordingPlayer,
    ChallengeForm,
    RevealArea,
    ChallengeDescription,
    ChallengeControls,
  },
  props: {
    locationRequest: Object as PropType<LocationRequest>,
    settings: Object as PropType<Settings>,
  },

  data() {
    const challengeRecordingsIterator = makeEmptyRecordingsIterator();
    return {
      ebirdLocIds: [] as string[],
      ebirdHotspots: [] as EbirdHotspot[],
      locationSpecies: [] as Species[],
      filteredLocationSpecies: [] as Species[],
      commonSpecies: new Set([]) as Set<string>,
      recentObservations: [] as EbirdObservation[],
      challengeFamilies: new Map([]) as Map<string, ChallengeFamily>,
      selectedFamilies: new Set([]) as Set<string>,
      taxonMaps: makeTaxonMaps([]),
      imageURLMaps: makeImageMaps([], []),
      challengeRecordingsIterator,
      _nextRecording: challengeRecordingsIterator.next(),
      recording: null as Recording | null,
      otherRecordings: [] as Recording[],
      state: ChallengeState.Init as ChallengeState,
      ChallengeState,
      image: "",
      answerIsCorrectSpecies: false,
      score: {
        correct: new Set() as Set<string>,
        revealed: new Set() as Set<string>,
        nPrompts: 0,
      },
    };
  },

  created: async function () {
    if (!this.settings.disableNetworkRequests) {
      await this.fetchLocationData();
    }
    this.state = ChallengeState.HaveLocationData;
    this.taxonMaps = makeTaxonMaps(this.locationSpecies);
    this.commonSpecies = new Set(
      this.recentObservations
        .map((obs) => this.taxonMaps.speciesId2SciName.get(obs.speciesCode))
        .filter(Boolean) as any
    );
    this.challengeFamilies = makeChallengeFamilies(this.locationSpecies);
    eventBus.$emit("set:challenge-families", this.challengeFamilies);
    this.filterSpecies();
    this.challengeRecordingsIterator = this.makeChallengeRecordingsIterator();
    this._nextRecording = this.challengeRecordingsIterator.next();
    eventBus.$on("family:select", this.handleFamilySelection);
    eventBus.$on("change:species-filters", this.filterSpecies);
    eventBus.$on("challenge:have-recording", () => {
      this.state = ChallengeState.HaveRecording;
    });
    eventBus.$on("reveal-field", this.handleReveal);
  },

  computed: {
    isLoading(): boolean {
      return (
        this.state == ChallengeState.Init ||
        this.state == ChallengeState.StartedChallenge
      );
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
        fetchSpeciesImages(this.locationSpecies).then(
          (images) =>
            (this.imageURLMaps = makeImageMaps(images, this.locationSpecies))
        );
        console.log(`Fetched data for ${this.ebirdLocIds.length} locIds:`);
        console.log(`hotspots: ${this.ebirdHotspots.length}`);
        console.log(`species: ${this.locationSpecies.length}`);
        console.log(`recent observations: ${this.recentObservations.length}`);
      } catch (err) {
        console.log("Error fetching location species and recordings: ", err);
      }
    },

    filterSpecies(): void {
      this.selectedFamilies = new Set(
        Array.from(this.challengeFamilies.entries())
          .filter(([_, { selected }]) => selected)
          .map(([family, _]) => family)
      );
      var species = this.locationSpecies.filter((sp) =>
        this.selectedFamilies.has(
          this.taxonMaps.species2familyEn.get(sp.speciesSci) || ""
        )
      );
      if (this.settings.commonSpeciesOnly) {
        species = species.filter((sp) => this.commonSpecies.has(sp.speciesSci));
      }
      this.filteredLocationSpecies = species;
    },

    handleFamilySelection(family: string, selected: boolean): void {
      var challengeFamily = this.challengeFamilies.get(family);
      if (challengeFamily) {
        challengeFamily.selected = selected;
        // HACK: force re-evaluation of computed properties depending on this
        this.challengeFamilies = new Map(this.challengeFamilies);
      }
      this.filterSpecies();
    },

    // For each species having some recording passing current filters,
    // yield [recording, recordings].
    makeChallengeRecordingsIterator: async function* (): AsyncGenerator<
      [Recording, Recording[]]
    > {
      for (let species of _.shuffle(this.locationSpecies)) {
        let sppecies = new Set(
          this.filteredLocationSpecies.map((sp) => sp.speciesSci)
        );
        if (sppecies.has(species.speciesSci)) {
          let recordings = await fetchRecordings(species, this.ebirdHotspots);
          for (let recording of recordings) {
            if (this.recordingMatchesFilters(recording.raw)) {
              recording.audio = new Audio(recording.url);
              recording.audio.load();
              yield [recording, recordings];
              break;
            }
          }
        }
      }
    },

    recordingMatchesFilters(xcRecording: XenoCantoRecording): boolean {
      if (this.settings.songsOnly && !isSong(xcRecording.type)) {
        return false;
      }
      const species = `${xcRecording.gen} ${xcRecording.sp}`;
      if (this.settings.commonSpeciesOnly && !this.commonSpecies.has(species)) {
        return false;
      }
      return true;
    },

    async nextPrompt(): Promise<void> {
      this.state = ChallengeState.StartedChallenge;
      this.recording = null;
      this.image = "";
      (this.$refs.challengeForm as any)?.clear();

      // Enqueue download of audio data for next recording.
      const nextRecording = this._nextRecording;
      this._nextRecording = this._nextRecording.then(
        () => (this._nextRecording = this.challengeRecordingsIterator.next())
      );
      const result = await nextRecording;

      if (!result.done) {
        [this.recording, this.otherRecordings] = result.value;
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
        this.score.nPrompts += 1;
      } else {
        alert("No more recordings!");
      }
    },

    handleAnswerSpeciesCorrect(isCorrect: boolean): void {
      this.answerIsCorrectSpecies = isCorrect;
      if (!this.recording) {
        return;
      }
      const key = this.recording.url;
      if (this.answerIsCorrectSpecies && !this.score.revealed.has(key)) {
        this.score.correct.add(key);
      }
    },

    handleReveal(): void {
      if (!this.recording) {
        return;
      }
      const key = this.recording.url;
      this.score.revealed.add(key);
      this.score.correct.delete(key);
    },
  },
});

function makeChallengeFamilies(
  challengeSpecies: Species[]
): Map<string, ChallengeFamily> {
  const family2order = new Map(
    challengeSpecies.map((sp) => [sp.familyEn, sp.order])
  );

  return new Map(
    Object.entries(_.groupBy(challengeSpecies, (sp) => sp.familyEn)).map(
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

export function makeTaxonMaps(species: Species[]): TaxonMaps {
  const speciesId2SciName = new Map();
  const species2familySci = new Map();
  const species2familyEn = new Map();
  const familyEn2Sci = new Map();
  const familySci2En = new Map();
  const genus2familySci = new Map();
  const speciesSci2genus = new Map();
  const speciesSci2En = new Map();
  const speciesEn2Sci = new Map();

  for (let sp of species) {
    speciesId2SciName.set(sp.id, sp.speciesSci);
    species2familySci.set(sp.speciesSci, sp.familySci);
    species2familyEn.set(sp.speciesSci, sp.familyEn);
    familyEn2Sci.set(sp.familyEn, sp.familySci);
    familySci2En.set(sp.familySci, sp.familyEn);
    genus2familySci.set(sp.genus, sp.familySci);
    speciesSci2genus.set(sp.speciesSci, sp.genus);
    speciesSci2En.set(sp.speciesSci, sp.speciesEn);
    speciesEn2Sci.set(sp.speciesEn, sp.speciesSci);
  }

  return {
    speciesId2SciName,
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
  locationSpecies: Species[]
): ImageMaps {
  var speciesSciName2images: Map<string, SpeciesImages[]> = new Map();
  var genus2images: Map<string, SpeciesImages[]> = new Map();
  var familySci2images: Map<string, SpeciesImages[]> = new Map();
  var familyEn2images: Map<string, SpeciesImages[]> = new Map();

  const species2images = new Map(
    speciesImages.map((obj) => [obj.species, obj])
  );

  for (let sp of locationSpecies) {
    let haveSeenGenus = true;
    let images = species2images.get(sp.speciesSci);
    if (images) {
      speciesSciName2images.set(sp.speciesSci, [images]);

      if (!genus2images.has(sp.genus)) {
        genus2images.set(sp.genus, []);
        haveSeenGenus = false;
      }
      genus2images.get(sp.genus)?.push(images);
      if (!haveSeenGenus) {
        if (!familySci2images.has(sp.familySci)) {
          familySci2images.set(sp.familySci, []);
        }
        if (!familyEn2images.has(sp.familyEn)) {
          familyEn2images.set(sp.familyEn, []);
        }
        familySci2images.get(sp.familySci)?.push(images);
        familyEn2images.get(sp.familyEn)?.push(images);
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
