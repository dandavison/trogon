<template>
  <section class="section">
    <nav class="level">
      <p class="level-item has-text-centered">
        <b-button @click="setNextRecording" class="is-success is-large">
          {{ recording ? "Next" : "Start" }}
        </b-button>
      </p>
      <p
        class="level-item"
        v-if="settings.promptIncludesRecording && recording"
      >
        <recording-player :recording="recording" />
      </p>

      <p class="level-item" v-if="image && settings.promptIncludesImages">
        <img :src="image" />
      </p>
    </nav>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Recording, Settings } from "./types";

import RecordingPlayer from "./RecordingPlayer.vue";

export default Vue.extend({
  components: { RecordingPlayer },
  props: {
    image: String,
    recording: Object as PropType<Recording | null>,
    setNextRecording: Function,
    settings: Object as PropType<Settings>,
  },
});
</script>
