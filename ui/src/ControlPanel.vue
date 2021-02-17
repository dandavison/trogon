<template>
  <section>
    <b-sidebar type="is-light" v-bind="sidebarAttributes" v-model="open">
      <div class="p-1">
        <b-menu>
          <b-menu-list>
            <b-menu-item
              label="Prompt"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <b-switch v-model="newSettings.promptIncludesImages">
              Images
            </b-switch>
            <b-switch v-model="newSettings.promptIncludesRecording">
              Audio
            </b-switch>

            <b-menu-item
              label="Names"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <names-selector :settings="settings" />

            <b-menu-item
              label="Recordings"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <b-switch v-model="newSettings.commonSpeciesOnly" class="p-1">
              common species only
            </b-switch>
            <b-switch v-model="newSettings.songsOnly" class="p-1">
              Songs only
            </b-switch>

            <div class="level p-1">
              <div class="level-left">
                <b-button @click="isFamilyModalActive = true" class="light">
                  <i class="fas fa-dna"></i>
                </b-button>
                <span class="pl-2">Select Families</span>
              </div>
            </div>
            <b-modal v-model="isFamilyModalActive" full-screen>
              <section class="section">
                <family-selector :challengeFamilies="challengeFamilies" />
              </section>
            </b-modal>

            <b-menu-item
              label="Appearance"
              class="menu-item has-text-weight-semibold"
            ></b-menu-item>
            <b-switch v-model="newSettings.useFieldModals">
              Full-screen dropdowns
            </b-switch>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="block"></div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import eventBus from "./event-bus";
import FamilySelector from "./FamilySelector.vue";
import NamesSelector from "./NamesSelector.vue";
import { ChallengeFamily, Settings } from "./types";

export default Vue.extend({
  components: { FamilySelector, NamesSelector },
  props: {
    challengeFamilies: Map as PropType<Map<string, ChallengeFamily>>,
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
      isFamilyModalActive: false,
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
});
</script>

<style scoped>
.menu-item {
  margin-top: 20px;
}
</style>
