<template>
  <section>
    <div class="box">
      <article class="media">
        <div class="media-left">
          <figure class="image is-64x64">
            <img
              src="https://user-images.githubusercontent.com/52205/74552822-b0f85f00-4f1b-11ea-908d-48d4f301b6a3.png"
              alt="Image"
            />
          </figure>
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
    return {};
  },
  props: { site: Object },
};
</script>
