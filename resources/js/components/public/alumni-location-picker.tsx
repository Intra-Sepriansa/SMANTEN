import type { LatLngExpression, Marker as LeafletMarker } from 'leaflet';
import { LocateFixed, MapPin, Search } from 'lucide-react';
import { useEffect } from 'react';
import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import type { GeocodeCandidate } from '@/types';

type AlumniLocationPickerProps = {
    city: string;
    province: string;
    latitude: string;
    longitude: string;
    query: string;
    loading: boolean;
    locating: boolean;
    results: GeocodeCandidate[];
    schoolPosition: [number, number];
    onCityChange: (value: string) => void;
    onProvinceChange: (value: string) => void;
    onQueryChange: (value: string) => void;
    onCoordinateChange: (latitude: number | '', longitude: number | '') => void;
    onCoordinateCommit: (latitude: number, longitude: number) => void;
    onPickResult: (result: GeocodeCandidate) => void;
    onUseCurrentLocation: () => void;
};

function RecenterMap({ position }: { position: LatLngExpression }) {
    const map = useMap();

    useEffect(() => {
        map.setView(position, map.getZoom(), { animate: true });
    }, [map, position]);

    return null;
}

function ClickableMarker({
    position,
    onCoordinateCommit,
}: {
    position: [number, number];
    onCoordinateCommit: (latitude: number, longitude: number) => void;
}) {
    useMapEvents({
        click(event) {
            onCoordinateCommit(event.latlng.lat, event.latlng.lng);
        },
    });

    return (
        <Marker
            position={position}
            draggable
            eventHandlers={{
                dragend(event) {
                    const marker = event.target as LeafletMarker;
                    const current = marker.getLatLng();
                    onCoordinateCommit(current.lat, current.lng);
                },
            }}
        />
    );
}

export function AlumniLocationPicker({
    city,
    province,
    latitude,
    longitude,
    query,
    loading,
    locating,
    results,
    schoolPosition,
    onCityChange,
    onProvinceChange,
    onQueryChange,
    onCoordinateChange,
    onCoordinateCommit,
    onPickResult,
    onUseCurrentLocation,
}: AlumniLocationPickerProps) {
    const hasCoordinates = latitude !== '' && longitude !== '';
    const selectedPosition: [number, number] = hasCoordinates
        ? [Number(latitude), Number(longitude)]
        : schoolPosition;

    return (
        <div className="space-y-4 rounded-4xl border border-emerald-100 bg-linear-to-br from-emerald-50/80 via-white to-sky-50/70 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-emerald-700 uppercase">
                        <MapPin className="size-3.5" />
                        Lokasi Alumni
                    </div>
                    <p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">
                        Pilih lokasi yang paling mendekati domisilimu saat ini.
                        Kamu bisa cari kota/provinsi, pakai lokasi browser, atau
                        klik titik langsung di peta.
                    </p>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={onUseCurrentLocation}
                    disabled={locating}
                    className="shrink-0 rounded-full border-emerald-200 bg-white/90 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-emerald-200 disabled:border-emerald-100 disabled:bg-emerald-50/80 disabled:text-emerald-700 disabled:opacity-100"
                >
                    <LocateFixed
                        className={`mr-2 size-4 ${locating ? 'animate-spin' : ''}`}
                    />
                    {locating ? 'Membaca lokasi...' : 'Lokasi Saya'}
                </Button>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-(--school-ink)">
                    Cari Lokasi
                </label>
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => onQueryChange(event.target.value)}
                        placeholder="Contoh: Jakarta Selatan, DKI Jakarta"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-11 py-3.5 text-sm text-(--school-ink) placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                </div>
                {loading && (
                    <p className="text-xs font-medium text-emerald-700">
                        Mencari kandidat lokasi...
                    </p>
                )}
                {results.length > 0 && (
                    <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg">
                        {results.map((result) => (
                            <button
                                key={`${result.latitude}-${result.longitude}`}
                                type="button"
                                onClick={() => onPickResult(result)}
                                className="flex w-full flex-col rounded-xl px-4 py-3 text-left transition hover:bg-slate-50"
                            >
                                <span className="text-sm font-semibold text-(--school-ink)">
                                    {result.name ??
                                        result.address.city ??
                                        result.displayName}
                                </span>
                                <span className="mt-0.5 text-xs leading-5 text-slate-500">
                                    {result.displayName}
                                </span>
                                <span className="mt-1 text-[11px] font-semibold text-emerald-700">
                                    {result.latitude.toFixed(5)},{' '}
                                    {result.longitude.toFixed(5)}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-(--school-ink)">
                        Kota
                    </label>
                    <input
                        type="text"
                        value={city}
                        onChange={(event) => onCityChange(event.target.value)}
                        placeholder="Jakarta"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-(--school-ink) placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-(--school-ink)">
                        Provinsi
                    </label>
                    <input
                        type="text"
                        value={province}
                        onChange={(event) =>
                            onProvinceChange(event.target.value)
                        }
                        placeholder="Jawa Barat"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-(--school-ink) placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-(--school-ink)">
                        Latitude
                    </label>
                    <input
                        type="number"
                        step="0.000001"
                        value={latitude}
                        onChange={(event) =>
                            onCoordinateChange(
                                event.target.value === ''
                                    ? ''
                                    : Number(event.target.value),
                                longitude === '' ? '' : Number(longitude),
                            )
                        }
                        placeholder="-6.200000"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-(--school-ink) placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-(--school-ink)">
                        Longitude
                    </label>
                    <input
                        type="number"
                        step="0.000001"
                        value={longitude}
                        onChange={(event) =>
                            onCoordinateChange(
                                latitude === '' ? '' : Number(latitude),
                                event.target.value === ''
                                    ? ''
                                    : Number(event.target.value),
                            )
                        }
                        placeholder="106.800000"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm text-(--school-ink) placeholder:text-slate-400 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 focus:outline-none"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 shadow-inner">
                <MapContainer
                    center={selectedPosition}
                    zoom={hasCoordinates ? 10 : 5}
                    scrollWheelZoom={false}
                    className="h-72 w-full bg-slate-50"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    />
                    <RecenterMap position={selectedPosition} />
                    <ClickableMarker
                        position={selectedPosition}
                        onCoordinateCommit={onCoordinateCommit}
                    />
                </MapContainer>
            </div>

            <p className="text-[11px] font-medium tracking-[0.18em] text-slate-400 uppercase">
                Klik peta untuk memilih titik secara manual, lalu marker dapat
                digeser untuk akurasi yang lebih presisi.
            </p>
        </div>
    );
}
