export interface Settings {
  names: NamesLanguage;
  songsOnly: boolean;
  promptIncludesImages: boolean;
  promptIncludesRecording: boolean;
}

export enum NamesLanguage {
  Scientific = "scientific",
  English = "English",
  Both = "both"
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

export interface Recording {
  url: string;
  familyEn: string;
  familySci: string;
  genus: string;
  speciesEn: string;
  speciesSci: string;
  speciesCode: string;
  raw: XenoCantoRecording;
}

export interface XenoCantoRecording {
  file: string;
  gen: string;
  sp: string;
  en: string;
  type: string;
}

export interface Answer {
  familySci: string;
  familyEn: string;
  genus: string;
  speciesSci: string;
  speciesEn: string;
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

export interface LeafletLatLng {
  lat: number;
  lng: number;
}

export interface LeafletMapEvent {
  latlng: LeafletLatLng;
}