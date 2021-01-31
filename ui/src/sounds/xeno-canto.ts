import {
  EbirdHotspot,
  EbirdSpecies,
} from "types";
import {
  Recording,
  XenoCantoRecording
} from "./types";
import { ebirdSpecies } from "./ebird";
import { Settings } from "./types";

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
  location: EbirdHotspot | null,
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
  for (let xcRec of await getXenoCantoRecordings(query)) {
      recordings.push({
        url: xcRec.file,
        familySci: familySci,
        familyEn: familyEn,
        genus: genus,
        speciesSci: speciesSci,
        speciesCode: species.speciesCode,
        speciesEn: speciesEn,
        raw: xcRec,
      });
  }
  return recordings;
}

export function recordingMatchesFilters(xcRec: XenoCantoRecording, settings: Settings): boolean {
  if (settings.songsOnly && !isSong(xcRec.type)) {
    return false;
  }
  return true;
}

function isSong(type: string): boolean {
  const words = new Set(type.toLowerCase().split(" "));
  return words.has("song") || words.has("duet");
}