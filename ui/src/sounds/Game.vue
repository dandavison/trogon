<template>
  <section style="margin-top: 50px">
    <challenge-description
      :ebirdLocId="ebirdLocId"
      :ebirdHotspot="ebirdHotspot"
      :locationSpecies="locationSpecies"
      :selectedChallengeSpecies="selectedChallengeSpecies"
      :challengeFamilies="challengeFamilies"
    />

    <b-loading v-model="isLoading"></b-loading>

    <challenge-controls
      :image="image"
      :recording="recording"
      :setNextRecording="setNextRecording"
      :settings="settings"
    />

    <game-form
      v-if="haveLocationData"
      ref="gameForm"
      :locationSpecies="locationSpecies"
      :recording="recording"
      :imageURLMaps="imageURLMaps"
      :settings="settings"
    />

    <reveal-area
      v-if="
        $refs.gameForm &&
        ($refs.gameForm.isSpeciesEnCorrect() ||
          $refs.gameForm.isSpeciesSciCorrect())
      "
      :image="image"
      :recording="recording"
      :recordings="recordings"
      :settings="settings"
    />
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { EbirdHotspot } from "types";
import {
  filterToCommonSpecies,
  fetchEbirdHotspot,
  ebirdSpecies,
  fetchLocationSpecies,
  fetchSpeciesImages,
} from "./ebird";
import { getRecordings, recordingMatchesFilters } from "./xeno-canto";
import { isDefaultSelectedFamily } from "./birds";
import RecordingComponent from "./Recording.vue";
import {
  ChallengeFamily,
  EbirdSpecies,
  ImageURLMaps,
  Recording,
  Settings,
  SpeciesImages,
} from "./types";
import GameForm from "./GameForm.vue";
import eventBus from "./event-bus";
import RevealArea from "./RevealArea.vue";
import ChallengeDescription from "./ChallengeDescription.vue";
import ChallengeControls from "./ChallengeControls.vue";

export default Vue.extend({
  name: "Home",
  components: {
    RecordingComponent,
    GameForm,
    RevealArea,
    ChallengeDescription,
    ChallengeControls,
  },
  props: { ebirdLocId: String, settings: Object as PropType<Settings> },

  data() {
    return {
      ebirdHotspot: null as EbirdHotspot | null,
      locationSpecies: [] as EbirdSpecies[],
      challengeSpecies: [] as EbirdSpecies[],
      challengeFamilies: new Map([]) as Map<string, ChallengeFamily>,
      imageURLMaps: makeImageURLMaps([], []),
      recordings: new Map([]) as Map<string, Recording[]>, // speciesCode
      recording: null as Recording | null,
      showImage: false,
      haveLocationData: false,
      image: "",
    };
  },

  created: function () {
    this.fetchLocationSpeciesAndRecordings().then(
      () => (this.haveLocationData = true)
    );
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

    isLoading(): Boolean {
      return !this.haveLocationData;
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

    async fetchLocationSpeciesAndRecordings(): Promise<void> {
      try {
        this.locationSpecies = await fetchLocationSpecies(this.ebirdLocId);
        this.challengeSpecies = _.shuffle(
          await filterToCommonSpecies(this.locationSpecies, this.ebirdLocId)
        );
        this.challengeFamilies = makeChallengeFamilies(this.challengeSpecies);
        this.fetchAllRecordings();

        this.imageURLMaps = makeImageURLMaps(
          await fetchSpeciesImages(this.locationSpecies),
          this.locationSpecies
        );
        console.log(
          `Fetched species images: \
          familySci ${this.imageURLMaps.familySci2images.size}, \
          familyEn ${this.imageURLMaps.familyEn2images.size}, \
          genus ${this.imageURLMaps.genus2images.size}, \
          speciesSci ${this.imageURLMaps.speciesSciName2images.size}`
        );
      } catch (err) {
        console.log("Error fetching location species and recordings: ", err);
      }
    },

    async fetchAllRecordings(): Promise<void> {
      this.ebirdHotspot = await fetchEbirdHotspot(this.ebirdLocId);
      for (let sp of this.selectedChallengeSpecies) {
        const recordings = await getRecordings(sp, this.ebirdHotspot);
        this.recordings.set(sp.speciesCode, recordings);
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
          this.recording.speciesSci
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
  },
});

function makeChallengeFamilies(
  challengeSpecies: EbirdSpecies[]
): Map<string, ChallengeFamily> {
  const family2order = new Map(
    challengeSpecies.map((sp) => [sp.familyComName, sp.order])
  );

  return new Map(
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
}

function makeImageURLMaps(
  speciesImages: SpeciesImages[],
  locationSpecies: EbirdSpecies[]
): ImageURLMaps {
  var speciesSciName2images: Map<string, Set<string>> = new Map();
  var genus2images: Map<string, Set<string>> = new Map();
  var familySci2images: Map<string, Set<string>> = new Map();
  var familyEn2images: Map<string, Set<string>> = new Map();

  const species2images = new Map(
    speciesImages.map((obj) => [obj.species, obj.urls])
  );

  for (let sp of locationSpecies) {
    let genus = ebirdSpecies.getGenus(sp);
    let speciesSci = ebirdSpecies.getSpeciesSci(sp);
    let haveSeenGenus = true;
    let images = species2images.get(sp.sciName) || [];
    if (images[0]) {
      speciesSciName2images.set(speciesSci, new Set(images));

      if (!genus2images.has(genus)) {
        genus2images.set(genus, new Set());
        haveSeenGenus = false;
      }
      genus2images.get(genus)?.add(images[0]);
      if (!haveSeenGenus) {
        let familySci = ebirdSpecies.getFamilySci(sp);
        let familyEn = ebirdSpecies.getFamilyEn(sp);
        if (!familySci2images.has(familySci)) {
          familySci2images.set(familySci, new Set());
        }
        if (!familyEn2images.has(familyEn)) {
          familyEn2images.set(familyEn, new Set());
        }
        familySci2images.get(familySci)?.add(images[0]);
        familyEn2images.get(familyEn)?.add(images[0]);
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
