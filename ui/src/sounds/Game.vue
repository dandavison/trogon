<template>

  <section style="margin-top: 50px">
    <section>
      <h1 style="font-weight: bold">{{ ebirdHotspot.locName }}</h1>
      <ul>
        <li>{{ locationSpecies.length }} species total</li>
        <li>
          {{ selectedChallengeSpecies.length }} species in current challenge
        </li>
      </ul>
    </section>

    <nav class="level">
      <p class="level-item has-text-centered">
        <b-button @click="setNextRecording">
          {{ recording ? "Next" : "Start" }}
        </b-button>
      </p>
      <p class="level-item" v-if="settings.promptIncludesRecording && recording">
        <ul>
          <li><audio controls :src="recording.url"></audio></li>
          <li> {{ recording.raw.loc }}, {{ recording.raw.cnt }} </li>
          <li v-if="recording.raw.also.length[0]"> Also:
            <ul>
                <li v-for="sp in recording.raw.also" :key="sp">{{ sp }}</li>
            </ul>
          </li>
        </ul>
      </p>

      <p class="level-item" v-if="settings.promptIncludesImages && image">
        <img :src="image"/>
      </p>

      <p class="level-item has-text-centered">
        <b-button v-if="recording" @click="revealSpecies"> Reveal </b-button>
      </p>
    </nav>

    <section>
      <b-field
        v-if="shouldShowScientificNames"
        :label="shouldShowEnglishNames ? 'Family (scientific)' : 'Family'"
      >
        <span>
          <b-autocomplete
            type="text"
            v-model="answer.familySci"
            :data="filterFamilySci()"
            :class="{ 'is-success': isFamilySciCorrect() }"
          />
          <p v-if="answer.familySci">
            {{ isFamilySciCorrect() ? "✅" : "❌" }}
          </p>
        </span>
      </b-field>

      <b-field
        v-if="shouldShowEnglishNames"
        :label="shouldShowScientificNames ? 'Family (English)' : 'Family'"
      >
        <span>
          <b-autocomplete
            type="text"
            v-model="answer.familyEn"
            :data="filterFamilyEn()"
            :class="{ 'is-success': isFamilyEnCorrect() }"
          />
          <p v-if="answer.familyEn">
            {{ isFamilyEnCorrect() ? "✅" : "❌" }}
          </p>
        </span>
      </b-field>

      <b-field label="Genus">
        <b-autocomplete
          type="text"
          v-model="answer.genus"
          :data="filterGenus()"
          :class="{ 'is-success': isGenusCorrect() }"
        />
        <p v-if="answer.genus">{{ isGenusCorrect() ? "✅" : "❌" }}</p>
      </b-field>

      <b-field
        v-if="shouldShowScientificNames"
        :label="shouldShowEnglishNames ? 'Species (scientific)' : 'Species'"
      >
        <b-autocomplete
          type="text"
          v-model="answer.speciesSci"
          :data="filterSpeciesSci()"
          :class="{ 'is-success': isSpeciesSciCorrect() }"
        />
        <p v-if="answer.speciesSci">
          {{ isSpeciesSciCorrect() ? "✅" : "❌" }}
        </p>
      </b-field>

      <b-field
        v-if="shouldShowEnglishNames"
        :label="shouldShowScientificNames ? 'Species (English)' : 'Species'"
      >
        <b-autocomplete
          type="text"
          v-model="answer.speciesEn"
          :data="filterSpeciesEn()"
          :class="{ 'is-success': isSpeciesEnCorrect() }"
        />
        <p v-if="answer.speciesEn">
          {{ isSpeciesEnCorrect() ? "✅" : "❌" }}
        </p>
      </b-field>
    </section>

    <nav v-if="
        image && (showImage || isSpeciesEnCorrect() || isSpeciesSciCorrect())
      " class="level">

      <p class="level-item" v-if="settings.promptIncludesRecording && recording">
        <ul>
          <li> {{ recording.raw.loc }}, {{ recording.raw.cnt }} </li>
          <li> {{ recording.raw.type }} </li>
          <li v-if="recording.raw.also.length[0]"> Also:
            <ul>
                <li v-for="sp in recording.raw.also" :key="sp">{{ sp }}</li>
            </ul>
          </li>
        </ul>
      </p>

      <p class="level-item">
        <img :src="image"/>
      </p>

    </nav>

    <section
      id="family-selector"
      style="margin-top: 50px; height: 400px; overflow-y: auto"
    >
      <ul>
        <li v-for="family in challengeFamilies" :key="family.family">
          <b-checkbox v-model="family.selected"></b-checkbox
          >{{ family.family }} ({{ family.n }})
        </li>
      </ul>
    </section>
  </section>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { EbirdSpecies, Recording } from "types";
import {
  ebirdSpecies,
  filterToCommonSpecies,
  fetchEbirdHotspot,
} from "./ebird";
import { getRecordings, recordingMatchesFilters } from "./xeno-canto";
import { isDefaultSelectedFamily } from "./birds";
import { fetchJSONArraySynchronously } from "../utils";
import { Answer, NamesLanguage, Settings } from "./types";

export default Vue.extend({
  name: "Home",
  props: { ebirdLocId: String, settings: Object as PropType<Settings> },

  data() {
    const ebirdHotspot = fetchEbirdHotspot(this.ebirdLocId);

    const locationSpecies = fetchJSONArraySynchronously(
      `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${this.ebirdLocId}`
    ) as EbirdSpecies[];

    const family2order = new Map(
      locationSpecies.map((sp) => [sp.familyComName, sp.order])
    );

    const familyEn2Sci = new Map(
      locationSpecies.map((sp) => [sp.familyComName, sp.familySciName])
    );

    const familySci2En = new Map(
      locationSpecies.map((sp) => [sp.familySciName, sp.familyComName])
    );

    const speciesSci2En = new Map(
      locationSpecies.map((sp) => [sp.sciName, sp.comName])
    );

    const speciesSciName2images = new Map(
      locationSpecies.map((sp) => [sp.sciName, sp.images])
    );

    var challengeSpecies = filterToCommonSpecies(
      locationSpecies,
      this.ebirdLocId
    );

    const challengeFamilies = Object.entries(
      _.groupBy(challengeSpecies, (sp) => sp.familyComName)
    ).map(([family, spp]) => {
      return {
        family: family,
        n: spp.length,
        selected: isDefaultSelectedFamily(family, family2order),
      };
    });

    challengeSpecies = _.shuffle(challengeSpecies);

    return {
      challengeSpecies,
      challengeFamilies,
      ebirdHotspot,
      locationSpecies,
      speciesSciName2images,
      familyEn2Sci,
      familySci2En,
      speciesSci2En,
      recordings: new Map([]) as Map<string, Recording[]>, // speciesCode
      recording: null as Recording | null,
      answer: {
        familySci: "",
        familyEn: "",
        genus: "",
        speciesSci: "",
        speciesEn: "",
      } as Answer,
      showImage: false,
      image: "",
    };
  },

  created: function () {
    this.fetchAllRecordings();
  },

  watch: {
    // Autofill familyEn according to familySci
    "answer.familySci": function (newVal: string): void {
      if (!this.answer.familyEn) {
        const familyEn = this.familySci2En.get(newVal);
        if (familyEn) {
          this.answer.familyEn = familyEn;
        }
      }
    },

    // Autofill familySci according to familyEn
    "answer.familyEn": function (newVal: string): void {
      if (!this.answer.familySci) {
        const familySci = this.familyEn2Sci.get(newVal);
        if (familySci) {
          this.answer.familySci = familySci;
        }
      }
    },

    // Autofill speciesEn according to (genus, speciesSci)
    answer: {
      deep: true,
      handler(newVal: Answer): void {
        if (!this.answer.speciesEn && newVal.genus && newVal.speciesSci) {
          const speciesEn = this.speciesSci2En.get(
            `${newVal.genus} ${newVal.speciesSci}`
          );
          if (speciesEn) {
            this.answer.speciesEn = speciesEn;
          }
        }
      },
    },
  },

  computed: {
    selectedChallengeSpecies(): EbirdSpecies[] {
      const selectedFamilies = new Set(
        this.challengeFamilies
          .filter(({ selected }) => selected)
          .map((family) => family.family)
      );
      return this.challengeSpecies.filter((sp) =>
        selectedFamilies.has(sp.familyComName)
      );
    },

    challengeRecordings(): Iterator<Recording> {
      return this.makeRecordingsIterator(this.selectedChallengeSpecies);
    },

    shouldShowScientificNames(): boolean {
      return new Set([NamesLanguage.Scientific, NamesLanguage.Both]).has(
        this.settings.names
      );
    },

    shouldShowEnglishNames(): boolean {
      return new Set([NamesLanguage.English, NamesLanguage.Both]).has(
        this.settings.names
      );
    },
  },

  methods: {
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

    clearInput(): void {
      this.answer.familySci = this.answer.familyEn = this.answer.genus = this.answer.speciesSci = this.answer.speciesEn =
        "";
    },

    revealSpecies(): void {
      if (this.recording) {
        this.answer.familySci = this.recording.familySci;
        this.answer.familyEn = this.recording.familyEn;
        this.answer.genus = this.recording.genus;
        this.answer.speciesSci = this.recording.speciesSci;
        this.answer.speciesEn = this.recording.speciesEn;
        this.showImage = true;
      }
    },

    setNextRecording(): void {
      this.clearInput();
      this.showImage = false;
      const rec = this.challengeRecordings.next();
      if (!rec.done) {
        this.recording = rec.value;
        let images = this.speciesSciName2images.get(
          `${this.recording.genus} ${this.recording.speciesSci}`
        );
        this.image = images && images[0] ? images[0] : "";
      } else {
        alert("No more recordings!");
      }
    },

    filterFamilySci(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isFamilySciMatch)
            .map(ebirdSpecies.getFamilySci)
        ),
      ].sort();
    },

    filterFamilyEn(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isFamilyEnMatch)
            .map(ebirdSpecies.getFamilyEn)
        ),
      ].sort();
    },

    filterGenus(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isGenusMatch)
            .map(ebirdSpecies.getGenus)
        ),
      ].sort();
    },

    filterSpeciesSci(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isSpeciesSciMatch)
            .map(ebirdSpecies.getSpeciesSci)
        ),
      ].sort();
    },

    filterSpeciesEn(): string[] {
      return [
        ...new Set(
          this.locationSpecies
            .filter(this.isSpeciesEnMatch)
            .map(ebirdSpecies.getSpeciesEn)
        ),
      ].sort();
    },

    isFamilySciMatch(species: EbirdSpecies): boolean {
      return species.familySciName
        .toLowerCase()
        .includes(this.answer.familySci.toLowerCase());
    },

    isFamilyEnMatch(species: EbirdSpecies): boolean {
      return species.familyComName
        .toLowerCase()
        .includes(this.answer.familyEn.toLowerCase());
    },

    isFamilySciCorrect(): boolean {
      return this.recording?.familySci === this.answer.familySci;
    },

    isFamilyEnCorrect(): boolean {
      return this.recording?.familyEn === this.answer.familyEn;
    },

    isGenusMatch(species: EbirdSpecies): boolean {
      if (this.answer.familySci && !this.isFamilySciMatch(species)) {
        return false;
      }
      if (this.answer.familyEn && !this.isFamilyEnMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getGenus(species)
        .toLowerCase()
        .startsWith(this.answer.genus.toLowerCase());
    },

    isGenusCorrect(): boolean {
      return this.recording?.genus === this.answer.genus;
    },

    isSpeciesSciMatch(species: EbirdSpecies): boolean {
      if (this.answer.familySci && !this.isFamilySciMatch(species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getSpeciesSci(species)
        .toLowerCase()
        .startsWith(this.answer.speciesSci.toLowerCase());
    },

    isSpeciesEnMatch(species: EbirdSpecies): boolean {
      if (this.answer.familyEn && !this.isFamilyEnMatch(species)) {
        return false;
      }
      if (this.answer.genus && !this.isGenusMatch(species)) {
        return false;
      }
      return ebirdSpecies
        .getSpeciesEn(species)
        .toLowerCase()
        .includes(this.answer.speciesEn.toLowerCase());
    },

    isSpeciesSciCorrect(): boolean {
      return this.recording?.speciesSci === this.answer.speciesSci;
    },

    isSpeciesEnCorrect(): boolean {
      return this.recording?.speciesEn === this.answer.speciesEn;
    },
  },
});
</script>

<style scoped>
.is-success input {
  border-color: #48c774;
}
</style>
