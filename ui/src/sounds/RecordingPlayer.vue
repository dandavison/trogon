<template>
  <ul>
    <li>
      <audio
        controls
        :src="recording.url"
        :preload="preload"
        @canplaythrough="
          (ev) => {
            ev.target.play();
          }
        "
        @loadeddata="eventBus.$emit('ready:challenge-recording')"
      ></audio>
    </li>
    <li>{{ recording.raw.loc }}, {{ recording.raw.cnt }}</li>
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

import eventBus from "./event-bus";
import { Recording } from "./types";

export default Vue.extend({
  props: {
    recording: Object as PropType<Recording>,
    preload: { type: String, default: "metadata" },
  },
  data() {
    return {
      eventBus,
    };
  },
});
</script>
