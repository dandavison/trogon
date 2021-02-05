import { EbirdHotspot, EbirdObservation } from "types";
import { LeafletLatLng, EbirdSpecies, SpeciesImages } from "./types";

export const ebirdSpecies = {
  getGenus: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[0] || "";
  },
  getSpeciesSci: function(species: EbirdSpecies): string {
    return species.sciName;
  },
  getSpeciesEn: function(species: EbirdSpecies): string {
    return species.comName;
  },
  getFamilyEn: function(species: EbirdSpecies): string {
    return species.familyComName;
  },
  getFamilySci: function(species: EbirdSpecies): string {
    return species.familySciName;
  }
};

export async function fetchLocationSpecies(
  locId: string
): Promise<EbirdSpecies[]> {
  var response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/product/spplist/${locId}?fmt=json`
  );
  const speciesCodes = await response.json();
  console.log(
    `Fetched ${speciesCodes.length} species codes for ebird location: ${locId}`
  );
  response = await fetch(
    `${
      process.env.VUE_APP_SERVER_URL
    }/api/ebird-species?species_codes=${speciesCodes.join(",")}`
  );
  const species = await response.json();
  console.log(
    `Fetched ${species.length} EbirdSpecies for ebird location: ${locId}`
  );
  return species;
}

export async function filterToCommonSpecies(
  locationSpecies: EbirdSpecies[],
  ebirdLocId: string
): Promise<EbirdSpecies[]> {
  const observations = await fetchRecentObservations(ebirdLocId);
  console.log(
    `Fetched ${observations.length} recent observations for ${ebirdLocId}`
  );
  if (observations.length === 0) {
    console.log(`No recent observations for ${ebirdLocId}`);
    console.log("Not filtering to common species");
    return locationSpecies;
  }
  const recentSpeciesCodes = new Set(observations.map(obs => obs.speciesCode));
  const commonSpecies = locationSpecies.filter(sp =>
    recentSpeciesCodes.has(sp.speciesCode)
  );
  console.log(
    `filterToCommonSpecies: ${locationSpecies.length} => ${commonSpecies.length} species`
  );
  return commonSpecies;
}

async function fetchRecentObservations(
  ebirdLocId: string
): Promise<EbirdObservation[]> {
  // TODO: client-side code shouldn't use EBIRD_API_TOKEN
  const response = await fetch(
    `https://api.ebird.org/v2/data/obs/${ebirdLocId}/recent/?back=30`,
    {
      headers: { "X-eBirdApiToken": process.env.VUE_APP_EBIRD_API_TOKEN || "" }
    }
  );
  return await response.json();
}

export async function fetchEbirdHotspot(
  ebirdLocId: string
): Promise<EbirdHotspot | null> {
  const response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspots/`
  );
  const ebirdHotspots: EbirdHotspot[] = await response.json();
  return ebirdHotspots.filter(h => h.locId == ebirdLocId)[0] || null;
}

export async function fetchEbirdHotspotsByLatLng(
  latlng: LeafletLatLng
): Promise<EbirdHotspot[]> {
  const response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/ref/hotspot/geo?lat=${latlng.lat}&lng=${latlng.lng}&fmt=json`
  );
  return await response.json();
}

export async function fetchSpeciesImages(
  species: EbirdSpecies[]
): Promise<SpeciesImages[]> {
  // HACK: how to correctly filter to successfully resolved promises only?
  const speciesImagesSettledPromises = await fetchSpeciesImagesParallel(
    species
  );
  return speciesImagesSettledPromises
    .filter(
      result =>
        result.status === "fulfilled" && result.value && result.value.urls
    )
    .map((result: any) => result.value); // result: PromiseFulfilledResult<SpeciesImages> ?
}

async function fetchSpeciesImagesParallel(
  species: EbirdSpecies[]
): Promise<PromiseSettledResult<SpeciesImages>[]> {
  return Promise.allSettled(
    species.map(sp =>
      fetch(
        `${process.env.VUE_APP_SERVER_URL}/api/species-image-urls?species=${sp.sciName}`
      ).then(resp => resp.json().then(data => data[0]))
    )
  );
}
