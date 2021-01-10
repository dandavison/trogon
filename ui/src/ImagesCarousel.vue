<template>
  <div class="container" v-if="urls">
    <b-carousel v-bind="carousel">
      <b-carousel-item v-for="url in urls" :key="url">
        <p :class="imageClass">
          <img :src="url" />
        </p>
      </b-carousel-item>
    </b-carousel>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PropType } from "vue";

export default Vue.extend({
  props: { urls: Array as PropType<String[]>, imageClass: String },
  data() {
    return {
      carousel: {
        // arrow: true,
        arrowBoth: true,
        autoplay: false,
        // iconSize: "is-small",
        indicator: false,
      },
    };
  },
});
</script>
