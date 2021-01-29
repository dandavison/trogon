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

export default Vue.extend({
  name: "Root",
  props: { ebirdLocId: String },
  components: { Navbar, ControlPanel, Game },
  data() {
    return {
      settings: {
        names: "english",
      },
      controlPanelOpen: false,
    };
  },
  mounted: function (): void {
    eventBus.$on("names:change", (newVal: string) => {
      console.log("Handling names:change", newVal);
      this.settings.names = newVal;
    });
  },
});
</script>
