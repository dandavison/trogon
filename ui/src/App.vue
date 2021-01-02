<template>
  <section>
    <div id="app-component" class="container">
      <sidebar />
      <mapx />
    </div>
  </section>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Mapx from "./Map.vue";
export default {
  name: "app",
  components: { Mapx, Sidebar },
  data() {
    return {};
  },
};
</script>

<style scoped>
</style>
