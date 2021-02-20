import { mount } from "@vue/test-utils";

import { TaxonName } from "../types";
import GameForm from "../GameForm.vue";
type GameFormInstance = InstanceType<typeof GameForm>;
import { makeTaxonMaps } from "../Game.vue";

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

describe("Clear", () => {
  test("Clear form works", () => {
    const vm: GameFormInstance = factory().vm;
    for (let name of Object.values(TaxonName)) {
      vm.answer[name] = "xxx";
    }
    vm.clear();
    for (let name of Object.values(TaxonName)) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear familySci works", () => {
    const vm: GameFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.familySciField.clear();
    for (let name of Object.values(TaxonName)) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear familyEn works", () => {
    const vm: GameFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.familyEnField.clear();
    for (let name of Object.values(TaxonName)) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear genus works", () => {
    const vm: GameFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.genusField.clear();
    for (let name of [TaxonName.FamilySci, TaxonName.FamilyEn]) {
      expect(vm.answer[name]).toEqual(ES.getName(name, incorrectFamily));
    }
    for (let name of [
      TaxonName.Genus,
      TaxonName.SpeciesSci,
      TaxonName.SpeciesEn
    ]) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear speciesSci works", () => {
    const vm: GameFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.speciesSciField.clear();
    for (let name of [
      TaxonName.FamilySci,
      TaxonName.FamilyEn,
      TaxonName.Genus
    ]) {
      expect(vm.answer[name]).toEqual(ES.getName(name, incorrectFamily));
    }
    for (let name of [TaxonName.SpeciesSci, TaxonName.SpeciesEn]) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear speciesEn works", () => {
    const vm: GameFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.speciesEnField.clear();
    for (let name of [
      TaxonName.FamilySci,
      TaxonName.FamilyEn,
      TaxonName.Genus
    ]) {
      expect(vm.answer[name]).toEqual(ES.getName(name, incorrectFamily));
    }
    for (let name of [TaxonName.SpeciesSci, TaxonName.SpeciesEn]) {
      expect(vm.answer[name]).toEqual("");
    }
  });
});

function initializeWithIncorrectSpecies(vm: GameFormInstance) {
  for (let name of Object.values(TaxonName)) {
    vm[name + "Field"].answer = ES.getName(name, incorrectFamily);
  }
  for (let name of Object.values(TaxonName)) {
    expect(vm.answer[name]).toEqual(vm[name + "Field"].answer);
  }
}

describe("GameForm autofill and isCorrect", () => {
  test("preconditions", () => {
    const vm: GameFormInstance = factory().vm;
    for (let name of Object.values(TaxonName)) {
      let fieldName = name + "Field";
      expect(vm[fieldName].answer).toEqual("");
      expect(vm[fieldName].isCorrect()).toEqual(false);
    }
  });

  test("familySci input works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.familySciField.answer = ES.getFamilySci(incorrectFamily);
    expect(vm.familySciField.isCorrect()).toEqual(false);
    expect(vm.familyEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.familySciField.answer = ES.getFamilySci(correctFamily);
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn input works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.familyEnField.answer = ES.getFamilyEn(incorrectFamily);
    expect(vm.familySciField.isCorrect()).toEqual(false);
    expect(vm.familyEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.familyEnField.answer = ES.getFamilyEn(correctFamily);
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus input works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.genusField.answer = ES.getGenus(correctFamily);
    expect(vm.familySciField.isCorrect()).toEqual(true);
    expect(vm.familyEnField.isCorrect()).toEqual(true);
    expect(vm.genusField.isCorrect()).toEqual(false);
    vm.clear();
    vm.genusField.answer = ES.getGenus(correctGenus);
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci input works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.speciesSciField.answer = ES.getSpeciesSci(correctGenus);
    expect(vm.familySciField.isCorrect()).toEqual(true);
    expect(vm.familyEnField.isCorrect()).toEqual(true);
    expect(vm.genusField.isCorrect()).toEqual(true);
    expect(vm.speciesSciField.isCorrect()).toEqual(false);
    expect(vm.speciesEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.speciesSciField.answer = ES.getSpeciesSci(correctSpecies);
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn input works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.speciesEnField.answer = ES.getSpeciesEn(correctGenus);
    expect(vm.familySciField.isCorrect()).toEqual(true);
    expect(vm.familyEnField.isCorrect()).toEqual(true);
    expect(vm.genusField.isCorrect()).toEqual(true);
    expect(vm.speciesSciField.isCorrect()).toEqual(false);
    expect(vm.speciesEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.speciesEnField.answer = ES.getSpeciesEn(correctSpecies);
    expectCorrectSpeciesEnEntered(vm);
  });
});

describe("GameForm reveal", () => {
  test("familySci reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.familySciField.reveal();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.familyEnField.reveal();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.genusField.reveal();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.speciesSciField.reveal();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn reveal works", () => {
    const vm: GameFormInstance = factory().vm;
    vm.speciesEnField.reveal();
    expectCorrectSpeciesEnEntered(vm);
  });
});

function expectCorrectFamilySciEntered(vm: GameFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true);
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
}

function expectCorrectFamilyEnEntered(vm: GameFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true);
}

function expectCorrectGenusEntered(vm: GameFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
  expect(vm.genusField.isCorrect()).toEqual(true);
}

function expectCorrectSpeciesSciEntered(vm: GameFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
  expect(vm.genusField.isCorrect()).toEqual(true); // autofill
  expect(vm.speciesSciField.isCorrect()).toEqual(true);
  expect(vm.speciesEnField.isCorrect()).toEqual(true); // autofill
}

function expectCorrectSpeciesEnEntered(vm: GameFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
  expect(vm.genusField.isCorrect()).toEqual(true); // autofill
  expect(vm.speciesSciField.isCorrect()).toEqual(true); // autofill
  expect(vm.speciesEnField.isCorrect()).toEqual(true);
}

function factory() {
  return mount(GameForm, {
    propsData: {
      locationSpecies,
      recording,
      image: "fake-image-url",
      taxonMaps: makeTaxonMaps(locationSpecies),
      imageURLMaps,
      settings: {}
    }
  });
}
