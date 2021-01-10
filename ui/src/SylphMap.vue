<template>
  <l-map id="sylph-map" style="height: 800px" v-bind="map" :center="center">
    <l-tile-layer v-bind="tileLayer"></l-tile-layer>

    <l-layer-group
      v-for="siteGroup in siteGroups"
      :key="siteGroup.id"
      :visible="siteGroup.visible"
    >
      <l-marker
        v-for="site in siteGroup"
        :key="site.id"
        :lat-lng="[site.lat, site.lng]"
        @click="handleSiteMarkerClick(site)"
      >
        <l-tooltip :content="formatSiteDetailHTML(site)" />
      </l-marker>
    </l-layer-group>

    <l-layer-group
      v-for="siteHighlightGroup in siteHighlightGroups"
      :key="siteHighlightGroup.id"
      :visible="siteHighlightGroup.visible"
    >
      <l-circle
        v-for="site in siteHighlightGroup"
        :key="site.id"
        :lat-lng="[site.lat, site.lng]"
        v-bind="siteHighlight"
      >
        <l-tooltip :content="formatSiteDetailHTML(site)" />
      </l-circle>
    </l-layer-group>

    <l-layer-group
      v-for="tripSiteGroup in tripSiteGroups"
      :key="tripSiteGroup.id"
      :visible="tripSiteGroup.visible"
    >
      <l-marker
        v-for="tripSite in tripSiteGroup"
        :key="tripSite.day"
        :lat-lng="[tripSite.site.lat, tripSite.site.lng]"
      />
    </l-layer-group>
    <l-layer-group
      v-for="ebirdHotspotGroup in ebirdHotspotGroups"
      :key="ebirdHotspotGroup.id"
      :visible="ebirdHotspotGroup.visible"
    >
      <l-circle
        v-for="hotspot in ebirdHotspotGroup.hotspots"
        :key="hotspot.id"
        :lat-lng="[hotspot.lat, hotspot.lng]"
        v-bind="hotspotProps"
        @click="handleEbirdHotspotClick(hotspot)"
      >
        <l-tooltip :content="formatEbirdHotspotDetailHTML(hotspot)" />
      </l-circle>
    </l-layer-group>
  </l-map>
</template>

<script lang="ts">
import { Site, EbirdHotspot, EbirdHotspotGroup } from "types";
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import {
  LMap,
  LTileLayer,
  LMarker,
  LCircle,
  LTooltip,
  LLayerGroup
} from "vue2-leaflet";

export default Vue.extend({
  components: { LMap, LTileLayer, LMarker, LCircle, LTooltip, LLayerGroup },
  props: {
    siteGroups: Array as PropType<Site[][]>,
    siteHighlightGroups: Array as PropType<Site[][]>,
    tripSiteGroups: Array as PropType<Site[][]>,
    ebirdHotspotGroups: Array as PropType<EbirdHotspotGroup[]>,
    center: Array as PropType<number[]>
  },
  data() {
    return {
      map: {
        zoom: 5
      },
      tileLayer: {
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      },
      hotspotProps: {
        color: "#f03",
        fillOpacity: 0.5,
        radius: 50
      },
      siteHighlight: {
        color: "#f03",
        fillOpacity: 0.5,
        radius: 20
      }
    };
  },
  methods: {
    handleSiteMarkerClick(site: Site): void {
      this.$router.push(`/site/${site.id}`);
    },
    handleEbirdHotspotClick(hotspot: EbirdHotspot): void {
      window.open(`https://ebird.org/hotspot/${hotspot.locId}`);
    },
    formatSiteDetailHTML(site: Site): string {
      let html = `<h4>${site.name}</h4>`;
      html += `<br><img src="${site.images[0]}" />`;
      // Habitats
      html += `<br><br><b>Habitats</b>:<br>`;
      html += "<ul>";
      for (let habitat of site.habitats) {
        html += `<li>${habitat.name}</li>`;
      }
      html += "</ul>";
      // Guides
      html += `<br><br><b>Guides</b>:<br>`;
      html += "<ul>";
      for (let guide of site.guides) {
        html += `<li>${guide.name}</li>`;
      }
      html += "</ul>";
      return html;
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
