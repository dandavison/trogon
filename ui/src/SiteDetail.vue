<template v-if="this.site">
  <div>
    <section class="section" id="header">
      <div class="container">
        <h1 class="title">{{ this.site.name }}</h1>
        <!-- <h2 class="subtitle"></h2> -->
        <!-- <detail-map /> -->
      </div>
    </section>

    <section class="section" id="site-body">
      <div class="container">
        <div class="grid-cols-2">
          <div class="col-1">
            <figure class="media-left">
              <images-carousel :urls="site.images" />
            </figure>
          </div>
          <div class="col-2">
            <site-structured-data :site="site" />
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="guides">
      <div class="container">
        <h1 class="title">Guides</h1>
        <entity-with-images
          v-for="item in this.site.guides"
          :item="item"
          :key="item.id"
        />
      </div>
    </section>

    <section class="section" id="habitats">
      <div class="container">
        <h1 class="title">Habitats</h1>
        <entity-with-images
          v-for="item in this.site.habitats"
          :item="item"
          :key="item.id"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchJSONArraySynchronously } from "./utils";
import { Site } from "types";
import DetailMap from "./DetailMap.vue";
import EntityWithImages from "./EntityWithImages.vue";
import ImagesCarousel from "./ImagesCarousel.vue";
import SiteStructuredData from "./SiteStructuredData.vue";

export default Vue.extend({
  components: {
    DetailMap,
    ImagesCarousel,
    SiteStructuredData,
    EntityWithImages,
  },
  props: { siteIdString: String },
  data() {
    return { site: null as Site | null };
  },
  created() {
    // TODO: how should this obtain the data for the site?
    const sites = fetchJSONArraySynchronously(
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
