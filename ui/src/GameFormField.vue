<template>
  <div class="level" v-if="shouldShow" :id="id">
    <div class="level-item">
      <div class="field has-addons" style="width: 100%">
        <p class="control">
          <b-button v-if="answer && answer != truth" @click="clear">
            <i class="fas fa-eraser" />
          </b-button>
        </p>
        <p class="control" style="width: 100%">
          <b-autocomplete
            type="text"
            v-model="answer"
            ref="autocomplete"
            :placeholder="label"
            :data="filteredCandidates"
            :open-on-focus="true"
            @focus="$emit('focus')"
            @select="handleSelect"
            dropdown-position="bottom"
            max-height="100%"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          >
            <template slot-scope="props">
              <div class="level">
                <div class="level-left">
                  <div class="level-item">{{ props.option }}</div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <img
                      v-for="url in getImageURLs(props.option)"
                      :key="url"
                      :src="url"
                    />
                  </div>
                </div>
              </div>
            </template>
          </b-autocomplete>
        </p>
        <p class="control">
          <b-button v-if="answer != truth" @click="reveal">
            <i class="fas fa-eye" />
          </b-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import { debug, transformTaxonName } from "./utils";

export default Vue.extend({
  props: {
    initial: String,
    shouldShow: Boolean,
    id: String,
    label: String,
    filter: Function,
    truth: String,
    getImageURLs: Function,
    handler: Function,
  },
  mounted() {
    this.dismissMobileKeyboardOnDropdownScroll();
  },
  data() {
    return {
      answer: this.initial,
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

    handleSelect(answer: string) {
      debug([
        `GameFormField(${this.id}).handleSelect:`,
        JSON.stringify(answer),
      ]);
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
          input.blur();
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