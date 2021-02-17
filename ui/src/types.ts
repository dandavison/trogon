import { LatLngLiteral } from "leaflet";

export interface Settings {
  names: NamesLanguage;
  commonSpeciesOnly: boolean;
  songsOnly: boolean;
  promptIncludesImages: boolean;
  promptIncludesRecording: boolean;
  useFieldModals: boolean;
  disableNetworkRequests: boolean;
}

export enum NamesLanguage {
  Scientific = "scientific",
  English = "English",
  Both = "both"
}

export interface LocationRequest {
  ebirdLocId?: string;
  latlng?: LatLngLiteral;
}

export interface EbirdSpecies {
  sciName: string;
  comName: string;
  speciesCode: string;
  category: string;
  taxonOrder: number;
  order: string;
  familyComName: string;
  familySciName: string;
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

export interface EbirdObservation {
  sciName: string;
  comName: string;
  speciesCode: string;
  locId: string;
  locName: string;
}

export interface Recording {
  url: string;
  familyEn: string;
  familySci: string;
  genus: string;
  speciesEn: string;
  speciesSci: string;
  raw: XenoCantoRecording;
  [index: string]: string | XenoCantoRecording;
}

export interface XenoCantoRecording {
  file: string;
  gen: string;
  sp: string;
  en: string;
  type: string;
  loc: string;
  cnt: string;
  also: string[];
}

export interface Answer {
  familySci: string;
  familyEn: string;
  genus: string;
  speciesSci: string;
  speciesEn: string;
  [index: string]: string;
}

export interface SpeciesImages {
  species: string;
  urls: string[];
}

export interface TaxonMaps {
  speciesCode2SciName: Map<string, string>;
  species2familySci: Map<string, string>;
  species2familyEn: Map<string, string>;
  familyEn2Sci: Map<string, string>;
  familySci2En: Map<string, string>;
  genus2familySci: Map<string, string>;
  speciesSci2genus: Map<string, string>;
  speciesSci2En: Map<string, string>;
  speciesEn2Sci: Map<string, string>;
}

export interface ImageURLMaps {
  speciesSciName2images: Map<string, Set<string>>;
  genus2images: Map<string, Set<string>>;
  familySci2images: Map<string, Set<string>>;
  familyEn2images: Map<string, Set<string>>;
}

export interface ChallengeFamily {
  n: number;
  selected: boolean;
}

export interface LeafletMapEvent {
  latlng: LatLngLiteral;
}
