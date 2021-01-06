<template>
  <section>
    <div class="field">
      <b-switch v-model="isSwitched">Show all sites</b-switch>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n"
Vue.use(VueI18n);

export default Vue.extend({
  data() {
    return {
      isSwitched: false,
    };
  },
  watch: {
    isSwitched: function (newVal) {
      this.$emit("changeshowsites", newVal);
    },
  },
});
</script>
