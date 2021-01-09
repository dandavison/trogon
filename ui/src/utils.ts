import { Site, Trip, EbirdHotspot } from "types";

export function fetchJSONSynchronously(
  url: string
): Site[] | Trip[] | EbirdHotspot[] {
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);
  if (request.status === 200) {
    return JSON.parse(request.responseText);
  }
  return [];
}
