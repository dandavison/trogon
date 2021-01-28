export interface Guide {
  id: number;
  name: string;
  trip_guide: boolean;
  description: string | null;
  images: string[];
}

export interface Habitat {
  id: number;
  name: string;
  description: string;
  images: string[];
}

export interface Site {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
  guides: Guide[];
  habitats: Habitat[];
  images: string[];
}

export interface EbirdHotspot {
  locId: string;
  locName: string;
  countryCode: string;
  subnational1Code: string;
  lat: number;
  lng: number;
  latestObsDt: string | null;
  numSpeciesAllTime: number | null;
}

export interface EbirdSpecies {
    sciName: string,
    comName: string,
    speciesCode: string,
    category: string,
    taxonOrder: number,
    order: string,
    familyComName: string,
    familySciName: string,
}

export interface Recording {
  url: string,
  family: string,
  genus: string,
  species: string,
}

export interface SiteDay {
  id: number;
  day: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Trip {
  id: number;
  name: string;
  site_days: SiteDay[];
}

// A set of sites to be displayed in a single layer group,
// e.g. results of user search for all sites with Várzea forest.
export interface SiteGroup {
  id: number;
  sites: Site[];
  visible: boolean;
}

// A set of site highlights to be displayed in a single layer group.
export interface SiteHighlightGroup {
  id: number;
  sites: Site[];
  visible: boolean;
}

// A set of sites to be displayed in a single layer group,
// because they belong to the same trip.
export interface TripSiteGroup {
  id: number;
  sites: SiteDay[];
  visible: boolean;
}

// A set of eBird hotspots to be displayed in a single layer group,
// e.g. results of user search for all hotspots with Forest Elaenia.
export interface EbirdHotspotGroup {
  id: number;
  hotspots: EbirdHotspot[];
  visible: boolean;
}
