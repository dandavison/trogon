<template>
  <div>
    <sidebar
      @changeshowsites="changeShowSites"
      @changeshowtrip="changeShowTrip"
      @clicktrips="showTrips"
    />
    <mapx v-bind:showSites="showSites" v-bind:trips="trips" />
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
    };
  },
  methods: {
    changeShowSites: function (newVal) {
      this.showSites = newVal;
    },
    changeShowTrip: function (newVal, trip) {
      console.log("MapView show trip: ", newVal, trip.name);
      let newTrips = [];
      for (let _trip of this.trips) {
        if (_trip.id === trip.id) {
          console.log("MapView updating visibility", newVal, trip.name);
          _trip["isVisible"] = newVal;
          newTrips.push(_trip);
        }
      }
      this.trips = newTrips;
    },
    showTrips: function (trips) {
      console.log("MapView: setting trips", trips);
      this.trips = trips;
    },
  },
};
</script>

<style scoped>
</style>
