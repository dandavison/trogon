<template>
  <section class="section has-text-grey-light">
    <div v-if="spanish" class="p-3">
      <em>Trogon</em> es un app por aprender a identificar los pájaros.
      Seleccione un sitio o zona en cualquier parte del mundo y llegará en un
      desafío de identificación con las especies que han sido registrados en la
      zona.
    </div>
    <div v-else class="p-3">
      <em>Trogon</em> is a tool for learning to identify birds. You select a
      location or region anywhere in the world on the map, and are taken to an
      identification challenge (audio or visual) featuring bird species
      occurring there.
    </div>

    <div v-if="spanish" class="p-3">
      Por lo predeterminado, el desafío es solo audio, pero se puede cambiar eso
      en los ajustes (<i class="fas fa-cog"></i>), como también eligir entre
      nombres de las especies en Inglés o nombres científicos, etc.
    </div>
    <div v-else class="p-3">
      By default the challenge is audio-only, but this can be changed in the
      settings (<i class="fas fa-cog"></i> at the top of the page), along with
      English vs scientific name preferences, etc.
    </div>

    <div v-if="spanish" class="p-3">
      Para selecccionar un sitio utilisando el mapa:
      <ol class="p-3">
        <li>Haga zoom en una area del mundo.</li>
        <li>
          Haga click derecho / pulsación larga (dispositivos móviles) para
          descargar sitios cercanos de
          <a href="http://ebird.org/">Ebird</a> (círculos rojas). Caso no
          aparezcan círculos rojos, entonces no hay sitios cercanos de Ebird.
        </li>
        <li>
          Haga click en el marcador del mapa, o en un círculo rojo, para
          seleccionar esa zona/sitio para el desafío de identificación.
        </li>
      </ol>
    </div>
    <div v-else class="p-3">
      To select a location using the map:
      <ol class="p-3">
        <li>Zoom in on some area of the world.</li>
        <li>
          Right click / long press (phone) to load nearby
          <a href="http://ebird.org/">Ebird</a> locations (red). If no red
          circles appear then there are no Ebird locations nearby.
        </li>
        <li>
          Click on the map marker, or on an individual Ebird location, to select
          that region/location for the identification challenge.
        </li>
      </ol>
    </div>

    <div class="p-3">
      <div v-if="spanish">
        Los seguientes enlaces van directamente al desafío:
      </div>
      <div v-else>Here are some direct links to identification challenges:</div>
      <ul class="p-3">
        <li>
          <a href="/challenge?location=L2697642">
            Buena Vista, San José del Guaviare, Colombia
          </a>
        </li>
        <li>
          <a href="/challenge?location=L1158780">
            Aberdare National Park, Nyandarua County / Nyeri County, Kenya
          </a>
        </li>
        <li>
          <a href="/challenge?location=L10473105">
            Dunwich Forest, Suffolk, United Kingdom
          </a>
        </li>
        <li>
          <a href="/challenge?location=L998667">
            Cherokee Park, Louisville, Kentucky, United States
          </a>
        </li>
      </ul>
    </div>

    <div v-if="spanish" class="p-3">
      Favor enviar sugerencias para mejorar el app, etc, para
      <tt>dandavison7@gmail.com</tt>, o
      <a href="https://github.com/dandavison/trogon/issues">abre un issue</a>
      en la página de Github.
    </div>
    <div v-else class="p-3">
      Please send suggestions for improvements etc to
      <tt>dandavison7@gmail.com</tt>, or
      <a href="https://github.com/dandavison/trogon/issues">open an issue</a>
      on the Github page.
    </div>

    <div v-if="spanish" class="p-3">
      Los dados de sitios provienen de <a href="http://ebird.org/">Ebird</a>,
      las grabaciones de <a href="https://www.xeno-canto.org/">xeno-canto</a>, y
      las imagenes de <a href="https://wikipedia.org/">Wikipedia</a>.
    </div>
    <div v-else class="p-3">
      The location data comes from <a href="http://ebird.org/">Ebird</a>, the
      recordings of vocalisations come from
      <a href="https://www.xeno-canto.org/">xeno-canto</a>, and the images come
      from <a href="https://wikipedia.org/">Wikipedia</a>.
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  computed: {
    spanish(): boolean {
      return this.$i18n.locale == "es";
    },
  },
});
</script>
