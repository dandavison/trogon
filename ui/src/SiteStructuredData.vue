<template>
  <div class="container" v-if="this.site">
    Site {{ this.site.id }} structured data
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
