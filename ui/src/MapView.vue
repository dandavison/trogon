<template>
  <div>
    <sidebar />
    <mapx v-bind:showSites="showSites" />
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Mapx from "./Map.vue";
export default {
  name: "mapView",
  components: { Mapx, Sidebar },
  data() {
    return {
      showSites: false,
    };
  },
};
</script>

<style scoped>
</style>
