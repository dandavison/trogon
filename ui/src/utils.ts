import { Site, Trip, EbirdHotspot, EbirdSpecies } from "types";

export function fetchJSONSynchronously(
  url: string
): Site[] | Trip[] | EbirdHotspot[] | EbirdSpecies[] {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  }
  return [];
}
