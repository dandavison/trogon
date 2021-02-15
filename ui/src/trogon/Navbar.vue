<template>
  <b-navbar>
    <template slot="brand">
      <b-navbar-item>
        <router-link to="/trogon">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Trogon_collaris_%28Trog%C3%B3n_collarejo%29_%2814027165535%29.jpg/320px-Trogon_collaris_%28Trog%C3%B3n_collarejo%29_%2814027165535%29.jpg"
            alt="Trogon"
          />
        </router-link>
      </b-navbar-item>
    </template>

    <template slot="end">
      <b-navbar-item href="#" @click="showHelp = true">
        <i class="fas fa-question"></i>
        <b-modal v-model="showHelp"><help /></b-modal>
      </b-navbar-item>

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

import Help from "./Help.vue";

export default Vue.extend({
  components: { Help },
  data() {
    return {
      showHelp: false,
    };
  },

  methods: {
    showControlPanel(): void {
      eventBus.$emit("control-panel:show");
    },
  },
});
</script>
