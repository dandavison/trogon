<template>
  <div class="level" v-if="shouldShow" :id="id">
    <div class="level-item">
      <div class="field has-addons" style="width: 100%">
        <p class="control" style="width: 100%">
          <b-autocomplete
            type="text"
            v-model="answer"
            ref="autocomplete"
            :placeholder="label"
            :data="filteredCandidates"
            :open-on-focus="true"
            @focus="handleFocus"
            @select="handleSelect"
            @blur="handleBlur"
            dropdown-position="bottom"
            max-height="100vh"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          >
            <template slot-scope="props">
              <game-form-field-dropdown-row-mobile
                v-if="isMobile"
                :images="getImageURLs(props.option)"
                :imageLabelFn="imageLabelFn"
                :option="props.option"
              />
              <game-form-field-dropdown-row
                v-else
                :images="getImageURLs(props.option)"
                :imageLabelFn="imageLabelFn"
                :option="props.option"
              />
            </template>
          </b-autocomplete>
        </p>
        <p class="control">
          <b-button
            v-if="answer && answer != truth && showInputButtons"
            @click="clear"
          >
            <i class="fas fa-eraser" />
          </b-button>
        </p>
        <p class="control">
          <b-button v-if="answer != truth && showInputButtons" @click="reveal">
            <i class="fas fa-eye" />
          </b-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { isMobile } from "mobile-device-detect";

import { debug, transformTaxonName } from "./utils";
import GameFormFieldDropdownRow from "./GameFormFieldDropdownRow.vue";
import GameFormFieldDropdownRowMobile from "./GameFormFieldDropdownRowMobile.vue";

export default Vue.extend({
  components: { GameFormFieldDropdownRow, GameFormFieldDropdownRowMobile },
  props: {
    initial: String,
    shouldShow: Boolean,
    id: String,
    label: String,
    filter: Function,
    truth: String,
    getImageURLs: Function,
    imageLabelFn: Function,
    handler: Function,
  },
  mounted() {
    this.dismissMobileKeyboardOnDropdownScroll();
  },
  data() {
    return {
      answer: this.initial,
      showInputButtons: true,
      isMobile,
    };
  },
  computed: {
    filteredCandidates(): string[] {
      debug([`${this.id}.filteredCandidates:`, JSON.stringify(this.answer)]);
      return this.filter(this.answer);
    },
  },
  watch: {
    answer: {
      sync: true,
      handler: function (value: string): void {
        debug([`${this.id}: watch: answer:`, JSON.stringify(value)]);
        this.handler(value);
        this.styleInputAccordingToAnswer();
      },
    } as any, // sync is private
  },
  methods: {
    clear(): void {
      debug([`GameFormField(${this.id}).clear`]);
      this.answer = "";
      this.handler(this.answer);
    },

    reveal(): void {
      debug([
        `GameFormField(${this.id}).reveal:`,
        JSON.stringify(this.answer),
        JSON.stringify(this.truth),
      ]);
      this.answer = this.truth;
    },

    handleFocus() {
      this.showInputButtons = false;
      this.$emit("focus");
    },

    handleBlur() {
      this.showInputButtons = true;
    },

    handleSelect(answer: string) {
      debug([
        `GameFormField(${this.id}).handleSelect:`,
        JSON.stringify(answer),
      ]);
      this.showInputButtons = true;
      if (answer) {
        this.answer = answer;
        this.handler(this.answer);
        this.$emit("select");
      }
      this.styleInputAccordingToAnswer();
    },

    isCorrect(): boolean {
      debug([
        `${this.id}.isCorrect:`,
        transformTaxonName(this.truth),
        transformTaxonName(this.answer),
      ]);
      return transformTaxonName(this.truth) === transformTaxonName(this.answer);
    },

    styleInputAccordingToAnswer() {
      const autocomplete = this.$refs.autocomplete as any;
      const input = autocomplete?.$refs.input.$refs.input as HTMLElement;
      debug([
        `${this.id}.styleInputAccordingToAnswer:`,
        `${input}`,
        JSON.stringify(this.answer),
        JSON.stringify(this.truth),
      ]);
      if (input) {
        input.classList.remove("is-danger");
        input.classList.remove("is-success");
        if (this.answer && this.truth) {
          input.classList.add(this.isCorrect() ? "is-success" : "is-danger");
        }
      }
    },

    dismissMobileKeyboardOnDropdownScroll(): void {
      const autocomplete = this.$refs.autocomplete as any;
      const input = autocomplete?.$refs.input.$refs.input as HTMLElement;
      const dropdown = autocomplete?.$refs.dropdown as HTMLElement;
      const dropdownContent = dropdown?.querySelector(
        ".dropdown-content"
      ) as HTMLElement;
      if (input && dropdownContent) {
        dropdownContent.onscroll = () => {
          // The purpose of this handler is to cause the soft keyboard of
          // mobile devices to be dismissed when the user starts scrolling.

          // On iOS and Safari, a single onscroll event is emitted
          // *after* selecting a dropdown item. Since at that point the
          // dropdown is closed, we do not want this handler to run.
          if (autocomplete.isActive) {
            input.blur();
            // If the input is focused, scrolling will emit a single blur event.
            // Since we have arranged for blur events to show the buttons,
            // we counteract this here.
            this.showInputButtons = false;
          }
        };
      } else {
        debug([
          "Failed to obtain references to input and dropdown HTML elements.",
        ]);
      }
    },
  },
});
</script>

<style scoped>
td {
  border-width: 0px;
}
</style>