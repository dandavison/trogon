<template>
  <form>
    <challenge-form-field
      ref="familySciField"
      id="familySci"
      :initial="answer.familySci"
      :handler="handleFamilySci"
      :shouldShow="shouldShowScientificNames"
      :filter="filterFamilySci"
      :truth="truth.familySci"
      :getImageURLs="getFamilySciImageURLs"
      :imageLabelFn="(im) => im.species.split(' ')[0]"
      :label="shouldShowEnglishNames ? 'Family (scientific)' : 'Family'"
      :useModal="settings.useFieldModals"
    />

    <challenge-form-field
      ref="familyEnField"
      id="familyEn"
      :initial="answer.familyEn"
      :handler="handleFamilyEn"
      :shouldShow="shouldShowEnglishNames"
      :filter="filterFamilyEn"
      :truth="truth.familyEn"
      :getImageURLs="getFamilyEnImageURLs"
      :imageLabelFn="(im) => im.species.split(' ')[0]"
      :label="shouldShowScientificNames ? 'Family (English)' : 'Family'"
      :useModal="settings.useFieldModals"
    />

    <challenge-form-field
      ref="genusField"
      id="genus"
      :initial="answer.genus"
      :handler="handleGenus"
      :shouldShow="true"
      :filter="filterGenus"
      :truth="truth.genus"
      :getImageURLs="getGenusImageURLs"
      :imageLabelFn="(im) => im.species.split(' ')[1]"
      :label="'Genus'"
      :useModal="settings.useFieldModals"
    />

    <challenge-form-field
      ref="speciesSciField"
      id="speciesSci"
      :initial="answer.speciesSci"
      :handler="handleSpeciesSci"
      :shouldShow="shouldShowScientificNames"
      :filter="filterSpeciesSci"
      :truth="truth.speciesSci"
      :getImageURLs="getSpeciesSciImageURLs"
      :imageLabelFn="(im) => ''"
      :label="shouldShowEnglishNames ? 'Species (scientific)' : 'Species'"
      :useModal="settings.useFieldModals"
    />

    <challenge-form-field
      ref="speciesEnField"
      id="speciesEn"
      :initial="answer.speciesEn"
      :handler="handleSpeciesEn"
      :shouldShow="shouldShowEnglishNames"
      :filter="filterSpeciesEn"
      :truth="truth.speciesEn"
      :getImageURLs="getSpeciesEnImageURLs"
      :imageLabelFn="(im) => ''"
      :label="shouldShowScientificNames ? 'Species (English)' : 'Species'"
      :useModal="settings.useFieldModals"
    />
  </form>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { debug, transformTaxonName } from "../utils";
import { Species } from "../types";
import {
  Answer,
  ImageMaps,
  NamesLanguage,
  Recording,
  Settings,
  SpeciesImages,
  TaxonMaps,
} from "../types";
import ChallengeFormField from "./ChallengeFormField.vue";

type ChallengeFormFieldInstance = InstanceType<typeof ChallengeFormField>;

export default Vue.extend({
  components: { ChallengeFormField },
  props: {
    locationSpecies: Array as PropType<Species[]>,
    recording: Object as PropType<Recording | null>,
    image: String as PropType<string | null>,
    imageURLMaps: Object as PropType<ImageMaps>,
    taxonMaps: Object as PropType<TaxonMaps>,
    settings: Object as PropType<Settings>,
  },
  data() {
    return {
      answer: {
        familySci: "",
        familyEn: "",
        genus: "",
        speciesSci: "",
        speciesEn: "",
      } as Answer,
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
      debug([`ChallengeForm.truth:`, JSON.stringify(this.recording)]);
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

    familySciField(): ChallengeFormFieldInstance {
      return this.$refs.familySciField as ChallengeFormFieldInstance;
    },

    familyEnField(): ChallengeFormFieldInstance {
      return this.$refs.familyEnField as ChallengeFormFieldInstance;
    },

    genusField(): ChallengeFormFieldInstance {
      return this.$refs.genusField as ChallengeFormFieldInstance;
    },

    speciesSciField(): ChallengeFormFieldInstance {
      return this.$refs.speciesSciField as ChallengeFormFieldInstance;
      this.$buefy.modal.open;
    },

    speciesEnField(): ChallengeFormFieldInstance {
      return this.$refs.speciesEnField as ChallengeFormFieldInstance;
    },
  },

  methods: {
    handleFamilySci(value: string): void {
      debug(["handleFamilySci:", JSON.stringify(value)]);
      this.answer.familySci = value;
      const familyEn = this.taxonMaps.familySci2En.get(value) || "";
      this.familyEnField.answer = familyEn;
      if (!familyEn) {
        this.genusField.answer = "";
      }
    },

    handleFamilyEn(value: string): void {
      debug(["handleFamilyEn:", JSON.stringify(value)]);
      this.answer.familyEn = value;
      const familySci = this.taxonMaps.familyEn2Sci.get(value) || "";
      this.familySciField.answer = familySci;
    },

    handleGenus(value: string): void {
      debug(["handleGenus:", JSON.stringify(value)]);
      this.answer.genus = value;
      const familySci = this.taxonMaps.genus2familySci.get(value);
      if (familySci) {
        this.familySciField.answer = familySci;
      } else {
        this.speciesSciField.answer = "";
      }
    },

    handleSpeciesSci(value: string): void {
      debug(["handleSpeciesSci:", JSON.stringify(value)]);
      this.answer.speciesSci = value;
      // Autofill speciesEn
      const speciesEn = this.taxonMaps.speciesSci2En.get(value) || "";
      (this.$refs.speciesEnField as any).answer = speciesEn;
      // Autofill genus if the species is valid
      const genus = this.taxonMaps.speciesSci2genus.get(value);
      if (genus) {
        this.genusField.answer = genus;
      }
      this.$emit("answer:species-correct", this.speciesSciField.isCorrect());
    },

    handleSpeciesEn(value: string): void {
      debug(["handleSpeciesEn:", JSON.stringify(value)]);
      this.answer.speciesEn = value;
      // Autofill speciesSci
      const speciesSci = this.taxonMaps.speciesEn2Sci.get(value) || "";
      this.speciesSciField.answer = speciesSci;
      this.$emit("answer:species-correct", this.speciesEnField.isCorrect());
    },

    getSpeciesSciImageURLs(answer: string): SpeciesImages[] {
      if (this.settings.promptIncludesImages) {
        return [];
      }
      return this._getImageURLs(
        answer,
        this.imageURLMaps.speciesSciName2images
      );
    },

    getSpeciesEnImageURLs(answer: string): SpeciesImages[] {
      if (this.settings.promptIncludesImages) {
        return [];
      }
      return this._getImageURLs(
        this.taxonMaps.speciesEn2Sci.get(answer) || "",
        this.imageURLMaps.speciesSciName2images
      );
    },

    getGenusImageURLs(answer: string): SpeciesImages[] {
      return this._getImageURLs(answer, this.imageURLMaps.genus2images);
    },

    getFamilySciImageURLs(answer: string): SpeciesImages[] {
      return this._getImageURLs(answer, this.imageURLMaps.familySci2images);
    },

    getFamilyEnImageURLs(answer: string): SpeciesImages[] {
      return this._getImageURLs(answer, this.imageURLMaps.familyEn2images);
    },

    _getImageURLs(
      answer: string,
      imageURLMap: Map<string, SpeciesImages[]>
    ): SpeciesImages[] {
      var images = imageURLMap.get(answer) || [];
      if (this.settings.promptIncludesImages && this.image) {
        images = images.filter((im) => !new Set(im.urls).has(this.image || "")); // TODO
      }
      return Array.from(images);
    },

    clear(): void {
      this.familySciField.clear();
      this.familyEnField.clear();
      this.genusField.clear();
      this.speciesSciField.clear();
      this.speciesEnField.clear();
    },

    // filter*

    filterFamilySci(answer: string): string[] {
      return this._filter(answer, this.isFamilySciMatch, (sp) => sp.familySci);
    },

    filterFamilyEn(answer: string): string[] {
      debug(["filterFamilyEn:", JSON.stringify(answer)]);
      return this._filter(answer, this.isFamilyEnMatch, (sp) => sp.familyEn);
    },

    filterGenus(answer: string): string[] {
      return this._filter(answer, this.isGenusMatch, (sp) => sp.genus);
    },

    filterSpeciesSci(answer: string): string[] {
      return this._filter(
        answer,
        this.isSpeciesSciMatch,
        (sp) => sp.speciesSci
      );
    },

    filterSpeciesEn(answer: string): string[] {
      return this._filter(answer, this.isSpeciesEnMatch, (sp) => sp.speciesEn);
    },

    _filter(
      answer: string,
      matchFn: Function,
      mapFn: (_: Species) => string
    ): string[] {
      return _.uniq(
        this.locationSpecies.filter((sp) => matchFn(answer, sp)).map(mapFn)
      );
    },

    // is*Match

    isFamilySciMatch(answer: string, species: Species): boolean {
      return _startsWith(species.familySci, answer);
    },

    isFamilyEnMatch(answer: string, species: Species): boolean {
      return _includes(species.familyEn, answer);
    },

    isGenusMatch(answer: string, species: Species): boolean {
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
      return _startsWith(species.genus, answer);
    },

    isSpeciesSciMatch(answer: string, species: Species): boolean {
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
        _startsWith(species.speciesSciSp, answer) ||
        _startsWith(species.speciesSci, answer)
      );
    },

    isSpeciesEnMatch(answer: string, species: Species): boolean {
      if (
        this.answer.familyEn &&
        !this.isFamilyEnMatch(this.answer.familyEn, species)
      ) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(this.answer.genus, species)) {
        return false;
      }
      return _includes(species.speciesEn, answer);
    },
  },
});

function _includes(truth: string, answer: string): boolean {
  truth = transformTaxonName(truth);
  answer = transformTaxonName(answer);
  if (answer.length > 1) {
    return truth.includes(answer);
  } else {
    return truth.startsWith(answer);
  }
}

function _startsWith(truth: string, answer: string): boolean {
  return transformTaxonName(truth).startsWith(transformTaxonName(answer));
}
</script>
