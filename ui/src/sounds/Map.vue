<template>
  <l-map
    style="height: 800px"
    v-bind="map"
    :center="center"
    @click.right="showPopup"
  >
    <l-tile-layer v-bind="tileLayer"></l-tile-layer>

    <l-circle
      v-for="hotspot in ebirdHotspots"
      :key="hotspot.id"
      :lat-lng="[hotspot.lat, hotspot.lng]"
      v-bind="hotspotProps"
      @click="handleEbirdHotspotClick(hotspot)"
    >
      <l-tooltip :content="formatEbirdHotspotDetailHTML(hotspot)" />
    </l-circle>

    <l-layer-group>
      <l-popup
        v-if="popup.latlng"
        :latLng="popup.latlng"
        @remove="() => (popup.latlng = null)"
      >
        <b-button @click="fetchNearbyHotspots">
          Fetch nearby Ebird hotspots
        </b-button>
      </l-popup>
    </l-layer-group>
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
  LPopup,
  LTooltip,
  LLayerGroup,
} from "vue2-leaflet";
import { EbirdHotspot } from "types";
import { fetchEbirdHotspotsByLatLng } from "./ebird";
import { LatLng } from "leaflet";
import { LeafletMapEvent } from "./types";

export default Vue.extend({
  components: { LMap, LTileLayer, LCircle, LPopup, LTooltip, LLayerGroup },
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
        radius: 50,
      },
      popup: {
        latlng: null as LatLng | null,
      },
      ebirdHotspots: [] as EbirdHotspot[],
    };
  },
  methods: {
    showPopup(event: LeafletMapEvent): void {
      console.log("showPopup", event);
      this.popup.latlng = event.latlng as any; // TODO
    },
    fetchNearbyHotspots(): void {
      if (this.popup.latlng) {
        fetchEbirdHotspotsByLatLng(this.popup.latlng).then(
          (data) => (this.ebirdHotspots = data)
        );
      }
    },
    handleEbirdHotspotClick(hotspot: EbirdHotspot): void {
      this.$router.push(`/sounds/${hotspot.locId}`);
    },
    formatEbirdHotspotDetailHTML(hotspot: EbirdHotspot): string {
      return `${hotspot.locName}`;
    },
  },
});
</script>

<style>
#sylph-map {
  z-index: 1;
}
</style>
