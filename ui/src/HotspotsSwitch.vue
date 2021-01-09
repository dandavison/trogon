<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">{{ $t("show-ebird-hotspots") }}</b-switch>
    </div>
  </section>
</template>

<i18n>
{
  "en": {
          "show-ebird-hotspots": "Show eBird hotspots"
        },
  "es": {
          "show-ebird-hotspots": "Mostrar hotspots de eBird"
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
      eventBus.$emit("change:show-hotspots", newVal);
    }
  }
});
</script>
