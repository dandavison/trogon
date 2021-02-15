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
  test("clear works", () => {
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
    expect(familySciField.isCorrect()).toEqual(false);
    expect(familyEnField.isCorrect()).toEqual(false);
    expect(genusField.isCorrect()).toEqual(false);
    expect(speciesSciField.isCorrect()).toEqual(false);
    expect(speciesEnField.isCorrect()).toEqual(false);
  });

  test("familySci input works", () => {
    const vm: GameFormInstance = factory().vm;
    var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
    var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
    familySciField.answer = ES.getFamilySci(incorrectFamily);
    expect(familySciField.isCorrect()).toEqual(false);
    expect(familyEnField.isCorrect()).toEqual(false);
    vm.clear();
    familySciField.answer = ES.getFamilySci(correctFamily);
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn input works", () => {
    const vm: GameFormInstance = factory().vm;
    var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
    var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
    familyEnField.answer = ES.getFamilyEn(incorrectFamily);
    expect(familySciField.isCorrect()).toEqual(false);
    expect(familyEnField.isCorrect()).toEqual(false);
    vm.clear();
    familyEnField.answer = ES.getFamilyEn(correctFamily);
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus input works", () => {
    const vm: GameFormInstance = factory().vm;
    var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
    var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
    var genusField = vm.$refs.genusField as GameFormFieldInstance;
    genusField.answer = ES.getGenus(correctFamily);
    expect(familySciField.isCorrect()).toEqual(true);
    expect(familyEnField.isCorrect()).toEqual(true);
    expect(genusField.isCorrect()).toEqual(false);
    vm.clear();
    genusField.answer = ES.getGenus(correctGenus);
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci input works", () => {
    const vm: GameFormInstance = factory().vm;
    var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
    var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
    var genusField = vm.$refs.genusField as GameFormFieldInstance;
    var speciesSciField = vm.$refs.speciesSciField as GameFormFieldInstance;
    var speciesEnField = vm.$refs.speciesEnField as GameFormFieldInstance;
    speciesSciField.answer = ES.getSpeciesSci(correctGenus);
    expect(familySciField.isCorrect()).toEqual(true);
    expect(familyEnField.isCorrect()).toEqual(true);
    expect(genusField.isCorrect()).toEqual(true);
    expect(speciesSciField.isCorrect()).toEqual(false);
    expect(speciesEnField.isCorrect()).toEqual(false);
    vm.clear();
    speciesSciField.answer = ES.getSpeciesSci(correctSpecies);
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn input works", () => {
    const vm: GameFormInstance = factory().vm;
    var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
    var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
    var genusField = vm.$refs.genusField as GameFormFieldInstance;
    var speciesSciField = vm.$refs.speciesSciField as GameFormFieldInstance;
    var speciesEnField = vm.$refs.speciesEnField as GameFormFieldInstance;
    speciesEnField.answer = ES.getSpeciesEn(correctGenus);
    expect(familySciField.isCorrect()).toEqual(true);
    expect(familyEnField.isCorrect()).toEqual(true);
    expect(genusField.isCorrect()).toEqual(true);
    expect(speciesSciField.isCorrect()).toEqual(false);
    expect(speciesEnField.isCorrect()).toEqual(false);
    vm.clear();
    speciesEnField.answer = ES.getSpeciesEn(correctSpecies);
    expectCorrectSpeciesEnEntered(vm);
  });
});

describe("GameForm reveal", () => {
  test("familySci reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.familySciField as GameFormFieldInstance;
    field.reveal();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.familyEnField as GameFormFieldInstance;
    field.reveal();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.genusField as GameFormFieldInstance;
    field.reveal();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.speciesSciField as GameFormFieldInstance;
    field.reveal();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    const field = vm.$refs.speciesEnField as GameFormFieldInstance;
    field.reveal();
    expectCorrectSpeciesEnEntered(vm);
  });
});

function expectCorrectFamilySciEntered(vm: GameFormInstance) {
  var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
  var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
  expect(familySciField.isCorrect()).toEqual(true);
  expect(familyEnField.isCorrect()).toEqual(true); // autofill
}

function expectCorrectFamilyEnEntered(vm: GameFormInstance) {
  var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
  var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
  expect(familySciField.isCorrect()).toEqual(true); // autofill
  expect(familyEnField.isCorrect()).toEqual(true);
}

function expectCorrectGenusEntered(vm: GameFormInstance) {
  var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
  var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
  var genusField = vm.$refs.genusField as GameFormFieldInstance;
  expect(familySciField.isCorrect()).toEqual(true); // autofill
  expect(familyEnField.isCorrect()).toEqual(true); // autofill
  expect(genusField.isCorrect()).toEqual(true);
}

function expectCorrectSpeciesSciEntered(vm: GameFormInstance) {
  var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
  var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
  var genusField = vm.$refs.genusField as GameFormFieldInstance;
  var speciesSciField = vm.$refs.speciesSciField as GameFormFieldInstance;
  var speciesEnField = vm.$refs.speciesEnField as GameFormFieldInstance;
  expect(familySciField.isCorrect()).toEqual(true); // autofill
  expect(familyEnField.isCorrect()).toEqual(true); // autofill
  expect(genusField.isCorrect()).toEqual(true); // autofill
  expect(speciesSciField.isCorrect()).toEqual(true);
  expect(speciesEnField.isCorrect()).toEqual(true); // autofill
}

function expectCorrectSpeciesEnEntered(vm: GameFormInstance) {
  var familySciField = vm.$refs.familySciField as GameFormFieldInstance;
  var familyEnField = vm.$refs.familyEnField as GameFormFieldInstance;
  var genusField = vm.$refs.genusField as GameFormFieldInstance;
  var speciesSciField = vm.$refs.speciesSciField as GameFormFieldInstance;
  var speciesEnField = vm.$refs.speciesEnField as GameFormFieldInstance;
  expect(familySciField.isCorrect()).toEqual(true); // autofill
  expect(familyEnField.isCorrect()).toEqual(true); // autofill
  expect(genusField.isCorrect()).toEqual(true); // autofill
  expect(speciesSciField.isCorrect()).toEqual(true); // autofill
  expect(speciesEnField.isCorrect()).toEqual(true);
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
