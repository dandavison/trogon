<template>
  <div>
    <sidebar
      @changeshowsites="changeShowSites"
      @changeshowtrip="changeShowTrip"
      @clicktrips="createTrips"
    />
    <mapx
      v-bind:showSites="showSites"
      v-bind:trips="trips"
      v-bind:visibleTrips="visibleTrips"
    />
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
      trips: [],
      visibleTrips: new Map(),
    };
  },
  methods: {
    changeShowSites: function (newVal) {
      this.showSites = newVal;
    },
    changeShowTrip: function (newVal, trip) {
      let visibleTrips = new Map();

      for (let _trip of this.trips) {
        if (_trip.id === trip.id) {
          visibleTrips[trip.id] = newVal;
        } else {
          visibleTrips[_trip.id] = this.visibleTrips[_trip.id];
        }
      }
      this.visibleTrips = visibleTrips;
    },
    createTrips: function (trips) {
      this.trips = trips;
      let visibleTrips = new Map();
      for (let trip of this.trips) {
        visibleTrips[trip.id] = false;
      }
      this.visibleTrips = visibleTrips;
    },
  },
};
</script>

<style scoped>
</style>
