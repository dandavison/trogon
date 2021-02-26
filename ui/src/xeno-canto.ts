import _ from "lodash";
import iso3311a2 from "iso-3166-1-alpha-2";
import { EbirdHotspot, Recording, Species, XenoCantoRecording } from "./types";

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

function makeQuery(species: Species, locations: EbirdHotspot[]): string {
  var query = `${species.speciesSci}+gen:${species.genus}`;
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
  species: Species,
  locations: EbirdHotspot[]
): Promise<Recording[]> {
  const query = makeQuery(species, locations);
  const xcRecs = await fetchXenoCantoRecordings(query);
  return xcRecs.map(x => makeRecording(x, species));
}

function makeRecording(
  xcRecording: XenoCantoRecording,
  species: Species
): Recording {
  return {
    url: formatAudioDataURL(xcRecording),
    audio: new Audio(),
    familySci: species.familySci,
    familyEn: species.familyEn,
    genus: species.genus,
    speciesSci: species.speciesSci,
    speciesEn: species.speciesEn,
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
