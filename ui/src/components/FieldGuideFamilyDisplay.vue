<template>
  <ul>
    <li v-for="genus of genera" :key="genus">
      <challenge-form-field-dropdown-row
        :images="getGenusImageURLs(genus)"
        :imageLabelFn="(im) => im.species.split(' ')[1]"
        :option="genus"
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
    familySci: String,
    sppecies: Array as PropType<Species[]>,
    imageURLMaps: Object as PropType<ImageMaps>,
  },

  computed: {
    genera(): string[] {
      return [
        ...new Set(
          this.sppecies
            .filter((sp) => sp.familySci == this.familySci)
            .map((sp) => sp.genus)
        ),
      ];
    },
  },

  methods: {
    getGenusImageURLs(genus: string): SpeciesImages[] {
      return Array.from(this.imageURLMaps.genus2images.get(genus) || []);
    },
  },
});
</script>
