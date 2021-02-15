<template>
  <section>
    <h1 style="font-weight: bold">
      {{
        ebirdHotspots.length > 0
          ? ebirdHotspots.map((h) => h.locName).join(", ")
          : ebirdLocIds.join(", ")
      }}
    </h1>
    <ul>
      <li>{{ locationSpecies.length }} species total</li>
      <li>{{ challengeRecordings.length }} species in current challenge</li>
      <li>
        <div class="buttons">
          <b-button
            label="Select families"
            @click="isFamilyModalActive = true"
            class="light"
          />
        </div>
        <b-modal v-model="isFamilyModalActive" full-screen>
          <section class="section">
            <family-selector :challengeFamilies="challengeFamilies" />
          </section>
        </b-modal>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { EbirdHotspot } from "types";
import { ChallengeFamily, EbirdSpecies, Recording } from "./types";
import FamilySelector from "./FamilySelector.vue";

export default Vue.extend({
  components: { FamilySelector },
  props: {
    ebirdLocIds: Array as PropType<string[]>,
    ebirdHotspots: Array as PropType<EbirdHotspot[]>,
    locationSpecies: Array as PropType<EbirdSpecies[]>,
    challengeRecordings: Array as PropType<Recording[]>,
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
  },
  data() {
    return { isFamilyModalActive: false };
  },
});
</script>
