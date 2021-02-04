<template>
  <b-field v-if="shouldShow" :label="label" :id="id">
    <span>
      <b-autocomplete
        type="text"
        :data="filter()"
        @typing="$emit('update:answer', $event)"
        @input="$emit('update:answer', $event)"
      >
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
    answer: String,
    shouldShow: Boolean,
    id: String,
    label: String,
    filter: Function,
    isCorrect: Function,
    getImageURLs: Function,
    handler: Function,
  },
});
</script>