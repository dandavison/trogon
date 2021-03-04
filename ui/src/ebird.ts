import _ from "lodash";
import { LatLngLiteral } from "leaflet";

import { fetchMultipleJSON } from "./utils";
import {
  EbirdHotspot,
  EbirdObservation,
  Species,
  SpeciesImages
} from "./types";

export interface EbirdSpecies {
  sciName: string;
  comName: string;
  speciesCode: string;
  category: string;
  taxonOrder: number;
  order: string;
  familyComName: string;
  familySciName: string;
}

const ES = {
  getGenus: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[0] || "";
  },
  getSpeciesSciSp: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[1] || "";
  },
  getSpeciesSci: function(species: EbirdSpecies): string {
    return species.sciName;
  },
  getSpeciesEn: function(species: EbirdSpecies): string {
    return species.comName;
  },
  getFamilyEn: function(species: EbirdSpecies): string {
    return (
      taxonomy.genus2familyEn.get(ES.getGenus(species)) ||
      taxonomy.familyEn2familyEn.get(species.familyComName) ||
      species.familyComName
    );
  },
  getFamilySci: function(species: EbirdSpecies): string {
    return (
      taxonomy.genus2familySci.get(ES.getGenus(species)) ||
      species.familySciName
    );
  }
};

const taxonomy = {
  familyEn2familyEn: new Map([["Ovenbirds and Woodcreepers", "Ovenbirds"]]),
  genus2familyEn: new Map([
    ["Certhiasomus", "Woodcreepers"],
    ["Sittasomus", "Woodcreepers"],
    ["Deconychura", "Woodcreepers"],
    ["Dendrocincla", "Woodcreepers"],
    ["Glyphorynchus", "Woodcreepers"],
    ["Dendrexetastes", "Woodcreepers"],
    ["Nasica", "Woodcreepers"],
    ["Dendrocolaptes", "Woodcreepers"],
    ["Hylexetastes", "Woodcreepers"],
    ["Xiphocolaptes", "Woodcreepers"],
    ["Xiphorhynchus", "Woodcreepers"],
    ["Dendroplex", "Woodcreepers"],
    ["Drymornis", "Woodcreepers"],
    ["Lepidocolaptes", "Woodcreepers"]
  ]),
  genus2familySci: new Map([
    ["Certhiasomus", "Dendrocolaptinae"],
    ["Sittasomus", "Dendrocolaptinae"],
    ["Deconychura", "Dendrocolaptinae"],
    ["Dendrocincla", "Dendrocolaptinae"],
    ["Glyphorynchus", "Dendrocolaptinae"],
    ["Dendrexetastes", "Dendrocolaptinae"],
    ["Nasica", "Dendrocolaptinae"],
    ["Dendrocolaptes", "Dendrocolaptinae"],
    ["Hylexetastes", "Dendrocolaptinae"],
    ["Xiphocolaptes", "Dendrocolaptinae"],
    ["Xiphorhynchus", "Dendrocolaptinae"],
    ["Dendroplex", "Dendrocolaptinae"],
    ["Drymornis", "Dendrocolaptinae"],
    ["Lepidocolaptes", "Dendrocolaptinae"]
  ])
};

function ebirdSpecies2Species(sp: EbirdSpecies): Species {
  return {
    id: sp.speciesCode,
    speciesSci: ES.getSpeciesSci(sp),
    speciesSciSp: ES.getSpeciesSciSp(sp),
    speciesEn: ES.getSpeciesEn(sp),
    genus: ES.getGenus(sp),
    familyEn: ES.getFamilyEn(sp),
    familySci: ES.getFamilySci(sp),
    order: sp.order,
    class: "Aves"
  };
}

export async function fetchLocationSpecies(
  locIds: string[]
): Promise<Species[]> {
  /// Fetch species lists for each location in parallel
  var speciesCodes = await fetchMultipleJSON(
    locIds.map(
      locId =>
        `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/v2/product/spplist/${locId}?fmt=json`
    )
  );
  speciesCodes = _.union(speciesCodes);
  console.log(
    `Fetched ${speciesCodes.length} species codes for locations: ${locIds.join(
      ","
    )}`
  );
  const species = await fetch(
    `${
      process.env.VUE_APP_SERVER_URL
    }/api/ebird-species?species_codes=${speciesCodes.join(",")}`
  ).then(resp => resp.json());
  console.log(
    `Fetched ${species.length} species for ebird locations: ${locIds.join(",")}`
  );
  return species.map(ebirdSpecies2Species);
}

export async function fetchRecentObservations(
  locIds: string[]
): Promise<EbirdObservation[]> {
  var observations = (await fetchMultipleJSON(
    locIds.map(
      locId =>
        `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/v2/data/obs/${locId}/recent/?back=30&fmt=json`
    )
  )) as EbirdObservation[];
  return _.union(_.flatten(observations));
}

export async function fetchEbirdHotspots(
  locIds: string[]
): Promise<EbirdHotspot[]> {
  return (await fetchMultipleJSON(
    locIds.map(
      locId =>
        `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/v2/ref/hotspot/info/${locId}?fmt=json`
    )
  )) as EbirdHotspot[];
}

export async function fetchEbirdHotspotsByLatLng(
  latlng: LatLngLiteral
): Promise<EbirdHotspot[]> {
  const response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/v2/ref/hotspot/geo?lat=${latlng.lat}&lng=${latlng.lng}&fmt=json`
  );
  return await response.json();
}

export async function fetchSpeciesImages(
  species: Species[]
): Promise<SpeciesImages[]> {
  const speciesString = species.map(sp => sp.speciesSci).join(",");
  const cachedSpeciesImages: SpeciesImages[] = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/api/species-image-urls?species=${speciesString}&cached_only=true`
  ).then(resp => resp.json());
  const remainingSpeciesNames = _.difference(
    species.map(sp => sp.speciesSci),
    cachedSpeciesImages.map(si => si.species)
  );
  console.log(
    `Got ${cachedSpeciesImages.length} cached species images; \
    fetching remaining ${remainingSpeciesNames.length}`
  );
  // HACK: how to correctly filter to successfully resolved promises only?
  const remainingSpeciesImages = (
    await fetchSpeciesImagesParallel(remainingSpeciesNames)
  )
    .filter(
      result =>
        result.status === "fulfilled" && result.value && result.value.urls
    )
    .map((result: any) => result.value); // result: PromiseFulfilledResult<SpeciesImages> ?

  return _.concat(cachedSpeciesImages, remainingSpeciesImages);
}

async function fetchSpeciesImagesParallel(
  species: string[]
): Promise<PromiseSettledResult<SpeciesImages>[]> {
  return Promise.allSettled(
    species.map(sp =>
      fetch(
        `${process.env.VUE_APP_SERVER_URL}/api/species-image-urls?species=${sp}&cached_only=false`
      )
        .then(resp => resp.json())
        .then(data => data[0])
        .catch(error =>
          console.log(`Error: fetchSpeciesImagesParallel: ${error}`)
        )
    )
  );
}
