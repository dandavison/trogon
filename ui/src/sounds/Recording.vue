<template>
  <ul>
    <li><audio controls :src="recording.url" :preload="preload"></audio></li>
    <li>{{ recording.raw.loc }}, {{ recording.raw.cnt }}</li>
    <li>{{ recording.raw.type }}</li>
    <li v-if="recording.raw.also.length[0]">
      Also:
      <ul>
        <li v-for="sp in recording.raw.also" :key="sp">{{ sp }}</li>
      </ul>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Recording } from "./types";

export default Vue.extend({
  props: {
    recording: Object as PropType<Recording>,
    preload: { type: String, default: "none" },
  },
});
</script>
