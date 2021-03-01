<template>
  <section>
    <challenge-form
      :locationSpecies="filteredLocationSpecies"
      :imageURLMaps="imageURLMaps"
      :taxonMaps="taxonMaps"
      :settings="settings"
    />
    <section class="section">
      <div class="tile is-ancestor" style="flex-wrap: wrap">
        <div class="tile is-parent" style="flex-wrap: wrap">
          <div
            v-for="sp of selectedSpecies"
            :key="sp.id"
            class="tile is-child card is-1"
          >
            <reveal-area
              :image="sp.images[0]"
              :recordings="sp.recordings"
              :settings="settings"
            />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";

import eventBus from "../event-bus";
import {
  FieldGuideSpecies,
  LocationRequest,
  Settings,
  SpeciesImages,
} from "../types";
import ChallengeForm from "./ChallengeForm.vue";
import RevealArea from "./RevealArea.vue";

import {
  LocationSpeciesSelector,
  makeLocationSpeciesSelectorData,
} from "./mixins";

var FieldGuide = Vue.extend({
  components: {
    ChallengeForm,
    RevealArea,
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

  methods: {
    postCreatedHook() {
      eventBus.$on("select:form-field", this.handleSelect);
    },

    handleSelect(field: string, value: string): void {
      const species = [] as FieldGuideSpecies[];
      for (let sp of this.filteredLocationSpecies) {
        if (sp[field] == value) {
          let [speciesImages] = this.imageURLMaps.speciesSciName2images.get(
            sp.speciesSci
          ) as SpeciesImages[];
          let images = (speciesImages as SpeciesImages).urls;
          species.push(Object.assign(sp, { images, recordings: [] }));
        }
      }
      this.selectedSpecies = species;
    },
  },
});

FieldGuide = FieldGuide.extend(LocationSpeciesSelector);

export default FieldGuide;
</script>

<style scoped>
.tile.is-parent {
  flex-wrap: wrap;
}
</style>