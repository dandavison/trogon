<template>
  <div>
    <navbar />
    <control-panel :open="controlPanelOpen" :settings="settings" />
    <game :settings="settings" :ebirdLocId="ebirdLocId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { LatLng } from "leaflet";

import eventBus from "./event-bus";
import ControlPanel from "./ControlPanel.vue";
import Navbar from "./Navbar.vue";
import Game from "./Game.vue";
import { NamesLanguage, Settings } from "./types";

export default Vue.extend({
  name: "GameRoot",
  props: { ebirdLocId: String, latlng: LatLng },
  components: { Navbar, ControlPanel, Game },
  data() {
    return {
      settings: {
        names: NamesLanguage.Both,
        promptIncludesImages: false,
        promptIncludesRecording: true,
        songsOnly: true,
      } as Settings,
      controlPanelOpen: false,
    };
  },
  mounted: function (): void {
    eventBus.$on("settings:change:names", (newVal: NamesLanguage) => {
      this.settings.names = newVal;
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
