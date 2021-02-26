<template>
  <div class="level" v-if="shouldShow" :id="id">
    <div class="level-item">
      <div class="field has-addons" style="width: 100%">
        <p class="control" style="width: 100%">
          <b-field :type="fieldType">
            <b-autocomplete
              type="text"
              v-model="answer"
              ref="autocomplete"
              :placeholder="label"
              :data="filteredCandidates"
              :open-on-focus="!useModal"
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
                <challenge-form-field-dropdown-row-mobile
                  v-if="isMobile"
                  :images="getImageURLs(props.option)"
                  :imageLabelFn="imageLabelFn"
                  :option="props.option"
                />
                <challenge-form-field-dropdown-row
                  v-else
                  :images="getImageURLs(props.option)"
                  :imageLabelFn="imageLabelFn"
                  :option="props.option"
                />
              </template>
            </b-autocomplete>
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
    initial: String,
    shouldShow: Boolean,
    id: String,
    label: String,
    filter: Function,
    truth: String,
    getImageURLs: Function,
    imageLabelFn: Function,
    handler: Function,
    useModal: Boolean,
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.dismissMobileKeyboardOnDropdownScroll();
    if (this.isModal) {
      this.autocomplete.focused(); // open-on-focus
      this.$nextTick(() => this.input.select()); // actually focus
    }
  },
  data() {
    return {
      answer: this.initial,
      showInputButtons: true,
      modal: null as BModalComponent | null,
      isMobile,
    };
  },
  computed: {
    filteredCandidates(): string[] {
      debug([`${this.id}.filteredCandidates:`, JSON.stringify(this.answer)]);
      return this.filter(this.answer);
    },

    fieldType(): string {
      if (this.answer && this.truth) {
        return this.isCorrect() ? "is-success" : "is-danger";
      } else {
        return "";
      }
    },

    autocomplete(): BAutocomplete {
      return this.$refs.autocomplete;
    },

    input(): HTMLInputElement {
      return this.autocomplete.$el.querySelector("input");
    },
  },
  watch: {
    answer: {
      sync: true,
      handler: function (value: string): void {
        debug([`${this.id}: watch: answer:`, JSON.stringify(value)]);
        this.handler(value);
      },
    } as any, // sync is private
  },
  methods: {
    clear(): void {
      debug([`ChallengeFormField(${this.id}).clear`]);
      this.answer = "";
      this.handler(this.answer);
    },

    reveal(): void {
      debug([
        `ChallengeFormField(${this.id}).reveal:`,
        JSON.stringify(this.answer),
        JSON.stringify(this.truth),
      ]);
      this.answer = this.truth;
      eventBus.$emit("reveal-field");
    },

    openModal(): BModalComponent {
      return this.$buefy.modal.open({
        parent: this,
        fullScreen: true,
        animation: "",
        component: ChallengeFormField,
        props: {
          ...this.$props,
          useModal: false,
          isModal: true,
        },
      });
    },

    handleFocus() {
      if (this.useModal) {
        this.modal = this.openModal();
        return;
      }
      this.showInputButtons = false;
      this.$emit("focus");
    },

    handleBlur() {
      this.showInputButtons = true;
    },

    handleSelect(answer: string) {
      debug([
        `ChallengeFormField(${this.id}).handleSelect:`,
        JSON.stringify(answer),
      ]);
      if (this.isModal) {
        if (answer) {
          this.answer = answer;
          let modal = this.$parent as BModalComponent;
          let field = modal.$parent as ChallengeFormFieldInstance;
          field.handleSelect(this.answer);
          modal.close();
          field.input.scrollIntoView();
        }
        return;
      }
      this.showInputButtons = true;
      if (answer) {
        this.answer = answer;
        this.handler(this.answer);
        this.$emit("select");
      }
    },

    isCorrect(): boolean {
      debug([
        `${this.id}.isCorrect:`,
        transformTaxonName(this.truth),
        transformTaxonName(this.answer),
      ]);
      return transformTaxonName(this.truth) === transformTaxonName(this.answer);
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

export default ChallengeFormField;
type ChallengeFormFieldInstance = InstanceType<typeof ChallengeFormField>;
</script>

<style>
.autocomplete .icon.has-text-danger,
.autocomplete .icon.has-text-success {
  display: none;
}
</style>