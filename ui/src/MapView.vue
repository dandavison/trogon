<!--
MapView
-------

MapView is a root component: the ControlPanel, Map, TripsTimeline and
SitesListPanel are all descendents of this node.

MapView owns the main arrays of objects received from the server:
Sites, EbirdHotspots, and Trips.

It also owns SiteGroups, EbirdHotspotGroups, and TripGroups. These
determine what is displayed on the map (they are bound as props of the
map).

Suppose a control panel component needs to change what is displayed on
the map. This works as follows:

1. The control panel component emits an event describing a mutation to
   one of the *Groups.
2. MapView handles the event and performs the mutation against the Group.
3. The map reacts, since the Group is bound as a prop of the map.
 -->
<template>
  <div>
    <control-panel v-bind:trips="trips" @click:trips="handleClickTrips" />
    <site-list-panel
      v-bind:sites="sites"
      @highlight:site="handleHighlightSite"
      @unhighlight:site="handleUnhighlightSite"
    />
    <sylph-map
      v-bind:siteGroups="siteGroups"
      v-bind:siteHighlightGroups="siteHighlightGroups"
      v-bind:tripSiteGroups="tripSiteGroups"
      v-bind:ebirdHotspotGroups="ebirdHotspotGroups"
      v-bind:center="mapCenter"
    />
    <trip-timeline v-bind:trip="selectedTrip" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import ControlPanel from "./ControlPanel.vue";
import eventBus from "./event-bus";
import SiteListPanel from "./SiteListPanel.vue";
import SylphMap from "./SylphMap.vue";
import TripTimeline from "./TripTimeline.vue";
import { EbirdHotspot, EbirdHotspotGroup, Site, SiteDay, Trip } from "types";
import { fetchJSONArraySynchronously } from "./utils";

export default Vue.extend({
  name: "mapView",
  components: { ControlPanel, SylphMap, SiteListPanel, TripTimeline },
  data() {
    const sites = fetchJSONArraySynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/sites`
    ) as Site[];
    const ebirdHotspots = fetchJSONArraySynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspots`
    ) as EbirdHotspot[];
    return {
      sites,
      mapCenter: [sites[0]?.lat || 0.0, sites[0]?.lng || 0.0],
      trips: [] as Trip[],
      ebirdHotspots,
      siteGroups: [] as Site[][],
      siteHighlightGroups: [] as Site[][],
      tripSiteGroups: [] as SiteDay[][],
      ebirdHotspotGroups: [
        {
          id: 1,
          hotspots: ebirdHotspots,
          visible: false,
        },
      ] as EbirdHotspotGroup[],
      selectedTrip: null as Trip | null,
    };
  },
  mounted() {
    eventBus.$on("change:show-sites", this.handleChangeShowSites);
    eventBus.$on("change:show-hotspots", this.handleChangeShowHotspots);
    eventBus.$on("change:show-trip", this.handleChangeShowTrip);
  },
  methods: {
    handleClickTrips: function(): void {
      fetch(`${process.env.VUE_APP_SERVER_URL}/api/trips`).then(response => {
        response.json().then(trips => {
          this.trips = trips;
        });
      });
    },
    handleChangeShowSites: function(show: boolean): void {
      if (show) {
        this.siteGroups.push(this.sites);
      } else {
        this.siteGroups = [];
      }
    },
    handleChangeShowHotspots: function(show: boolean): void {
      var ebirdHotspotGroup = this.ebirdHotspotGroups[0];
      if (ebirdHotspotGroup) {
        ebirdHotspotGroup.visible = show;
      }
    },
    handleChangeShowTrip: function(show: boolean, trip: Trip) {
      if (show) {
        this.selectedTrip = trip;
        // TODO: mutate tripSiteGroups correctly
        this.tripSiteGroups.push(this.trips[0]?.site_days || []);
      } else {
        this.selectedTrip = null;
        this.tripSiteGroups = [[]];
      }
    },
    handleHighlightSite: function(site: Site): void {
      this.siteHighlightGroups.push([site]);
    },
    handleUnhighlightSite: function(site: Site): void {
      // TODO: mutate siteHighlightGroups correctly
      console.log("TODO", site); // for the typechecker
      this.siteHighlightGroups = [];
    }
  }
});
</script>

<style scoped></style>
