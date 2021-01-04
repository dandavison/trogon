<template>
  <div id="map"></div>
</template>

<script lang="ts">
import Vue from "vue";
import L from "leaflet";
export default Vue.extend({
  props: {
    highlightSite: Object,
    showHotspots: Boolean,
    showSites: Boolean,
    trips: Array,
    visibleTrips: Map,
  },
  data() {
    this.mymap = null;
    this.hotspotsLayerGroup = null;
    this.sitesLayerGroup = null;
    this.tripsLayerGroup = {};
    fetch("http://localhost:8000/api/sites").then((response) => {
      response.json().then((sites) => {
        this.mymap = createMap(sites);
        this.sitesLayerGroup = createSitesLayerGroup(sites);
        this.$emit("loadsites", sites);
      });
    });
    fetch("http://localhost:8000/api/ebird-hotspots").then((response) => {
      response.json().then((hotspots) => {
        this.hotspotsLayerGroup = createHotspotsLayerGroup(hotspots);
        this.$emit("loadhotspots", hotspots);
      });
    });
    return {};
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
      handler(newTrips) {
        for (let trip of newTrips) {
          this.tripsLayerGroup[trip.id] = createSitesLayerGroup(trip.site_days);
        }
      },
      deep: true,
    },
    visibleTrips: {
      handler(tripIds) {
        for (var tripId in tripIds) {
          if (tripIds[tripId]) {
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
    doHideHotspots() {
      this.hotspotsLayerGroup.remove();
    },
    doShowHotspots() {
      this.hotspotsLayerGroup.addTo(this.mymap);
    },
    doHideSites() {
      this.sitesLayerGroup.remove();
    },
    doShowSites() {
      this.sitesLayerGroup.addTo(this.mymap);
    },
    doHideTrip(tripId) {
      this.tripsLayerGroup[tripId].remove();
    },
    doShowTrip(tripId) {
      this.tripsLayerGroup[tripId].addTo(this.mymap);
    },
    doHighlightSite(site) {
      if (!site) {
        return;
      }
      var marker = L.circle([site.lat, site.lng], 500, {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
      }).addTo(this.mymap);
      this.highlightMarker = marker;
    },
    doUnhighlightSite() {
      let marker = this.highlightMarker;
      if (!marker) {
        return;
      }
      this.mymap.removeLayer(marker);
      this.highlightMarker = null;
    },
  },
});

function createMap(sites): L.Map {
  // -> Map
  var mymap = L.map("map").setView([sites[0].lat, sites[0].lng], 5);

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

function createHotspotsLayerGroup(hotspots): L.LayerGroup {
  // -> LayerGroup
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

function formatHotspotDetailHTML(hotspot): string {
  let html = `<a href='/ebird-hotspot/${hotspot.locId}' target='_blank'>${hotspot.locName}</a>`;
  html += `<br><br>${hotspot.numSpeciesAllTime || 0} species<br>`;
  html += `<br>Most recent observations: ${hotspot.latestObsDt || "none"}`;
  return html;
}

function createSitesLayerGroup(sites):  {
  // -> LayerGroup
  let markers = [];
  for (let site of sites) {
    markers.push(
      L.marker([site.lat, site.lng]).bindPopup(formatSiteDetailHTML(site))
    );
  }
  return L.layerGroup(markers);
}

function formatSiteDetailHTML(site): string {
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
