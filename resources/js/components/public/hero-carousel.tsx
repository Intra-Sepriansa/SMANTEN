import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const slides = [
    {
        image: '/images/sekolah/guru_mengajar.jpg',
        title: 'Mendukung Sosialisasi Kurikulum Merdeka Belajar',
        subtitle: 'Menyiapkan generasi unggul',
    },
    {
        image: '/images/sekolah/murid_belajar.jpg',
        title: 'Pembelajaran Hidup dan Adaptif',
        subtitle: 'Tampil digital dan berkarakter',
    },
    {
        image: '/images/sekolah/fasilitas_lab.jpg',
        title: 'Fasilitas Belajar Modern',
        subtitle: 'Dukung penuh inovasi siswa',
    },
    {
        image: '/images/sekolah/kegiatan_siswa.jpg',
        title: 'Ekstrakurikuler Dinamis',
        subtitle: 'Gali potensi dan bakat sejati',
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
    const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-[100vw] h-[85vh] lg:h-[90vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-8 md:-mt-10 overflow-hidden bg-neutral-900 group">
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

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            <div className="absolute inset-0 z-10 flex min-h-full items-center">
                <div className="mx-auto w-full max-w-[84rem] px-5 md:px-8">
                    <div className="w-full max-w-3xl space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={current}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="space-y-4"
                            >
                                <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur">
                                    {slides[current].subtitle}
                                </div>
                                <h1 className="font-heading text-4xl font-bold uppercase leading-[1.1] text-white md:text-6xl lg:text-7xl">
                                    {slides[current].title}
                                </h1>
                            </motion.div>
                        </AnimatePresence>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            <Button
                                asChild
                                size="lg"
                                className="group relative mt-6 overflow-hidden rounded-none bg-[#0E9EE4] px-8 py-7 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-[#0b86c2] hover:pr-12 shadow-[0_0_40px_-10px_rgba(14,158,228,0.5)]"
                            >
                                <Link href="/berita">
                                    Cek Beritanya
                                    <ChevronRight className="absolute right-4 size-5 translate-x-4 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur transition-all hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 sm:left-6"
            >
                <ChevronLeft className="size-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/20 p-3 text-white backdrop-blur transition-all hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 sm:right-6"
            >
                <ChevronRight className="size-6" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={cn(
                            "transition-all cursor-pointer h-2.5 rounded-full border border-white/80",
                            current === index
                                ? "w-8 bg-[#0E9EE4] border-[#0E9EE4]"
                                : "w-2.5 bg-transparent hover:bg-white/50"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
