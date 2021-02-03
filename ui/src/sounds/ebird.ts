import { fetchJSONArraySynchronously } from "@/utils";
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

export function filterToCommonSpecies(
  locationSpecies: EbirdSpecies[],
  ebirdLocId: string
): EbirdSpecies[] {
  const recentSpeciesCodes = new Set(
    fetchRecentObservations(ebirdLocId).map(obs => obs.speciesCode)
  );
  return locationSpecies.filter(sp => recentSpeciesCodes.has(sp.speciesCode));
}

function fetchRecentObservations(ebirdLocId: string): EbirdObservation[] {
  return fetchJSONArraySynchronously(
    `https://api.ebird.org/v2/data/obs/${ebirdLocId}/recent/?back=30`,
    { "X-eBirdApiToken": process.env.VUE_APP_EBIRD_API_TOKEN }
  ) as EbirdObservation[];
}

export function fetchEbirdHotspot(ebirdLocId: string): EbirdHotspot | null {
  const ebirdHotspots = fetchJSONArraySynchronously(
    `${process.env.VUE_APP_SERVER_URL}/api/ebird-hotspots/`
  ) as EbirdHotspot[];
  return ebirdHotspots.filter(h => h.locId == ebirdLocId)[0] || null;
}

export async function fetchEbirdHotspotsByLatLng(latlng: LeafletLatLng): Promise<EbirdHotspot[]> {
  const query = `ref/hotspot/geo?lat=${latlng.lat}&lng=${latlng.lng}&fmt=json`;
  const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/proxy/ebird/${query}`);
  return await response.json();
}