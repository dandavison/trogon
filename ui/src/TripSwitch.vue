<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">{{ trip.name }}</b-switch>
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
  props: ["trip"],
  watch: {
    isSwitched: function (newVal) {
      this.$emit("changeshowtrip", newVal, this.trip);
    },
  },
};
</script>