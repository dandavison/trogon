<template>
  <audio
    controls
    class="mt-3"
    :src="recording.url"
    :preload="preload"
    @canplaythrough="
      (ev) => {
        ev.target.play();
      }
    "
    @play="
      (ev) => {
        eventBus.$emit('ready:challenge-recording');
      }
    "
  ></audio>
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

<style scoped>
audio::-webkit-media-controls-panel {
  background-color: white;
}
</style>