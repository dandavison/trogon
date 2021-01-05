<template>
  <section id="trip-switches">
    <div class="field" v-for="trip in trips" :key="trip.id">
      <trip-switch :trip="trip" id="trip.id" @changeshowtrip="changeShowTrip" />
    </div>
  </section>
</template>

<script lang="ts">
import { Trip } from "types";
import Vue from "vue";
import TripSwitch from "./TripSwitch.vue";

export default Vue.extend({
  data() {
    return {};
  },
  props: ["trips"],
  components: { TripSwitch },
  methods: {
    changeShowTrip: function (newVal: boolean, trip: Trip) {
      this.$emit("changeshowtrip", newVal, trip);
    },
  },
});
</script>
