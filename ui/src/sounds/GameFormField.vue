<template>
  <b-field v-if="shouldShow" :label="label" :id="id">
    <span>
      <b-autocomplete
        type="text"
        v-model="answer"
        :data="filteredCandidates"
        dropdown-position="bottom"
        max-height="600px"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      >
        <template slot-scope="props">
          <div class="media">
            <div class="media-content">
              {{ props.option }}
            </div>
            <div class="media-right">
              <figure
                class="image is-128x128"
                 v-for="url in getImageURLs(props.option)"
                :key="url"
              >
                <img :src="url" />
              </figure>
            </div>
          </div>
        </template>
      </b-autocomplete>
      <b-button v-if="answer != truth" @click="reveal">Reveal</b-button>
      <p v-if="answer">
        {{ isCorrect() ? "✅" : "❌" }}
      </p>
    </span>
  </b-field>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    shouldShow: Boolean,
    id: String,
    label: String,
    filter: Function,
    truth: String,
    isCorrect: Function,
    getImageURLs: Function,
    handler: Function,
  },
  data() {
    return {
      answer: "",
    };
  },
  computed: {
    filteredCandidates(): string[] {
      return this.filter(this.answer);
    },
  },
  watch: {
    answer: function (newVal) {
      this.handler(newVal);
    },
  },
  methods: {
    clear(): void {
      this.answer = "";
    },
    reveal(): void {
      this.answer = this.truth;
    },
  },
});
</script>
