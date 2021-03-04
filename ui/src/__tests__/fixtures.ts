import { ImageMaps, Recording, Species } from "../types";

export const locationSpecies: Species[] = [
  {
    id: "coltro1",
    speciesSci: "Trogon collaris",
    speciesSciSp: "collaris",
    speciesEn: "Collared Trogon",
    genus: "Trogon",
    familySci: "Trogonidae",
    familyEn: "Trogons",
    order: "Trogoniformes",
    class: "Aves"
  },
  {
    id: "gnbtro1",
    speciesSci: "Trogon viridis",
    speciesSciSp: "viridis",
    speciesEn: "Green-backed Trogon",
    genus: "Trogon",
    familySci: "Trogonidae",
    familyEn: "Trogons",
    order: "Trogoniformes",
    class: "Aves"
  },
  {
    id: "pavque1",
    speciesSci: "Pharomachrus pavoninus",
    speciesSciSp: "pavoninus",
    speciesEn: "Pavonine Quetzal",
    genus: "Pharomachrus",
    familySci: "Trogonidae",
    familyEn: "Trogons",
    order: "Trogoniformes",
    class: "Aves"
  },
  {
    id: "bnrcot1",
    speciesSci: "Phoenicircus nigricollis",
    speciesSciSp: "nigricollis",
    speciesEn: "Black-necked Red-Cotinga",
    genus: "Phoenicircus",
    familySci: "Cotingidae",
    familyEn: "Cotingas",
    order: "Passeriformes",
    class: "Aves"
  }
];

export const correctSpecies = locationSpecies[0] as Species;
export const correctGenus = locationSpecies[1] as Species;
export const correctFamily = locationSpecies[2] as Species;
export const incorrectFamily = locationSpecies[3] as Species;

export const recording: Recording = {
  genus: "Trogon",
  speciesSci: "Trogon collaris",
  familyEn: "Trogons",
  familySci: "Trogonidae",
  speciesEn: "Collared Trogon",
  url: "fake-url",
  audio: new Audio(),
  raw: {
    file: "fake-file",
    gen: "fake-gen",
    sp: "fake-sp",
    en: "fake-sp",
    type: "fake-type",
    loc: "fake-loc",
    cnt: "fake-cnt",
    also: []
  }
};

export const imageMaps: ImageMaps = {
  speciesSci2images: new Map(),
  genus2images: new Map(),
  familySci2images: new Map(),
  familyEn2images: new Map()
};
