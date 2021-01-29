<template>
  <div>
    <navbar />
    <control-panel :open="controlPanelOpen" />
    <game :settings="settings" :ebirdLocId="ebirdLocId" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
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
});
</script>
