import iso3311a2 from "iso-3166-1-alpha-2";
import { EbirdHotspot } from "types";
import { EbirdSpecies, Recording, XenoCantoRecording } from "./types";
import { ebirdSpecies } from "./ebird";
import { Settings } from "./types";

const XENO_CANTO_API_URL = `${process.env.VUE_APP_SERVER_URL}/proxy/xeno-canto/`;

async function getXenoCantoRecordings(
  query: string
): Promise<XenoCantoRecording[]> {
  const response = await fetch(`${XENO_CANTO_API_URL}?query=${query}`);
  const text = await response.text();
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

  var query = `${genus}+${speciesSci}+gen:${genus}`;
  if (location) {
    const country = iso3311a2.getCountry(location.countryCode);
    if (country) {
      query = `${query}+cnt:"${country}"+q:A`;
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
      raw: xcRec
    });
  }
  return recordings;
}

export function recordingMatchesFilters(
  xcRec: XenoCantoRecording,
  settings: Settings
): boolean {
  if (settings.songsOnly && !isSong(xcRec.type)) {
    return false;
  }
  return true;
}

function isSong(type: string): boolean {
  const words = new Set(type.toLowerCase().split(" "));
  return words.has("song") || words.has("duet");
}
