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
      <li>{{ locationSpecies.length }} species</li>
      <li>{{ nSpecies }} species in challenge</li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { ChallengeFamily, EbirdHotspot, EbirdSpecies } from "./types";

export default Vue.extend({
  props: {
    ebirdLocIds: Array as PropType<string[]>,
    ebirdHotspots: Array as PropType<EbirdHotspot[]>,
    locationSpecies: Array as PropType<EbirdSpecies[]>,
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
  },
  computed: {
    nSpecies(): number {
      return [...this.challengeFamilies.values()]
        .filter(({ selected }) => selected)
        .map(({ n }) => n)
        .reduce((a, b) => a + b, 0);
    },
  },
});
</script>
