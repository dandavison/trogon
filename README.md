<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Trogon_collaris_%28Trog%C3%B3n_collarejo%29_%2814027165535%29.jpg/320px-Trogon_collaris_%28Trog%C3%B3n_collarejo%29_%2814027165535%29.jpg" />
</p>

https://trogon.app/ is a tool for learning to identify birds. You select a
location or region anywhere in the world on the map, and are taken to an
identification challenge (audio or visual) featuring bird species
occurring there.

By default the challenge is audio-only, but this can be changed in the
settings (<i class="fas fa-cog"></i> at the top of the page), along with
English vs scientific name preferences, etc.

<div>
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
  <div v-else>Here are some direct links to identification challenges:</div>
  <ul class="p-3">
    <li>
      <a href="https://trogon.app/challenge?location=L2697642">
        Buena Vista, San José del Guaviare, Colombia
      </a>
    </li>
    <li>
      <a href="https://trogon.app/challenge?location=L1158780">
        Aberdare National Park, Nyandarua County / Nyeri County, Kenya
      </a>
    </li>
    <li>
      <a href="https://trogon.app/challenge?location=L10473105">
        Dunwich Forest, Suffolk, United Kingdom
      </a>
    </li>
    <li>
      <a href="https://trogon.app/challenge?location=L998667">
        Cherokee Park, Louisville, Kentucky, United States
      </a>
    </li>
  </ul>
</div>

The location data comes from [Ebird](https://ebird.org), the recordings of vocalisations come from [xeno-canto](https://www.xeno-canto.org), and the images come from [Wikipedia](https://wikipedia.org).

The Trogon backend is written in Rust using the [Rocket](https://rocket.rs/) web framework. The frontend uses Typescript, [Vue.js](https://vuejs.org/), [Bulma](https://bulma.io/), and [Buefy](https://buefy.org/).
