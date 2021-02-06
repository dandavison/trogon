<template>
  <l-map
    style="height: 800px"
    v-bind="map"
    :center="center"
    @click.right="showCoordinatesPopup"
  >
    <l-tile-layer v-bind="tileLayer"></l-tile-layer>

    <l-circle
      v-for="hotspot in ebirdHotspots"
      :key="hotspot.id"
      :lat-lng="[hotspot.lat, hotspot.lng]"
      v-bind="hotspotProps"
    >
      <l-popup>
        <b-button
          class="is-success is-light"
          @click="
            () => $router.push(`/sounds/challenge?location=${hotspot.locId}`)
          "
        >
          {{ hotspot.locName }}
        </b-button>
      </l-popup>
    </l-circle>

    <l-marker v-if="popup.latlng" :latLng="popup.latlng">
      <l-popup>
        <b-button
          class="is-success is-light"
          @click="
            () => $router.push(`/sounds/challenge?coords=${popup.latlng}`)
          "
        >
          ({{ popup.latlng.lat.toFixed(2) }}, {{ popup.latlng.lng.toFixed(2) }})
        </b-button>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import {
  LMap,
  LTileLayer,
  LCircle,
  LMarker,
  LPopup,
  LLayerGroup,
} from "vue2-leaflet";
import { EbirdHotspot } from "types";
import { fetchEbirdHotspotsByLatLng } from "./ebird";
import { LatLng } from "leaflet";
import { LeafletMapEvent } from "./types";

export default Vue.extend({
  components: {
    LMap,
    LTileLayer,
    LCircle,
    LMarker,
    LPopup,
    LLayerGroup,
  },
  props: {
    center: Array as PropType<number[]>,
  },
  data() {
    return {
      map: {
        zoom: 2,
      },
      tileLayer: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      },
      hotspotProps: {
        color: "#f03",
        fillOpacity: 0.5,
        radius: 500,
      },
      popup: {
        latlng: null as LatLng | null,
      },
      ebirdHotspots: [] as EbirdHotspot[],
    };
  },
  methods: {
    showCoordinatesPopup(event: LeafletMapEvent): void {
      this.popup.latlng = event.latlng as any; // TODO
      if (this.popup.latlng) {
        fetchEbirdHotspotsByLatLng(this.popup.latlng).then(
          (data) => (this.ebirdHotspots = data)
        );
      }
    },
  },
});
</script>

<style>
#sylph-map {
  z-index: 1;
}
</style>
