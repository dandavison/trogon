<template>
  <div id="map" style="width: 100%; height: 800px">Map</div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    let mymap = ref(null);
    fetch("http://localhost:8000/api/sites").then((response) => {
      response.json().then((sites) => {
        mymap.value = displayMap(sites);
        displaySites(sites, mymap.value);
      });
    });
    return {};
  },
};

function displayMap(sites) {
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

function displaySites(sites, mymap) {
  for (let site of sites) {
    L.marker([site.lat, site.lng])
      .addTo(mymap)
      .bindPopup(`<a href='/site/${site.id}' target='_blank'>${site.name}</a>`);
  }
}
</script>

<style>
</style>