<template>
  <div>
    <navbar />
    <control-panel :open="controlPanelOpen" :settings="settings" />
    <game :settings="settings" :ebirdLocId="ebirdLocId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import eventBus from "./event-bus";
import ControlPanel from "./ControlPanel.vue";
import Navbar from "./Navbar.vue";
import Game from "./Game.vue";
import { Settings } from "./types";

export default Vue.extend({
  name: "Root",
  props: { ebirdLocId: String },
  components: { Navbar, ControlPanel, Game },
  data() {
    return {
      settings: {
        names: "english",
        songsOnly: true,
      } as Settings,
      controlPanelOpen: false,
    };
  },
  mounted: function (): void {
    eventBus.$on("settings:change:names", (newVal: string) => {
      this.settings.names = newVal;
    });
    eventBus.$on("settings:change:songsOnly", (newVal: boolean) => {
      this.settings.songsOnly = newVal;
    });
  },
});
</script>
