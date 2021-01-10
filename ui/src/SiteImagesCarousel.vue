<template>
  <div class="container" v-if="this.site">
    <b-carousel v-bind="carousel">
      <b-carousel-item v-for="image in site.images" :key="image">
        <img v-bind:src="image" alt="Site Image" />
      </b-carousel-item>
    </b-carousel>
  </div>
</template>

<script lang="ts">
import { Site } from "types";
import Vue from "vue";
import { PropType } from "vue";

export default Vue.extend({
  props: { site: (Object as null | Object) as PropType<Site> },
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
