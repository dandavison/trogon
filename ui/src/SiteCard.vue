<template>
  <section
    class="site-card"
    @mouseover="highlightSite"
    @mouseleave="unhighlightSite"
    style="height: 200px"
  >
    <div class="box" style="height: 200px">
      <article class="media">
        <div class="media-left">
          <b-carousel v-bind="carouselAttributes">
            <b-carousel-item v-for="image in site.images" :key="image">
              <figure class="image is-64x64">
                <img v-bind:src="image" alt="Site Image" />
              </figure>
            </b-carousel-item>
          </b-carousel>
        </div>
        <div class="media-content">
          <div class="content">
            <p style="height: 150px; text-overflow: ellipsis; overflow: hidden">
              <strong>{{ site.name }}</strong>
              <br />
              {{ site.description }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);

export default Vue.extend({
  data() {
    return {
      carouselAttributes: {
        arrow: true,
        arrowBoth: false,
        autoplay: false,
        iconSize: "is-small",
        indicator: false,
      },
    };
  },
  methods: {
    highlightSite: function () {
      this.$emit("highlightsite", this.site);
    },
    unhighlightSite: function () {
      this.$emit("unhighlightsite", this.site);
    },
  },
  props: { site: Object },
});
</script>
