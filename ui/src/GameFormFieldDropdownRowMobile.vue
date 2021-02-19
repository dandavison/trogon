<template>
  <div>
    <div class="mt-4">
      <b>{{ option }}</b>
    </div>
    <div class="level">
      <div width="100%">
        <div class="level-left">
          <div class="level-item">
            <div>
              <span v-for="(im, i) in images" :key="i">
                <img :src="im.urls[0]" style="height: 160px" />
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
