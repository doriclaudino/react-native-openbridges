export interface Bridge {
    code: string,
    name: string,
    src: string,
    geo: BridgeGeoLocation,
    distance: number
}

export type BridgeGeoLocation = {
    lat: number,
    lng: number,
    statusThreshold: number
}
