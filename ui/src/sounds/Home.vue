<template>
  <section style="margin-top: 50px">
    <nav class="level">
      <p class="level-item has-text-centered">
        <b-button @click="setNextRecording">
          {{ recording ? "Next" : "Start" }}
        </b-button>
      </p>
      <p class="level-item has-text-centered" v-if="recording">
        <audio controls :src="recording.url" :loop="loop"></audio>
        <b-checkbox v-model="loop">loop {{ loop ? "on" : "off" }}</b-checkbox>
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
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { EbirdSpecies, Recording } from "types";
import { ebirdSpecies } from "./ebird";
import { getRecordings } from "./xeno_canto";
import { fetchJSONArraySynchronously } from "../utils";

function* makeRecordingsIterator(
  locationSpecies: EbirdSpecies[]
): Iterator<Recording> {
  for (let sp of locationSpecies) {
    let recordings = getRecordings(sp);
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
    const recordings = makeRecordingsIterator(locationSpecies);
    return {
      locationSpecies: locationSpecies,
      recordings: recordings,
      recording: null as Recording | null,
      answer: {
        family: "",
        genus: "",
        species: "",
      },
      loop: false,
    };
  },
  methods: {
    setNextRecording: function (): void {
      const rec = this.recordings.next();
      if (!rec.done) {
        this.recording = rec.value;
        console.log("setNextRecording: ", this.recording);
      } else {
        alert("No more recordings!");
      }
    },
    filterFamily: function () {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isFamilyMatch)
            .map(ebirdSpecies.getFamily)
        ),
      ].sort();
    },
    filterGenus: function () {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isGenusMatch)
            .map(ebirdSpecies.getGenus)
        ),
      ].sort();
    },
    filterSpecies: function () {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isSpeciesMatch)
            .map(ebirdSpecies.getSpecies)
        ),
      ].sort();
    },
    isFamilyMatch: function (species: EbirdSpecies): boolean {
      return this.isFamilyComNameMatch(species);
    },
    isFamilyComNameMatch: function (species: EbirdSpecies): boolean {
      return species.familyComName
        .toLowerCase()
        .includes(this.answer.family.toLowerCase());
    },
    isFamilyCorrect: function () {
      return this.recording?.family === this.answer.family;
    },
    isGenusMatch: function (species: EbirdSpecies): boolean {
      if (this.answer.family && !this.isFamilyMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getGenus(species)
        .toLowerCase()
        .startsWith(this.answer.genus.toLowerCase());
    },
    isGenusCorrect: function () {
      return this.recording?.genus === this.answer.genus;
    },
    isSpeciesMatch: function (species: EbirdSpecies): boolean {
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
    isSpeciesCorrect: function () {
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
