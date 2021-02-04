<template>
  <section>
    <h1 style="font-weight: bold">
      {{ ebirdHotspot ? ebirdHotspot.locName : ebirdLocId }}
    </h1>
    <ul>
      <li>{{ locationSpecies.length }} species total</li>
      <li>
        {{ selectedChallengeSpecies.length }} species in current challenge
      </li>
      <li>
        <div class="buttons">
          <b-button
            label="Select families"
            @click="isFamilyModalActive = true"
          />
        </div>
        <b-modal v-model="isFamilyModalActive" full-screen>
          <family-selector :challengeFamilies="challengeFamilies" />
        </b-modal>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { EbirdHotspot, EbirdSpecies } from "types";
import { ChallengeFamily } from "./types";
import FamilySelector from "./FamilySelector.vue";

export default Vue.extend({
  components: { FamilySelector },
  props: {
    ebirdLocId: String,
    ebirdHotspot: Object as PropType<EbirdHotspot | null>,
    locationSpecies: Array as PropType<EbirdSpecies[]>,
    selectedChallengeSpecies: Array as PropType<EbirdSpecies[]>,
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
  },
  data() {
    return { isFamilyModalActive: false };
  },
});
</script>