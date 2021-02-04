import { EbirdHotspot, EbirdObservation, EbirdSpecies } from "types";
import { LeafletLatLng } from "./types";

export const ebirdSpecies = {
  getGenus: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[0] || "";
  },
  getSpeciesSci: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[1] || "";
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
  const response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspot-species/${locId}`
  );
  const species = await response.json();
  console.log(`Fetched ${species.length} species for ebird location: ${locId}`);
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
  const query = `ref/hotspot/geo?lat=${latlng.lat}&lng=${latlng.lng}&fmt=json`;
  const response = await fetch(
    `${process.env.VUE_APP_SERVER_URL}/proxy/ebird/${query}`
  );
  return await response.json();
}
