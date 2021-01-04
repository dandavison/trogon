<template>
  <section>
    <b-sidebar
      type="is-light"
      v-bind="sidebarAttributes"
      v-model="open"
    >
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
            <b-menu-item v-on:click="getTrips" icon="settings">
              <template slot="label" slot-scope="props">
                Trips
                <b-icon
                  class="is-pulled-right"
                  :icon="props.expanded ? 'menu-down' : 'menu-up'"
                ></b-icon>
              </template>
              <trip-switches :trips="trips" @changeshowtrip="changeShowTrip" />
            </b-menu-item>
            <site-switch @changeshowsites="changeShowSites" />
            <hotspots-switch @changeshowhotspots="changeShowHotspots" />
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item label="Logout"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="block"></div>
    <b-button class="show" @click="open = true">
      <span v-if="!open">Open control panel</span>
    </b-button>
  </section>
</template>

<script>
import HotspotsSwitch from "./HotspotsSwitch";
import SiteSwitch from "./SiteSwitch.vue";
import TripSwitches from "./TripSwitches.vue";

export default {
  data() {
    return {
      sidebarAttributes: {
        overlay: false,
        fullheight: true,
        fullwidth: false,
        right: false,
      },
      open: false,
      trips: [],
    };
  },
  components: { HotspotsSwitch, SiteSwitch, TripSwitches },
  methods: {
    changeShowHotspots: function (newVal) {
      this.$emit("changeshowhotspots", newVal);
    },
    changeShowSites: function (newVal) {
      this.$emit("changeshowsites", newVal);
    },
    changeShowTrip: function (newVal, trip) {
      this.$emit("changeshowtrip", newVal, trip);
    },
    getTrips: function () {
      fetch("http://localhost:8000/api/trips").then((response) => {
        response.json().then((trips) => {
          this.trips = trips;
          this.$emit("clicktrips", this.trips);
        });
      });
    },
  },
};
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
