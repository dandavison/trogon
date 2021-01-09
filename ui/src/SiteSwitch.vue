<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">{{ $t("show-all-sites") }}</b-switch>
    </div>
  </section>
</template>

<i18n>
{
  "en": {
          "show-all-sites": "Show all sites"
        },
  "es": {
          "show-all-sites": "Mostrar todos los sitios"
        }
}
</i18n>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import eventBus from "./event-bus";

export default Vue.extend({
  data() {
    return {
      isSwitched: false
    };
  },
  watch: {
    isSwitched: function(newVal) {
      eventBus.$emit("change:show-sites", newVal);
    }
  }
});
</script>
