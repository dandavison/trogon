<template>
  <div>hello __{{ msg }}__</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    msg: String,
  },
});
</script>
