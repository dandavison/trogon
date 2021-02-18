<template>
  <div>
    <div class="mt-4">
      <b>{{ option }}</b>
    </div>
    <div class="level">
      <div class="level-left">
        <img
          class="level-item"
          v-for="url in images"
          :key="url"
          :src="url"
          style="height: 160px"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export default Vue.extend({
  props: { option: String, images: Array as PropType<string[]> },
});
</script>