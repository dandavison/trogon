import _ from "lodash";

import { isDefaultSelectedFamily } from "./birds";
import {
  ChallengeFamily,
  TaxonMaps,
  ImageMaps,
  Species,
  SpeciesImages
} from "./types";

export async function fetchMultipleJSON(urls: string[]): Promise<Object[]> {
  const settledPromises = await Promise.allSettled(
    urls.map(url =>
      fetch(url)
        .then(resp => resp.json())
        .catch(error => console.log(`Error: fetchJSONParallel: ${error}`))
    )
  );
  return settledPromises
    .filter(result => result.status === "fulfilled")
    .map((result: any) => result.value);
}

export function transformTaxonName(value: string): string {
  return value.replace("-", " ").toLowerCase();
}

export function debug(msg: string[], force: boolean = false): void {
  var debug = false;
  if (debug || force) {
    console.log.apply(null, msg);
  }
}

export function makeChallengeFamilies(
  challengeSpecies: Species[]
): Map<string, ChallengeFamily> {
  const family2order = new Map(
    challengeSpecies.map(sp => [sp.familySci, sp.order])
  );

  return new Map(
    Object.entries(_.groupBy(challengeSpecies, sp => sp.familySci)).map(
      ([family, spp]) => [
        family,
        {
          n: spp.length,
          selected: isDefaultSelectedFamily(family, family2order)
        }
      ]
    )
  );
}

export function makeTaxonMaps(species: Species[]): TaxonMaps {
  const speciesId2SciName = new Map();
  const species2familySci = new Map();
  const species2familyEn = new Map();
  const familyEn2Sci = new Map();
  const familySci2En = new Map();
  const genus2familySci = new Map();
  const speciesSci2genus = new Map();
  const speciesSci2En = new Map();
  const speciesEn2Sci = new Map();

  for (let sp of species) {
    speciesId2SciName.set(sp.id, sp.speciesSci);
    species2familySci.set(sp.speciesSci, sp.familySci);
    species2familyEn.set(sp.speciesSci, sp.familyEn);
    familyEn2Sci.set(sp.familyEn, sp.familySci);
    familySci2En.set(sp.familySci, sp.familyEn);
    genus2familySci.set(sp.genus, sp.familySci);
    speciesSci2genus.set(sp.speciesSci, sp.genus);
    speciesSci2En.set(sp.speciesSci, sp.speciesEn);
    speciesEn2Sci.set(sp.speciesEn, sp.speciesSci);
  }

  return {
    speciesId2SciName,
    species2familySci,
    species2familyEn,
    familyEn2Sci,
    familySci2En,
    genus2familySci,
    speciesSci2genus,
    speciesSci2En,
    speciesEn2Sci
  };
}

export function makeImageMaps(
  speciesImages: SpeciesImages[],
  locationSpecies: Species[]
): ImageMaps {
  var speciesSciName2images: Map<string, SpeciesImages[]> = new Map();
  var genus2images: Map<string, SpeciesImages[]> = new Map();
  var familySci2images: Map<string, SpeciesImages[]> = new Map();
  var familyEn2images: Map<string, SpeciesImages[]> = new Map();

  const species2images = new Map(speciesImages.map(obj => [obj.species, obj]));

  for (let sp of locationSpecies) {
    let haveSeenGenus = true;
    let images = species2images.get(sp.speciesSci);
    if (images) {
      speciesSciName2images.set(sp.speciesSci, [images]);

      if (!genus2images.has(sp.genus)) {
        genus2images.set(sp.genus, []);
        haveSeenGenus = false;
      }
      genus2images.get(sp.genus)?.push(images);
      if (!haveSeenGenus) {
        if (!familySci2images.has(sp.familySci)) {
          familySci2images.set(sp.familySci, []);
        }
        if (!familyEn2images.has(sp.familyEn)) {
          familyEn2images.set(sp.familyEn, []);
        }
        familySci2images.get(sp.familySci)?.push(images);
        familyEn2images.get(sp.familyEn)?.push(images);
      }
    }
  }

  return {
    speciesSciName2images,
    genus2images,
    familySci2images,
    familyEn2images
  };
}
