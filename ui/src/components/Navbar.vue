<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item>
        <router-link to="/">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Trogon_collaris_%28Trog%C3%B3n_collarejo%29_%2814027165535%29.jpg/320px-Trogon_collaris_%28Trog%C3%B3n_collarejo%29_%2814027165535%29.jpg"
            alt="Trogon"
          />
        </router-link>
      </b-navbar-item>

      <b-navbar-item tag="div">
        <router-link to="/">
          <i class="fas fa-globe-americas"></i>
        </router-link>
      </b-navbar-item>

      <b-navbar-item href="#" @click="showHelp">
        {{ $t("Help") }}
      </b-navbar-item>
      <b-modal v-model="helpModalActive">
        <help />
      </b-modal>
    </template>

    <template slot="end">
      <b-navbar-item
        v-if="$route.path.startsWith('/challenge')"
        href="#"
        @click="showControlPanel"
      >
        <i class="fas fa-cog"></i>
      </b-navbar-item>

      <b-navbar-item href="https://github.com/dandavison/trogon">
        <i class="fab fa-github"></i>
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
  "es": {"Help": "Asistencia"}
}
</i18n>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import LocaleSelector from "../LocaleSelector.vue";

import eventBus from "../event-bus";
import Help from "./Help.vue";

export default Vue.extend({
  components: { Help, LocaleSelector },
  data() {
    return { helpModalActive: false };
  },

  methods: {
    showControlPanel(): void {
      eventBus.$emit("control-panel:show");
    },

    showHelp(): void {
      if (this.$route.path === "/") {
        // TODO: We should just be able to display the help modal
        // as an element within the navbar. However, when we do that,
        // the map component obscures the help modal, so there is a
        // special implementation of the help modal in Map.vue
        // triggered by this event.
        eventBus.$emit("show:help");
      } else {
        this.helpModalActive = true;
      }
    },
  },
});
</script>
