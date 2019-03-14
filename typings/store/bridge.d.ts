export interface Bridge {
    id: string,
    code: string,
    name: string,
    src: string,
    geo: BridgeGeoLocation,
    distance: number,
    events?: IEvent[],
    statusThreshold: number
}

export type BridgeGeoLocation = {
    lat: number,
    lng: number,
    statusThreshold: number
}

export interface IEvent extends IStatus {
    id: string
}

export interface IStatusColor extends IStatus {
    color: string,
}

export interface IStatus {
    when: Date,
    status: string
}

export type TBridgeStatus = "Open" | "Close";
