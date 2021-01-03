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
                  id="site.id"
                  @highlightsite="highlightSite"
                />
              </div>
            </section>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <b-button @click="open = true">Show site list</b-button>
  </section>
</template>

<script>
import SiteCard from "./SiteCard.vue";

export default {
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
    highlightSite: function (site) {
      this.$emit("highlightsite", site);
    },
  },
  props: { sites: Array },
};
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
