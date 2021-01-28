<template>
  <section>
    <form>
      <b-field label="Family">
        <span>
          <b-autocomplete
            type="text"
            v-model="answer.family"
            :data="filterFamily()"
            :class="{ 'is-success': answer.family == truth.family }"
          />
          <p v-if="answer.family == truth.family">✅</p>
        </span>
      </b-field>
      <b-field label="Genus">
        <b-autocomplete
          type="text"
          v-model="answer.genus"
          :data="filterGenus()"
          :class="{ 'is-success': answer.genus == truth.genus }"
        />
        <p v-if="answer.genus == truth.genus">✅</p>
      </b-field>
      <b-field label="Species">
        <b-autocomplete
          type="text"
          v-model="answer.species"
          :data="filterSpecies()"
          :class="{ 'is-success': answer.species == truth.species }"
        />
        <p v-if="answer.species == truth.species">✅</p>
      </b-field>
    </form>
    <nav class="level">
      <p class="level-item has-text-centered">
        <audio controls :src="url" :loop="loop"></audio>
        <b-checkbox v-model="loop">loop {{ loop ? "on" : "off" }}</b-checkbox>
      </p>
    </nav>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { EbirdSpecies } from "types";
import { fetchJSONSynchronously } from "../utils";

export default Vue.extend({
  name: "Home",
  props: { ebirdLocId: String },
  data() {
    return {
      locationSpecies: fetchJSONSynchronously(
        `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${this.ebirdLocId}`
      ) as EbirdSpecies[],
      url: "https://www.xeno-canto.org/142305/download",
      loop: false,
      truth: {
        family: "Tityridae (Tityras and Allies)",
        genus: "Pachyramphus",
        species: "polychopterus",
      },
      answer: {
        family: "",
        genus: "",
        species: "",
      },
      familyFormatRegex: /([^ ]+)(?: \(([^)]+)\))?/,
    };
  },
  methods: {
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
      return (
        this.isFamilySciNameMatch(species) || this.isFamilyComNameMatch(species)
      );
    },
    isFamilySciNameMatch: function (species: EbirdSpecies): boolean {
      return species.familySciName
        .toLowerCase()
        .startsWith(this.parseFamilySciNameAnswer().toLowerCase());
    },
    isFamilyComNameMatch: function (species: EbirdSpecies): boolean {
      return species.familyComName
        .toLowerCase()
        .startsWith(this.parseFamilyComNameAnswer().toLowerCase());
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
    parseFamilySciNameAnswer: function (): string {
      const match = this.familyFormatRegex.exec(this.answer.family);
      return match ? match[1] || "" : "";
    },
    parseFamilyComNameAnswer: function (): string {
      const match = this.familyFormatRegex.exec(this.answer.family);
      return match ? match[2] || "" : "";
    },
  },
});
function formatGenus(species: EbirdSpecies): string {
  return species.sciName.split(" ")[0] || "";
}
function formatSpecies(species: EbirdSpecies): string {
  return species.sciName.split(" ")[1] || "";
}
function formatFamily(species: EbirdSpecies): string {
  return `${species.familySciName} (${species.familyComName})`;
}
</script>

<style scoped>
.is-success input {
  border-color: #48c774;
}
</style>
