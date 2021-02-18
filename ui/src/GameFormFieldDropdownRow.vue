<template>
  <div class="level">
    <div class="level-left">
      <div class="level-item has-text-left ml-2" style="width: 220px">
        <b>{{ option }}</b>
      </div>
    </div>
    <div class="level-right">
      <img
        class="level-item"
        v-for="url in images"
        :key="url"
        :src="url"
        style="height: 160px"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

export default Vue.extend({
  props: { option: String, images: Array as PropType<string[]> },
});
</script>