<template>
  <div class="container">
    <div v-if="this.site">
      <b>{{ this.site.name }}</b>
      <detail-map />
    </div>
    <div class="grid-cols-2">
      <div class="col-1">
        <site-images-carousel :site="site" />
      </div>
      <div class="col-2">
        <site-structured-data :site="site" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchJSONSynchronously } from "./utils";
import { Site } from "types";
import DetailMap from "./DetailMap.vue";
import SiteImagesCarousel from "./SiteImagesCarousel.vue";
import SiteStructuredData from "./SiteStructuredData.vue";

export default Vue.extend({
  components: { DetailMap, SiteImagesCarousel, SiteStructuredData },
  props: { siteIdString: String },
  data() {
    return { site: null as Site | null };
  },
  created() {
    // TODO: how should this obtain the data for the site?
    const sites = fetchJSONSynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/sites`
    ) as Site[];
    const requestedSiteId = parseInt(this.siteIdString);
    for (let site of sites) {
      if (site.id === requestedSiteId) {
        this.site = site;
        break;
      }
    }
  },
});
</script>
