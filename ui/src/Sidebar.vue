<template>
  <section>
    <b-sidebar
      type="is-light"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :overlay="overlay"
      :right="right"
      v-model="open"
    >
      <div class="p-1">
        <img
          src="https://raw.githubusercontent.com/buefy/buefy/dev/static/img/buefy-logo.png"
          alt="Lightweight UI components for Vue.js based on Bulma"
        />
        <b-menu>
          <b-menu-list label="Menu">
            <site-switch @changeshowsites="changeShowSites" />
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
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item label="Logout"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
    <div class="block"></div>
    <b-button class="show" @click="open = true">
      Toggle<br />control<br />panel
    </b-button>
  </section>
</template>

<script>
import SiteSwitch from "./SiteSwitch.vue";
import TripSwitches from "./TripSwitches.vue";

export default {
  data() {
    return {
      open: false,
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: false,
      trips: [
        {
          name: "Araracuara",
          id: 1,
          site_days: [
            {
              day: 1,
              id: 1,
              name: "Villa Azul",
              lat: -0.5930590066379546,
              lng: -72.11438768433418,
            },
            {
              day: 2,
              id: 2,
              name: "San José del Guaviare",
              lat: -0.5745422166246894,
              lng: -72.38932491030444,
            },
          ],
        },
        {
          name: "Vaupes",
          id: 2,
          site_days: [
            {
              day: 1,
              id: 1,
              name: "Mitu",
              lat: 1.2539646349060007,
              lng: -70.23341850460245,
            },
            {
              day: 2,
              id: 2,
              name: "Moroco",
              lat: 0.1444015171331046,
              lng: -70.96084408873314,
            },
          ],
        },
      ],
    };
  },
  components: { SiteSwitch, TripSwitches },
  methods: {
    changeShowSites: function (newVal) {
      this.$emit("changeshowsites", newVal);
    },
    changeShowTrip: function (newVal, trip) {
      for (let _trip of this.trips) {
        if (_trip.id == trip.id) {
          trip["isVisible"] = newVal;
        }
      }
      this.$emit("changeshowtrip", newVal, trip);
    },
    getTrips: function () {
      // for (let trip of this.trips) {
      //   trip["isVisible"] = true;
      // }
      // fetch("http://localhost:8000/api/trips").then((response) => {
      //   response.json().then((trips) => {
      //     for (let trip of trips) {
      //       this.tripsLayerGroup[trip.id] = createSitesLayerGroup(trip.sites);
      //     }
      //   });
      // });
      this.$emit("clicktrips", this.trips);
    },
  },
};
</script>

<style>
.p-1 {
  padding: 1em;
  z-index: -1;
}
button.show {
  float: right;
  height: fit-content;
}
</style>
