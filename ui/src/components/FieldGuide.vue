<template>
  <section>
    <challenge-form
      :locationSpecies="filteredLocationSpecies"
      :imageURLMaps="imageURLMaps"
      :taxonMaps="taxonMaps"
      :settings="settings"
    />
    <section v-if="selected.speciesSci" class="section">
      <reveal-area
        :image="species.images[0]"
        :recordings="[]"
        :settings="settings"
      />
    </section>
    <section v-else-if="selected.genus" class="section">
      <field-guide-genus-display
        :genus="selected.genus"
        :sppecies="filteredLocationSpecies"
        :imageURLMaps="imageURLMaps"
      />
    </section>
    <section v-else-if="selected.familySci" class="section">
      <field-guide-family-display
        :familySci="selected.familySci"
        :sppecies="filteredLocationSpecies"
        :imageURLMaps="imageURLMaps"
      />
    </section>
    <section v-else class="section">[display all families]</section>
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import eventBus from "../event-bus";
import { LocationRequest, Settings, Species } from "../types";
import ChallengeForm from "./ChallengeForm.vue";
import FieldGuideGenusDisplay from "./FieldGuideGenusDisplay.vue";
import FieldGuideFamilyDisplay from "./FieldGuideFamilyDisplay.vue";
import RevealArea from "./RevealArea.vue";

import {
  LocationSpeciesSelector,
  makeLocationSpeciesSelectorData,
} from "./mixins";

interface TaxonSelection {
  familySci: string | null;
  genus: string | null;
  speciesSci: string | null;
  [index: string]: string | null;
}

var FieldGuide = Vue.extend({
  components: {
    ChallengeForm,
    FieldGuideGenusDisplay,
    FieldGuideFamilyDisplay,
    RevealArea,
  },

  props: {
    locationRequest: Object as PropType<LocationRequest>,
    settings: Object as PropType<Settings>,
  },

  data() {
    return Object.assign(makeLocationSpeciesSelectorData(), {
      selected: {
        familySci: null,
        genus: null,
        speciesSci: null,
      } as TaxonSelection,
    });
  },

  computed: {
    species(): Species {
      return this.filteredLocationSpecies.filter(
        (sp) => sp.speciesSci == this.selected.speciesSci
      )[0] as Species;
    },
  },

  methods: {
    postCreatedHook() {
      eventBus.$on("select:form-field", this.handleSelect);
      eventBus.$on("clear:form-field", this.handleClear);
    },

    handleSelect(field: string, value: string): void {
      console.log("handleSelect: ", field, value);
      this.selected[field] = value;
    },

    handleClear(field: string): void {
      console.log("handleClear: ", field);
      this.selected[field] = null;
    },
  },
});

FieldGuide = FieldGuide.extend(LocationSpeciesSelector);

export default FieldGuide;
</script>
