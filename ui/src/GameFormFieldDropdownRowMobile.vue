<template>
  <div>
    <div class="mt-1">
      <b>{{ option }}</b>
    </div>
    <div class="level">
      <div width="100%" class="x-scrollable">
        <div class="level-left" style="overflow-x: hidden; width: 9999px">
          <div class="level-item is-justify-content-left">
            <div>
              <span v-for="(im, i) in images" :key="i">
                <img :src="im.urls[0]" style="height: 100px" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { SpeciesImages } from "./types";

export default Vue.extend({
  props: {
    option: String,
    images: Array as PropType<SpeciesImages[]>,
    imageLabelFn: Function,
  },
});
</script>

<style scoped>
.x-scrollable {
  overflow-x: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.x-scrollable::-webkit-scrollbar {
  display: none;
}
</style>