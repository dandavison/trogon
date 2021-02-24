<template>
  <div class="mt-3">
    <audio
      :src="recording.url"
      id="audio-from-html-tag"
      :autoplay="true"
      :controls="true"
      preload="none"
    />
  </div>
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
      default: "none",
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
        audio.play();
      });
      audio.addEventListener("play", () => {
        eventBus.$emit("challenge:have-recording");
      });
    },

    mountAudio(programmaticAudio: HTMLAudioElement) {
      if (
        programmaticAudio.readyState ===
        HTMLMediaElementReadyState.HAVE_ENOUGH_DATA
      ) {
        eventBus.$emit("challenge:have-recording");
        programmaticAudio.play();
      }
      const shouldAutoplay = programmaticAudio.autoplay;
      this.$el.append(programmaticAudio);
      window.setTimeout(() => {
        if (shouldAutoplay && !programmaticAudio.autoplay) {
          // desktop Chrome
          console.log(
            "WARNING: It looks like the browser is blocking audio play from javascript: using workaround."
          );
          this.selectAudio(false, programmaticAudio);
        } else {
          this.selectAudio(true, programmaticAudio);
        }
      }, 0);
    },

    selectAudio(
      useProgrammaticAudio: boolean,
      programmaticAudio: HTMLAudioElement
    ): void {
      const HTMLAudio = this.$el.querySelector(
        "audio#audio-from-html-tag"
      ) as HTMLAudioElement;
      if (useProgrammaticAudio) {
        this.disableAudio(HTMLAudio);
        this.configureAudioEventListeners(programmaticAudio);
      } else {
        this.disableAudio(programmaticAudio);
        this.configureAudioEventListeners(HTMLAudio);
      }
    },

    disableAudio(audio: HTMLAudioElement): void {
      audio.hidden = true;
      audio.muted = true;
      audio.src = "";
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