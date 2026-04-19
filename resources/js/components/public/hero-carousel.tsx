import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
                        >
                            <Button
                                asChild
                                size="lg"
                                className="group relative mt-6 overflow-hidden rounded-none bg-[#0E9EE4] px-8 py-7 text-sm font-semibold tracking-widest text-white uppercase shadow-[0_0_40px_-10px_rgba(14,158,228,0.5)] transition-all hover:bg-[#0b86c2] hover:pr-12"
                            >
                                <Link href="/berita">
                                    Lihat Berita
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
                                ? 'w-8 border-[#0E9EE4] bg-[#0E9EE4]'
                                : 'w-2.5 bg-transparent hover:bg-white/50',
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
