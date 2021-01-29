import { fetchJSONArraySynchronously } from "@/utils";
import { EbirdObservation, EbirdSpecies } from "types";

export const ebirdSpecies = {
  getGenus: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[0] || "";
  },
  getSpecies: function(species: EbirdSpecies): string {
    return species.sciName.split(" ")[1] || "";
  },
  getFamily: function(species: EbirdSpecies): string {
    return species.familyComName;
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
