<template>
  <section class="section">
    <control-panel :open="controlPanelOpen" :settings="settings" />
    <field-guide :settings="settings" :locationRequest="locationRequest" />
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { isMobile } from "mobile-device-detect";

import ControlPanel from "../components/ControlPanel.vue";
import FieldGuide from "../components/FieldGuide.vue";
import { LocationRequest, NamesLanguage, Settings } from "../types";

export default Vue.extend({
  props: { locationRequest: Object as PropType<LocationRequest> },
  components: { ControlPanel, FieldGuide },
  data() {
    return {
      settings: {
        names:
          this.$i18n.locale == "en" ? NamesLanguage.Both : NamesLanguage.Both,
        promptIncludesImages: false,
        promptIncludesRecording: true,
        commonSpeciesOnly: false,
        songsOnly: true,
        useFieldModals: isMobile,
        disableNetworkRequests: false,
      } as Settings,
      controlPanelOpen: false,
    };
  },
});
</script>
