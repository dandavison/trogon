<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
export default {
  props: {
    highlightSite: Object,
    showSites: Boolean,
    trips: Array,
    visibleTrips: Map,
  },
  data() {
    this.mymap = null;
    this.sitesLayerGroup = null;
    this.tripsLayerGroup = {};
    fetch("http://localhost:8000/api/sites").then((response) => {
      response.json().then((sites) => {
        this.mymap = createMap(sites);
        this.sitesLayerGroup = createSitesLayerGroup(sites);
        this.doShowSites();
        this.$emit("loadsites", sites);
      });
    });
    return {};
  },
  watch: {
    highlightSite: function (newVal) {
      if (newVal) {
        this.doUnhighlightSite();
        this.doHighlightSite(newVal);
      } else {
        this.doUnhighlightSite();
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
};

function createMap(sites) {
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

function createSitesLayerGroup(sites) {
  // -> LayerGroup
  let markers = [];
  for (let site of sites) {
    markers.push(
      L.marker([site.lat, site.lng]).bindPopup(
        `<a href='/site/${site.id}' target='_blank'>${site.name}</a>`
      )
    );
  }
  return L.layerGroup(markers);
}
</script>

<style>
#map {
  height: 800px;
  z-index: 1;
}
</style>