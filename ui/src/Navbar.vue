<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item>
        <img
          src="https://user-images.githubusercontent.com/52205/74552822-b0f85f00-4f1b-11ea-908d-48d4f301b6a3.png"
          alt="Sylph"
        />
      </b-navbar-item>
      <b-navbar-item
        ><router-link to="/"><b>Sylph</b></router-link>
      </b-navbar-item>
    </template>

    <template slot="start">
      <b-navbar-dropdown label="Info">
        <b-navbar-item href="#"> About </b-navbar-item>
        <b-navbar-item href="#"> Contact </b-navbar-item>
      </b-navbar-dropdown>

      <b-navbar-item tag="div">
        <router-link to="/map">Map</router-link>
      </b-navbar-item>

      <b-navbar-dropdown label="">
        <b-navbar-item href="#" @click="showControlPanel">{{
          $t("show-control-panel")
        }}</b-navbar-item>
        <b-navbar-item href="#" @click="showSitesList">{{
          $t("show-site-list")
        }}</b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template slot="end">
      <b-navbar-dropdown label="Account">
        <b-navbar-item href="#"> Log in </b-navbar-item>
        <b-navbar-item href="#"> Sign up </b-navbar-item>
      </b-navbar-dropdown>

      <b-navbar-item>
        <locale-selector />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<i18n>
{
  "en": {
          "show-control-panel": "Show control panel",
          "show-site-list": "Show site list",
          "trips": "Trips"
        },
  "es": {
          "show-control-panel": "Revelar panel de control",
          "show-site-list": "Revelar lista de sitios",
          "trips": "Viajes"
        }
}
</i18n>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import eventBus from "./event-bus";
import LocaleSelector from "./LocaleSelector.vue";

export default Vue.extend({
  components: { LocaleSelector },
  methods: {
    showControlPanel: function (): void {
      eventBus.$emit("show:control-panel");
    },
    showSitesList: function (): void {
      eventBus.$emit("show:sites-list");
    },
  },
});
</script>
