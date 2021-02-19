<template>
  <b-modal v-model="isModalActive">
    <section class="section has-text-grey-light">
      <ul>
        <li v-for="[family, data] of challengeFamilies.entries()" :key="family">
          <b-checkbox
            @input="(val) => selectFamily(family, val)"
            :value="data.selected"
          ></b-checkbox>
          {{ family }} ({{ data.n }})
        </li>
      </ul>
    </section>
  </b-modal>
</template>

<script lang="ts">
import eventBus from "./event-bus";
import Vue, { PropType } from "vue";
import { ChallengeFamily } from "./types";
export default Vue.extend({
  props: {
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
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
  },
});
</script>
