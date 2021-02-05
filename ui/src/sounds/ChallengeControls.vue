<template>
  <nav class="level">
    <p class="level-item has-text-centered">
      <b-button @click="setNextRecording">
        {{ recording ? "Next" : "Start" }}
      </b-button>
    </p>
    <p class="level-item" v-if="settings.promptIncludesRecording && recording">
      <recording-component :recording="recording" />
    </p>

    <p class="level-item" v-if="image && settings.promptIncludesImages">
      <img :src="image" />
    </p>
  </nav>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { Recording, Settings } from "./types";

import RecordingComponent from "./Recording.vue";

export default Vue.extend({
  components: { RecordingComponent },
  props: {
    image: String,
    recording: Object as PropType<Recording | null>,
    setNextRecording: Function,
    settings: Object as PropType<Settings>,
  },
});
</script>