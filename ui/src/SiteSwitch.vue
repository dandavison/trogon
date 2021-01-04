<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">Show all sites</b-switch>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      isSwitched: false,
    };
  },
  watch: {
    isSwitched: function (newVal: boolean) {
      this.$emit("changeshowsites", newVal);
    },
  },
});
</script>
