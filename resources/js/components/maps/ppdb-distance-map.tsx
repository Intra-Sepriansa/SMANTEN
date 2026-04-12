import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { useEffect } from 'react';
import { Circle, CircleMarker, MapContainer, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';

type PpdbDistanceMapProps = {
    schoolPosition: [number, number];
    homePosition: [number, number] | null;
    zoneRadiusKm: number;
    onSelectPosition?: (position: [number, number]) => void;
};

function FitMapToSelection({
    schoolPosition,
    homePosition,
}: Pick<PpdbDistanceMapProps, 'schoolPosition' | 'homePosition'>) {
    const map = useMap();

    const bounds: LatLngBoundsExpression | null = homePosition
        ? [schoolPosition, homePosition]
        : null;

    useEffect(() => {
        if (bounds) {
            map.fitBounds(bounds, { padding: [48, 48] });
        } else {
            map.setView(schoolPosition, 13);
        }
    }, [bounds, map, schoolPosition]);

    return null;
}

function ClickToSetMarker({
    onSelectPosition,
}: {
    onSelectPosition?: (position: [number, number]) => void;
}) {
    useMapEvents({
        click(event) {
            onSelectPosition?.([
                Number(event.latlng.lat.toFixed(6)),
                Number(event.latlng.lng.toFixed(6)),
            ]);
        },
    });

    return null;
}

export default function PpdbDistanceMap({
    schoolPosition,
    homePosition,
    zoneRadiusKm,
    onSelectPosition,
}: PpdbDistanceMapProps) {
    const center: LatLngTuple = homePosition ?? schoolPosition;

    return (
        <MapContainer
            center={center}
            zoom={13}
            scrollWheelZoom={false}
            className="h-[420px] w-full rounded-[1.8rem]"
        >
            <FitMapToSelection
                schoolPosition={schoolPosition}
                homePosition={homePosition}
            />
            <ClickToSetMarker onSelectPosition={onSelectPosition} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle
                center={schoolPosition}
                radius={zoneRadiusKm * 1000}
                pathOptions={{
                    color: '#0f766e',
                    fillColor: '#34d399',
                    fillOpacity: 0.12,
                }}
            />
            <CircleMarker
                center={schoolPosition}
                radius={9}
                pathOptions={{ color: '#042f2e', fillColor: '#0f766e', fillOpacity: 1 }}
            >
                <Popup>Koordinat sekolah</Popup>
            </CircleMarker>
            {homePosition ? (
                <>
                    <CircleMarker
                        center={homePosition}
                        radius={8}
                        pathOptions={{ color: '#b45309', fillColor: '#f59e0b', fillOpacity: 1 }}
                    >
                        <Popup>Titik rumah calon siswa</Popup>
                    </CircleMarker>
                    <Polyline
                        positions={[schoolPosition, homePosition]}
                        pathOptions={{
                            color: '#f59e0b',
                            dashArray: '8 10',
                            weight: 3,
                        }}
                    />
                </>
            ) : null}
        </MapContainer>
    );
}
