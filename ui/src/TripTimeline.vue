<template>
  <b-carousel-list v-if="trip" :data="trip.site_days" :items-to-show="3">
    <template slot="item" slot-scope="list">
      <div class="card-content">
        <div class="content">
          <p class="title is-6">{{ list.site.name }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-image">
          <figure class="image is-5by4">
            <a @click="info(list.index)"><img :src="list.site.images[0]" /></a>
          </figure>
        </div>
      </div>
    </template>
  </b-carousel-list>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

import { Trip } from "types";

export default Vue.extend({
  props: {
    trip: (Object as null | Object) as PropType<Trip>,
  },
});
</script>
