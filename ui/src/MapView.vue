<template>
  <div>
    <navbar />
    <control-panel
      @changeshowsites="changeShowSites"
      @changeshowtrip="changeShowTrip"
      @clicktrips="createTrips"
    />
    <site-list-panel
      @highlightsite="doHighlightSite"
      @unhighlightsite="doUnhighlightSite"
      v-bind:sites="sites"
    />
    <mapx
      @loadsites="loadSites"
      v-bind:highlightSite="highlightSite"
      v-bind:showSites="showSites"
      v-bind:trips="trips"
      v-bind:visibleTrips="visibleTrips"
    />
  </div>
</template>

<script>
import ControlPanel from "./ControlPanel.vue";
import Mapx from "./Map.vue";
import Navbar from "./Navbar.vue";
import SiteListPanel from "./SiteListPanel.vue";
export default {
  name: "mapView",
  components: { ControlPanel, Mapx, Navbar, SiteListPanel },
  data() {
    return {
      highlightSite: null,
      showSites: false,
      sites: [],
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
    doHighlightSite: function (site) {
      this.highlightSite = site;
    },
    doUnhighlightSite: function (site) {
      if (this.highlightSite && site.id === this.highlightSite.id)
        this.highlightSite = null;
    },
    loadSites: function (sites) {
      this.sites = sites;
    },
  },
};
</script>

<style scoped>
</style>
