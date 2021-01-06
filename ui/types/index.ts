export interface Guide {
    id: number,
    name: string,
    trip_guide: boolean,
    biography: string | null,
    images: string[],
}

export interface Habitat {
    id: number,
    name: string,
    html: string,
    images: string[],
}

export interface Site {
    id: number,
    name: string,
    description: string,
    lat: number,
    lng: number,
    guides: Guide[],
    habitats: Habitat[],
    images: string[],
}

export interface EbirdHotSpot {
    locId: string,
    locName: string,
    countryCode: string,
    subnational1Code: string,
    lat: number,
    lng: number,
    latestObsDt: string | null,
    numSpeciesAllTime: number | null,
}

export interface SiteDay {
    id: number,
    day: number,
    name: string,
    lat: number,
    lng: number,
}

export interface Trip {
    id: number,
    name: string,
    site_days: SiteDay[],
}
