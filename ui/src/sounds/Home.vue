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
      <p class="level-item has-text-centered" v-if="recording">
        <audio controls :src="recording.url"></audio>
      </p>
    </nav>
    <section>
      <b-field label="Family">
        <span>
          <b-autocomplete
            type="text"
            v-model="answer.family"
            :data="filterFamily()"
            :class="{ 'is-success': isFamilyCorrect() }"
          />
          <p v-if="answer.family">{{ isFamilyCorrect() ? "✅" : "❌" }}</p>
        </span>
      </b-field>
      <b-field label="Genus">
        <b-autocomplete
          type="text"
          v-model="answer.genus"
          :data="filterGenus()"
          :class="{ 'is-success': isGenusCorrect() }"
        />
        <p v-if="answer.genus">{{ isGenusCorrect() ? "✅" : "❌" }}</p>
      </b-field>
      <b-field label="Species">
        <b-autocomplete
          type="text"
          v-model="answer.species"
          :data="filterSpecies()"
          :class="{ 'is-success': isSpeciesCorrect() }"
        />
        <p v-if="answer.species">{{ isSpeciesCorrect() ? "✅" : "❌" }}</p>
      </b-field>
    </section>
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
import Vue from "vue";
import { EbirdSpecies, Recording } from "types";
import {
  ebirdSpecies,
  filterToCommonSpecies,
  fetchEbirdHotspot,
} from "./ebird";
import { getRecordings } from "./xeno_canto";
import { fetchJSONArraySynchronously } from "../utils";

function* makeRecordingsIterator(species: EbirdSpecies[]): Iterator<Recording> {
  for (const sp of species) {
    const recordings = getRecordings(sp);
    if (recordings[0]) {
      yield recordings[0];
    }
  }
}

export default Vue.extend({
  name: "Home",
  props: { ebirdLocId: String },
  data() {
    const locationSpecies = fetchJSONArraySynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${this.ebirdLocId}`
    ) as EbirdSpecies[];
    var challengeSpecies = filterToCommonSpecies(
      locationSpecies,
      this.ebirdLocId
    );
    const challengeFamilies = Object.entries(
      _.groupBy(challengeSpecies, (sp) => sp.familyComName)
    ).map(([family, spp]) => {
      return { family: family, n: spp.length, selected: false };
    });

    challengeSpecies = _.shuffle(challengeSpecies);

    return {
      challengeSpecies,
      challengeFamilies,
      ebirdHotspot: fetchEbirdHotspot(this.ebirdLocId),
      locationSpecies,
      recording: null as Recording | null,
      answer: {
        family: "",
        genus: "",
        species: "",
      },
    };
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
      return makeRecordingsIterator(this.selectedChallengeSpecies);
    },
  },
  methods: {
    setNextRecording(): void {
      this.answer.family = this.answer.genus = this.answer.species = "";
      const rec = this.challengeRecordings.next();
      if (!rec.done) {
        this.recording = rec.value;
      } else {
        alert("No more recordings!");
      }
    },
    filterFamily(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isFamilyMatch)
            .map(ebirdSpecies.getFamily)
        ),
      ].sort();
    },
    filterGenus(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isGenusMatch)
            .map(ebirdSpecies.getGenus)
        ),
      ].sort();
    },
    filterSpecies(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isSpeciesMatch)
            .map(ebirdSpecies.getSpecies)
        ),
      ].sort();
    },
    isFamilyMatch(species: EbirdSpecies): boolean {
      return this.isFamilyComNameMatch(species);
    },
    isFamilyComNameMatch(species: EbirdSpecies): boolean {
      return species.familyComName
        .toLowerCase()
        .includes(this.answer.family.toLowerCase());
    },
    isFamilyCorrect(): boolean {
      return this.recording?.family === this.answer.family;
    },
    isGenusMatch(species: EbirdSpecies): boolean {
      if (this.answer.family && !this.isFamilyMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getGenus(species)
        .toLowerCase()
        .startsWith(this.answer.genus.toLowerCase());
    },
    isGenusCorrect(): boolean {
      return this.recording?.genus === this.answer.genus;
    },
    isSpeciesMatch(species: EbirdSpecies): boolean {
      if (this.answer.family && !this.isFamilyMatch(species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getSpecies(species)
        .toLowerCase()
        .startsWith(this.answer.species.toLowerCase());
    },
    isSpeciesCorrect(): boolean {
      return this.recording?.species === this.answer.species;
    },
  },
});
</script>

<style scoped>
.is-success input {
  border-color: #48c774;
}
</style>
