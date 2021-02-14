<template>
  <section class="section">
    <ul v-if="recording" class="box has-text-centered">
      <li>
        <nav class="level">
          <div class="level-item">
            <div class="field has-addons">
              <p class="control">
                <recording-player :recording="recording" />
              </p>
              <p class="control">
                <b-button @click="setNextRecording" class="light">
                  {{ recording ? "Next" : "Start" }}
                </b-button>
              </p>
            </div>
          </div>
          <p class="level-item" v-if="image && settings.promptIncludesImages">
            <img :src="image" />
          </p>
        </nav>
      </li>
      <li>{{ recording.raw.loc }}, {{ recording.raw.cnt }}</li>
      <li v-if="recording.raw.also.length[0]">
        Also:
        <ul>
          <li v-for="sp in recording.raw.also" :key="sp">{{ sp }}</li>
        </ul>
      </li>
    </ul>
    <nav v-else class="level">
      <div class="level-item">
        <div class="field">
          <p class="control">
            <b-button @click="setNextRecording" class="light">Start</b-button>
          </p>
        </div>
      </div>
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
