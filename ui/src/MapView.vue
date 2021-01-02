<template>
  <div>
    <sidebar
      @changeshowsites="changeShowSites"
      @changeshowtrip="changeShowTrip"
    />
    <mapx v-bind:showSites="showSites" />
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Mapx from "./Map.vue";
export default {
  name: "mapView",
  components: { Mapx, Sidebar },
  data() {
    return {
      showSites: false,
    };
  },
  methods: {
    changeShowSites: function (newVal) {
      this.showSites = newVal;
    },
    changeShowTrip: function (newVal, trip) {
      this.$emit("changeshowtrip", newVal, trip);
    },
  },
};
</script>

<style scoped>
</style>
