<template>
  <div class="mt-3"></div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import eventBus from "../event-bus";
import { HTMLMediaElementReadyState, Recording } from "../types";

export default Vue.extend({
  props: {
    recording: Object as PropType<Recording>,
    preload: {
      type: String,
      default: "metadata",
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    if (!this.recording.audio.src) {
      this.recording.audio = new Audio(this.recording.url);
    }
    this.configureAudio(this.recording.audio);
    this.configureAudioEventListeners(this.recording.audio);
  },
  mounted() {
    this.mountAudio(this.recording.audio);
  },
  watch: {
    recording(value: Recording) {
      this.mountAudio(value.audio);
    },
  },
  methods: {
    configureAudio(audio: HTMLAudioElement): void {
      audio.preload = this.preload;
      audio.autoplay = this.autoplay;
      audio.controls = true;
    },

    configureAudioEventListeners(audio: HTMLAudioElement): void {
      audio.addEventListener("canplaythrough", () => {
        console.log("@canplaythrough");
        audio.play();
      });
      audio.addEventListener("play", () => {
        console.log("@play");
        eventBus.$emit("challenge:have-recording");
      });
    },

    mountAudio(audio: HTMLAudioElement) {
      if (audio.readyState === HTMLMediaElementReadyState.HAVE_ENOUGH_DATA) {
        console.log("HAVE_ENOUGH_DATA already");
        eventBus.$emit("challenge:have-recording");
        audio.play();
      }
      console.log(audio.autoplay);
      const shouldAutoplay = audio.autoplay;
      this.$el.append(audio);
      window.setTimeout(() => {
        if (shouldAutoplay && !audio.autoplay) {
          // desktop Chrome
          console.log(
            "WARNING: It looks like the browser is blocking audio play from javascript."
          );
        }
      }, 0);
    },
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