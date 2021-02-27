<template>
  <section>
    <b-sidebar type="is-light" v-bind="sidebarAttributes" v-model="open">
      <div class="p-1">
        <b-menu>
          <b-menu-list>
            <b-menu-item
              :label="$t('Prompt')"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <b-switch v-model="newSettings.promptIncludesImages">
              {{ $t("Images") }}
            </b-switch>
            <b-switch v-model="newSettings.promptIncludesRecording">
              {{ $t("Audio") }}
            </b-switch>

            <b-menu-item
              :label="$t('Names')"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <names-selector :settings="settings" />

            <b-menu-item
              :label="$t('Recordings')"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <b-switch v-model="newSettings.commonSpeciesOnly" class="p-1">
              {{ $t("common species only") }}
            </b-switch>
            <b-switch v-model="newSettings.songsOnly" class="p-1">
              {{ $t("Songs only") }}
            </b-switch>

            <div class="level p-1">
              <div class="level-left">
                <b-button @click="showFamilyModal" class="light">
                  <i class="fas fa-dna"></i>
                </b-button>
                <span class="pl-2">{{ $t("Select Families") }}</span>
              </div>
            </div>

            <b-menu-item
              :label="$t('Appearance')"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <b-switch v-model="newSettings.useFieldModals">
              {{ $t("Full-screen menus") }}
            </b-switch>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="block"></div>
  </section>
</template>

<i18n>
{
  "en": {
  },
  "es": {
    "Appearance": "Apariencia",
    "Audio": "Audio",
    "Full-screen menus": "Menús de pantalla completa",
    "Images": "Imagenes",
    "Names": "Nombres",
    "Prompt": "Desafío",
    "Recordings": "Grabaciones",
    "Select Families": "Seleccionar familias",
    "Songs only": "Solo cantos",
    "common species only": "Solo especies comunes"
  }
}
</i18n>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import eventBus from "../event-bus";
import NamesSelector from "./NamesSelector.vue";
import { Settings } from "../types";

export default Vue.extend({
  components: { NamesSelector },
  props: {
    settings: Object as PropType<Settings>,
  },
  data() {
    return {
      newSettings: Object.assign({}, this.settings) as Settings,
      sidebarAttributes: {
        overlay: false,
        fullheight: true,
        fullwidth: false,
        right: true,
      },
      open: false,
    };
  },

  watch: {
    "newSettings.commonSpeciesOnly": function (newVal) {
      eventBus.$emit("settings:change:commonSpeciesOnly", newVal);
    },
    "newSettings.songsOnly": function (newVal) {
      eventBus.$emit("settings:change:songsOnly", newVal);
    },
    "newSettings.promptIncludesImages": function (newVal) {
      eventBus.$emit("settings:change:promptIncludesImages", newVal);
    },
    "newSettings.promptIncludesRecording": function (newVal) {
      eventBus.$emit("settings:change:promptIncludesRecording", newVal);
    },
    "newSettings.useFieldModals": function (newVal) {
      eventBus.$emit("settings:change:useFieldModals", newVal);
    },
  },

  mounted: function (): void {
    eventBus.$on("control-panel:show", () => {
      this.open = true;
    });
  },

  methods: {
    showFamilyModal() {
      eventBus.$emit("show:family-selector");
    },
  },
});
</script>

<style scoped>
.menu-item {
  margin-top: 20px;
}
</style>
