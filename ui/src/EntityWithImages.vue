<template>
  <article class="media">
    <figure class="media-left">
      <images-carousel :urls="item.images" image-class="image is-128x128" />
    </figure>
    <div class="media-content">
      <div class="content">
        <p>
          <strong>{{ item.name }}</strong>
          <br />
          {{ item.html }}
        </p>
      </div>
    </div>
    <div class="media-right">
      <button class="delete"></button>
    </div>
  </article>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { Guide, Habitat } from "types";
import ImagesCarousel from "./ImagesCarousel.vue";
export default Vue.extend({
  components: { ImagesCarousel },
  props: { item: Object as PropType<Guide | Habitat> },
  mounted: function () {
    console.log(this.item);
  },
});
</script>