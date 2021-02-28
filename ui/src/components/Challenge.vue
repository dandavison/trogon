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
          <span
            class="mr-1"
            :style="score.correct.size > 0 ? 'color: #48c774' : ''"
            >{{ score.correct.size }}</span
          >
          /
          <span class="ml-1">{{ score.nPrompts }}</span>
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

    <section class="section">
      <reveal-area
        v-if="answerIsCorrectSpecies"
        :image="image"
        :recording="recording"
        :recordings="otherRecordings"
        :settings="settings"
      />
    </section>

    <family-selector
      :challengeFamilies="challengeFamilies"
      :taxonMaps="taxonMaps"
      :settings="settings"
    />
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { fetchRecordings, isSong } from "../xeno-canto";
import RecordingPlayer from "./RecordingPlayer.vue";
import {
  LocationRequest,
  ChallengeState,
  Recording,
  Settings,
  XenoCantoRecording,
} from "../types";
import ChallengeForm from "./ChallengeForm.vue";

import eventBus from "../event-bus";
import {
  LocationSpeciesSelector,
  makeLocationSpeciesSelectorData,
} from "./mixins";
import RevealArea from "./RevealArea.vue";
import ChallengeDescription from "./ChallengeDescription.vue";
import ChallengeControls from "./ChallengeControls.vue";
import FamilySelector from "../components/FamilySelector.vue";

var Challenge = Vue.extend({
  components: {
    RecordingPlayer,
    ChallengeForm,
    FamilySelector,
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
    return Object.assign(makeLocationSpeciesSelectorData(), {
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
    });
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
    postCreatedHook() {
      this.challengeRecordingsIterator = this.makeChallengeRecordingsIterator();
      this._nextRecording = this.challengeRecordingsIterator.next();
      eventBus.$on("challenge:have-recording", () => {
        this.state = ChallengeState.HaveRecording;
      });
      eventBus.$on("reveal-field", this.handleReveal);
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

Challenge = Challenge.extend(LocationSpeciesSelector);

export default Challenge;

async function* makeEmptyRecordingsIterator(): AsyncGenerator<
  [Recording, Recording[]]
> {}
</script>
