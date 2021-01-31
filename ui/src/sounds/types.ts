export enum NamesLanguage {
    Scientific = "scientific",
    English = "English",
    Both = "both",
}

export interface Settings {
    names: NamesLanguage;
    songsOnly: boolean;
    promptIncludesImages: boolean;
    promptIncludesRecording: boolean;
}
  names: NamesLanguage;
  songsOnly: boolean;
  promptIncludesImages: boolean;
  promptIncludesRecording: boolean;
}

export interface Answer {
  familySci: string;
  familyEn: string;
  genus: string;
  speciesSci: string;
  speciesEn: string;
}
