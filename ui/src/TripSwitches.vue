<template>
  <section id="trip-switches">
    <div class="field" v-for="trip in trips" :key="trip.id">
      <trip-switch :trip="trip" id="trip.id" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import TripSwitch from "./TripSwitch.vue";

export default Vue.extend({
  data() {
    return {};
  },
  props: ["trips"],
  components: { TripSwitch },
});
</script>
