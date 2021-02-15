<template>
  <section class="section">
    <control-panel :open="controlPanelOpen" :settings="settings" />
    <game :settings="settings" :locationRequest="locationRequest" />
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import eventBus from "./event-bus";
import ControlPanel from "./ControlPanel.vue";
import Game from "./Game.vue";
import { LocationRequest, NamesLanguage, Settings } from "./types";

export default Vue.extend({
  name: "GameRoot",
  props: { locationRequest: Object as PropType<LocationRequest> },
  components: { ControlPanel, Game },
  data() {
    return {
      settings: {
        names: NamesLanguage.Both,
        promptIncludesImages: false,
        promptIncludesRecording: true,
        commonSpeciesOnly: false,
        songsOnly: true,
        useFieldModals: false,
      } as Settings,
      controlPanelOpen: false,
    };
  },
  mounted: function (): void {
    eventBus.$on("settings:change:names", (newVal: NamesLanguage) => {
      this.settings.names = newVal;
    });
    eventBus.$on("settings:change:commonSpeciesOnly", (newVal: boolean) => {
      this.settings.commonSpeciesOnly = newVal;
    });
    eventBus.$on("settings:change:songsOnly", (newVal: boolean) => {
      this.settings.songsOnly = newVal;
    });
    eventBus.$on("settings:change:promptIncludesImages", (newVal: boolean) => {
      this.settings.promptIncludesImages = newVal;
    });
    eventBus.$on(
      "settings:change:promptIncludesRecording",
      (newVal: boolean) => {
        this.settings.promptIncludesRecording = newVal;
      }
    );
    eventBus.$on("settings:change:useFieldModals", (newVal: boolean) => {
      this.settings.useFieldModals = newVal;
    });
  },
});
</script>
