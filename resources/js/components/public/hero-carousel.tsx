import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { index as beritaIndex } from '@/routes/berita';

const slides = [
    {
        image: '/images/sekolah/guru_mengajar.jpg',
        title: 'Mendukung Sosialisasi Kurikulum Merdeka Belajar',
        subtitle: 'Kurikulum dan pembelajaran',
    },
    {
        image: '/images/sekolah/murid_belajar.jpg',
        title: 'Pembelajaran Adaptif dan Berkarakter',
        subtitle: 'Kegiatan belajar siswa',
    },
    {
        image: '/images/sekolah/fasilitas_lab.jpg',
        title: 'Fasilitas Belajar Modern',
        subtitle: 'Sarana pendukung sekolah',
    },
    {
        image: '/images/sekolah/kegiatan_siswa.jpg',
        title: 'Ekstrakurikuler Siswa',
        subtitle: 'Minat, bakat, dan prestasi',
    },
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prev = () =>
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="group relative right-1/2 left-1/2 -mt-8 -mr-[50vw] -ml-[50vw] h-[85vh] w-[100vw] overflow-hidden bg-neutral-900 md:-mt-10 lg:h-[90vh]">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${slides[current].image})`,
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-linear-to-b from-black/55 via-black/35 to-black/60" />

            <div className="absolute inset-0 z-10 flex min-h-full items-center justify-center">
                <div className="mx-auto w-full max-w-[84rem] px-5 text-center md:px-8">
                    <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-col items-center space-y-4"
                            >
                                <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur">
                                    {slides[current].subtitle}
                                </div>
                                <h1 className="font-heading text-4xl leading-[1.1] font-bold text-white uppercase md:text-6xl lg:text-7xl">
                                    {slides[current].title}
                                </h1>
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="flex justify-center"
                        >
                            <Button
                                asChild
                                size="lg"
                                className="group/cta relative mt-6 h-auto min-h-0 w-full max-w-[22rem] overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/92 px-0 py-0 text-sm font-semibold text-(--school-ink) shadow-[0_26px_70px_-32px_rgba(15,23,42,0.58)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_32px_85px_-34px_rgba(15,23,42,0.62)] focus-visible:ring-white/80 sm:max-w-none"
                            >
                                <Link
                                    href={beritaIndex()}
                                    prefetch
                                    className="relative flex w-full min-w-0 items-center justify-between gap-3 px-4 py-4 sm:min-w-[23rem] sm:px-5"
                                >
                                    <span className="flex size-11 shrink-0 items-center justify-center rounded-[1.1rem] border border-slate-200/90 bg-white text-(--school-gold-500) shadow-[0_14px_30px_-24px_rgba(15,23,42,0.5)] transition-all duration-500 group-hover/cta:border-(--school-green-100) group-hover/cta:bg-(--school-green-50)">
                                        <Sparkles className="size-4" />
                                    </span>
                                    <span className="flex min-w-0 flex-1 items-center">
                                        <span className="truncate text-left text-sm font-bold tracking-[0.14em] text-(--school-ink) uppercase sm:text-[0.92rem]">
                                            Lihat Berita
                                        </span>
                                    </span>
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[1rem] border border-slate-200/90 bg-slate-50 text-(--school-ink) transition-all duration-500 group-hover/cta:-translate-y-0.5 group-hover/cta:border-(--school-green-200) group-hover/cta:bg-white group-hover/cta:text-(--school-green-700)">
                                        <ArrowUpRight className="size-4" />
                                    </span>
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-white hover:text-black sm:left-6"
            >
                <ChevronLeft className="size-6" />
            </button>
            <button
                onClick={next}
                className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-white opacity-0 backdrop-blur transition-all group-hover:opacity-100 hover:bg-white hover:text-black sm:right-6"
            >
                <ChevronRight className="size-6" />
            </button>

            {/* Slider Dots */}
            <div className="absolute right-0 bottom-10 left-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={cn(
                            'h-2.5 cursor-pointer rounded-full border border-white/80 transition-all',
                            current === index
                                ? 'w-8 border-(--school-gold-400) bg-(--school-gold-400)'
                                : 'w-2.5 bg-transparent hover:bg-white/50',
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
