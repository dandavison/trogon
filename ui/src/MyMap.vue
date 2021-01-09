<template>
  <section>
    <div class="container"><map-view /></div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import MapView from "./MapView.vue";

export default Vue.extend({
  components: { MapView },
  data() {
    return {};
  },
});
</script>

<style scoped></style>
