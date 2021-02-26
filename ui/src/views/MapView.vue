<template>
  <section>
    <map-component :center="[0.0, 0.0]" />
  </section>
</template>

<script lang="ts">
import Vue from "vue";

import { EbirdHotspot } from "../types";
import MapComponent from "../components/Map.vue";

export default Vue.extend({
  components: { MapComponent },
  data() {
    return {
      ebirdHotSpots: [] as EbirdHotspot[],
    };
  },
});
</script>
