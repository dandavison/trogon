<template>
  <div>
    <l-map
      v-if="!helpModalActive"
      style="height: 800px"
      v-bind="map"
      :center="center"
      @contextmenu="showCoordinatesPopup"
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
            @click="() => $router.push(`/challenge?location=${hotspot.locId}`)"
          >
            {{ hotspot.locName }} ({{ hotspot.numSpeciesAllTime }} species)
          </b-button>
        </l-popup>
      </l-circle>

      <l-marker v-if="popup.latlng" :latLng="popup.latlng">
        <l-popup>
          <b-button
            class="is-success is-light"
            @click="
              () =>
                $router.push(
                  `/challenge?coords=${popup.latlng.lat.toFixed(
                    2
                  )},${popup.latlng.lng.toFixed(2)}`
                )
            "
          >
            ({{ popup.latlng.lat.toFixed(2) }},
            {{ popup.latlng.lng.toFixed(2) }})
          </b-button>
        </l-popup>
      </l-marker>
      <b-loading v-model="isLoading"></b-loading>
    </l-map>
    <b-modal v-else v-model="helpModalActive">
      <help />
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import Vue2TouchEvents from "vue2-touch-events";
import VueI18n from "vue-i18n";

Vue.use(Vue2TouchEvents);
Vue.use(VueI18n);

import {
  LMap,
  LTileLayer,
  LCircle,
  LMarker,
  LPopup,
  LLayerGroup,
} from "vue2-leaflet";
import eventBus from "./event-bus";
import Help from "./Help.vue";
import { fetchEbirdHotspotsByLatLng } from "./ebird";
import { LatLngLiteral } from "leaflet";
import { EbirdHotspot, LeafletMapEvent } from "./types";

export default Vue.extend({
  components: {
    Help,
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
        tap: true,
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
        latlng: null as LatLngLiteral | null,
      },
      ebirdHotspots: [] as EbirdHotspot[],
      isLoading: false,
      helpModalActive: false,
    };
  },

  mounted: function (): void {
    eventBus.$on("show:help", () => {
      this.helpModalActive = true;
    });
  },

  methods: {
    showCoordinatesPopup(event: LeafletMapEvent): void {
      this.popup.latlng = event.latlng as any; // TODO
      if (this.popup.latlng) {
        this.isLoading = true;
        fetchEbirdHotspotsByLatLng(this.popup.latlng)
          .then((data) => (this.ebirdHotspots = data))
          .finally(() => (this.isLoading = false));
      }
    },
  },
});
</script>
