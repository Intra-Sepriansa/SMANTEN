import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
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
    const prefersReducedMotion = useReducedMotion();

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
                                className="group/cta relative mt-6 h-auto min-h-0 overflow-hidden rounded-[8px] border border-white/16 bg-[linear-gradient(135deg,rgba(22,121,111,0.96),rgba(15,91,85,0.98))] px-0 py-0 text-sm font-semibold tracking-[0.18em] text-white uppercase shadow-[0_24px_60px_-24px_rgba(15,91,85,0.78)] transition-transform duration-500 hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-24px_rgba(15,91,85,0.86)] focus-visible:ring-white/70"
                            >
                                <Link
                                    href={beritaIndex()}
                                    prefetch
                                    className="relative flex items-center gap-3 overflow-hidden px-5 py-4 sm:px-6"
                                >
                                    <span className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-[linear-gradient(180deg,rgba(243,168,29,0.22),rgba(247,191,89,0.05))]" />
                                    <motion.span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.34)_50%,transparent_78%)]"
                                        initial={
                                            prefersReducedMotion
                                                ? false
                                                : { x: '-135%' }
                                        }
                                        animate={
                                            prefersReducedMotion
                                                ? { opacity: 0 }
                                                : { x: '135%' }
                                        }
                                        transition={
                                            prefersReducedMotion
                                                ? { duration: 0 }
                                                : {
                                                      duration: 2.8,
                                                      repeat: Infinity,
                                                      ease: 'easeInOut',
                                                      repeatDelay: 1.2,
                                                  }
                                        }
                                    />
                                    <span className="relative flex size-10 shrink-0 items-center justify-center rounded-[8px] border border-white/18 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm transition-transform duration-500 group-hover/cta:scale-[1.05]">
                                        <Sparkles className="size-4 text-(--school-gold-400)" />
                                    </span>
                                    <span className="relative flex min-w-0 items-center gap-3">
                                        <span className="whitespace-nowrap text-left text-sm font-bold tracking-[0.22em] text-white uppercase sm:text-[0.92rem]">
                                            Lihat Berita
                                        </span>
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] border border-white/14 bg-black/10 text-white/90 transition-all duration-500 group-hover/cta:translate-x-0.5 group-hover/cta:bg-white/12 group-hover/cta:text-(--school-gold-400)">
                                            <ArrowUpRight className="size-4" />
                                        </span>
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
