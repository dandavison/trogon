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
      <li>
        <b-dropdown>
          <template #trigger>
            <a role="button" style="color: currentColor">
              <span>
                {{ filteredLocationSpecies.length }} species in challenge
              </span>
              <i class="fas fa-chevron-down"></i>
            </a>
          </template>
          <b-dropdown-item>
            {{ nSelectedFamilies }} / {{ challengeFamilies.size }} families
            selected
          </b-dropdown-item>
          <b-dropdown-item v-if="settings.commonSpeciesOnly">
            Restricting to {{ commonSpecies.size }} recently observed species.
          </b-dropdown-item>
        </b-dropdown>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import {
  ChallengeFamily,
  EbirdHotspot,
  EbirdObservation,
  Settings,
  Species,
} from "../types";

export default Vue.extend({
  props: {
    ebirdLocIds: Array as PropType<string[]>,
    ebirdHotspots: Array as PropType<EbirdHotspot[]>,
    locationSpecies: Array as PropType<Species[]>,
    filteredLocationSpecies: Array as PropType<Species[]>,
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
    commonSpecies: Set as PropType<Set<string>>,
    recentObservations: Array as PropType<EbirdObservation[]>,
    settings: Object as PropType<Settings>,
  },
  computed: {
    nSelectedFamilies(): number {
      return [...this.challengeFamilies.values()].filter(
        ({ selected }) => selected
      ).length;
    },
  },
});
</script>
