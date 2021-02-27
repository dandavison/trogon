<template>
  <section>
    <challenge-form
      :locationSpecies="filteredLocationSpecies"
      :imageURLMaps="imageURLMaps"
      :taxonMaps="taxonMaps"
      :settings="settings"
    />
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import { LocationRequest, Settings } from "../types";
import ChallengeForm from "./ChallengeForm.vue";

import {
  LocationSpeciesSelector,
  makeLocationSpeciesSelectorData,
} from "./mixins";

var FieldGuide = Vue.extend({
  components: {
    ChallengeForm,
  },

  props: {
    locationRequest: Object as PropType<LocationRequest>,
    settings: Object as PropType<Settings>,
  },

  data() {
    return Object.assign(makeLocationSpeciesSelectorData(), {
      selectedSpecies: [] as FieldGuideSpecies[],
    });
  },
});

FieldGuide = FieldGuide.extend(LocationSpeciesSelector);

export default FieldGuide;
</script>
