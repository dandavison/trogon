<template>
  <form type="box">
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
  </form>
</template>

<script lang="ts">
import _ from "lodash";
import Vue, { PropType } from "vue";
import { EbirdSpecies } from "types";
import { ebirdSpecies } from "./ebird";
import { Answer, NamesLanguage, Recording, Settings } from "./types";

export default Vue.extend({
  props: {
    locationSpecies: Array as PropType<EbirdSpecies[]>,
    recording: Object as PropType<Recording | null>,
    settings: Object as PropType<Settings>,
  },
  data() {
    const familyEn2Sci = new Map(
      this.locationSpecies.map((sp) => [sp.familyComName, sp.familySciName])
    );

    const familySci2En = new Map(
      this.locationSpecies.map((sp) => [sp.familySciName, sp.familyComName])
    );

    const speciesSci2En = new Map(
      this.locationSpecies.map((sp) => [sp.sciName, sp.comName])
    );

    return {
      answer: {
        familySci: "",
        familyEn: "",
        genus: "",
        speciesSci: "",
        speciesEn: "",
      } as Answer,
      familyEn2Sci,
      familySci2En,
      speciesSci2En,
    };
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
