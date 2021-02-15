<template>
  <section class="section">
    <navbar />
    <control-panel :open="controlPanelOpen" :settings="settings" />
    <game :settings="settings" :locationRequest="locationRequest" />
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import eventBus from "./event-bus";
import ControlPanel from "./ControlPanel.vue";
import Navbar from "./Navbar.vue";
import Game from "./Game.vue";
import { LocationRequest, NamesLanguage, Settings } from "./types";

export default Vue.extend({
  name: "GameRoot",
  props: { locationRequest: Object as PropType<LocationRequest> },
  components: { Navbar, ControlPanel, Game },
  data() {
    return {
      settings: {
        names: NamesLanguage.Both,
        promptIncludesImages: false,
        promptIncludesRecording: true,
        commonSpeciesOnly: false,
        songsOnly: true,
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
  },
});
</script>
