<template>
  <div>
    <navbar />
    <control-panel
      @changeshowhotspots="changeShowHotspots"
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
      @loadhotspots="loadHotspots"
      v-bind:highlightSite="highlightSite"
      v-bind:showHotspots="showHotspots"
      v-bind:showSites="showSites"
      v-bind:trips="trips"
      v-bind:visibleTrips="visibleTrips"
    />
    <trip-timeline v-bind:sites="sites" />
  </div>
</template>

<script lang="ts">
import { EbirdHotSpot, Site, Trip } from "types";
import Vue from "vue";
import ControlPanel from "./ControlPanel.vue";
import Mapx from "./Map.vue";
import Navbar from "./Navbar.vue";
import SiteListPanel from "./SiteListPanel.vue";
import TripTimeline from "./TripTimeline.vue";

export default Vue.extend({
  name: "mapView",
  components: { ControlPanel, Mapx, Navbar, SiteListPanel, TripTimeline },
  data() {
    return {
      highlightSite: null as Site | null,
      showHotspots: false,
      showSites: false,
      sites: [] as Site[],
      trips: [] as Trip[],
      visibleTrips: new Map() as Map<number, boolean>,
      hotspots: [] as EbirdHotSpot[],
    };
  },
  methods: {
    changeShowHotspots: function (newVal: boolean): void {
      this.showHotspots = newVal;
    },
    changeShowSites: function (newVal: boolean): void {
      this.showSites = newVal;
    },
    changeShowTrip: function (newVal: boolean, trip: Trip): void {
      let visibleTrips = new Map() as Map<number, boolean>;

      for (let _trip of this.trips) {
        if (_trip.id === trip.id) {
          visibleTrips.set(trip.id, newVal);
        } else {
          visibleTrips.set(_trip.id, this.visibleTrips.get(_trip.id) || false);
        }
      }
      this.visibleTrips = visibleTrips;
    },
    createTrips: function (trips: Trip[]): void {
      this.trips = trips;
      let visibleTrips = new Map() as Map<number, boolean>;
      for (let trip of this.trips) {
        visibleTrips.set(trip.id, false);
      }
      this.visibleTrips = visibleTrips;
    },
    doHighlightSite: function (site: Site): void {
      this.highlightSite = site;
    },
    doUnhighlightSite: function (site: Site): void {
      if (this.highlightSite && site.id === this.highlightSite.id)
        this.highlightSite = null;
    },
    loadSites: function (sites: Site[]): void {
      this.sites = sites;
    },
    loadHotspots: function (hotspots: EbirdHotSpot[]): void {
      this.hotspots = hotspots;
    },
  },
});
</script>

<style scoped>
</style>
