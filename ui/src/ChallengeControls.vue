<template>
  <section class="section">
    <nav v-if="!recording" class="level">
      <div class="level-item">
        <div class="field">
          <p class="control">
            <b-button @click="setNextRecording" class="light is-large">
              <i class="fas fa-play"></i>
            </b-button>
          </p>
        </div>
      </div>
    </nav>
    <ul v-else class="box has-text-centered">
      <li>
        <nav class="level">
          <div class="level-item">
            <div class="field">
              <p class="control">
                <b-button @click="setNextRecording" class="light">
                  <i class="fas fa-step-forward"></i>
                </b-button>
              </p>
            </div>
          </div>
        </nav>
      </li>
      <li>
        <nav class="level">
          <div class="level-item">
            <div class="field">
              <p class="control">
                <recording-player :recording="recording" />
              </p>
            </div>
          </div>
          <p class="level-item" v-if="image && settings.promptIncludesImages">
            <img :src="image" />
          </p>
        </nav>
      </li>
      <li>{{ recording.raw.loc }}, {{ recording.raw.cnt }}</li>
      <li>{{ recording.raw.type }}</li>
      <li v-if="recording.raw.also.filter(Boolean).length > 0">
        <small>
          Also in recording:
          <span v-for="(sp, index) in recording.raw.also" :key="index">
            <i v-if="settings.names === NamesLanguage.Scientific">{{ sp }}</i>
            <span v-else>
              {{ taxonMaps.speciesSci2En.get(sp) || "" }}
              <span v-if="settings.names === NamesLanguage.Both">
                (<i>{{ sp }}</i
                >)</span
              >
            </span>
            <span v-if="index + 1 < recording.raw.also.length">, </span>
          </span>
        </small>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { NamesLanguage, Recording, Settings, TaxonMaps } from "./types";

import RecordingPlayer from "./RecordingPlayer.vue";

export default Vue.extend({
  components: { RecordingPlayer },
  props: {
    image: String,
    recording: Object as PropType<Recording | null>,
    setNextRecording: Function,
    taxonMaps: Object as PropType<TaxonMaps>,
    settings: Object as PropType<Settings>,
  },
  data() {
    return { NamesLanguage };
  },
});
</script>
