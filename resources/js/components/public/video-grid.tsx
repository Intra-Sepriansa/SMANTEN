import { motion } from 'framer-motion';
import { PlayCircle, Youtube } from 'lucide-react';
import { startTransition, useState } from 'react';
import { BorderGlow } from '@/components/public/border-glow';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import { useExtracurricularVideosQuery } from '@/lib/query/public-site';
import { cn } from '@/lib/utils';

const categories = [
    'Semua',
    'Budaya',
    'Kepemimpinan',
    'Media',
    'Lingkungan',
    'Sekolah',
];

export function VideoGrid() {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const { data, isLoading } = useExtracurricularVideosQuery();

    const items =
        activeCategory === 'Semua'
            ? (data ?? [])
            : (data ?? []).filter((item) => item.category === activeCategory);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/60 bg-white/50 p-1.5 shadow-sm md:w-max">
                {categories.map((category) => {
                    const isActive = category === activeCategory;

                    return (
                        <button
                            key={category}
                            type="button"
                            onClick={() => {
                                startTransition(() =>
                                    setActiveCategory(category),
                                );
                            }}
                            className={cn(
                                'relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300',
                                isActive
                                    ? 'text-white'
                                    : 'text-[var(--school-muted)] hover:text-[var(--school-ink)]',
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="video-category-active"
                                    className="absolute inset-0 rounded-full bg-[var(--school-green-700)] shadow-md"
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                            <span className="relative z-10">{category}</span>
                        </button>
                    );
                })}
            </div>

            {isLoading ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-5"
                        >
                            <Skeleton className="h-44 rounded-[1.25rem]" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
                >
                    {items.length > 0 ? (
                        items.map((item, index) => {
                            const fallbacks = [
                                '/images/sekolah/kegiatan_siswa.jpg',
                                '/images/sekolah/murid_belajar.jpg',
                                '/images/sekolah/guru_mengajar.jpg',
                                '/images/sekolah/fasilitas_lab.jpg',
                            ];
                            const localThumb =
                                item.thumbnailUrl ||
                                fallbacks[index % fallbacks.length];

                            return (
                                <motion.article
                                    key={item.id}
                                    variants={fadeUp}
                                    whileHover={{ y: -6, scale: 1.02 }}
                                    className="group flex h-full flex-col"
                                >
                                    <BorderGlow
                                        borderRadius={32}
                                        className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_70px_-40px_rgba(15,118,110,0.45)] transition-all duration-500 hover:shadow-[0_40px_80px_-30px_rgba(4,47,46,0.6)]"
                                    >
                                        <div className="relative flex min-h-[14rem] shrink-0 flex-col justify-between overflow-hidden p-6">
                                            {/* Background Image that scales independently on hover */}
                                            <div
                                                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                                style={{
                                                    backgroundImage: `url(${localThumb})`,
                                                }}
                                            />

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#042f2e] via-[#042f2e]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

                                            {/* Card Content Top */}
                                            <div className="relative z-10 flex items-center justify-between text-white">
                                                <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[0.68rem] font-bold tracking-[0.26em] uppercase backdrop-blur-md">
                                                    {item.category}
                                                </span>
                                                <div className="rounded-full bg-black/20 p-2 backdrop-blur-md">
                                                    <Youtube className="size-4" />
                                                </div>
                                            </div>

                                            {/* Card Content Bottom */}
                                            <div className="relative z-10 mt-10 flex items-end justify-between">
                                                <div>
                                                    <div className="text-[0.65rem] font-bold tracking-widest text-[#0E9EE4] uppercase drop-shadow-sm">
                                                        {item.state}
                                                    </div>
                                                    <div className="mt-2 text-2xl leading-tight font-bold text-white drop-shadow-md">
                                                        {item.title}
                                                    </div>
                                                </div>
                                                <div className="rounded-full border border-white/30 bg-white/20 p-3 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white/40">
                                                    <PlayCircle className="size-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative z-20 shrink-0 grow space-y-4 bg-white/95 p-6 backdrop-blur-xl">
                                            <p className="text-sm leading-7 text-[var(--school-muted)]">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center justify-between pt-2">
                                                <div className="text-[0.65rem] font-bold tracking-[0.28em] text-[var(--school-green-700)] uppercase">
                                                    {item.provider === 'youtube'
                                                        ? 'MOCK API YOUTUBE'
                                                        : 'GALERI LOKAL'}
                                                </div>
                                                {item.externalUrl ? (
                                                    <Button
                                                        asChild
                                                        size="sm"
                                                        className="rounded-full bg-[var(--school-green-700)] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--school-green-600)] hover:shadow-md"
                                                    >
                                                        <a
                                                            href={
                                                                item.externalUrl
                                                            }
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Putar
                                                        </a>
                                                    </Button>
                                                ) : (
                                                    <div className="text-xs font-medium text-[var(--school-muted)]">
                                                        Siap Tayang
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </BorderGlow>
                                </motion.article>
                            );
                        })
                    ) : (
                        <div className="rounded-[1.8rem] border border-dashed border-[var(--school-green-200)] bg-white/72 p-8 text-sm leading-7 text-[var(--school-muted)] md:col-span-2 xl:col-span-4">
                            Video sekolah belum tersedia. Konten akan tampil
                            setelah kanal resmi dikonfigurasi.
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
