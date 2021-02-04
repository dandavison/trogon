<template>
  <form type="box">
    <game-form-field
      id="familySciField"
      v-bind:answer.sync="answer.familySci"
      :shouldShow="shouldShowScientificNames"
      :filter="filterFamilySci"
      :isCorrect="isFamilySciCorrect"
      :getImageURLs="getFamilySciImageURLs"
      :label="shouldShowEnglishNames ? 'Family (scientific)' : 'Family'"
    />

    <game-form-field
      id="familyEnField"
      v-bind:answer.sync="answer.familyEn"
      :shouldShow="shouldShowEnglishNames"
      :filter="filterFamilyEn"
      :isCorrect="isFamilyEnCorrect"
      :getImageURLs="getFamilyEnImageURLs"
      :label="shouldShowScientificNames ? 'Family (English)' : 'Family'"
    />

    <game-form-field
      id="genusField"
      v-bind:answer.sync="answer.genus"
      :shouldShow="true"
      :filter="filterGenus"
      :isCorrect="isGenusCorrect"
      :getImageURLs="getGenusImageURLs"
      :label="'Genus'"
    />

    <game-form-field
      id="speciesSciField"
      v-bind:answer.sync="answer.speciesSci"
      :shouldShow="shouldShowScientificNames"
      :filter="filterSpeciesSci"
      :isCorrect="isSpeciesSciCorrect"
      :getImageURLs="getSpeciesSciImageURLs"
      :label="shouldShowEnglishNames ? 'Species (scientific)' : 'Species'"
    />

    <game-form-field
      id="speciesEnField"
      v-bind:answer.sync="answer.speciesEn"
      :shouldShow="shouldShowEnglishNames"
      :filter="filterSpeciesEn"
      :isCorrect="isSpeciesEnCorrect"
      :getImageURLs="getSpeciesEnImageURLs"
      :label="shouldShowScientificNames ? 'Species (English)' : 'Species'"
    />

    <b-button @click="clearInput">Clear</b-button>
  </form>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { EbirdSpecies } from "types";
import { ebirdSpecies } from "./ebird";
import {
  Answer,
  ImageURLMaps,
  NamesLanguage,
  Recording,
  Settings,
} from "./types";
import GameFormField from "./GameFormField.vue";

export default Vue.extend({
  components: { GameFormField },
  props: {
    locationSpecies: Array as PropType<EbirdSpecies[]>,
    recording: Object as PropType<Recording | null>,
    imageURLMaps: Object as PropType<ImageURLMaps>,
    settings: Object as PropType<Settings>,
  },
  data() {
    const familyEn2Sci = new Map(
      this.locationSpecies.map((sp) => [sp.familyComName, sp.familySciName])
    );

    const familySci2En = new Map(
      this.locationSpecies.map((sp) => [sp.familySciName, sp.familyComName])
    );

    const speciesSci2En = new Map(
      this.locationSpecies.map((sp) => [sp.sciName, sp.comName])
    );

    const speciesEn2Sci = new Map(
      this.locationSpecies.map((sp) => [sp.comName, sp.sciName])
    );

    return {
      answer: {
        familySci: "",
        familyEn: "",
        genus: "",
        speciesSci: "",
        speciesEn: "",
      } as Answer,
      familyEn2Sci,
      familySci2En,
      speciesSci2En,
      speciesEn2Sci,
    };
  },

  watch: {
    "answer.familySci": function (newVal: string): void {
      // Autofill familyEn according to familySci
      if (!this.answer.familyEn) {
        const familyEn = this.familySci2En.get(newVal);
        if (familyEn) {
          this.answer.familyEn = familyEn;
        }
      }
    },

    "answer.FamilyEn": function (newVal: string): void {
      // Autofill familySci according to familyEn
      if (!this.answer.familySci) {
        const familySci = this.familyEn2Sci.get(newVal);
        if (familySci) {
          this.answer.familySci = familySci;
        }
      }
    },

    answer: {
      deep: true,
      handler(newVal: Answer): void {
        // Autofill speciesEn according to (genus, speciesSci)
        if (!this.answer.speciesEn && newVal.genus && newVal.speciesSci) {
          const speciesEn = this.speciesSci2En.get(
            `${newVal.genus} ${newVal.speciesSci}`
          );
          if (speciesEn) {
            this.answer.speciesEn = speciesEn;
          }
        }
      },
    },
  },

  computed: {
    shouldShowScientificNames(): boolean {
      return new Set([NamesLanguage.Scientific, NamesLanguage.Both]).has(
        this.settings.names
      );
    },

    shouldShowEnglishNames(): boolean {
      return new Set([NamesLanguage.English, NamesLanguage.Both]).has(
        this.settings.names
      );
    },
  },

  methods: {
    getSpeciesSciImageURLs(option: string): string[] {
      const answerSciName = `${this.answer.genus} ${option}`;
      return Array.from(
        this.imageURLMaps.speciesSciName2images.get(answerSciName) || new Set()
      );
    },
    getSpeciesEnImageURLs(option: string): string[] {
      const answerSciName = this.speciesEn2Sci.get(option);
      return Array.from(
        this.imageURLMaps.speciesSciName2images.get(answerSciName || "") ||
          new Set()
      );
    },
    getGenusImageURLs(option: string): string[] {
      return Array.from(
        this.imageURLMaps.genus2images.get(option) || new Set()
      );
    },
    getFamilySciImageURLs(option: string): string[] {
      return Array.from(
        this.imageURLMaps.familySci2images.get(option) || new Set()
      );
    },
    getFamilyEnImageURLs(option: string): string[] {
      return Array.from(
        this.imageURLMaps.familyEn2images.get(option) || new Set()
      );
    },
    clearInput(): void {
      this.answer = {
        familySci: "",
        familyEn: "",
        genus: "",
        speciesSci: "",
        speciesEn: "",
      };
    },

    revealSpecies(): void {
      if (this.recording) {
        this.answer.familySci = this.recording.familySci;
        this.answer.familyEn = this.recording.familyEn;
        this.answer.genus = this.recording.genus;
        this.answer.speciesSci = this.recording.speciesSci;
        this.answer.speciesEn = this.recording.speciesEn;
      }
    },

    filterFamilySci(): string[] {
      return _.uniq(
        this.locationSpecies
          .filter(this.isFamilySciMatch)
          .map(ebirdSpecies.getFamilySci)
      );
    },

    filterFamilyEn(): string[] {
      return _.uniq(
        this.locationSpecies
          .filter(this.isFamilyEnMatch)
          .map(ebirdSpecies.getFamilyEn)
      );
    },

    filterGenus(): string[] {
      return _.uniq(
        this.locationSpecies
          .filter(this.isGenusMatch)
          .map(ebirdSpecies.getGenus)
      );
    },

    filterSpeciesSci(): string[] {
      return _.uniq(
        this.locationSpecies
          .filter(this.isSpeciesSciMatch)
          .map(ebirdSpecies.getSpeciesSci)
      );
    },

    filterSpeciesEn(): string[] {
      return _.uniq(
        this.locationSpecies
          .filter(this.isSpeciesEnMatch)
          .map(ebirdSpecies.getSpeciesEn)
      );
    },

    isFamilySciMatch(species: EbirdSpecies): boolean {
      return species.familySciName
        .toLowerCase()
        .includes(this.answer.familySci.toLowerCase());
    },

    isFamilyEnMatch(species: EbirdSpecies): boolean {
      return species.familyComName
        .toLowerCase()
        .includes(this.answer.familyEn.toLowerCase());
    },

    isFamilySciCorrect(): boolean {
      return this.recording?.familySci === this.answer.familySci;
    },

    isFamilyEnCorrect(): boolean {
      return this.recording?.familyEn === this.answer.familyEn;
    },

    isGenusMatch(species: EbirdSpecies): boolean {
      if (this.answer.familySci && !this.isFamilySciMatch(species)) {
        return false;
      }
      if (this.answer.familyEn && !this.isFamilyEnMatch(species)) {
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

    isSpeciesSciMatch(species: EbirdSpecies): boolean {
      if (this.answer.familySci && !this.isFamilySciMatch(species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getSpeciesSci(species)
        .toLowerCase()
        .startsWith(this.answer.speciesSci.toLowerCase());
    },

    isSpeciesEnMatch(species: EbirdSpecies): boolean {
      if (this.answer.familyEn && !this.isFamilyEnMatch(species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getSpeciesEn(species)
        .toLowerCase()
        .includes(this.answer.speciesEn.toLowerCase());
    },

    isSpeciesSciCorrect(): boolean {
      return this.recording?.speciesSci === this.answer.speciesSci;
    },

    isSpeciesEnCorrect(): boolean {
      return this.recording?.speciesEn === this.answer.speciesEn;
    },
  },
});
</script>

<style scoped>
.is-success input {
  border-color: #48c774;
}
</style>
