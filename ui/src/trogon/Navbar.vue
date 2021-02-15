<template>
  <b-navbar>
    <template slot="end">
      <b-navbar-item tag="div">
        <router-link to="/trogon">
          <i class="fas fa-globe-americas"></i>
        </router-link>
      </b-navbar-item>

      <b-navbar-item href="#" @click="showControlPanel">
        <i class="fas fa-cog"></i>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>


<script lang="ts">
import Vue from "vue";
import eventBus from "./event-bus";

export default Vue.extend({
  methods: {
    showControlPanel(): void {
      eventBus.$emit("control-panel:show");
    },
  },
});
</script>
