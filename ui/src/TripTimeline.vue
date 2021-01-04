<template>
  <b-carousel-list v-model="test" :data="sites" :items-to-show="3">
    <template slot="item" slot-scope="list">
      <div class="card-content">
        <div class="content">
          <p class="title is-6">{{ list.name }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-image">
          <figure class="image is-5by4">
            <a @click="info(list.index)"><img :src="list.images[0]" /></a>
          </figure>
        </div>
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      test: 0,
    };
  },
  methods: {
    info(value) {
      this.test = value;
    },
  },
  props: { sites: Array },
});
</script>
