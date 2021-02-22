<template>
  <div class="block">
    <ul>
      <li>
        <b-radio
          v-model="names"
          name="name"
          :native-value="NamesLanguage.English"
        >
          {{ NamesLanguage.English }}
        </b-radio>
      </li>
      <li>
        <b-radio
          v-model="names"
          name="name"
          :native-value="NamesLanguage.Scientific"
        >
          {{ NamesLanguage.Scientific }}
        </b-radio>
      </li>
      <li>
        <b-radio v-model="names" name="name" :native-value="NamesLanguage.Both">
          {{ NamesLanguage.Both }}
        </b-radio>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import eventBus from "../event-bus";
import { Settings, NamesLanguage } from "../types";

export default Vue.extend({
  props: { settings: Object as PropType<Settings> },
  data() {
    return {
      names: this.settings.names,
      NamesLanguage,
    };
  },
  watch: {
    names: function (newVal) {
      eventBus.$emit("settings:change:names", newVal);
    },
  },
});
</script>
