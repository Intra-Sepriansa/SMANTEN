import { Html, OrbitControls, useTexture } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { BackSide, SRGBColorSpace } from 'three';
import type { VirtualTourScene } from '@/types';

type PanoramaViewerProps = {
    scene: VirtualTourScene;
    onSelectScene: (sceneId: string) => void;
};

function toSpherePosition(yaw: number, pitch: number, radius = 9.4) {
    const yawRadians = (yaw * Math.PI) / 180;
    const pitchRadians = (pitch * Math.PI) / 180;

    const x = Math.cos(pitchRadians) * Math.sin(yawRadians) * radius;
    const y = Math.sin(pitchRadians) * radius;
    const z = Math.cos(pitchRadians) * Math.cos(yawRadians) * radius;

    return [x, y, z] as const;
}

function PanoramaSphere({
    scene,
    onSelectScene,
}: PanoramaViewerProps) {
    const reduceMotion = useReducedMotion();
    const texture = useTexture(scene.imageUrl);

    texture.colorSpace = SRGBColorSpace;

    const hotspots = useMemo(
        () =>
            scene.hotspots.map((hotspot) => ({
                ...hotspot,
                position: toSpherePosition(hotspot.yaw, hotspot.pitch),
            })),
        [scene.hotspots],
    );

    return (
        <>
            <mesh rotation={[0, (scene.initialYaw * Math.PI) / 180, 0]}>
                <sphereGeometry args={[10, 64, 48]} />
                <meshBasicMaterial map={texture} side={BackSide} />
            </mesh>

            {hotspots.map((hotspot) => (
                <Html
                    key={hotspot.id}
                    position={hotspot.position}
                    transform
                    distanceFactor={1.7}
                >
                    <button
                        type="button"
                        title={hotspot.label}
                        aria-label={`Pindah ke ${hotspot.label}`}
                        className="group rounded-full border border-white/50 bg-[rgba(4,47,46,0.84)] px-3 py-2 text-xs font-semibold tracking-[0.18em] text-white uppercase shadow-[0_18px_45px_-28px_rgba(4,47,46,0.9)] transition hover:scale-105 hover:bg-[rgba(15,118,110,0.92)]"
                        onClick={() => onSelectScene(hotspot.targetSceneId)}
                    >
                        {hotspot.label}
                    </button>
                </Html>
            ))}

            <OrbitControls
                enablePan={false}
                enableZoom={false}
                rotateSpeed={-0.28}
                autoRotate={!reduceMotion}
                autoRotateSpeed={0.18}
                minPolarAngle={Math.PI * 0.28}
                maxPolarAngle={Math.PI * 0.72}
            />
        </>
    );
}

function FallbackPanel() {
    return (
        <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.18),transparent_45%),linear-gradient(160deg,rgba(4,47,46,0.94),rgba(15,118,110,0.86)_58%,rgba(245,158,11,0.7))] text-white">
            Memuat panorama 360...
        </div>
    );
}

export function PanoramaViewer({ scene, onSelectScene }: PanoramaViewerProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return <FallbackPanel />;
    }

    return (
        <div className="relative h-full w-full overflow-hidden bg-[var(--school-ink)]">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-white/18 bg-black/24 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white backdrop-blur">
                {scene.eyebrow}
            </div>
            <div className="absolute bottom-5 left-5 z-10 max-w-sm rounded-[1.5rem] border border-white/18 bg-black/24 p-4 text-white backdrop-blur">
                <div className="font-heading text-2xl">{scene.title}</div>
                <p className="mt-2 text-sm leading-7 text-white/75">
                    {scene.description}
                </p>
            </div>
            <div className="absolute right-5 top-5 z-10 rounded-[1.4rem] border border-white/18 bg-black/24 px-4 py-3 text-right text-white backdrop-blur">
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/70">
                    Navigasi
                </div>
                <div className="mt-2 text-sm leading-6 text-white/80">
                    Drag untuk memutar
                    <br />
                    Klik hotspot untuk pindah
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 0.1], fov: 70 }}>
                <color attach="background" args={['#0b1f24']} />
                <PanoramaSphere scene={scene} onSelectScene={onSelectScene} />
            </Canvas>
        </div>
    );
}
