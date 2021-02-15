<template>
  <b-navbar>
    <template slot="end">
      <b-navbar-item tag="div">
        <router-link to="/trogon">Location</router-link>
      </b-navbar-item>

      <b-navbar-item href="#" @click="showControlPanel">
        {{ $t("show-control-panel") }}
      </b-navbar-item>

      <b-navbar-item>
        <locale-selector />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<i18n>
{
  "en": {
          "show-control-panel": "Settings"
        },
  "es": {
          "show-control-panel": "Controles"
        }
}
</i18n>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import LocaleSelector from "../LocaleSelector.vue";
import eventBus from "./event-bus";

export default Vue.extend({
  components: { LocaleSelector },
  methods: {
    showControlPanel(): void {
      eventBus.$emit("control-panel:show");
    },
  },
});
</script>
