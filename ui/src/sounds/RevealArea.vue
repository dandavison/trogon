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
        <b-button
          label="Recordings"
          icon-right="chevron-down"
          icon-pack="fas"
        />
      </template>
      <b-dropdown-item
        v-for="rec in recordings.get(recording.sciName)"
        :key="rec.url"
      >
        <recording-component :recording="rec" :preload="'none'" />
      </b-dropdown-item>
    </b-dropdown>

    <p v-if="settings.promptIncludesRecording && recording"></p>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { NamesLanguage, Recording, Settings } from "./types";
import RecordingComponent from "./Recording.vue";

export default Vue.extend({
  components: { RecordingComponent },
  props: {
    image: String,
    recording: Object as PropType<Recording>,
    recordings: Map as PropType<Map<string, Recording[]>>,
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
