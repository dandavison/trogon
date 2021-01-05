<template>
  <div id="map"></div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import L, { LayerGroup } from "leaflet";
import { EbirdHotSpot, Site, SiteDay, Trip } from "types";

function fetchSites(url: string): Site[] {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  }
  return [];
}

function fetchHotspots(url: string): EbirdHotSpot[] {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  }
  return [];
}

export default Vue.extend({
  props: {
    highlightSite: Object,
    showHotspots: Boolean,
    showSites: Boolean,
    trips: Array,
    visibleTrips: Map,
  },
  data() {
    const sites = fetchSites("http://localhost:8000/api/sites");
    const sitesLayerGroup = createSitesLayerGroup(sites);
    this.$emit("loadsites", sites);

    const hotspots = fetchHotspots("http://localhost:8000/api/ebird-hotspots");
    const hotspotsLayerGroup = createHotspotsLayerGroup(hotspots);
    this.$emit("loadhotspots", hotspots);

    return {
      hotspotsLayerGroup: hotspotsLayerGroup,
      mymap: null as L.Map | null,
      sites: sites,
      sitesLayerGroup: sitesLayerGroup,
      tripsLayerGroup: new Map() as Map<number, LayerGroup>,
      highlightMarker: null as L.Circle | null,
    };
  },
  mounted() {
    this.mymap = createMap(this.sites);
  },
  watch: {
    highlightSite: function (newVal) {
      if (newVal) {
        this.doHighlightSite(newVal);
      } else {
        this.doUnhighlightSite();
      }
    },
    showHotspots: function (newVal) {
      if (newVal) {
        this.doShowHotspots();
      } else {
        this.doHideHotspots();
      }
    },
    showSites: function (newVal) {
      if (newVal) {
        this.doShowSites();
      } else {
        this.doHideSites();
      }
    },
    trips: {
      handler(newTrips: Trip[]) {
        for (let trip of newTrips) {
          this.tripsLayerGroup.set(
            trip.id,
            createTripLayerGroup(trip.site_days)
          );
        }
      },
      deep: true,
    },
    visibleTrips: {
      handler(newVal: Map<number, boolean>) {
        for (let [tripId, isVisible] of newVal.entries()) {
          if (isVisible) {
            this.doShowTrip(tripId);
          } else {
            this.doHideTrip(tripId);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    doHideHotspots(): void {
      this.hotspotsLayerGroup.remove();
    },
    doShowHotspots(): void {
      if (this.mymap) {
        this.hotspotsLayerGroup.addTo(this.mymap);
      }
    },
    doHideSites(): void {
      this.sitesLayerGroup.remove();
    },
    doShowSites(): void {
      if (this.mymap) {
        this.sitesLayerGroup.addTo(this.mymap);
      }
    },
    doHideTrip(tripId: number): void {
      this.tripsLayerGroup.get(tripId)?.remove();
    },
    doShowTrip(tripId: number): void {
      if (this.mymap) {
        this.tripsLayerGroup.get(tripId)?.addTo(this.mymap);
      }
    },
    doHighlightSite(site: Site): void {
      if (!site || !this.mymap) {
        return;
      }
      var marker = L.circle([site.lat, site.lng], 500, {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
      }).addTo(this.mymap);
      this.highlightMarker = marker;
    },
    doUnhighlightSite(): void {
      let marker = this.highlightMarker;
      if (!marker) {
        return;
      }
      this.mymap?.removeLayer(marker);
      this.highlightMarker = null;
    },
  },
});

function createMap(sites: Array<Site>): L.Map {
  var mymap = L.map("map");
  if (sites.length > 0 && sites[0]) {
    mymap.setView([sites[0].lat, sites[0].lng], 5);
  }

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(mymap);
  return mymap;
}

function createHotspotsLayerGroup(hotspots: Array<EbirdHotSpot>): L.LayerGroup {
  let markers = [];
  for (let hotspot of hotspots) {
    markers.push(
      L.circle([hotspot.lat, hotspot.lng], 50, {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
      }).bindPopup(formatHotspotDetailHTML(hotspot))
    );
  }
  return L.layerGroup(markers);
}

function formatHotspotDetailHTML(hotspot: EbirdHotSpot): string {
  let html = `<a href='/ebird-hotspot/${hotspot.locId}' target='_blank'>${hotspot.locName}</a>`;
  html += `<br><br>${hotspot.numSpeciesAllTime || 0} species<br>`;
  html += `<br>Most recent observations: ${hotspot.latestObsDt || "none"}`;
  return html;
}

function createTripLayerGroup(sites: Array<SiteDay>): L.LayerGroup {
  let markers = [];
  for (let site of sites) {
    markers.push(L.marker([site.lat, site.lng]));
  }
  return L.layerGroup(markers);
}

function createSitesLayerGroup(sites: Array<Site>): L.LayerGroup {
  let markers = [];
  for (let site of sites) {
    markers.push(
      L.marker([site.lat, site.lng]).bindPopup(formatSiteDetailHTML(site))
    );
  }
  return L.layerGroup(markers);
}

function formatSiteDetailHTML(site: Site): string {
  let html = `<a href='/site/${site.id}' target='_blank'>${site.name}</a>`;
  html += `<br><img src="${site.images[0]}" />`;
  html += `<br><br>${site.guides.length} guide${
    site.guides.length == 1 ? "" : "s"
  }:<br>`;
  html += "<ul>";
  for (let guide of site.guides) {
    html += `<li>${guide.name}</li>`;
  }
  html += "</ul>";
  return html;
}
</script>

<style>
#map {
  height: 800px;
  z-index: 1;
}
</style>
