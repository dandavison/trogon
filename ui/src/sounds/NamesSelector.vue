<template>
  <div class="block">
    <b-radio v-model="names" name="name" native-value="en"> English </b-radio>
    <b-radio v-model="names" name="name" native-value="sci">
      Scientific
    </b-radio>
    <b-radio v-model="names" name="name" native-value="both"> Both </b-radio>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import eventBus from "./event-bus";

export default Vue.extend({
  props: { settings: Object },
  data() {
    return {
      names: this.settings.names,
    };
  },
  watch: {
    names: function (_oldVal, newVal) {
      eventBus.$emit("names:change", newVal);
    },
  },
});
</script>
