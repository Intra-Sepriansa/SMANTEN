const EARTH_RADIUS_KM = 6371;

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

export function calculateHaversineKm(
    fromLatitude: number,
    fromLongitude: number,
    toLatitude: number,
    toLongitude: number,
) {
    const deltaLatitude = degreesToRadians(toLatitude - fromLatitude);
    const deltaLongitude = degreesToRadians(toLongitude - fromLongitude);

    const latitudeA = degreesToRadians(fromLatitude);
    const latitudeB = degreesToRadians(toLatitude);

    const haversine =
        Math.sin(deltaLatitude / 2) ** 2 +
        Math.cos(latitudeA) *
            Math.cos(latitudeB) *
            Math.sin(deltaLongitude / 2) ** 2;

    const arc = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return EARTH_RADIUS_KM * arc;
}
