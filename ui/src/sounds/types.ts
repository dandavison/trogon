export enum NamesLanguage {
    Scientific = "scientific",
    English = "English",
    Both = "both",
}

export interface Settings {
  names: NamesLanguage,
  songsOnly: boolean,
}