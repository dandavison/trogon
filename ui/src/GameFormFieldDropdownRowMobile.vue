<template>
  <div>
    <div class="mt-4">
      <b>{{ option }}</b>
    </div>
    <div class="level">
      <div class="level-left">
        <img
          class="level-item"
          v-for="im in images"
          :key="im.urls[0]"
          :src="im.urls[0]"
          style="height: 160px"
        />
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
