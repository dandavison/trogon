<template>
  <div class="block">
    <ul>
      <li>
        <b-radio v-model="names" name="name" native-value="english">
          English
        </b-radio>
      </li>
      <li>
        <b-radio v-model="names" name="name" native-value="scientific">
          Scientific
        </b-radio>
      </li>
      <li>
        <b-radio v-model="names" name="name" native-value="both">
          Both
        </b-radio>
      </li>
    </ul>
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
    names: function (newVal) {
      eventBus.$emit("names:change", newVal);
    },
  },
});
</script>
