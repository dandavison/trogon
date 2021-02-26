import { mount } from "@vue/test-utils";

import { TaxonName } from "../types";
import ChallengeForm from "../components/ChallengeForm.vue";
type ChallengeFormInstance = InstanceType<typeof ChallengeForm>;
import { makeTaxonMaps } from "../components/Challenge.vue";

import {
  locationSpecies,
  imageURLMaps,
  recording,
  correctSpecies,
  correctGenus,
  correctFamily,
  incorrectFamily
} from "./fixtures";

describe("ChallengeForm fixtures", () => {
  test("fixtures are coherent", () => {
    // FamilySci
    const trueFamilySci = recording.familySci;
    expect(trueFamilySci).toEqual(correctSpecies.familySci);
    expect(trueFamilySci).toEqual(correctGenus.familySci);
    expect(trueFamilySci).toEqual(correctFamily.familySci);
    expect(trueFamilySci).not.toEqual(incorrectFamily.familySci);
    // FamilyEn
    const trueFamilyEn = recording.familyEn;
    expect(trueFamilyEn).toEqual(correctSpecies.familyEn);
    expect(trueFamilyEn).toEqual(correctGenus.familyEn);
    expect(trueFamilyEn).toEqual(correctFamily.familyEn);
    expect(trueFamilyEn).not.toEqual(incorrectFamily.familyEn);
    // Genus
    const trueGenus = recording.genus;
    expect(trueGenus).toEqual(correctSpecies.genus);
    expect(trueGenus).toEqual(correctGenus.genus);
    expect(trueGenus).not.toEqual(correctFamily.genus);
    expect(trueGenus).not.toEqual(incorrectFamily.genus);
    // speciesSci
    const trueSpeciesSci = recording.speciesSci;
    expect(trueSpeciesSci).toEqual(correctSpecies.speciesSci);
    expect(trueSpeciesSci).not.toEqual(correctGenus.speciesSci);
    expect(trueSpeciesSci).not.toEqual(correctFamily.speciesSci);
    expect(trueSpeciesSci).not.toEqual(incorrectFamily.speciesSci);
    // speciesEn
    const trueSpeciesEn = recording.speciesEn;
    expect(trueSpeciesEn).toEqual(correctSpecies.speciesEn);
    expect(trueSpeciesEn).not.toEqual(correctGenus.speciesEn);
    expect(trueSpeciesEn).not.toEqual(correctFamily.speciesEn);
    expect(trueSpeciesEn).not.toEqual(incorrectFamily.speciesEn);
  });
});

describe("Clear", () => {
  test("Clear form works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    for (let name of Object.values(TaxonName)) {
      vm.answer[name] = "xxx";
    }
    vm.clear();
    for (let name of Object.values(TaxonName)) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear familySci works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.familySciField.clear();
    for (let name of Object.values(TaxonName)) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear familyEn works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.familyEnField.clear();
    for (let name of Object.values(TaxonName)) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear genus works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.genusField.clear();
    for (let name of [TaxonName.FamilySci, TaxonName.FamilyEn]) {
      expect(vm.answer[name]).toEqual(incorrectFamily[name]);
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
    const vm: ChallengeFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.speciesSciField.clear();
    for (let name of [
      TaxonName.FamilySci,
      TaxonName.FamilyEn,
      TaxonName.Genus
    ]) {
      expect(vm.answer[name]).toEqual(incorrectFamily[name]);
    }
    for (let name of [TaxonName.SpeciesSci, TaxonName.SpeciesEn]) {
      expect(vm.answer[name]).toEqual("");
    }
  });

  test("clear speciesEn works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    initializeWithIncorrectSpecies(vm);
    vm.speciesEnField.clear();
    for (let name of [
      TaxonName.FamilySci,
      TaxonName.FamilyEn,
      TaxonName.Genus
    ]) {
      expect(vm.answer[name]).toEqual(incorrectFamily[name]);
    }
    for (let name of [TaxonName.SpeciesSci, TaxonName.SpeciesEn]) {
      expect(vm.answer[name]).toEqual("");
    }
  });
});

function initializeWithIncorrectSpecies(vm: ChallengeFormInstance) {
  for (let name of Object.values(TaxonName)) {
    (vm as any)[name + "Field"].answer = incorrectFamily[name];
  }
  for (let name of Object.values(TaxonName)) {
    expect(vm.answer[name]).toEqual((vm as any)[name + "Field"].answer);
  }
}

describe("ChallengeForm autofill and isCorrect", () => {
  test("preconditions", () => {
    const vm: ChallengeFormInstance = factory().vm;
    for (let name of Object.values(TaxonName)) {
      let fieldName = name + "Field";
      expect((vm as any)[fieldName].answer).toEqual("");
      expect((vm as any)[fieldName].isCorrect()).toEqual(false);
    }
  });

  test("familySci input works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.familySciField.answer = incorrectFamily.familySci;
    expect(vm.familySciField.isCorrect()).toEqual(false);
    expect(vm.familyEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.familySciField.answer = correctFamily.familySci;
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn input works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.familyEnField.answer = incorrectFamily.familyEn;
    expect(vm.familySciField.isCorrect()).toEqual(false);
    expect(vm.familyEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.familyEnField.answer = correctFamily.familyEn;
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus input works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.genusField.answer = correctFamily.genus;
    expect(vm.familySciField.isCorrect()).toEqual(true);
    expect(vm.familyEnField.isCorrect()).toEqual(true);
    expect(vm.genusField.isCorrect()).toEqual(false);
    vm.clear();
    vm.genusField.answer = correctGenus.genus;
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci input works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.speciesSciField.answer = correctGenus.speciesSci;
    expect(vm.familySciField.isCorrect()).toEqual(true);
    expect(vm.familyEnField.isCorrect()).toEqual(true);
    expect(vm.genusField.isCorrect()).toEqual(true);
    expect(vm.speciesSciField.isCorrect()).toEqual(false);
    expect(vm.speciesEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.speciesSciField.answer = correctSpecies.speciesSci;
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn input works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.speciesEnField.answer = correctGenus.speciesEn;
    expect(vm.familySciField.isCorrect()).toEqual(true);
    expect(vm.familyEnField.isCorrect()).toEqual(true);
    expect(vm.genusField.isCorrect()).toEqual(true);
    expect(vm.speciesSciField.isCorrect()).toEqual(false);
    expect(vm.speciesEnField.isCorrect()).toEqual(false);
    vm.clear();
    vm.speciesEnField.answer = correctSpecies.speciesEn;
    expectCorrectSpeciesEnEntered(vm);
  });
});

describe("ChallengeForm reveal", () => {
  test("familySci reveal works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.familySciField.reveal();
    expectCorrectFamilySciEntered(vm);
  });

  test("familyEn reveal works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.familyEnField.reveal();
    expectCorrectFamilyEnEntered(vm);
  });

  test("genus reveal works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.genusField.reveal();
    expectCorrectGenusEntered(vm);
  });

  test("speciesSci reveal works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.speciesSciField.reveal();
    expectCorrectSpeciesSciEntered(vm);
  });

  test("speciesEn reveal works", () => {
    const vm: ChallengeFormInstance = factory().vm;
    vm.speciesEnField.reveal();
    expectCorrectSpeciesEnEntered(vm);
  });
});

function expectCorrectFamilySciEntered(vm: ChallengeFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true);
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
}

function expectCorrectFamilyEnEntered(vm: ChallengeFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true);
}

function expectCorrectGenusEntered(vm: ChallengeFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
  expect(vm.genusField.isCorrect()).toEqual(true);
}

function expectCorrectSpeciesSciEntered(vm: ChallengeFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
  expect(vm.genusField.isCorrect()).toEqual(true); // autofill
  expect(vm.speciesSciField.isCorrect()).toEqual(true);
  expect(vm.speciesEnField.isCorrect()).toEqual(true); // autofill
}

function expectCorrectSpeciesEnEntered(vm: ChallengeFormInstance) {
  expect(vm.familySciField.isCorrect()).toEqual(true); // autofill
  expect(vm.familyEnField.isCorrect()).toEqual(true); // autofill
  expect(vm.genusField.isCorrect()).toEqual(true); // autofill
  expect(vm.speciesSciField.isCorrect()).toEqual(true); // autofill
  expect(vm.speciesEnField.isCorrect()).toEqual(true);
}

function factory() {
  return mount(ChallengeForm, {
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
