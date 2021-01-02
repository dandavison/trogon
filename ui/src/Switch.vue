<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched"> </b-switch>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isSwitched: false,
    };
  },
  watch: {
    isSwitched: function (newVal) {
      this.$emit("change:show-sites", newVal);
    },
  },
};
</script>