<template>
  <b-navbar>
    <template slot="end">
      <b-navbar-item tag="div">
        <router-link to="/trogon">
          <i class="fas fa-globe-americas"></i>
        </router-link>
      </b-navbar-item>

      <b-navbar-item href="#" @click="showControlPanel">
        <i class="fas fa-cog"></i>
      </b-navbar-item>

      <b-navbar-item>
        <locale-selector />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<i18n>
{
  "en": {},
  "es": {}
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
