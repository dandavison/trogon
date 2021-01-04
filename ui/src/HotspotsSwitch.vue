<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">Show eBird hotspots</b-switch>
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
      this.$emit("changeshowhotspots", newVal);
    },
  },
};
</script>
