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
        <img
          src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
        <b-menu>
          <b-menu-list label="Menu">
            <section id="site-cards">
              <div class="field" v-for="site in sites" :key="site.id">
                <site-card v-bind:site="site" id="site.id" />
              </div>
            </section>
            <b-menu-item icon="information-outline" label="Info"></b-menu-item>
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
      open: true,
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: true,
    };
  },
  components: { SiteCard },
  props: {"sites": Array},
};
</script>

<style>
.p-1 {
  padding: 1em;
}
</style>
