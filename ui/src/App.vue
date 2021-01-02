<template>
  <div id="app-component" class="container">
    <div class="row">
      <nav class="col-2 border" id="controls-container"><controls /></nav>
      <div class="col-10 border"><mapx /></div>
    </div>
  </div>
</template>

<script>
import Controls from "./Controls.vue";
import Mapx from "./Map.vue";
export default {
  name: "app",
  components: { Mapx, Controls },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>
