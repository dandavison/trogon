<template>
  <section class="section">
    <control-panel
      :open="controlPanelOpen"
      :challengeFamilies="challengeFamilies"
      :settings="settings"
    />
    <family-selector :challengeFamilies="challengeFamilies" />
    <challenge :settings="settings" :locationRequest="locationRequest" />
  </section>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { isMobile } from "mobile-device-detect";

import eventBus from "../event-bus";
import FamilySelector from "../components/FamilySelector.vue";
import ControlPanel from "../components/ControlPanel.vue";
import Challenge from "../components/Challenge.vue";
import {
  ChallengeFamily,
  LocationRequest,
  NamesLanguage,
  Settings,
} from "../types";

export default Vue.extend({
  name: "ChallengeRoot",
  props: { locationRequest: Object as PropType<LocationRequest> },
  components: { ControlPanel, FamilySelector, Challenge },
  data() {
    return {
      settings: {
        names: NamesLanguage.Both,
        promptIncludesImages: false,
        promptIncludesRecording: true,
        commonSpeciesOnly: false,
        songsOnly: true,
        useFieldModals: isMobile,
        disableNetworkRequests: false,
      } as Settings,
      controlPanelOpen: false,
      challengeFamilies: new Map() as Map<string, ChallengeFamily>,
    };
  },
  mounted: function (): void {
    eventBus.$on("settings:change:names", (newVal: NamesLanguage) => {
      this.settings.names = newVal;
    });
    eventBus.$on("settings:change:commonSpeciesOnly", (newVal: boolean) => {
      this.settings.commonSpeciesOnly = newVal;
      eventBus.$emit("change:species-filters");
    });
    eventBus.$on("settings:change:songsOnly", (newVal: boolean) => {
      this.settings.songsOnly = newVal;
    });
    eventBus.$on("settings:change:promptIncludesImages", (newVal: boolean) => {
      this.settings.promptIncludesImages = newVal;
    });
    eventBus.$on(
      "settings:change:promptIncludesRecording",
      (newVal: boolean) => {
        this.settings.promptIncludesRecording = newVal;
      }
    );
    eventBus.$on("settings:change:useFieldModals", (newVal: boolean) => {
      this.settings.useFieldModals = newVal;
    });
    eventBus.$on(
      "set:challenge-families",
      (newVal: Map<string, ChallengeFamily>) => {
        this.challengeFamilies = newVal;
      }
    );
  },
});
</script>
