import { mount } from "@vue/test-utils";

import GameForm from "../GameForm.vue";
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
    const vm: GameForm = factory().vm;
    vm.answer.familySci = "xxx";
    vm.answer.familyEn = "xxx";
    vm.answer.genus = "xxx";
    vm.answer.speciesSci = "xxx";
    vm.answer.speciesEn = "xxx";
    vm.clear();
    await vm.$nextTick();
    expect(vm.answer.familySci).toEqual("");
    expect(vm.answer.familyEn).toEqual("");
    expect(vm.answer.genus).toEqual("");
    expect(vm.answer.speciesSci).toEqual("");
    expect(vm.answer.speciesEn).toEqual("");
  });
});

describe("GameForm autofill and isCorrect", () => {
  test("preconditions", () => {
    const vm: GameForm = factory().vm;
    expect(vm.$refs.familySciField.answer).toEqual("");
    expect(vm.$refs.familyEnField.answer).toEqual("");
    expect(vm.$refs.genusField.answer).toEqual("");
    expect(vm.$refs.speciesSciField.answer).toEqual("");
    expect(vm.$refs.speciesEnField.answer).toEqual("");
    expect(vm.isFamilySciCorrect()).toEqual(false);
    expect(vm.isFamilyEnCorrect()).toEqual(false);
    expect(vm.isGenusCorrect()).toEqual(false);
    expect(vm.isSpeciesSciCorrect()).toEqual(false);
    expect(vm.isSpeciesEnCorrect()).toEqual(false);
  });

  test("familySci input works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.familySciField.answer = ES.getFamilySci(incorrectFamily);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(false);
    expect(vm.isFamilyEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    vm.$refs.familySciField.answer = ES.getFamilySci(correctFamily);
    await vm.$nextTick();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn input works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.familyEnField.answer = ES.getFamilyEn(incorrectFamily);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(false);
    expect(vm.isFamilyEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    vm.$refs.familyEnField.answer = ES.getFamilyEn(correctFamily);
    await vm.$nextTick();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus input works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.genusField.answer = ES.getGenus(correctFamily);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(true);
    expect(vm.isFamilyEnCorrect()).toEqual(true);
    expect(vm.isGenusCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    vm.$refs.genusField.answer = ES.getGenus(correctGenus);
    await vm.$nextTick();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci input works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.speciesSciField.answer = ES.getSpeciesSci(correctGenus);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(true);
    expect(vm.isFamilyEnCorrect()).toEqual(true);
    expect(vm.isGenusCorrect()).toEqual(true);
    expect(vm.isSpeciesSciCorrect()).toEqual(false);
    expect(vm.isSpeciesEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    vm.$refs.speciesSciField.answer = ES.getSpeciesSci(correctSpecies);
    await vm.$nextTick();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn input works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.speciesEnField.answer = ES.getSpeciesEn(correctGenus);
    await vm.$nextTick();
    expect(vm.isFamilySciCorrect()).toEqual(true);
    expect(vm.isFamilyEnCorrect()).toEqual(true);
    expect(vm.isGenusCorrect()).toEqual(true);
    expect(vm.isSpeciesSciCorrect()).toEqual(false);
    expect(vm.isSpeciesEnCorrect()).toEqual(false);
    vm.clear();
    await vm.$nextTick();
    vm.$refs.speciesEnField.answer = ES.getSpeciesEn(correctSpecies);
    await vm.$nextTick();
    expectCorrectSpeciesEnEntered(vm);
  });
});

describe("GameForm reveal", () => {
  test("familySci reveal works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.familySciField.reveal();
    await vm.$nextTick();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn reveal works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.familyEnField.reveal();
    await vm.$nextTick();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus reveal works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.genusField.reveal();
    await vm.$nextTick();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci reveal works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.speciesSciField.reveal();
    await vm.$nextTick();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn reveal works", async () => {
    const vm: GameForm = factory().vm;
    vm.$refs.speciesEnField.reveal();
    await vm.$nextTick();
    expectCorrectSpeciesEnEntered(vm);
  });
});

function expectCorrectFamilySciEntered(vm: GameForm) {
  expect(vm.isFamilySciCorrect()).toEqual(true);
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
}

function expectCorrectFamilyEnEntered(vm: GameForm) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true);
}

function expectCorrectGenusEntered(vm: GameForm) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
  expect(vm.isGenusCorrect()).toEqual(true);
}

function expectCorrectSpeciesSciEntered(vm: GameForm) {
  expect(vm.isFamilySciCorrect()).toEqual(true); // autofill
  expect(vm.isFamilyEnCorrect()).toEqual(true); // autofill
  expect(vm.isGenusCorrect()).toEqual(true); // autofill
  expect(vm.isSpeciesSciCorrect()).toEqual(true);
  expect(vm.isSpeciesEnCorrect()).toEqual(true); // autofill
}

function expectCorrectSpeciesEnEntered(vm: GameForm) {
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
