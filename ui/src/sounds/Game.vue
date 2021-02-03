<template>
  <section style="margin-top: 50px">
    <section>
      <h1 style="font-weight: bold">{{ ebirdHotspot.locName }}</h1>
      <ul>
        <li>{{ locationSpecies.length }} species total</li>
        <li>
          {{ selectedChallengeSpecies.length }} species in current challenge
        </li>
        <li>
          <div class="buttons">
            <b-button
              label="Select families"
              @click="isFamilyModalActive = true"
            />
          </div>
          <b-modal v-model="isFamilyModalActive" full-screen>
            <family-selector :challengeFamilies="challengeFamilies" />
          </b-modal>
        </li>
      </ul>
    </section>

    <nav class="level">
      <p class="level-item has-text-centered">
        <b-button @click="setNextRecording">
          {{ recording ? "Next" : "Start" }}
        </b-button>
      </p>
      <p
        class="level-item"
        v-if="settings.promptIncludesRecording && recording"
      >
        <recording-component :recording="recording" />
      </p>

      <p class="level-item" v-if="image && settings.promptIncludesImages">
        <img :src="image" />
      </p>

      <p class="level-item has-text-centered">
        <b-button v-if="recording" @click="revealSpecies"> Reveal </b-button>
      </p>
    </nav>

    <div class="container">
      <div class="columns">
        <div class="column">
          <game-form
            ref="gameForm"
            :locationSpecies="locationSpecies"
            :recording="recording"
            :imageURLMaps="imageURLMaps"
            :settings="settings"
          />
        </div>
        <div class="column">
          <div
            id="revealed-recording-info"
            v-if="
              $refs.gameForm &&
              ($refs.gameForm.isSpeciesEnCorrect() ||
                $refs.gameForm.isSpeciesSciCorrect())
            "
          >
            <p>
              <a :href="recordingSpeciesWikipediaURL()" target="_blank">
                {{ recordingSpeciesSciName() }}
              </a>
            </p>

            <img v-if="image && !settings.promptIncludesImages" :src="image" />

            <b-dropdown v-if="settings.promptIncludesRecording && recording">
              <template #trigger="{ active }">
                <b-button
                  label="Recordings"
                  icon-right="chevron-down"
                  icon-pack="fas"
                />
              </template>
              <b-dropdown-item
                v-for="rec in recordings.get(recording.speciesCode)"
                :key="rec.url"
              >
                <recording-component :recording="rec" :preload="'none'" />
              </b-dropdown-item>
            </b-dropdown>

            <p v-if="settings.promptIncludesRecording && recording"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { EbirdSpecies } from "types";
import {
  filterToCommonSpecies,
  fetchEbirdHotspot,
  ebirdSpecies,
} from "./ebird";
import { getRecordings, recordingMatchesFilters } from "./xeno-canto";
import { isDefaultSelectedFamily } from "./birds";
import { fetchJSONArraySynchronously } from "../utils";
import RecordingComponent from "./Recording.vue";
import {
  ChallengeFamily,
  ImageURLMaps,
  NamesLanguage,
  Recording,
  Settings,
} from "./types";
import GameForm from "./GameForm.vue";
import FamilySelector from "./FamilySelector.vue";
import eventBus from "./event-bus";

export default Vue.extend({
  name: "Home",
  components: { RecordingComponent, GameForm, FamilySelector },
  props: { ebirdLocId: String, settings: Object as PropType<Settings> },

  data() {
    const ebirdHotspot = fetchEbirdHotspot(this.ebirdLocId);

    const locationSpecies = fetchJSONArraySynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${this.ebirdLocId}`
    ) as EbirdSpecies[];

    const family2order = new Map(
      locationSpecies.map((sp) => [sp.familyComName, sp.order])
    );

    var challengeSpecies = filterToCommonSpecies(
      locationSpecies,
      this.ebirdLocId
    );

    console.log(
      `filterToCommonSpecies: ${locationSpecies.length} => ${challengeSpecies.length} species`
    );

    const challengeFamilies: Map<string, ChallengeFamily> = new Map(
      Object.entries(_.groupBy(challengeSpecies, (sp) => sp.familyComName)).map(
        ([family, spp]) => [
          family,
          {
            n: spp.length,
            selected: isDefaultSelectedFamily(family, family2order),
          },
        ]
      )
    );

    challengeSpecies = _.shuffle(challengeSpecies);

    return {
      challengeSpecies,
      challengeFamilies,
      ebirdHotspot,
      locationSpecies,
      imageURLMaps: makeImageURLMaps(locationSpecies),
      recordings: new Map([]) as Map<string, Recording[]>, // speciesCode
      recording: null as Recording | null,
      showImage: false,
      image: "",
      isFamilyModalActive: false,
    };
  },

  created: function () {
    this.fetchAllRecordings();
  },

  mounted: function () {
    eventBus.$on("family:select", this.handleFamilySelection);
  },

  computed: {
    selectedChallengeSpecies(): EbirdSpecies[] {
      const selectedFamilies = new Set(
        Array.from(this.challengeFamilies.entries())
          .filter(([_, { selected }]) => selected)
          .map(([family, _]) => family)
      );
      return this.challengeSpecies.filter((sp) =>
        selectedFamilies.has(sp.familyComName)
      );
    },

    challengeRecordings(): Iterator<Recording> {
      return this.makeRecordingsIterator(this.selectedChallengeSpecies);
    },
  },

  methods: {
    handleFamilySelection(family: string, selected: boolean): void {
      var challengeFamily = this.challengeFamilies.get(family);
      if (challengeFamily) {
        challengeFamily.selected = selected;
        // TODO: HACK: trigger reactivity: selectedChallengeSpecies
        this.challengeFamilies = new Map(this.challengeFamilies.entries());
      }
    },
    revealSpecies(): void {
      if (this.recording) {
        (this.$refs["gameForm"] as any).revealSpecies();
        this.showImage = true;
      }
    },

    fetchAllRecordings(): void {
      for (let sp of this.selectedChallengeSpecies) {
        getRecordings(sp, this.ebirdHotspot).then((recs) => {
          this.recordings.set(sp.speciesCode, recs);
        });
      }
    },

    makeRecordingsIterator: function* (
      species: EbirdSpecies[]
    ): Iterator<Recording> {
      for (const sp of species) {
        const recordings = this.recordings.get(sp.speciesCode);
        if (
          recordings &&
          recordings[0] &&
          recordingMatchesFilters(recordings[0].raw, this.settings)
        ) {
          yield recordings[0];
        }
      }
    },

    setNextRecording(): void {
      (this.$refs.gameForm as any).clearInput();
      this.showImage = false;
      this.image = "";
      const rec = this.challengeRecordings.next();
      if (!rec.done) {
        this.recording = rec.value;
        let images = this.imageURLMaps.speciesSciName2images.get(
          `${this.recording.genus} ${this.recording.speciesSci}`
        );
        if (images) {
          let image = images.values().next();
          if (!image.done) {
            this.image = image.value;
          } else {
            alert("No images for species!");
          }
        }
      } else {
        alert("No more recordings!");
      }
    },

    recordingSpeciesWikipediaURL(): string | null {
      if (this.recording) {
        return `https://en.wikipedia.org/w/index.php?title=${this.recording.genus}_${this.recording.speciesSci}`;
      } else {
        return null;
      }
    },

    // TODO: remove species/genus names from Recording, leaving speciesCode foreign key.
    recordingSpeciesSciName(): string | null {
      if (this.recording) {
        const speciesEn = this.recording.speciesEn;
        if (this.settings.names == NamesLanguage.English) {
          return speciesEn;
        } else {
          const speciesSci = `${this.recording.genus} ${this.recording.speciesSci}`;
          if (this.settings.names == NamesLanguage.Scientific) {
            return speciesSci;
          } else {
            return `${speciesSci} (${speciesEn})`;
          }
        }
      } else {
        return null;
      }
    },
  },
});

function makeImageURLMaps(locationSpecies: EbirdSpecies[]): ImageURLMaps {
  var speciesSciName2images: Map<string, Set<string>> = new Map();
  var genus2images: Map<string, Set<string>> = new Map();
  var familySci2images: Map<string, Set<string>> = new Map();
  var familyEn2images: Map<string, Set<string>> = new Map();

  for (let sp of locationSpecies) {
    let genus = ebirdSpecies.getGenus(sp);
    let speciesSci = ebirdSpecies.getSpeciesSci(sp);
    let haveSeenGenus = true;
    if (sp.images[0]) {
      speciesSciName2images.set(`${genus} ${speciesSci}`, new Set(sp.images));

      if (!genus2images.has(genus)) {
        genus2images.set(genus, new Set());
        haveSeenGenus = false;
      }
      genus2images.get(genus)?.add(sp.images[0]);
      if (!haveSeenGenus) {
        let familySci = ebirdSpecies.getFamilySci(sp);
        let familyEn = ebirdSpecies.getFamilyEn(sp);
        if (!familySci2images.has(familySci)) {
          familySci2images.set(familySci, new Set());
        }
        if (!familyEn2images.has(familyEn)) {
          familyEn2images.set(familyEn, new Set());
        }
        familySci2images.get(familySci)?.add(sp.images[0]);
        familyEn2images.get(familyEn)?.add(sp.images[0]);
      }
    }
  }

  return {
    speciesSciName2images,
    genus2images,
    familySci2images,
    familyEn2images,
  };
}
</script>
