<template>
  <section>
    <p>
      <a :href="recordingSpeciesWikipediaURL()" target="_blank">
        {{ recordingSpeciesSciName() }}
      </a>
    </p>

    <img v-if="image && !settings.promptIncludesImages" :src="image" />

    <b-dropdown v-if="settings.promptIncludesRecording && recording">
      <template #trigger="{ active }">
        <b-button icon-right="chevron-down" icon-pack="fas">
          <i class="fas fa-volume-up"></i>
        </b-button>
      </template>
      <b-dropdown-item v-for="rec in recordings" :key="rec.url">
        <ul>
          <li v-if="rec.url != recording.url">
            <ul>
              <li><recording-player :recording="rec" /></li>
              <li>{{ rec.raw.loc }}, {{ rec.raw.cnt }}</li>
            </ul>
          </li>
        </ul>
      </b-dropdown-item>
    </b-dropdown>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { NamesLanguage, Recording, Settings } from "../types";
import RecordingPlayer from "./RecordingPlayer.vue";

export default Vue.extend({
  components: { RecordingPlayer },
  props: {
    image: String,
    recording: Object as PropType<Recording>,
    recordings: Array as PropType<Recording[]>,
    settings: Object as PropType<Settings>,
  },
  methods: {
    recordingSpeciesWikipediaURL(): string | null {
      if (this.recording) {
        return `https://en.wikipedia.org/w/index.php?title=${this.recording.speciesSci.replace(
          " ",
          "_"
        )}`;
      } else {
        return null;
      }
    },
    recordingSpeciesSciName(): string | null {
      if (this.recording) {
        const speciesEn = this.recording.speciesEn;
        if (this.settings.names == NamesLanguage.English) {
          return speciesEn;
        } else {
          const speciesSci = this.recording.speciesSci;
          if (this.settings.names == NamesLanguage.Scientific) {
            return speciesSci;
          } else {
            return `${speciesSci} (${speciesEn})`;
          }
        }
      } else {
        return null;
      }
    },
  },
});
</script>
