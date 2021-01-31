<template>
  <section style="margin-top: 50px">
    <section>
      <h1 style="font-weight: bold">{{ ebirdHotspot.locName }}</h1>
      <ul>
        <li>{{ locationSpecies.length }} species total</li>
        <li>
          {{ selectedChallengeSpecies.length }} species in current challenge
        </li>
      </ul>
    </section>

    <nav class="level">
      <p class="level-item has-text-centered">
        <b-button @click="setNextRecording">
          {{ recording ? "Next" : "Start" }}
        </b-button>
      </p>
      <p
        class="level-item"
        v-if="settings.promptIncludesRecording && recording"
      >
        <recording-component :recording="recording" />
      </p>

      <p class="level-item" v-if="settings.promptIncludesImages && image">
        <img :src="image" />
      </p>

      <p class="level-item has-text-centered">
        <b-button v-if="recording" @click="revealSpecies"> Reveal </b-button>
      </p>
    </nav>

    <div class="container">
      <div class="columns">
        <div class="column">
          <game-form
            ref="gameForm"
            :locationSpecies="locationSpecies"
            :recording="recording"
            :settings="settings"
          />
        </div>
        <div class="column"></div>
      </div>
    </div>

    <div
      v-if="
        image &&
        (showImage ||
          $refs.gameForm.isSpeciesEnCorrect() ||
          $refs.gameForm.isSpeciesSciCorrect())
      "
    >
      <nav class="level">
        <p class="level-item">
          <a :href="recordingSpeciesWikipediaURL()" target="_blank">
            {{ recordingSpeciesSciName() }}
          </a>
        </p>

        <p class="level-item">
          <img :src="image" />
        </p>
      </nav>

      <p v-if="settings.promptIncludesRecording && recording">
        <recording-component
          v-for="rec in recordings.get(recording.speciesCode)"
          :key="rec.url"
          :recording="rec"
        />
      </p>
    </div>

    <section
      id="family-selector"
      style="margin-top: 50px; height: 400px; overflow-y: auto"
    >
      <ul>
        <li v-for="family in challengeFamilies" :key="family.family">
          <b-checkbox v-model="family.selected"></b-checkbox
          >{{ family.family }} ({{ family.n }})
        </li>
      </ul>
    </section>
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { EbirdSpecies } from "types";
import { filterToCommonSpecies, fetchEbirdHotspot } from "./ebird";
import { getRecordings, recordingMatchesFilters } from "./xeno-canto";
import { isDefaultSelectedFamily } from "./birds";
import { fetchJSONArraySynchronously } from "../utils";
import RecordingComponent from "./Recording.vue";
import { NamesLanguage, Recording, Settings } from "./types";
import GameForm from "./GameForm.vue";

export default Vue.extend({
  name: "Home",
  components: { RecordingComponent, GameForm },
  props: { ebirdLocId: String, settings: Object as PropType<Settings> },

  data() {
    const ebirdHotspot = fetchEbirdHotspot(this.ebirdLocId);

    const locationSpecies = fetchJSONArraySynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${this.ebirdLocId}`
    ) as EbirdSpecies[];

    const family2order = new Map(
      locationSpecies.map((sp) => [sp.familyComName, sp.order])
    );

    const speciesSciName2images = new Map(
      locationSpecies.map((sp) => [sp.sciName, sp.images])
    );

    var challengeSpecies = filterToCommonSpecies(
      locationSpecies,
      this.ebirdLocId
    );

    const challengeFamilies = Object.entries(
      _.groupBy(challengeSpecies, (sp) => sp.familyComName)
    ).map(([family, spp]) => {
      return {
        family: family,
        n: spp.length,
        selected: isDefaultSelectedFamily(family, family2order),
      };
    });

    challengeSpecies = _.shuffle(challengeSpecies);

    return {
      challengeSpecies,
      challengeFamilies,
      ebirdHotspot,
      locationSpecies,
      speciesSciName2images,
      recordings: new Map([]) as Map<string, Recording[]>, // speciesCode
      recording: null as Recording | null,
      showImage: false,
      image: "",
    };
  },

  created: function () {
    this.fetchAllRecordings();
  },

  computed: {
    selectedChallengeSpecies(): EbirdSpecies[] {
      const selectedFamilies = new Set(
        this.challengeFamilies
          .filter(({ selected }) => selected)
          .map((family) => family.family)
      );
      return this.challengeSpecies.filter((sp) =>
        selectedFamilies.has(sp.familyComName)
      );
    },

    challengeRecordings(): Iterator<Recording> {
      return this.makeRecordingsIterator(this.selectedChallengeSpecies);
    },
  },

  methods: {
    revealSpecies(): void {
      if (this.recording) {
        (this.$refs["gameForm"] as any).revealSpecies();
        this.showImage = true;
      }
    },

    fetchAllRecordings(): void {
      for (let sp of this.selectedChallengeSpecies) {
        getRecordings(sp, this.ebirdHotspot).then((recs) => {
          this.recordings.set(sp.speciesCode, recs);
        });
      }
    },

    makeRecordingsIterator: function* (
      species: EbirdSpecies[]
    ): Iterator<Recording> {
      for (const sp of species) {
        const recordings = this.recordings.get(sp.speciesCode);
        if (
          recordings &&
          recordings[0] &&
          recordingMatchesFilters(recordings[0].raw, this.settings)
        ) {
          yield recordings[0];
        }
      }
    },

    setNextRecording(): void {
      (this.$refs.gameForm as any).clearInput();
      this.showImage = false;
      const rec = this.challengeRecordings.next();
      if (!rec.done) {
        this.recording = rec.value;
        let images = this.speciesSciName2images.get(
          `${this.recording.genus} ${this.recording.speciesSci}`
        );
        this.image = images && images[0] ? images[0] : "";
      } else {
        alert("No more recordings!");
      }
    },

    recordingSpeciesWikipediaURL(): string | null {
      if (this.recording) {
        return `https://en.wikipedia.org/w/index.php?title=${this.recording.genus}_${this.recording.speciesSci}`;
      } else {
        return null;
      }
    },

    // TODO: remove species/genus names from Recording, leaving speciesCode foreign key.
    recordingSpeciesSciName(): string | null {
      if (this.recording) {
        const speciesEn = this.recording.speciesEn;
        if (this.settings.names == NamesLanguage.English) {
          return speciesEn;
        } else {
          const speciesSci = `${this.recording.genus} ${this.recording.speciesSci}`;
          if (this.settings.names == NamesLanguage.Scientific) {
            return speciesSci;
          } else {
            return `${speciesSci} (${speciesEn})`;
          }
        }
      } else {
        return null;
      }
    },
  },
});
</script>
