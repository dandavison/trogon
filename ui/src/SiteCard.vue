<template>
  <section @mouseover="highlightSite" @mouseleave="unhighlightSite">
    <div class="box">
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
            <p>
              <strong>{{ site.name }}</strong>
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
export default {
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
};
</script>
