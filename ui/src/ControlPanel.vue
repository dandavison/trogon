<template>
  <section>
    <b-sidebar type="is-light" v-bind="sidebarAttributes" v-model="open">
      <div class="p-1">
        <table>
          <tr>
            <td>
              <img
                src="https://user-images.githubusercontent.com/52205/74552822-b0f85f00-4f1b-11ea-908d-48d4f301b6a3.png"
                alt="Sylph"
              />
            </td>
          </tr>
          <tr>
            <td
              style="display: table-cell; vertical-align: middle; padding: 10px"
            >
              <b>Sylph</b>
            </td>
          </tr>
        </table>

        <b-menu>
          <b-menu-list label="Menu">
            <b-menu-item v-on:click="$emit('click:trips')" icon="settings">
              <template slot="label" slot-scope="props">
                {{ $t("trips") }}
                <b-icon
                  class="is-pulled-right"
                  :icon="props.expanded ? 'menu-down' : 'menu-up'"
                ></b-icon>
              </template>
              <trip-switches :trips="trips" />
            </b-menu-item>
            <site-switch />
            <hotspots-switch />
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item label="Logout"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="block"></div>
  </section>
</template>

<script lang="ts">
import { Trip } from "types";
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import eventBus from "./event-bus";
import HotspotsSwitch from "./HotspotsSwitch.vue";
import SiteSwitch from "./SiteSwitch.vue";
import TripSwitches from "./TripSwitches.vue";

export default Vue.extend({
  data() {
    return {
      sidebarAttributes: {
        overlay: false,
        fullheight: true,
        fullwidth: false,
        right: false
      },
      open: false
    };
  },
  components: { HotspotsSwitch, SiteSwitch, TripSwitches },
  props: { trips: Array as PropType<Trip[]> },
  mounted: function (): void {
    eventBus.$on("show:control-panel", this.showControlPanel);
  },
  methods: {
    showControlPanel: function (): void {
      this.open = true;
    },
  },
});
</script>

<style>
.p-1 {
  padding: 1em;
  z-index: 2;
}
button.show {
  height: fit-content;
}
</style>
