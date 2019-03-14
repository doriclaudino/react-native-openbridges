export interface User {
    currentUserLocation: GeolocationReturnType;
    searchBarValue: string,
    selectedDistance: number
}

export type GeolocationReturnType = {
    coords: {
        latitude: number;
        longitude: number;
        altitude: number | null;
        accuracy: number;
        altitudeAccuracy: number | null;
        heading: number | null;
        speed: number | null;
    };
    timestamp: number;
};
