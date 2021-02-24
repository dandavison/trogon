import _ from "lodash";
import iso3311a2 from "iso-3166-1-alpha-2";
import {
  EbirdHotspot,
  EbirdSpecies,
  Recording,
  XenoCantoRecording
} from "./types";
import { ebirdSpecies } from "./ebird";

async function fetchXenoCantoRecordings(
  query: string
): Promise<XenoCantoRecording[]> {
  const response = await fetch(
    `${
      process.env.VUE_APP_SERVER_URL
    }/proxy/xeno-canto/2/recordings?query=${encodeURIComponent(query)}`
  );
  const text = await response.text();
  if (text) {
    return JSON.parse(text).recordings;
  } else {
    return [];
  }
}

function makeQuery(species: EbirdSpecies, locations: EbirdHotspot[]): string {
  const genus = ebirdSpecies.getGenus(species);
  const speciesSci = ebirdSpecies.getSpeciesSci(species);

  var query = `${speciesSci}+gen:${genus}`;
  const countryCodes = new Set(locations.map(loc => loc.countryCode));
  if (countryCodes.size === 1) {
    const [countryCode] = countryCodes;
    const country = iso3311a2.getCountry(countryCode);
    if (country) {
      query = `${query}+cnt:"${country}"+q:A`;
    }
  }
  return query;
}

export async function fetchRecordings(
  species: EbirdSpecies,
  locations: EbirdHotspot[]
): Promise<Recording[]> {
  const query = makeQuery(species, locations);
  const xcRecs = await fetchXenoCantoRecordings(query);
  return xcRecs.map(x => makeRecording(x, species));
}

function makeRecording(
  xcRecording: XenoCantoRecording,
  species: EbirdSpecies
): Recording {
  const familySci = ebirdSpecies.getFamilySci(species);
  const familyEn = ebirdSpecies.getFamilyEn(species);
  const genus = ebirdSpecies.getGenus(species);
  const speciesSci = ebirdSpecies.getSpeciesSci(species);
  const speciesEn = ebirdSpecies.getSpeciesEn(species);
  return {
    url: formatAudioDataURL(xcRecording),
    audio: new Audio(),
    familySci,
    familyEn,
    genus,
    speciesSci,
    speciesEn,
    raw: xcRecording
  };
}

function formatAudioDataURL(xcRecording: XenoCantoRecording): string {
  if (xcRecording.file.startsWith("//")) {
    return `https:${xcRecording.file}`;
  } else {
    return xcRecording.file;
  }
}

export function isSong(type: string): boolean {
  const words = new Set(type.toLowerCase().split(" "));
  return words.has("song") || words.has("duet");
}
