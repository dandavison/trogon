<template>
  <audio
    controls
    class="mt-3"
    :src="recording.url"
    :preload="preload"
    @loadedmetadata="
      (ev) => {
        debug(['loadedmetadata']);
        ev.target.play();
      }
    "
    @loadeddata="
      (ev) => {
        debug(['loadeddata']);
      }
    "
    @canplay="
      (ev) => {
        debug(['canplay']);
      }
    "
    @canplaythrough="
      (ev) => {
        debug(['canplaythrough']);
        ev.target.play();
      }
    "
    @playing="
      (ev) => {
        debug(['playing']);
      }
    "
    @play="
      (ev) => {
        debug(['play']);
        eventBus.$emit('ready:challenge-recording');
      }
    "
  ></audio>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { debug } from "../utils";
import eventBus from "../event-bus";
import { Recording } from "../types";

export default Vue.extend({
  props: {
    recording: Object as PropType<Recording>,
    preload: { type: String, default: "metadata" },
  },
  data() {
    return {
      eventBus,
      debug,
    };
  },
});
</script>

<style scoped>
audio {
  outline: none;
}
audio::-webkit-media-controls-panel {
  background-color: white;
}
</style>