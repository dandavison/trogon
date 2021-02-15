<template>
  <form>
    <game-form-field-container
      :isModal="settings.useFieldModals && isModal.familySci"
    >
      <template v-slot:form-field>
        <game-form-field
          ref="familySciField"
          id="familySciField"
          :initial="answer.familySci"
          :handler="handleFamilySci"
          @focus="isModal.familySci = true"
          @select="isModal.familySci = false"
          :shouldShow="shouldShowScientificNames"
          :filter="filterFamilySci"
          :truth="truth.familySci"
          :isCorrect="isFamilySciCorrect"
          :getImageURLs="getFamilySciImageURLs"
          :label="shouldShowEnglishNames ? 'Family (scientific)' : 'Family'"
        />
      </template>
    </game-form-field-container>

    <game-form-field-container
      :isModal="settings.useFieldModals && isModal.familyEn"
    >
      <template v-slot:form-field>
        <game-form-field
          ref="familyEnField"
          id="familyEnField"
          :initial="answer.familyEn"
          :handler="handleFamilyEn"
          @focus="isModal.familyEn = true"
          @select="isModal.familyEn = false"
          :shouldShow="shouldShowEnglishNames"
          :filter="filterFamilyEn"
          :truth="truth.familyEn"
          :isCorrect="isFamilyEnCorrect"
          :getImageURLs="getFamilyEnImageURLs"
          :label="shouldShowScientificNames ? 'Family (English)' : 'Family'"
        />
      </template>
    </game-form-field-container>

    <game-form-field-container
      :isModal="settings.useFieldModals && isModal.genus"
    >
      <template v-slot:form-field>
        <game-form-field
          ref="genusField"
          id="genusField"
          :initial="answer.genus"
          :handler="handleGenus"
          @focus="isModal.genus = true"
          @select="isModal.genus = false"
          :shouldShow="true"
          :filter="filterGenus"
          :truth="truth.genus"
          :isCorrect="isGenusCorrect"
          :getImageURLs="getGenusImageURLs"
          :label="'Genus'"
        />
      </template>
    </game-form-field-container>

    <game-form-field-container
      :isModal="settings.useFieldModals && isModal.speciesSci"
    >
      <template v-slot:form-field>
        <game-form-field
          ref="speciesSciField"
          id="speciesSciField"
          :initial="answer.speciesSci"
          :handler="handleSpeciesSci"
          @focus="isModal.speciesSci = true"
          @select="isModal.speciesSci = false"
          :shouldShow="shouldShowScientificNames"
          :filter="filterSpeciesSci"
          :truth="truth.speciesSci"
          :isCorrect="isSpeciesSciCorrect"
          :getImageURLs="getSpeciesSciImageURLs"
          :label="shouldShowEnglishNames ? 'Species (scientific)' : 'Species'"
        />
      </template>
    </game-form-field-container>

    <game-form-field-container
      :isModal="settings.useFieldModals && isModal.speciesEn"
    >
      <template v-slot:form-field>
        <game-form-field
          ref="speciesEnField"
          id="speciesEnField"
          :initial="answer.speciesEn"
          :handler="handleSpeciesEn"
          @focus="isModal.speciesEn = true"
          @select="isModal.speciesEn = false"
          :shouldShow="shouldShowEnglishNames"
          :filter="filterSpeciesEn"
          :truth="truth.speciesEn"
          :isCorrect="isSpeciesEnCorrect"
          :getImageURLs="getSpeciesEnImageURLs"
          :label="shouldShowScientificNames ? 'Species (English)' : 'Species'"
        />
      </template>
    </game-form-field-container>
  </form>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { debug } from "./utils";
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
import GameFormFieldContainer from "./GameFormFieldContainer.vue";

export default Vue.extend({
  components: { GameFormFieldContainer, GameFormField },
  props: {
    locationSpecies: Array as PropType<EbirdSpecies[]>,
    recording: Object as PropType<Recording | null>,
    image: String as PropType<string | null>,
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
      isModal: {
        familySci: false,
        familyEn: false,
        genus: false,
        speciesSci: false,
        speciesEn: false,
      },
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
      debug([`GameForm.truth:`, JSON.stringify(this.recording)]);
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
    handleFamilySci(value: string): void {
      debug(["handleFamilySci:", JSON.stringify(value)]);
      this.answer.familySci = value;
      // Autofill familyEn
      const familyEn = this.familySci2En.get(value) || "";
      (this.$refs.familyEnField as any).answer = familyEn;
    },

    handleFamilyEn(value: string): void {
      debug(["handleFamilyEn:", JSON.stringify(value)]);
      this.answer.familyEn = value;
      // Autofill familySci
      const familySci = this.familyEn2Sci.get(value) || "";
      (this.$refs.familySciField as any).answer = familySci;
    },

    handleGenus(value: string): void {
      debug(["handleGenus:", JSON.stringify(value)]);
      this.answer.genus = value;
      // Autofill familySci if the genus is valid
      const familySci = this.genus2familySci.get(value);
      if (familySci) {
        (this.$refs.familySciField as any).answer = familySci;
      }
    },

    handleSpeciesSci(value: string): void {
      debug(["handleSpeciesSci:", JSON.stringify(value)]);
      this.answer.speciesSci = value;
      // Autofill speciesEn
      const speciesEn = this.speciesSci2En.get(value) || "";
      (this.$refs.speciesEnField as any).answer = speciesEn;
      // Autofill genus if the species is valid
      const genus = this.speciesSci2genus.get(value);
      if (genus) {
        (this.$refs.genusField as any).answer = genus;
      }
    },

    handleSpeciesEn(value: string): void {
      debug(["handleSpeciesEn:", JSON.stringify(value)]);
      this.answer.speciesEn = value;
      // Autofill speciesSci
      const speciesSci = this.speciesEn2Sci.get(value) || "";
      (this.$refs.speciesSciField as any).answer = speciesSci;
    },

    getSpeciesSciImageURLs(answer: string): string[] {
      if (this.settings.promptIncludesImages) {
        return [];
      }
      return this._getImageURLs(
        answer,
        this.imageURLMaps.speciesSciName2images
      );
    },

    getSpeciesEnImageURLs(answer: string): string[] {
      if (this.settings.promptIncludesImages) {
        return [];
      }
      return this._getImageURLs(
        this.speciesEn2Sci.get(answer) || "",
        this.imageURLMaps.speciesSciName2images
      );
    },

    getGenusImageURLs(answer: string): string[] {
      return this._getImageURLs(answer, this.imageURLMaps.genus2images);
    },

    getFamilySciImageURLs(answer: string): string[] {
      return this._getImageURLs(answer, this.imageURLMaps.familySci2images);
    },

    getFamilyEnImageURLs(answer: string): string[] {
      return this._getImageURLs(answer, this.imageURLMaps.familyEn2images);
    },

    _getImageURLs(
      answer: string,
      imageURLMap: Map<string, Set<string>>
    ): string[] {
      var images = imageURLMap.get(answer) || new Set();
      if (this.settings.promptIncludesImages && this.image) {
        images.delete(this.image);
      }
      return Array.from(images);
    },

    clear(): void {
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
      debug(["filterFamilyEn:", JSON.stringify(answer)]);
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
      return _startsWith(species.familySciName, answer);
    },

    isFamilyEnMatch(answer: string, species: EbirdSpecies): boolean {
      return _includes(species.familyComName, answer);
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
      return _startsWith(ebirdSpecies.getGenus(species), answer);
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
      return (
        _startsWith(ebirdSpecies.getSpeciesSciSp(species), answer) ||
        _startsWith(ebirdSpecies.getSpeciesSci(species), answer)
      );
    },

    isSpeciesEnMatch(answer: string, species: EbirdSpecies): boolean {
      if (
        this.answer.familyEn &&
        !this.isFamilyEnMatch(this.answer.familyEn, species)
      ) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(this.answer.genus, species)) {
        return false;
      }
      return _includes(ebirdSpecies.getSpeciesEn(species), answer);
    },

    // is*Correct

    isFamilySciCorrect(): boolean {
      return _isCorrect(this.recording?.familySci, this.answer.familySci);
    },

    isFamilyEnCorrect(): boolean {
      return _isCorrect(this.recording?.familyEn, this.answer.familyEn);
    },

    isGenusCorrect(): boolean {
      return _isCorrect(this.recording?.genus, this.answer.genus);
    },

    isSpeciesSciCorrect(): boolean {
      return _isCorrect(this.recording?.speciesSci, this.answer.speciesSci);
    },

    isSpeciesEnCorrect(): boolean {
      return _isCorrect(this.recording?.speciesEn, this.answer.speciesEn);
    },
  },
});

function _includes(truth: string, answer: string): boolean {
  truth = _transform(truth);
  answer = _transform(answer);
  if (answer.length > 1) {
    return truth.includes(answer);
  } else {
    return truth.startsWith(answer);
  }
}

function _startsWith(truth: string, answer: string): boolean {
  return _transform(truth).startsWith(_transform(answer));
}

function _isCorrect(truth: string | undefined, answer: string): boolean {
  debug(["_isCorrect", JSON.stringify(truth), JSON.stringify(answer)]);
  if (truth) {
    return _transform(truth) === _transform(answer);
  }
  return false;
}

function _transform(value: string): string {
  return value.replace("-", " ").toLowerCase();
}
</script>

<style scoped>
.is-success input {
  border-color: #48c774;
}
</style>
