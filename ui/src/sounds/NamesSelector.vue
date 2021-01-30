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
import Vue, { PropType } from "vue";
import eventBus from "./event-bus";
import { Settings } from "./types";

export default Vue.extend({
  props: { settings: Object as PropType<Settings> },
  data() {
    return {
      names: this.settings.names,
    };
  },
  watch: {
    names: function (newVal) {
      eventBus.$emit("settings:change:names", newVal);
    },
  },
});
</script>
