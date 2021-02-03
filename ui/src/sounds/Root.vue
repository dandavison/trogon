<template>
  <section>
    <map-component :center="[0.0, 0.0]" />
  </section>
</template>

<script lang="ts">
import { EbirdHotspot } from "types";
import Vue from "vue";
import MapComponent from "./Map.vue";

export default Vue.extend({
  components: { MapComponent },
  data() {
    return {
      ebirdHotSpots: [] as EbirdHotspot[]
    };
  },
  created: function(): void {}
});
</script>
