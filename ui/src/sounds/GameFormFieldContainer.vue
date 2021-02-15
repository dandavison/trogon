<template>
  <div>
    <b-modal v-if="isModal" :active="true" full-screen>
      <slot name="form-field"></slot>
    </b-modal>
    <div v-else><slot name="form-field"></slot></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: { isModal: Boolean },
});
</script>