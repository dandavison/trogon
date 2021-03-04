<template>
  <ul>
    <li v-for="subtaxon of subtaxa" :key="subtaxon">
      <challenge-form-field-dropdown-row
        :images="getImageURLs(subtaxon)"
        :imageLabelFn="(im) => im['subtaxonField']"
        :option="subtaxon"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { ImageMaps, Species, SpeciesImages, TaxonField } from "../types";

import ChallengeFormFieldDropdownRow from "./ChallengeFormFieldDropdownRow.vue";

export default Vue.extend({
  components: {
    ChallengeFormFieldDropdownRow,
  },

  props: {
    taxonField: String as PropType<TaxonField>,
    taxon: String,
    sppecies: Array as PropType<Species[]>,
    imageMaps: Object as PropType<ImageMaps>,
  },

  data() {
    const subTaxonFieldMap = new Map([
      [TaxonField.Class, TaxonField.FamilySci],
      [TaxonField.FamilySci, TaxonField.Genus],
      [TaxonField.Genus, TaxonField.SpeciesSci],
    ]);
    return { subTaxonFieldMap };
  },

  computed: {
    subTaxonField(): TaxonField {
      return this.subTaxonFieldMap.get(this.taxonField) as TaxonField;
    },

    subtaxa(): string[] {
      return [
        ...new Set(
          this.sppecies
            .filter((sp) => sp[this.taxonField] == this.taxon)
            .map((sp) => sp[this.subTaxonField])
        ),
      ];
    },
  },

  methods: {
    getImageURLs(subtaxon: string): SpeciesImages[] {
      return Array.from(
        this.imageMaps[`${this.subTaxonField}2images`]?.get(subtaxon) || []
      );
    },
  },
});
</script>
