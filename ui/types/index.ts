export interface EbirdHotSpot {
    locId: string,
    locName: string,
    countryCode: string,
    subnational1Code: string,
    lat: number,
    lng: number,
    latestObsDt?: string,
    numSpeciesAllTime?: number,
}
