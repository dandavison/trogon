<template>
  <l-map id="sylph-map" style="height: 800px" v-bind="map" :center="center">
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
  </l-map>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import { LMap, LTileLayer, LCircle, LTooltip, LLayerGroup } from "vue2-leaflet";
import { EbirdHotspot } from "types";

export default Vue.extend({
  components: { LMap, LTileLayer, LCircle, LTooltip, LLayerGroup },
  props: {
    ebirdHotspots: Array as PropType<EbirdHotspot[]>,
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
    };
  },
  methods: {
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
