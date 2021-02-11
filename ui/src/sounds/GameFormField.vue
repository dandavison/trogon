<template>
  <b-field v-if="shouldShow" :label="label" :id="id">
    <span>
      <b-autocomplete
        type="text"
        v-model="answer"
        :data="filteredCandidates"
        :open-on-focus="true"
        @select="handleSelect"
        dropdown-position="bottom"
        max-height="600px"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        readonly
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
    initial: String,
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
      answer: this.initial,
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
    handleSelect(answer: string) {
      this.answer = answer;
      this.handler(this.answer);
      this.$emit("select");
    },
  },
});
</script>
