import {
  EbirdHotspot,
  EbirdSpecies,
  Recording,
  XenoCantoRecording
} from "types";
import { ebirdSpecies } from "./ebird";
import { fetchJSONObjectSynchronously } from "../utils";

const XENO_CANTO_API_URL = `${process.env.VUE_APP_SERVER_URL}/xeno-canto/`;

function getXenoCantoRecordings(query: string): XenoCantoRecording[] {
  const xcData = fetchJSONObjectSynchronously(
    `${XENO_CANTO_API_URL}?query=${query}+q:A`
  );
  return xcData.recordings || [];
}

export function getRecordings(
  species: EbirdSpecies,
  location: EbirdHotspot | null
): Recording[] {
  const familySci = ebirdSpecies.getFamilySci(species);
  const familyEn = ebirdSpecies.getFamilyEn(species);
  const genus = ebirdSpecies.getGenus(species);
  const speciesSci = ebirdSpecies.getSpeciesSci(species);
  const speciesEn = ebirdSpecies.getSpeciesEn(species);
  const ebirdCountryCode2country = new Map([["CO", "Colombia"]]);

  var query = `${genus}+${speciesSci}+gen:${genus}`;
  if (location) {
    const country = ebirdCountryCode2country.get(location.countryCode);
    if (country) {
      query = `${query}+cnt:${country}`;
    }
  }

  var recordings = [];
  for (let raw of getXenoCantoRecordings(query)) {
    if (raw.type === "song") {
      recordings.push({
        url: raw.file,
        familySci: familySci,
        familyEn: familyEn,
        genus: genus,
        speciesSci: speciesSci,
        speciesEn: speciesEn,
        raw: raw
      });
    }
  }
  return recordings;
}
