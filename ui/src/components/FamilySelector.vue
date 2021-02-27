<template>
  <b-modal v-model="isModalActive">
    <section class="section has-text-grey-light">
      <ul>
        <li v-for="[family, data] of challengeFamilies.entries()" :key="family">
          <b-checkbox
            @input="(val) => selectFamily(family, val)"
            :value="data.selected"
          ></b-checkbox>
          {{ formatFamily(family) }} ({{ data.n }})
        </li>
      </ul>
    </section>
  </b-modal>
</template>

<script lang="ts">
import eventBus from "../event-bus";
import Vue, { PropType } from "vue";
import { ChallengeFamily, NamesLanguage, Settings, TaxonMaps } from "../types";
export default Vue.extend({
  props: {
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
    taxonMaps: Object as PropType<TaxonMaps>,
    settings: Object as PropType<Settings>,
  },
  data() {
    return {
      isModalActive: false,
    };
  },
  mounted() {
    eventBus.$on("show:family-selector", () => (this.isModalActive = true));
  },
  methods: {
    selectFamily(family: string, val: boolean): void {
      eventBus.$emit("family:select", family, val);
    },

    formatFamily(familySci: string): string {
      if (this.settings.names == NamesLanguage.Scientific) {
        return familySci;
      } else {
        const familyEn = this.taxonMaps.familySci2En.get(familySci) as string;
        if (this.settings.names == NamesLanguage.Both)
          return `${familySci} (${familyEn})`;
        else {
          return familyEn;
        }
      }
    },
  },
});
</script>
