import { Head } from '@inertiajs/react';
import { lazy, Suspense, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowRightCircle, Move3d, Route } from 'lucide-react';
import { PageIntro } from '@/components/public/page-intro';
import { virtualTourScenes } from '@/lib/public-content';
import { useSiteUiStore } from '@/stores/site-ui-store';
import type { SchoolProfilePayload } from '@/types';

const PanoramaViewer = lazy(() =>
    import('@/components/virtual-tour/panorama-viewer').then((module) => ({
        default: module.PanoramaViewer,
    })),
);

type VirtualTourPageProps = {
    school: SchoolProfilePayload;
};

export default function VirtualTourPage({ school }: VirtualTourPageProps) {
    const selectedTourSceneId = useSiteUiStore((state) => state.selectedTourSceneId);
    const setSelectedTourSceneId = useSiteUiStore(
        (state) => state.setSelectedTourSceneId,
    );
    const selectedScene =
        virtualTourScenes.find((scene) => scene.id === selectedTourSceneId) ??
        virtualTourScenes[0];
    const selectedSceneIndex = virtualTourScenes.findIndex(
        (scene) => scene.id === selectedScene.id,
    );

    useEffect(() => {
        function handleKeydown(event: KeyboardEvent) {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                return;
            }

            const nextIndex =
                event.key === 'ArrowLeft'
                    ? (selectedSceneIndex - 1 + virtualTourScenes.length) %
                      virtualTourScenes.length
                    : (selectedSceneIndex + 1) % virtualTourScenes.length;

            setSelectedTourSceneId(virtualTourScenes[nextIndex].id);
        }

        window.addEventListener('keydown', handleKeydown);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [selectedSceneIndex, setSelectedTourSceneId]);

    return (
        <>
            <Head title="Virtual Tour" />

            <div className="space-y-8">
                <PageIntro
                    eyebrow="Virtual Tour 360"
                    title="Tur virtual dibangun sebagai jalur orientasi sekolah yang bisa diputar dan dipindai per lokasi."
                    description={`${school.name} mengeksplorasi gerbang utama, laboratorium, perpustakaan, dan area lapangan melalui panorama client-side, hotspot lintas lokasi, dan rail navigasi yang bisa tumbuh seiring koleksi scene sekolah.`}
                />

                <div className="grid gap-5 xl:grid-cols-[0.34fr_0.66fr]">
                    <div className="space-y-3">
                        <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-46px_rgba(15,118,110,0.4)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                Progress Scene
                            </div>
                            <div className="mt-3 flex items-end justify-between gap-4">
                                <div className="text-3xl font-semibold text-[var(--school-ink)]">
                                    {selectedSceneIndex + 1}
                                    <span className="text-lg text-[var(--school-muted)]">
                                        /{virtualTourScenes.length}
                                    </span>
                                </div>
                                <div className="text-sm leading-7 text-[var(--school-muted)]">
                                    Gunakan panah keyboard atau tombol berikut untuk
                                    menjelajah scene.
                                </div>
                            </div>
                        </div>

                        {virtualTourScenes.map((scene) => (
                            <button
                                key={scene.id}
                                type="button"
                                onClick={() => setSelectedTourSceneId(scene.id)}
                                className={`w-full rounded-[1.6rem] border p-5 text-left transition ${
                                    selectedScene.id === scene.id
                                        ? 'border-[var(--school-green-200)] bg-white text-[var(--school-ink)] shadow-[0_22px_60px_-44px_rgba(15,118,110,0.42)]'
                                        : 'border-white/70 bg-white/72 text-[var(--school-muted)]'
                                }`}
                            >
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    {scene.eyebrow}
                                </div>
                                <div className="mt-2 text-xl font-semibold">
                                    {scene.title}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]">
                        <div className="relative h-[460px]">
                            <Suspense
                                fallback={
                                    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.18),transparent_45%),linear-gradient(160deg,rgba(4,47,46,0.94),rgba(15,118,110,0.86)_58%,rgba(245,158,11,0.7))] text-white">
                                        Memuat panorama 360...
                                    </div>
                                }
                            >
                                <PanoramaViewer
                                    scene={selectedScene}
                                    onSelectScene={setSelectedTourSceneId}
                                />
                            </Suspense>
                        </div>
                        <div className="grid gap-4 border-t border-white/70 p-6 md:grid-cols-[0.7fr_0.3fr]">
                            <div className="rounded-[1.5rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-5">
                                <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    <Route className="size-4" />
                                    Hotspot Aktif
                                </div>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    {selectedScene.hotspots.map((hotspot) => (
                                        <button
                                            key={hotspot.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedTourSceneId(hotspot.targetSceneId)
                                            }
                                            className="rounded-full border border-[var(--school-green-200)] bg-white px-4 py-2 text-sm font-semibold text-[var(--school-ink)] transition hover:-translate-y-0.5 hover:border-[var(--school-green-300)]"
                                        >
                                            {hotspot.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTourSceneId(
                                            virtualTourScenes[
                                                (selectedSceneIndex - 1 + virtualTourScenes.length) %
                                                    virtualTourScenes.length
                                            ].id,
                                        )
                                    }
                                    className="flex items-center justify-between rounded-[1.4rem] border border-white/70 bg-white/84 px-4 py-3 text-left text-sm font-semibold text-[var(--school-ink)] transition hover:-translate-y-0.5"
                                >
                                    <span>Scene Sebelumnya</span>
                                    <ArrowLeft className="size-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTourSceneId(
                                            virtualTourScenes[
                                                (selectedSceneIndex + 1) % virtualTourScenes.length
                                            ].id,
                                        )
                                    }
                                    className="flex items-center justify-between rounded-[1.4rem] border border-white/70 bg-white/84 px-4 py-3 text-left text-sm font-semibold text-[var(--school-ink)] transition hover:-translate-y-0.5"
                                >
                                    <span>Scene Berikutnya</span>
                                    <ArrowRight className="size-4" />
                                </button>
                            </div>
                        </div>
                        <div className="grid gap-4 p-6 md:grid-cols-2">
                            <div className="rounded-[1.5rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-5">
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    Hotspot berikutnya
                                </div>
                                <div className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    Gunakan drag untuk memutar panorama. Hotspot di dalam scene akan memindahkan Anda ke lokasi berikutnya tanpa reload halaman.
                                </div>
                            </div>
                            <div className="rounded-[1.5rem] border border-[rgba(245,158,11,0.22)] bg-[rgba(255,251,235,0.82)] p-5">
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-gold-700)]">
                                    Konteks Lokasi
                                </div>
                                <div className="mt-3 flex items-start gap-3 text-sm leading-7 text-[var(--school-muted)]">
                                    <ArrowRightCircle className="mt-1 size-4 shrink-0 text-[var(--school-gold-700)]" />
                                    Sekolah {school.name} berada di Tenjo, Kabupaten Bogor, dengan area yang cukup luas untuk divisualisasikan sebagai jalur orientasi virtual.
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-white/70 p-6">
                            <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                <Move3d className="size-4" />
                                Fakta Lokasi
                            </div>
                            <div className="mt-4 grid gap-3 md:grid-cols-3">
                                {selectedScene.facts.map((fact) => (
                                    <div
                                        key={fact}
                                        className="rounded-[1.4rem] border border-white/70 bg-white/78 p-4 text-sm leading-7 text-[var(--school-muted)]"
                                    >
                                        {fact}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
