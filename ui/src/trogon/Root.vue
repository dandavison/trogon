<template>
  <section>
    <navbar />
    <map-component :center="[0.0, 0.0]" />
    <b-modal v-model="showHelp"><help /></b-modal>
  </section>
</template>

<script lang="ts">
import { EbirdHotspot } from "types";
import Vue from "vue";

import eventBus from "./event-bus";
import Help from "./Help.vue";
import MapComponent from "./Map.vue";
import Navbar from "./Navbar.vue";

export default Vue.extend({
  components: { Help, MapComponent, Navbar },
  data() {
    return {
      ebirdHotSpots: [] as EbirdHotspot[],
      showHelp: false,
    };
  },
  mounted: function (): void {
    eventBus.$on("show:help", () => {
      this.showHelp = true;
    });
  },
});
</script>
