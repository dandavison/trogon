<template>
  <section class="section has-text-grey-light">
    <div class="p-3">
      <em>Trogon</em> is a tool for learning to identify birds. You select a
      location anywhere in the world on the map, and are taken to an
      identification challenge (audio or visual) featuring bird species
      occurring at that location.
    </div>

    <div class="p-3">
      To select a location:
      <ol class="p-3">
        <li>
          Zoom in on some area of the world.
        </li>
        <li>
          Right click / long press (phone) to load nearby Ebird locations (red).
          If no red circles appear then there are no Ebird locations nearby.
        </li>
        <li>
          Click on the map marker, or on an individual Ebird location, to select
          that location for the identification challenge.
        </li>
      </ol>
    </div>

    <div class="p-3">
      Feedback appreciated! Please send comments, suggestions, etc to
      <tt>dandavison7@gmail.com</tt>, or
      <a href="https://github.com/dandavison/trogon/issues">open an issue</a>
      on the Github page.
    </div>

    <div class="p-3">
      The location data comes from <a href="http://ebird.org/">Ebird</a>, the
      recordings of vocalisations come from
      <a href="https://www.xeno-canto.org/">xeno-canto</a>, and the images come
      from <a href="https://wikipedia.org/">Wikipedia</a>.
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({});
</script>