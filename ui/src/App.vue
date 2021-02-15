<template>
  <div class="container">
    <navbar />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Navbar from "./Navbar.vue";

export default Vue.extend({
  components: { Navbar }
});
</script>
