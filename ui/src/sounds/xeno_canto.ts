import { EbirdSpecies, Recording, XenoCantoRecording } from "types";
import { ebirdSpecies } from "./ebird";
import { fetchJSONObjectSynchronously } from "../utils";

const XENO_CANTO_API_URL = "https://www.xeno-canto.org/api/2/recordings";

function getXenoCantoRecordings(query: string): XenoCantoRecording[] {
  const xcData = fetchJSONObjectSynchronously(
    `${XENO_CANTO_API_URL}?query=${query}`
  );
  return xcData.recordings || [];
}

export function getRecordings(species: EbirdSpecies): Recording[] {
  const family = ebirdSpecies.getFamily(species);
  const genus = ebirdSpecies.getGenus(species);
  const sp = ebirdSpecies.getSpecies(species);

  const query = `${genus}+${sp}+gen:${genus}`;
  var recordings = [];
  for (let raw of getXenoCantoRecordings(query)) {
    recordings.push({
      url: raw.file,
      family: family,
      genus: raw.gen,
      species: raw.sp,
      raw: raw
    });
  }
  return recordings;
}
