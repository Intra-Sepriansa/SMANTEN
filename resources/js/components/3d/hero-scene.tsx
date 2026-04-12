import { Float, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Group } from 'three';

function SchoolBlocks() {
    const group = useRef<Group | null>(null);

    useFrame((state, delta) => {
        if (!group.current) {
            return;
        }

        group.current.rotation.y += delta * 0.18;
        group.current.rotation.x += (state.pointer.y * 0.12 - group.current.rotation.x) * 0.08;
        group.current.rotation.z += (state.pointer.x * 0.08 - group.current.rotation.z) * 0.08;
        group.current.position.x += (state.pointer.x * 0.35 - group.current.position.x) * 0.08;
        group.current.position.y += (state.pointer.y * 0.18 - group.current.position.y) * 0.08;
    });

    return (
        <group ref={group} position={[0, 0, 0]}>
            <Float speed={1.3} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh position={[-1.6, -0.2, 0]} scale={[1.5, 0.9, 1.2]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#0f766e" metalness={0.3} roughness={0.18} />
                </mesh>
            </Float>
            <Float speed={1.7} rotationIntensity={0.18} floatIntensity={0.6}>
                <mesh position={[0.2, 0.6, -0.5]} scale={[1.25, 1.6, 1.2]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#115e59" metalness={0.24} roughness={0.16} />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={0.22} floatIntensity={0.75}>
                <mesh position={[1.7, -0.35, 0.25]} scale={[1.1, 0.75, 1.5]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.18} roughness={0.12} />
                </mesh>
            </Float>
            <Float speed={2} rotationIntensity={0.45} floatIntensity={0.9}>
                <mesh position={[0.1, -1.2, -0.2]} rotation={[1.15, 0.2, 0]} scale={1.9}>
                    <torusGeometry args={[1.2, 0.08, 20, 120]} />
                    <meshStandardMaterial color="#fdba74" emissive="#f59e0b" emissiveIntensity={0.25} />
                </mesh>
            </Float>
        </group>
    );
}

function HeroSceneFallback() {
    return (
        <div className="relative flex h-[460px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.22),transparent_45%),linear-gradient(160deg,rgba(255,255,255,0.88),rgba(220,252,231,0.72)_55%,rgba(245,158,11,0.18))] shadow-[0_28px_80px_-42px_rgba(15,118,110,0.55)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,118,110,0.08)_1px,transparent_1px),linear-gradient(rgba(15,118,110,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute inset-x-10 top-10 h-24 rounded-full bg-[rgba(15,118,110,0.18)] blur-3xl" />
            <div className="relative z-10 max-w-sm space-y-5 rounded-[1.75rem] border border-white/80 bg-white/70 p-7 text-center backdrop-blur">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                    Three.js Ready
                </div>
                <div className="font-heading text-3xl text-[var(--school-ink)]">
                    Panggung 3D sekolah siap diisi model siswa atau massa bangunan sekolah.
                </div>
                <p className="text-sm leading-7 text-[var(--school-muted)]">
                    Pada mode reduced motion atau saat model final belum dipasang, hero tetap menyajikan atmosfer ruang yang hidup.
                </p>
            </div>
        </div>
    );
}

export function HeroScene() {
    const reduceMotion = useReducedMotion();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || reduceMotion) {
        return <HeroSceneFallback />;
    }

    return (
        <div className="relative h-[460px] overflow-hidden rounded-[2rem] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(15,118,110,0.22),transparent_45%),linear-gradient(160deg,rgba(255,255,255,0.88),rgba(220,252,231,0.72)_55%,rgba(245,158,11,0.14))] shadow-[0_28px_80px_-42px_rgba(15,118,110,0.55)]">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,118,110,0.08)_1px,transparent_1px),linear-gradient(rgba(15,118,110,0.08)_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute left-8 top-8 z-10 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)] backdrop-blur">
                Interactive Hero
            </div>
            <Canvas camera={{ position: [0, 0, 7.5], fov: 38 }} dpr={[1, 1.7]}>
                <color attach="background" args={['#f3f8f6']} />
                <ambientLight intensity={1.05} />
                <directionalLight position={[6, 8, 5]} intensity={2.2} color="#ffffff" />
                <directionalLight position={[-4, -2, 2]} intensity={0.9} color="#fbbf24" />
                <Sparkles count={90} scale={[8, 4, 4]} size={2.8} speed={0.25} color="#0f766e" />
                <SchoolBlocks />
            </Canvas>
            <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div className="max-w-xs rounded-[1.6rem] border border-white/70 bg-white/75 p-4 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                        Parallax Reactive
                    </div>
                    <div className="mt-2 text-sm leading-6 text-[var(--school-muted)]">
                        Struktur abstrak ini disiapkan sebagai placeholder yang nantinya bisa diganti dengan model area sekolah atau karakter siswa 3D.
                    </div>
                </div>
                <div className="hidden rounded-[1.4rem] border border-white/70 bg-white/70 px-4 py-3 text-right text-sm text-[var(--school-muted)] backdrop-blur md:block">
                    Gerakkan pointer untuk melihat kedalaman scene.
                </div>
            </div>
        </div>
    );
}
