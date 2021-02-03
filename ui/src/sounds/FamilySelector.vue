<template>
  <ul>
    <li v-for="[family, data] of challengeFamilies.entries()" :key="family">
      <b-checkbox
        @input="(val) => selectFamily(family, val)"
        :value="data.selected"
      ></b-checkbox>
      {{ family }} ({{ data.n }})
    </li>
  </ul>
</template>

<script lang="ts">
import eventBus from "./event-bus";
import Vue, { PropType } from "vue";
import { ChallengeFamily } from "./types";
export default Vue.extend({
  props: { challengeFamilies: Map as PropType<Map<string, ChallengeFamily>> },
  methods: {
    selectFamily(family: string, val: boolean): void {
      eventBus.$emit("family:select", family, val);
    },
  },
});
</script>