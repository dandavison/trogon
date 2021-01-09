<template>
  <section id="trip-switches">
    <div class="field" v-for="trip in trips" :key="trip.id">
      <trip-switch :trip="trip" id="trip.id" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import TripSwitch from "./TripSwitch.vue";
import { Trip } from "types";

export default Vue.extend({
  data() {
    return {};
  },
  props: { trips: Array as PropType<Trip[]> },
  components: { TripSwitch },
});
</script>
