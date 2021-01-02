<template>
  <div>
    <sidebar />
    <mapx />
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Mapx from "./Map.vue";
export default {
  name: "mapView",
  components: { Mapx, Sidebar },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>
