<template>
  <section>
    <b-sidebar type="is-light" v-bind="sidebarAttributes" v-model="open">
      <div class="p-1">
        <b-menu>
          <b-menu-list>
            <b-menu-item label="Prompt" class="menu-item"></b-menu-item>
            <b-switch v-model="newSettings.promptIncludesImages">
              Images
            </b-switch>
            <b-switch v-model="newSettings.promptIncludesRecording">
              Audio
            </b-switch>

            <b-menu-item label="Names" class="menu-item"></b-menu-item>
            <names-selector :settings="settings" />

            <b-menu-item label="Recordings" class="menu-item"></b-menu-item>
            <b-switch v-model="newSettings.commonSpeciesOnly">
              common species only
            </b-switch>
            <b-switch v-model="newSettings.songsOnly">Songs only</b-switch>
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
import NamesSelector from "./NamesSelector.vue";
import { Settings } from "./types";

export default Vue.extend({
  components: { NamesSelector },
  props: { settings: Object as PropType<Settings> },
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
