<template>
  <ul>
    <li v-for="speciesSci of sppeciesSci" :key="speciesSci">
      <challenge-form-field-dropdown-row
        :images="getSpeciesImageURLs(speciesSci)"
        :imageLabelFn="(im) => im.species"
        :option="speciesSci"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { ImageMaps, Species, SpeciesImages } from "../types";

import ChallengeFormFieldDropdownRow from "./ChallengeFormFieldDropdownRow.vue";

export default Vue.extend({
  components: {
    ChallengeFormFieldDropdownRow,
  },

  props: {
    genus: String,
    sppecies: Array as PropType<Species[]>,
    imageURLMaps: Object as PropType<ImageMaps>,
  },

  computed: {
    sppeciesSci(): string[] {
      return this.sppecies
        .filter((sp) => sp.genus == this.genus)
        .map((sp) => sp.speciesSci);
    },
  },

  methods: {
    getSpeciesImageURLs(speciesSci: string): SpeciesImages[] {
      return Array.from(
        this.imageURLMaps.speciesSciName2images.get(speciesSci) || []
      );
    },
  },
});
</script>
