<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
export default {
  props: { showSites: Boolean, trips: Array },
  data() {
    this.mymap = null;
    this.sitesLayerGroup = null;
    this.tripsLayerGroup = {};
    fetch("http://localhost:8000/api/sites").then((response) => {
      response.json().then((sites) => {
        this.mymap = createMap(sites);
        this.sitesLayerGroup = createSitesLayerGroup(sites);
        this.doShowSites();
      });
    });
    return {};
  },
  watch: {
    showSites: function (newVal) {
      if (newVal) {
        this.doShowSites();
      } else {
        this.doHideSites();
      }
    },
    trips: {
      handler(newTrips) {
        console.log("Map: handling trips", newTrips);
        for (let trip of newTrips) {
          console.log("Map: loading trips", trip.name);
          if (trip.isVisible === true) {
            console.log("Map: visible", trip.name, trip.site_days);
            this.tripsLayerGroup[trip.id] = createSitesLayerGroup(
              trip.site_days
            );
            this.doShowTrip(trip);
          } else {
            console.log("Map: not visible", trip.name, trip.site_days);
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
    doHideTrip(trip) {
      console.log("Map hide trip", trip);
      this.tripsLayerGroup[trip.id].remove();
    },
    doShowTrip(trip) {
      console.log("Map show trip", trip);
      this.tripsLayerGroup[trip.id].addTo(this.mymap);
    },
  },
};

function createMap(sites) {
  // -> Map
  var mymap = L.map("map").setView([sites[0].lat, sites[0].lng], 5);
  L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }).addTo(mymap);
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
  z-index: -1;
}
</style>