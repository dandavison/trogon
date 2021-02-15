<template>
  <section class="section">
    <div class="p-3">
      <em>Trogon</em> is a work-in-progress. Currently, there is a
      <router-link to="/trogon"> map view </router-link> which you use to select
      a location. This takes you to an identification challenge page.
    </div>

    <div class="p-3">
      To select a location:
      <ol class="p-3">
        <li>
          Zoom in on an area on the
          <router-link to="/trogon"> map </router-link>
        </li>
        <li>
          Right click / long press (phone) on the map to load nearby Ebird
          locations (red)
        </li>
        <li>
          Click on the map marker, or on an individual Ebird location, to select
          that location for the identification challenge
        </li>
      </ol>
    </div>

    <div class="p-3">
      If no red circles appear then there may simply be no Ebird locations
      nearby.
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
