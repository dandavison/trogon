import { Site, Trip, EbirdHotspot, EbirdSpecies, EbirdObservation } from "types";

export function fetchJSONObjectSynchronously(url: string, headers: object = {}) {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  for (const [key, value] of Object.entries(headers)) {
    request.setRequestHeader(key, value)
  }
  request.send(null);
  if (request.status !== 200) {
    return {};
  }
  return JSON.parse(request.responseText);
}

export function fetchJSONArraySynchronously(
  url: string, headers: object = {}
): Site[] | Trip[] | EbirdHotspot[] | EbirdSpecies[] | EbirdObservation[] {
  return fetchJSONObjectSynchronously(url, headers) || [];
}
