<template>
  <div>
    <b-modal v-if="isModal" :active="true" full-screen>
      <slot></slot>
    </b-modal>
    <div class="m-4" v-else><slot></slot></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { isModal: Boolean },
});
</script>