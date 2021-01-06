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
                <!-- FIXME: the id is  being set to the string 'site.id' -->
                <site-card
                  v-bind:site="site"
                  id="site.id"
                  @highlightsite="highlightSite"
                  @unhighlightsite="unhighlightSite"
                />
              </div>
            </section>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <b-button @click="open = true">{{ $t("show-site-list") }}</b-button>
  </section>
</template>

<i18n>
{
  "en": {"show-site-list": "Show site list"},
  "es": {"show-site-list": "Revelar lista de sitios"}
}
</i18n>

<script lang="ts">
import { Site } from "types";
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import SiteCard from "./SiteCard.vue";

export default Vue.extend({
  data() {
    return {
      open: false,
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: true,
    };
  },
  components: { SiteCard },
  methods: {
    highlightSite: function (site: Site) {
      this.$emit("highlightsite", site);
    },
    unhighlightSite: function (site: Site) {
      this.$emit("unhighlightsite", site);
    },
  },
  props: { sites: Array },
});
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
