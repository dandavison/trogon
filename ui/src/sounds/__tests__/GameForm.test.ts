import { mount } from "@vue/test-utils";

import GameForm from "../GameForm.vue";
type GameFormInstance = InstanceType<typeof GameForm>;

import GameFormField from "../GameFormField.vue";
type GameFormFieldInstance = InstanceType<typeof GameFormField>;

import { ebirdSpecies as ES } from "../ebird";
import {
  locationSpecies,
  imageURLMaps,
  recording,
  correctSpecies,
  correctGenus,
  correctFamily,
  incorrectFamily
} from "./fixtures";

describe("GameForm fixtures", () => {
  test("fixtures are coherent", () => {
    // FamilySci
    const trueFamilySci = recording.familySci;
    expect(trueFamilySci).toEqual(ES.getFamilySci(correctSpecies));
    expect(trueFamilySci).toEqual(ES.getFamilySci(correctGenus));
    expect(trueFamilySci).toEqual(ES.getFamilySci(correctFamily));
    expect(trueFamilySci).not.toEqual(ES.getFamilySci(incorrectFamily));
    // FamilyEn
    const trueFamilyEn = recording.familyEn;
    expect(trueFamilyEn).toEqual(ES.getFamilyEn(correctSpecies));
    expect(trueFamilyEn).toEqual(ES.getFamilyEn(correctGenus));
    expect(trueFamilyEn).toEqual(ES.getFamilyEn(correctFamily));
    expect(trueFamilyEn).not.toEqual(ES.getFamilyEn(incorrectFamily));
    // Genus
    const trueGenus = recording.genus;
    expect(trueGenus).toEqual(ES.getGenus(correctSpecies));
    expect(trueGenus).toEqual(ES.getGenus(correctGenus));
    expect(trueGenus).not.toEqual(ES.getGenus(correctFamily));
    expect(trueGenus).not.toEqual(ES.getGenus(incorrectFamily));
    // speciesSci
    const trueSpeciesSci = recording.speciesSci;
    expect(trueSpeciesSci).toEqual(ES.getSpeciesSci(correctSpecies));
    expect(trueSpeciesSci).not.toEqual(ES.getSpeciesSci(correctGenus));
    expect(trueSpeciesSci).not.toEqual(ES.getSpeciesSci(correctFamily));
    expect(trueSpeciesSci).not.toEqual(ES.getSpeciesSci(incorrectFamily));
    // speciesEn
    const trueSpeciesEn = recording.speciesEn;
    expect(trueSpeciesEn).toEqual(ES.getSpeciesEn(correctSpecies));
    expect(trueSpeciesEn).not.toEqual(ES.getSpeciesEn(correctGenus));
    expect(trueSpeciesEn).not.toEqual(ES.getSpeciesEn(correctFamily));
    expect(trueSpeciesEn).not.toEqual(ES.getSpeciesEn(incorrectFamily));
  });
});

describe("GameForm misc", () => {
  test("clear works", async () => {
    const vm: GameFormInstance = factory().vm;
    vm.answer.familySci = "xxx";
    vm.answer.familyEn = "xxx";
    vm.answer.genus = "xxx";
    vm.answer.speciesSci = "xxx";
    vm.answer.speciesEn = "xxx";
    vm.clear();
    expect(vm.answer.familySci).toEqual("");
    expect(vm.answer.familyEn).toEqual("");
    expect(vm.answer.genus).toEqual("");
    expect(vm.answer.speciesSci).toEqual("");
    expect(vm.answer.speciesEn).toEqual("");
  });
});

describe("GameForm autofill and isCorrect", () => {
  test("preconditions", () => {
    const vm: GameFormInstance = factory().vm;
    var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
    var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
    var genusField = vm.$refs.genusField as GameFormFieldInstance;
    var speciesSciField = vm.$refs.speciesSciField as GameFormFieldInstance;
    var speciesEnField = vm.$refs.speciesEnField as GameFormFieldInstance;
    expect(familySciField.answer).toEqual("");
    expect(familyEnField.answer).toEqual("");
    expect(genusField.answer).toEqual("");
    expect(speciesSciField.answer).toEqual("");
    expect(speciesEnField.answer).toEqual("");
    expect(vm.isFamilySciCorrect()).toEqual(false);
    expect(vm.isFamilyEnCorrect()).toEqual(false);
    expect(vm.isGenusCorrect()).toEqual(false);
    expect(vm.isSpeciesSciCorrect()).toEqual(false);
    expect(vm.isSpeciesEnCorrect()).toEqual(false);
  });

  test("familySci input works", async () => {
    const vm: GameFormInstance = factory().vm;
    var field = vm.$refs.familySciField as GameFormFieldInstance;
    field.answer = ES.getFamilySci(incorrectFamily);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(false);
    expect(vm.isFamilyEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    field.answer = ES.getFamilySci(correctFamily);
    await vm.$nextTick();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn input works", async () => {
    const vm: GameFormInstance = factory().vm;
    var field = vm.$refs.familyEnField as GameFormFieldInstance;
    field.answer = ES.getFamilyEn(incorrectFamily);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(false);
    expect(vm.isFamilyEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    field.answer = ES.getFamilyEn(correctFamily);
    await vm.$nextTick();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus input works", async () => {
    const vm: GameFormInstance = factory().vm;
    var field = vm.$refs.genusField as GameFormFieldInstance;
    field.answer = ES.getGenus(correctFamily);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(true);
    expect(vm.isFamilyEnCorrect()).toEqual(true);
    expect(vm.isGenusCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    field.answer = ES.getGenus(correctGenus);
    await vm.$nextTick();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci input works", async () => {
    const vm: GameFormInstance = factory().vm;
    var field = vm.$refs.speciesSciField as GameFormFieldInstance;
    field.answer = ES.getSpeciesSci(correctGenus);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(true);
    expect(vm.isFamilyEnCorrect()).toEqual(true);
    expect(vm.isGenusCorrect()).toEqual(true);
    expect(vm.isSpeciesSciCorrect()).toEqual(false);
    expect(vm.isSpeciesEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    field.answer = ES.getSpeciesSci(correctSpecies);
    await vm.$nextTick();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn input works", async () => {
    const vm: GameFormInstance = factory().vm;
    var field = vm.$refs.speciesEnField as GameFormFieldInstance;
    field.answer = ES.getSpeciesEn(correctGenus);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(true);
    expect(vm.isFamilyEnCorrect()).toEqual(true);
    expect(vm.isGenusCorrect()).toEqual(true);
    expect(vm.isSpeciesSciCorrect()).toEqual(false);
    expect(vm.isSpeciesEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    field.answer = ES.getSpeciesEn(correctSpecies);
    await vm.$nextTick();
    expectCorrectSpeciesEnEntered(vm);
  });
});

describe("GameForm reveal", () => {
  test("familySci reveal works", async () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.familySciField as GameFormFieldInstance;
    field.reveal();
    await vm.$nextTick();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn reveal works", async () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.familyEnField as GameFormFieldInstance;
    field.reveal();
    await vm.$nextTick();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus reveal works", async () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.genusField as GameFormFieldInstance;
    field.reveal();
    await vm.$nextTick();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci reveal works", async () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.speciesSciField as GameFormFieldInstance;
    field.reveal();
    await vm.$nextTick();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn reveal works", async () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.speciesEnField as GameFormFieldInstance;
    field.reveal();
    await vm.$nextTick();
    expectCorrectSpeciesEnEntered(vm);
  });
});

function expectCorrectFamilySciEntered(vm: GameFormInstance) {
  expect(vm.isFamilySciCorrect()).toEqual(true);
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
}

function expectCorrectFamilyEnEntered(vm: GameFormInstance) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true);
}

function expectCorrectGenusEntered(vm: GameFormInstance) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
  expect(vm.isGenusCorrect()).toEqual(true);
}

function expectCorrectSpeciesSciEntered(vm: GameFormInstance) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
  expect(vm.isGenusCorrect()).toEqual(true); // autofill
  expect(vm.isSpeciesSciCorrect()).toEqual(true);
  expect(vm.isSpeciesEnCorrect()).toEqual(true); // autofill
}

function expectCorrectSpeciesEnEntered(vm: GameFormInstance) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
  expect(vm.isGenusCorrect()).toEqual(true); // autofill
  expect(vm.isSpeciesSciCorrect()).toEqual(true); // autofill
  expect(vm.isSpeciesEnCorrect()).toEqual(true);
}

function factory() {
  return mount(GameForm, {
    propsData: {
      locationSpecies,
      recording,
      image: "fake-image-url",
      imageURLMaps,
      settings: {}
    }
  });
}
