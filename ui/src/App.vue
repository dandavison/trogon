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
  setup() {
    console.log("app setup, fetching /api/sites JSON...");
    fetch("http://localhost:8000/api/sites").then((response) => {
      response.json().then((sites) => console.log(sites));
    });
    return {};
  },
  components: { Mapx, Controls },
};
</script>

<style>
</style>
