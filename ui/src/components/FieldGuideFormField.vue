<template>
  <div class="level" v-if="shouldShow" :id="id">
    <div class="level-item">
      <div class="field has-addons" style="width: 100%">
        <p class="control" style="width: 100%">
          <b-field :type="fieldType">
            <input
              type="text"
              v-model="answer"
              @focus="handleFocus"
              @select="handleSelect"
              @blur="handleBlur"
              max-height="100vh"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            >
              </template>
            </input>
          </b-field>
        </p>
        <p class="control">
          <b-button
            v-if="answer && answer != truth && showInputButtons"
            @click="clear"
          >
            <i class="fas fa-eraser" />
          </b-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { BModalComponent } from "buefy/types/components";
import { BAutocomplete as BAutocompleteInstance } from "buefy/src/components/autocomplete";
type BAutocomplete = InstanceType<typeof BAutocompleteInstance>;
import { isMobile } from "mobile-device-detect";

import eventBus from "../event-bus";
import { debug, transformTaxonName } from "../utils";
import ChallengeFormFieldDropdownRow from "./ChallengeFormFieldDropdownRow.vue";
import ChallengeFormFieldDropdownRowMobile from "./ChallengeFormFieldDropdownRowMobile.vue";

const ChallengeFormField = Vue.extend({
  components: {
    ChallengeFormFieldDropdownRow,
    ChallengeFormFieldDropdownRowMobile,
  },
  props: {
    shouldShow: Boolean,
    id: String,
    label: String,
  },

  data() {
    return {
      answer: "",
      showInputButtons: true,
    };
  },
  methods: {
    clear(): void {
      debug([`ChallengeFormField(${this.id}).clear`]);
      this.answer = "";
      eventBus.$emit("clear:form-field", this.id);
    },

    handleSelect(answer: string) {
      debug([
        `ChallengeFormField(${this.id}).handleSelect:`,
        JSON.stringify(answer),
      ]);
      if (answer) {
        this.answer = answer;
        eventBus.$emit("select:form-field", this.id, answer);
      }
    },
  },
});

export default ChallengeFormField;
</script>

<style>
.autocomplete .icon.has-text-danger,
.autocomplete .icon.has-text-success {
  display: none;
}
</style>