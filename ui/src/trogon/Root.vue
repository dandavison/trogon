<template>
  <section>
    <navbar />
    <map-component :center="[0.0, 0.0]" />
  </section>
</template>

<script lang="ts">
import { EbirdHotspot } from "types";
import Vue from "vue";

import MapComponent from "./Map.vue";
import Navbar from "./Navbar.vue";

export default Vue.extend({
  components: { MapComponent, Navbar },
  data() {
    return {
      ebirdHotSpots: [] as EbirdHotspot[],
    };
  },
  created: function (): void {},
});
</script>
