<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">{{ trip.name }}</b-switch>
    </div>
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import eventBus from "./event-bus";
import { Trip } from "types";

export default Vue.extend({
  data() {
    return {
      isSwitched: false,
    };
  },
  props: { trip: Object as PropType<Trip> },
  watch: {
    isSwitched: function (newVal) {
      eventBus.$emit("change:show-trip", newVal, this.trip);
    },
  },
});
</script>
