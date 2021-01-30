import {
  EbirdHotspot,
  EbirdSpecies,
  Recording,
  XenoCantoRecording
} from "types";
import { ebirdSpecies } from "./ebird";

const XENO_CANTO_API_URL = `${process.env.VUE_APP_SERVER_URL}/xeno-canto/`;

async function getXenoCantoRecordings(query: string): Promise<XenoCantoRecording[]> {
  const key = `xeno-canto-query:${query}`;
  if (!localStorage.getItem(key)) {
    const response = await fetch(`${XENO_CANTO_API_URL}?query=${query}`);
    localStorage.setItem(key, await response.text());
  }
  const text = localStorage.getItem(key);
  if (text) {
    return JSON.parse(text).recordings;
  } else {
    return [];
  }
}

export async function getRecordings(
  species: EbirdSpecies,
  location: EbirdHotspot | null
): Promise<Recording[]> {
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
      query = `${query}+cnt:${country}+q:A`;
    }
  }

  var recordings = [];
  for (let raw of await getXenoCantoRecordings(query)) {
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
