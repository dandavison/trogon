import { EbirdSpecies, Recording, XenoCantoRecording } from "types";
import { ebirdSpecies } from "./ebird";
import { fetchJSONObjectSynchronously } from "../utils";

const XENO_CANTO_API_URL = `${process.env.VUE_APP_SERVER_URL}/xeno-canto/`;

function getXenoCantoRecordings(query: string): XenoCantoRecording[] {
  const xcData = fetchJSONObjectSynchronously(
    `${XENO_CANTO_API_URL}?query=${query}`
  );
  return xcData.recordings || [];
}

export function getRecordings(species: EbirdSpecies): Recording[] {
  const familySci = ebirdSpecies.getFamilySci(species);
  const familyEn = ebirdSpecies.getFamilyEn(species);
  const genus = ebirdSpecies.getGenus(species);
  const speciesSci = ebirdSpecies.getSpeciesSci(species);

  const query = `${genus}+${speciesSci}+gen:${genus}`;
  var recordings = [];
  for (let raw of getXenoCantoRecordings(query)) {
    recordings.push({
      url: raw.file,
      familySci: familySci,
      familyEn: familyEn,
      genus: raw.gen,
      speciesSci: raw.sp,
      speciesEn: raw.en,
      raw: raw
    });
  }
  return recordings;
}
