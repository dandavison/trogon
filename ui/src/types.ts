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

export enum TaxonField {
  FamilySci = "familySci",
  FamilyEn = "familyEn",
  Genus = "genus",
  SpeciesSci = "speciesSci",
  SpeciesEn = "speciesEn"
}

export interface LocationRequest {
  ebirdLocId?: string;
  latlng?: LatLngLiteral;
}

export interface Species {
  id: string;
  speciesSci: string; // 'Trogon collaris'
  speciesSciSp: string; // 'collaris'
  speciesEn: string;
  genus: string;
  familyEn: string;
  familySci: string;
  order: string;
  [index: string]: string | string[] | Recording[];
}

export interface FieldGuideSpecies extends Species {
  images: string[];
  recordings: Recording[];
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
  audio: HTMLAudioElement;
  familyEn: string;
  familySci: string;
  genus: string;
  speciesEn: string;
  speciesSci: string;
  raw: XenoCantoRecording;
  [index: string]: string | XenoCantoRecording | HTMLAudioElement | null;
}

export enum HTMLMediaElementReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4
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
  speciesId2SciName: Map<string, string>;
  species2familySci: Map<string, string>;
  species2familyEn: Map<string, string>;
  familyEn2Sci: Map<string, string>;
  familySci2En: Map<string, string>;
  genus2familySci: Map<string, string>;
  speciesSci2genus: Map<string, string>;
  speciesSci2En: Map<string, string>;
  speciesEn2Sci: Map<string, string>;
}

export interface ImageMaps {
  speciesSci2images: Map<string, SpeciesImages[]>;
  genus2images: Map<string, SpeciesImages[]>;
  familySci2images: Map<string, SpeciesImages[]>;
  familyEn2images: Map<string, SpeciesImages[]>;
}

export interface ChallengeFamily {
  n: number;
  selected: boolean;
}

export interface LeafletMapEvent {
  latlng: LatLngLiteral;
}

export enum ChallengeState {
  Init,
  HaveLocationData,
  StartedChallenge,
  HaveRecording
}
