import _ from "lodash";
import iso3311a2 from "iso-3166-1-alpha-2";
import { EbirdHotspot, EbirdSpecies, Recording, XenoCantoRecording } from "./types";
import { ebirdSpecies } from "./ebird";

export async function fetchAllRecordings(
  sppecies: EbirdSpecies[],
  ebirdHotspots: EbirdHotspot[]
): Promise<Map<string, Recording[]>> {
  var recordings = await fetchCachedRecordings(sppecies, ebirdHotspots);
  const remainingSpeciesNames = new Set(
    _.difference(
      sppecies.map(sp => sp.sciName),
      [...recordings.keys()]
    )
  );
  const remainingSpecies = sppecies.filter(sp =>
    remainingSpeciesNames.has(sp.sciName)
  );
  const remainingRecordings = await Promise.all(
    remainingSpecies.map(sp => fetchRecordings(sp, ebirdHotspots))
  );
  for (let [sp, recs] of _.zip(remainingSpecies, remainingRecordings) as [
    EbirdSpecies,
    Recording[]
  ][]) {
    recordings.set(sp.sciName, recs);
  }
  return recordings;
}

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

async function fetchRecordings(
  species: EbirdSpecies,
  locations: EbirdHotspot[]
): Promise<Recording[]> {
  const query = makeQuery(species, locations);
  const xcRecs = await fetchXenoCantoRecordings(query);
  return xcRecs.map(x => makeRecording(x, species));
}

async function fetchCachedRecordings(
  sppecies: EbirdSpecies[],
  locations: EbirdHotspot[]
): Promise<Map<string, Recording[]>> {
  const name2EbirdSpecies = new Map(sppecies.map(sp => [sp.sciName, sp]));
  return fetchCachedXenoCantoRecording(sppecies, locations).then(
    sp2xcRecs =>
      new Map(
        [...sp2xcRecs.entries()].map(([sp, xcRecs]) => [
          sp,
          xcRecs.map(x =>
            makeRecording(x, name2EbirdSpecies.get(sp) as EbirdSpecies)
          )
        ])
      )
  );
}

async function fetchCachedXenoCantoRecording(
  sppecies: EbirdSpecies[],
  locations: EbirdHotspot[]
): Promise<Map<string, XenoCantoRecording[]>> {
  const query2species = new Map(
    sppecies.map(sp => [makeQuery(sp, locations), sp])
  );
  const url = `${
    process.env.VUE_APP_SERVER_URL
  }/proxy/xeno-canto-cached/2/recordings?queries=${encodeURIComponent(
    [...query2species.keys()].join(",")
  )}`;
  return fetch(url)
    .then(resp => resp.json() as object)
    .then(
      doc =>
        new Map(
          (_.entries(doc) as [string, string][]).map(([query, doc]) => [
            query2species.get(query)?.sciName as string,
            (JSON.parse(doc || "{}").recordings || []) as XenoCantoRecording[]
          ])
        )
    );
}

function makeRecording(
  xcRec: XenoCantoRecording,
  species: EbirdSpecies
): Recording {
  const familySci = ebirdSpecies.getFamilySci(species);
  const familyEn = ebirdSpecies.getFamilyEn(species);
  const genus = ebirdSpecies.getGenus(species);
  const speciesSci = ebirdSpecies.getSpeciesSci(species);
  const speciesEn = ebirdSpecies.getSpeciesEn(species);
  return {
    url: xcRec.file,
    familySci: familySci,
    familyEn: familyEn,
    genus: genus,
    speciesSci: speciesSci,
    speciesEn: speciesEn,
    raw: xcRec
  };
}

export function isSong(type: string): boolean {
  const words = new Set(type.toLowerCase().split(" "));
  return words.has("song") || words.has("duet");
}
