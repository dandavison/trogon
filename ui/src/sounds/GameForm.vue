<template>
  <form type="box">
    <game-form-field
      ref="familySciField"
      id="familySciField"
      :handler="handleFamilySci"
      :shouldShow="shouldShowScientificNames"
      :filter="filterFamilySci"
      :truth="truth.familySci"
      :isCorrect="isFamilySciCorrect"
      :getImageURLs="getFamilySciImageURLs"
      :label="shouldShowEnglishNames ? 'Family (scientific)' : 'Family'"
    />

    <game-form-field
      ref="familyEnField"
      id="familyEnField"
      :handler="handleFamilyEn"
      :shouldShow="shouldShowEnglishNames"
      :filter="filterFamilyEn"
      :truth="truth.familyEn"
      :isCorrect="isFamilyEnCorrect"
      :getImageURLs="getFamilyEnImageURLs"
      :label="shouldShowScientificNames ? 'Family (English)' : 'Family'"
    />

    <game-form-field
      ref="genusField"
      id="genusField"
      :handler="handleGenus"
      :shouldShow="true"
      :filter="filterGenus"
      :truth="truth.genus"
      :isCorrect="isGenusCorrect"
      :getImageURLs="getGenusImageURLs"
      :label="'Genus'"
    />

    <game-form-field
      ref="speciesSciField"
      id="speciesSciField"
      :handler="handleSpeciesSci"
      :shouldShow="shouldShowScientificNames"
      :filter="filterSpeciesSci"
      :truth="truth.speciesSci"
      :isCorrect="isSpeciesSciCorrect"
      :getImageURLs="getSpeciesSciImageURLs"
      :label="shouldShowEnglishNames ? 'Species (scientific)' : 'Species'"
    />

    <game-form-field
      ref="speciesEnField"
      id="speciesEnField"
      :handler="handleSpeciesEn"
      :shouldShow="shouldShowEnglishNames"
      :filter="filterSpeciesEn"
      :truth="truth.speciesEn"
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
import { EbirdSpecies } from "./types";
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

    const genus2familySci = new Map(
      this.locationSpecies.map((sp) => [
        ebirdSpecies.getGenus(sp),
        sp.familySciName,
      ])
    );

    const speciesSci2genus = new Map(
      this.locationSpecies.map((sp) => [sp.sciName, ebirdSpecies.getGenus(sp)])
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
      genus2familySci,
      speciesSci2genus,
      speciesSci2En,
      speciesEn2Sci,
    };
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

    truth(): Answer {
      if (this.recording) {
        return {
          familySci: this.recording.familySci,
          familyEn: this.recording.familyEn,
          genus: this.recording.genus,
          speciesSci: this.recording.speciesSci,
          speciesEn: this.recording.speciesEn,
        };
      } else {
        return {
          familySci: "",
          familyEn: "",
          genus: "",
          speciesSci: "",
          speciesEn: "",
        };
      }
    },
  },

  methods: {
    handleFamilySci(newVal: string): void {
      this.answer.familySci = newVal;
      // Autofill familyEn
      if (!this.answer.familyEn) {
        const familyEn = this.familySci2En.get(newVal);
        if (familyEn) {
          (this.$refs.familyEnField as any).answer = familyEn;
        }
      }
    },
    handleFamilyEn(newVal: string): void {
      this.answer.familyEn = newVal;
      // Autofill familySci
      if (!this.answer.familySci) {
        const familySci = this.familyEn2Sci.get(newVal);
        if (familySci) {
          (this.$refs.familySciField as any).answer = familySci;
        }
      }
    },
    handleGenus(newVal: string): void {
      this.answer.genus = newVal;
      // Autofill familySci
      if (!this.answer.familySci) {
        const familySci = this.genus2familySci.get(newVal);
        if (familySci) {
          (this.$refs.familySciField as any).answer = familySci;
        }
      }
    },
    handleSpeciesSci(newVal: string): void {
      this.answer.speciesSci = newVal;
      // Autofill speciesEn
      if (!this.answer.speciesEn) {
        const speciesEn = this.speciesSci2En.get(newVal);
        if (speciesEn) {
          (this.$refs.speciesEnField as any).answer = speciesEn;
        }
      }
      // Autofill genus
      if (!this.answer.genus) {
        const genus = this.speciesSci2genus.get(newVal);
        if (genus) {
          (this.$refs.genusField as any).answer = genus;
        }
      }
    },
    handleSpeciesEn(newVal: string): void {
      this.answer.speciesEn = newVal;
      // Autofill speciesSci
      if (!this.answer.speciesSci) {
        const speciesSci = this.speciesEn2Sci.get(newVal);
        if (speciesSci) {
          (this.$refs.speciesSciField as any).answer = speciesSci;
        }
      }
    },
    getSpeciesSciImageURLs(option: string): string[] {
      return Array.from(
        this.imageURLMaps.speciesSciName2images.get(option) || new Set()
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
      (this.$refs.familySciField as any).clear();
      (this.$refs.familyEnField as any).clear();
      (this.$refs.genusField as any).clear();
      (this.$refs.speciesSciField as any).clear();
      (this.$refs.speciesEnField as any).clear();
    },

    // filter*

    filterFamilySci(answer: string): string[] {
      return this._filter(
        answer,
        this.isFamilySciMatch,
        ebirdSpecies.getFamilySci
      );
    },

    filterFamilyEn(answer: string): string[] {
      return this._filter(
        answer,
        this.isFamilyEnMatch,
        ebirdSpecies.getFamilyEn
      );
    },

    filterGenus(answer: string): string[] {
      return this._filter(answer, this.isGenusMatch, ebirdSpecies.getGenus);
    },

    filterSpeciesSci(answer: string): string[] {
      return this._filter(
        answer,
        this.isSpeciesSciMatch,
        ebirdSpecies.getSpeciesSci
      );
    },

    filterSpeciesEn(answer: string): string[] {
      return this._filter(
        answer,
        this.isSpeciesEnMatch,
        ebirdSpecies.getSpeciesEn
      );
    },

    _filter(
      answer: string,
      matchFn: Function,
      mapFn: (_: EbirdSpecies) => string
    ): string[] {
      return _.uniq(
        this.locationSpecies.filter((sp) => matchFn(answer, sp)).map(mapFn)
      );
    },

    // is*Match

    isFamilySciMatch(answer: string, species: EbirdSpecies): boolean {
      return this._transform(species.familySciName).startsWith(
        this._transform(answer)
      );
    },

    isFamilyEnMatch(answer: string, species: EbirdSpecies): boolean {
      return this._transform(species.familyComName).includes(
        this._transform(answer)
      );
    },

    isGenusMatch(answer: string, species: EbirdSpecies): boolean {
      if (
        this.answer.familySci &&
        !this.isFamilySciMatch(this.answer.familySci, species)
      ) {
        return false;
      }
      if (
        this.answer.familyEn &&
        !this.isFamilyEnMatch(this.answer.familyEn, species)
      ) {
        return false;
      }
      return this._transform(ebirdSpecies.getGenus(species)).startsWith(
        this._transform(answer)
      );
    },

    isSpeciesSciMatch(answer: string, species: EbirdSpecies): boolean {
      if (
        this.answer.familySci &&
        !this.isFamilySciMatch(this.answer.familySci, species)
      ) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(this.answer.genus, species)) {
        return false;
      }
      answer = this._transform(answer);
      const speciesSciSp = this._transform(
        ebirdSpecies.getSpeciesSciSp(species)
      );
      if (speciesSciSp.startsWith(answer)) {
        return true;
      }
      const speciesSci = this._transform(ebirdSpecies.getSpeciesSci(species));
      return speciesSci.startsWith(answer);
    },

    isSpeciesEnMatch(answer: string, species: EbirdSpecies): boolean {
      if (this.answer.familyEn && !this.isFamilyEnMatch(answer, species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(answer, species)) {
        return false;
      }
      return this._transform(ebirdSpecies.getSpeciesEn(species)).includes(
        this._transform(answer.toLowerCase())
      );
    },

    _transform(name: string): string {
      return name.toLowerCase().replace("-", " ");
    },

    // is*Correct

    isFamilySciCorrect(): boolean {
      return this.recording?.familySci === this.answer.familySci;
    },

    isFamilyEnCorrect(): boolean {
      return this.recording?.familyEn === this.answer.familyEn;
    },

    isGenusCorrect(): boolean {
      return this.recording?.genus === this.answer.genus;
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
