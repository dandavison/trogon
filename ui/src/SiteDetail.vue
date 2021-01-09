<template>
  <div class="container" v-if="this.site">Site {{ this.site.id }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchJSONSynchronously } from "./utils";
import { Site } from "types";

export default Vue.extend({
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
