<template>
  <section>
    <div class="container"><map-view /></div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import MapView from "./MapView.vue";
export default Vue.extend({
  name: "app",
  components: { MapView },
  data() {
    return {};
  },
});
</script>

<style scoped>
</style>
