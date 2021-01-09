<template>
  <div class="container" v-if="this.site">
    Site {{ this.site.id }} images carousel

    <b-carousel v-bind="carouselAttributes">
      <b-carousel-item v-for="image in site.images" :key="image">
        <figure class="image is-64x64">
          <img v-bind:src="image" alt="Site Image" />
        </figure>
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
});
</script>
