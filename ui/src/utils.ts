import { Site, Trip, EbirdHotspot, EbirdSpecies } from "types";

export function fetchJSONObjectSynchronously(url: string) {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  }
  return {};
}

export function fetchJSONArraySynchronously(
  url: string
): Site[] | Trip[] | EbirdHotspot[] | EbirdSpecies[] {
  return fetchJSONObjectSynchronously(url) || [];
}
