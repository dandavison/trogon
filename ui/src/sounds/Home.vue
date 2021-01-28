<template>
  <section>
    <nav class="level">
      <p class="level-item has-text-centered">
        <b-button @click="setNextRecording">
          <b-icon pack="fas" icon="forward" size="large"></b-icon>
        </b-button>
      </p>
    </nav>
    <form>
      <b-field label="Family">
        <span>
          <b-autocomplete
            type="text"
            v-model="answer.family"
            :data="filterFamily()"
            :class="{ 'is-success': answer.family == recording.family }"
          />
          <p v-if="answer.family == recording.family">✅</p>
        </span>
      </b-field>
      <b-field label="Genus">
        <b-autocomplete
          type="text"
          v-model="answer.genus"
          :data="filterGenus()"
          :class="{ 'is-success': answer.genus == recording.genus }"
        />
        <p v-if="answer.genus == recording.genus">✅</p>
      </b-field>
      <b-field label="Species">
        <b-autocomplete
          type="text"
          v-model="answer.species"
          :data="filterSpecies()"
          :class="{ 'is-success': answer.species == recording.species }"
        />
        <p v-if="answer.species == recording.species">✅</p>
      </b-field>
    </form>
    <nav class="level">
      <p class="level-item has-text-centered">
        <audio controls :src="recording.url" :loop="loop"></audio>
        <b-checkbox v-model="loop">loop {{ loop ? "on" : "off" }}</b-checkbox>
      </p>
    </nav>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { EbirdSpecies, Recording } from "types";
import { fetchJSONSynchronously } from "../utils";

export default Vue.extend({
  name: "Home",
  props: { ebirdLocId: String },
  data() {
    var recordings = getRecordings(this.ebirdLocId);
    const recording = recordings[0];
    return {
      locationSpecies: fetchJSONSynchronously(
        `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${this.ebirdLocId}`
      ) as EbirdSpecies[],
      recordings: recordings,
      recording: recording,
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
      this.recording = this.recordings[0];
    },
    filterFamily: function () {
      return [
        ...new Set(
          this.locationSpecies.filter(this.isFamilyMatch).map(formatFamily)
        ),
      ].sort();
    },
    filterGenus: function () {
      return [
        ...new Set(
          this.locationSpecies.filter(this.isGenusMatch).map(formatGenus)
        ),
      ].sort();
    },
    filterSpecies: function () {
      return [
        ...new Set(
          this.locationSpecies.filter(this.isSpeciesMatch).map(formatSpecies)
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
    isGenusMatch: function (species: EbirdSpecies): boolean {
      if (this.answer.family && !this.isFamilyMatch(species)) {
        return false;
      }
      return formatGenus(species)
        .toLowerCase()
        .startsWith(this.answer.genus.toLowerCase());
    },
    isSpeciesMatch: function (species: EbirdSpecies): boolean {
      if (this.answer.family && !this.isFamilyMatch(species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(species)) {
        return false;
      }
      return formatSpecies(species)
        .toLowerCase()
        .startsWith(this.answer.species.toLowerCase());
    },
  },
});
function getRecordings(_ebirdLocId: string): Recording[] {
  return [
    {
      url: "https://www.xeno-canto.org/142305/download",
      family: "Tityras and Allies",
      genus: "Pachyramphus",
      species: "polychopterus",
    },
  ];
}
function formatGenus(species: EbirdSpecies): string {
  return species.sciName.split(" ")[0] || "";
}
function formatSpecies(species: EbirdSpecies): string {
  return species.sciName.split(" ")[1] || "";
}
function formatFamily(species: EbirdSpecies): string {
  return species.familyComName;
}
</script>

<style scoped>
.is-success input {
  border-color: #48c774;
}
</style>
