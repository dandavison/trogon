<template>
  <b-field v-if="shouldShow" :label="label" :id="id">
    <span>
      <b-autocomplete type="text" v-model="answer" :data="filter()">
        <template slot-scope="props">
          <div class="media">
            <div class="media-content">
              {{ props.option }}
            </div>
            <div class="media-right">
              <img
                v-for="url in getImageURLs(props.option)"
                :key="url"
                :src="url"
                width="128"
              />
            </div>
          </div>
        </template>
      </b-autocomplete>
      <b-button @click="reveal">Reveal</b-button>
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