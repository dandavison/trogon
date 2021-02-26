<template>
  <div class="block">
    <ul>
      <li>
        <b-radio
          v-model="names"
          name="name"
          :native-value="NamesLanguage.English"
        >
          {{ $t(NamesLanguage.English) }}
        </b-radio>
      </li>
      <li>
        <b-radio
          v-model="names"
          name="name"
          :native-value="NamesLanguage.Scientific"
        >
          {{ $t(NamesLanguage.Scientific) }}
        </b-radio>
      </li>
      <li>
        <b-radio v-model="names" name="name" :native-value="NamesLanguage.Both">
          {{ $t(NamesLanguage.Both) }}
        </b-radio>
      </li>
    </ul>
  </div>
</template>

<i18n>
{
  "en": {
  },
  "es": {
      "English": "Inglés"
    , "scientific": "científicos"
    , "both": "ambos"
  }
}
</i18n>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

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
