<template>
  <section>
    <b-sidebar
      type="is-light"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :overlay="overlay"
      :right="right"
      v-model="open"
    >
      <div class="p-1">
        <b-menu>
          <b-menu-list>
            <section id="site-cards">
              <div class="field" v-for="site in sites" :key="site.id">
                <site-card
                  v-bind:site="site"
                  @highlight:site="highlightSite"
                  @unhighlight:site="unhighlightSite"
                />
              </div>
            </section>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
  </section>
</template>

<script lang="ts">
import { Site } from "types";
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import eventBus from "./event-bus";
import SiteCard from "./SiteCard.vue";

export default Vue.extend({
  data() {
    return {
      open: false,
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: true
    };
  },
  components: { SiteCard },
  mounted: function (): void {
    eventBus.$on("show:site-list", this.showSitesList);
  },
  methods: {
    highlightSite: function(site: Site) {
      this.$emit("highlight:site", site);
    },
    unhighlightSite: function(site: Site) {
      this.$emit("unhighlight:site", site);
    },
    showSitesList: function (): void {
      this.open = true;
    },
  },
  props: { sites: Array as PropType<Site[]> }
});
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
