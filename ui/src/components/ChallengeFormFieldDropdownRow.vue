<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item has-text-left ml-2" style="width: 220px">
        <b>{{ option }}</b>
      </div>
    </div>
    <div width="100%" class="x-scrollable">
      <div class="level-left" style="overflow-x: hidden; width: 9999px">
        <div v-for="(im, i) in images" :key="i" class="level-item">
          <div class="field">
            <img :src="im.urls[0]" style="height: 160px" />
            <p class="help has-text-centered">
              <i>{{ imageLabelFn(im) }}</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

import { SpeciesImages } from "../types";

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