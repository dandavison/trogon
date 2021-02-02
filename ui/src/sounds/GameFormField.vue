<template>
  <b-field v-if="shouldShow" :label="label">
    <span>
      <b-autocomplete type="text" v-model="answer" :data="filter()">
        <template slot-scope="props">
          <div class="media">
            <div class="media-content">
              {{ props.option }}
            </div>
            <div class="media-right">
              <img
                v-for="url in getImages(props.option)"
                :key="url"
                :src="url"
                width="128"
              />
            </div>
          </div>
        </template>
      </b-autocomplete>
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
    label: String,
    filter: Function,
    isCorrect: Function,
    getImages: Function,
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
});
</script>