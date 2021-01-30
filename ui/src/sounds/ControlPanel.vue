<template>
  <section>
    <b-sidebar type="is-light" v-bind="sidebarAttributes" v-model="open">
      <div class="p-1">
        <b-menu>
          <b-menu-list>
            <b-switch v-model="newSettings.songsOnly">Songs only</b-switch>
            <b-menu-item label="Names"></b-menu-item>
            <names-selector :settings="settings" />
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
    "newSettings.songsOnly": function (newVal) {
      eventBus.$emit("settings:change:songsOnly", newVal);
    },
  },

  mounted: function (): void {
    eventBus.$on("control-panel:show", () => {
      this.open = true;
    });
  },
});
</script>
