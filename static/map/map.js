function renderMap(sites) {
  var mymap = L.map('mapid').setView([sites[0].lat, sites[0].lng], 5);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(mymap);

  for(let site of sites) {
    L.marker([site.lat, site.lng])
      .addTo(mymap)
      .bindPopup(`<a href='/site/${site.id}' target='_blank'>${site.name}</a>`);
  }
}

document.addEventListener("DOMContentLoaded", () => fetch("/api/sites").then((response) => {
  response.json().then(renderMap)
}));
