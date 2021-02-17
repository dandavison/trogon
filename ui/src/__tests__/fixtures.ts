import { EbirdSpecies, ImageURLMaps, Recording } from "../types";

export const locationSpecies: EbirdSpecies[] = [
  {
    sciName: "Trogon collaris",
    comName: "Collared Trogon",
    speciesCode: "coltro1",
    category: "species",
    taxonOrder: 9003,
    order: "Trogoniformes",
    familyComName: "Trogons",
    familySciName: "Trogonidae"
  },
  {
    sciName: "Trogon viridis",
    comName: "Green-backed Trogon",
    speciesCode: "gnbtro1",
    category: "species",
    taxonOrder: 8963,
    order: "Trogoniformes",
    familyComName: "Trogons",
    familySciName: "Trogonidae"
  },
  {
    sciName: "Pharomachrus pavoninus",
    comName: "Pavonine Quetzal",
    speciesCode: "pavque1",
    category: "species",
    taxonOrder: 8926,
    order: "Trogoniformes",
    familyComName: "Trogons",
    familySciName: "Trogonidae"
  },
  {
    sciName: "Phoenicircus nigricollis",
    comName: "Black-necked Red-Cotinga",
    speciesCode: "bnrcot1",
    category: "species",
    taxonOrder: 15138,
    order: "Passeriformes",
    familyComName: "Cotingas",
    familySciName: "Cotingidae"
  }
];

export const correctSpecies = locationSpecies[0] as EbirdSpecies;
export const correctGenus = locationSpecies[1] as EbirdSpecies;
export const correctFamily = locationSpecies[2] as EbirdSpecies;
export const incorrectFamily = locationSpecies[3] as EbirdSpecies;

export const recording: Recording = {
  genus: "Trogon",
  speciesSci: "Trogon collaris",
  familyEn: "Trogons",
  familySci: "Trogonidae",
  speciesEn: "Collared Trogon",
  url: "fake-url",
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

export const imageURLMaps: ImageURLMaps = {
  speciesSciName2images: new Map(),
  genus2images: new Map(),
  familySci2images: new Map(),
  familyEn2images: new Map()
};
