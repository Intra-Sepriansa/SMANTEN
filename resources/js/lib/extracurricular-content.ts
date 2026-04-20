import {
    Activity,
    Compass,
    Heart,
    Megaphone,
    ShieldCheck,
    Sparkles,
    Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const extracurricularCategories = [
    'Semua',
    'Kepemimpinan',
    'Olahraga',
    'Karakter',
    'Pengabdian',
    'Media',
    'Seni',
] as const;

export type ExtracurricularCategory =
    (typeof extracurricularCategories)[number];

export type ExtracurricularRoutineItem = {
    label: string;
    value: string;
};

export type ExtracurricularExperienceItem = {
    title: string;
    description: string;
};

export type ExtracurricularStatItem = {
    label: string;
    value: string;
};

export type ExtracurricularProgram = {
    slug: string;
    name: string;
    category: Exclude<ExtracurricularCategory, 'Semua'>;
    image: string;
    accent: string;
    icon: LucideIcon;
    summary: string;
    headline: string;
    cadence: string;
    metric: string;
    metricSub: string;
    focus: string[];
    highlights: string[];
    fit: string[];
    routine: ExtracurricularRoutineItem[];
    experience: ExtracurricularExperienceItem[];
    stats: ExtracurricularStatItem[];
    objectPosition?: string;
};

export const extracurricularPrograms: readonly ExtracurricularProgram[] = [
    {
        slug: 'paskibra',
        name: 'Paskibra',
        category: 'Kepemimpinan',
        image: '/images/eskul/paskibra.png',
        accent: '#DC2626',
        icon: ShieldCheck,
        summary:
            'Korps disiplin dan kepemimpinan yang menyiapkan siswa tampil presisi di upacara, event besar, dan kompetisi baris-berbaris.',
        headline: 'Presisi, komando, dan mental tampil dalam ritme yang rapi.',
        cadence: 'Latihan rutin 2-3 kali per minggu',
        metric: 'Disiplin',
        metricSub: 'Tingkat tinggi',
        focus: ['Baris-berbaris', 'Komando', 'Kepemimpinan'],
        highlights: ['Upacara', 'Latihan formasi', 'Mental juang'],
        fit: [
            'Suka ritme yang tegas',
            'Nyaman latihan presisi',
            'Siap pegang tanggung jawab tim',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Drill komando, formasi, dan koreksi tempo gerak.',
            },
            {
                label: 'Momen tampil',
                value: 'Upacara sekolah, event resmi, dan seleksi lomba.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Disiplin, presisi, dan ketahanan mental kerja tim.',
            },
        ],
        experience: [
            {
                title: 'Masuk dasar teknik',
                description: 'Siswa mulai dari sikap dasar, tempo, dan akurasi gerak.',
            },
            {
                title: 'Naik ke formasi',
                description: 'Latihan bergeser ke koordinasi kelompok dan komando lapangan.',
            },
            {
                title: 'Tampil di momen resmi',
                description: 'Hasil latihan dibawa ke upacara, event, dan panggung sekolah.',
            },
        ],
        stats: [
            { label: 'Ritme', value: '2-3 sesi / pekan' },
            { label: 'Tampil', value: 'Upacara & lomba' },
            { label: 'Nuansa', value: 'Presisi tim' },
        ],
        objectPosition: 'center 32%',
    },
    {
        slug: 'futsal',
        name: 'Futsal',
        category: 'Olahraga',
        image: '/images/eskul/futsal.png',
        accent: '#16A34A',
        icon: Trophy,
        summary:
            'Ruang pembinaan fisik, strategi permainan, dan kekompakan tim bagi siswa yang aktif di kompetisi olahraga sekolah.',
        headline: 'Latihan cepat, keputusan singkat, dan kerja tim yang hidup.',
        cadence: 'Sparring dan latihan pekanan',
        metric: 'Tim',
        metricSub: 'Kompetitif',
        focus: ['Teknik dasar', 'Game sense', 'Kerja tim'],
        highlights: ['Friendly match', 'Seleksi tim', 'Turnamen sekolah'],
        fit: [
            'Suka permainan cepat',
            'Nyaman latihan fisik rutin',
            'Senang membaca ritme tim',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Passing, kontrol, finishing, dan pola rotasi permainan.',
            },
            {
                label: 'Momen tampil',
                value: 'Friendly match, seleksi tim inti, dan turnamen sekolah.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Sportivitas, komunikasi, dan disiplin menjaga performa.',
            },
        ],
        experience: [
            {
                title: 'Bangun teknik',
                description: 'Siswa menguatkan sentuhan dasar dan koordinasi permainan.',
            },
            {
                title: 'Masuk strategi',
                description: 'Latihan mulai fokus ke shape, transisi, dan keputusan cepat.',
            },
            {
                title: 'Bermain kompetitif',
                description: 'Unit tampil dalam sparring, seleksi, dan kompetisi internal.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Latihan pekanan' },
            { label: 'Tampil', value: 'Match & turnamen' },
            { label: 'Nuansa', value: 'Kompetitif' },
        ],
        objectPosition: 'center 26%',
    },
    {
        slug: 'rohis',
        name: 'Rohis',
        category: 'Karakter',
        image: '/images/eskul/rohis.png',
        accent: '#0F766E',
        icon: Heart,
        summary:
            'Pembinaan akhlak, kepemimpinan spiritual, dan program keagamaan yang menjaga ritme karakter siswa tetap kuat.',
        headline: 'Ritme pembinaan yang tenang, terarah, dan menjaga karakter.',
        cadence: 'Kajian, mentoring, dan agenda sosial',
        metric: 'Karakter',
        metricSub: 'Konsisten',
        focus: ['Pembinaan', 'Kajian', 'Kepedulian'],
        highlights: ['Mentoring', 'Peringatan hari besar', 'Program sosial'],
        fit: [
            'Suka ruang tumbuh yang tenang',
            'Nyaman belajar sambil berkomunitas',
            'Peka pada agenda sosial dan karakter',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Kajian, mentoring kecil, dan evaluasi kebiasaan positif.',
            },
            {
                label: 'Momen tampil',
                value: 'Agenda keagamaan, hari besar, dan program sosial sekolah.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Konsistensi, empati, dan kepemimpinan spiritual.',
            },
        ],
        experience: [
            {
                title: 'Masuk pembinaan',
                description: 'Siswa mulai dari ritme kajian dan pertemuan yang teratur.',
            },
            {
                title: 'Naik ke peran',
                description: 'Mulai pegang agenda, mentoring, atau koordinasi kegiatan.',
            },
            {
                title: 'Hadir untuk sekolah',
                description: 'Unit tampil lewat program hari besar dan aksi sosial nyata.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Kajian terjadwal' },
            { label: 'Tampil', value: 'Agenda karakter' },
            { label: 'Nuansa', value: 'Tenang & solid' },
        ],
        objectPosition: 'center 40%',
    },
    {
        slug: 'pmr',
        name: 'PMR',
        category: 'Pengabdian',
        image: '/images/eskul/pmr.png',
        accent: '#E11D48',
        icon: Activity,
        summary:
            'Unit kesiapsiagaan siswa yang berfokus pada pertolongan pertama, kesehatan remaja, dan respon cepat saat kegiatan sekolah.',
        headline: 'Sigap, terlatih, dan siap hadir saat sekolah membutuhkan.',
        cadence: 'Simulasi, pelatihan, dan siaga acara',
        metric: 'Siaga',
        metricSub: 'P3K',
        focus: ['Kesehatan', 'Pertolongan pertama', 'Empati'],
        highlights: ['P3K acara', 'Simulasi tanggap', 'Edukasi kesehatan'],
        fit: [
            'Suka situasi yang butuh sigap',
            'Peka pada kondisi sekitar',
            'Tertarik belajar bantuan awal',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'P3K dasar, simulasi kasus, dan kesiapan alat siaga.',
            },
            {
                label: 'Momen tampil',
                value: 'Siaga acara, simulasi tanggap, dan edukasi kesehatan.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Empati, ketenangan, dan respon cepat yang terukur.',
            },
        ],
        experience: [
            {
                title: 'Masuk dasar siaga',
                description: 'Siswa belajar protokol sederhana dan pertolongan awal.',
            },
            {
                title: 'Naik ke simulasi',
                description: 'Latihan bergerak ke skenario nyata dan koordinasi lapangan.',
            },
            {
                title: 'Pegang tugas acara',
                description: 'Unit hadir langsung saat kegiatan sekolah butuh dukungan siaga.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Simulasi berkala' },
            { label: 'Tampil', value: 'Siaga acara' },
            { label: 'Nuansa', value: 'Cepat & tenang' },
        ],
        objectPosition: 'center 36%',
    },
    {
        slug: 'pramuka',
        name: 'Pramuka',
        category: 'Kepemimpinan',
        image: '/images/eskul/pramuka.png',
        accent: '#A16207',
        icon: Compass,
        summary:
            'Wadah pembentukan siswa yang mandiri, tangguh, dan mampu bekerja dalam tim.',
        headline: 'Latihan lapangan yang membentuk kemandirian dan daya tahan.',
        cadence: 'Latihan ambalan dan agenda lapangan',
        metric: 'Ambalan',
        metricSub: 'Aktif',
        focus: ['Kemandirian', 'Tim', 'Ketahanan'],
        highlights: ['Perkemahan', 'Navigasi', 'Project teamwork'],
        fit: [
            'Suka aktivitas lapangan',
            'Siap belajar mandiri',
            'Senang kerja tim dalam tantangan',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Keterampilan lapangan, navigasi, dan problem solving tim.',
            },
            {
                label: 'Momen tampil',
                value: 'Perkemahan, simulasi regu, dan kegiatan lintas unit.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Mandiri, tangguh, dan siap pegang peran di lapangan.',
            },
        ],
        experience: [
            {
                title: 'Masuk dasar ambalan',
                description: 'Siswa mengenal ritme regu, tugas, dan etika kegiatan.',
            },
            {
                title: 'Naik ke tantangan',
                description: 'Mulai pegang simulasi, navigasi, dan koordinasi lapangan.',
            },
            {
                title: 'Jalani agenda besar',
                description: 'Latihan dibawa ke kemah dan kegiatan lapangan yang nyata.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Agenda lapangan' },
            { label: 'Tampil', value: 'Kemah & simulasi' },
            { label: 'Nuansa', value: 'Mandiri' },
        ],
        objectPosition: 'center 30%',
    },
    {
        slug: 'pencak-silat',
        name: 'Pencak Silat',
        category: 'Olahraga',
        image: '/images/eskul/silat.png',
        accent: '#7C3AED',
        icon: Sparkles,
        summary:
            'Latihan bela diri tradisional yang menggabungkan ketahanan fisik, fokus mental, dan estetika gerak.',
        headline: 'Teknik, kontrol tubuh, dan fokus yang dibangun perlahan.',
        cadence: 'Latihan teknik dan demonstrasi',
        metric: 'Teknik',
        metricSub: 'Presisi',
        focus: ['Bela diri', 'Fokus', 'Kontrol tubuh'],
        highlights: ['Demo budaya', 'Latihan teknik', 'Kesiapan tanding'],
        fit: [
            'Suka gerak yang presisi',
            'Siap latihan teknik berulang',
            'Tertarik bela diri dan budaya',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Kuda-kuda, rangkaian teknik, dan kontrol tubuh.',
            },
            {
                label: 'Momen tampil',
                value: 'Demonstrasi budaya, latihan terbuka, dan kesiapan tanding.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Fokus, kontrol diri, dan ketahanan fisik yang rapi.',
            },
        ],
        experience: [
            {
                title: 'Masuk dasar teknik',
                description: 'Siswa membangun fondasi gerak dan postur tubuh yang stabil.',
            },
            {
                title: 'Naik ke rangkaian',
                description: 'Latihan bergeser ke kombinasi teknik dan kontrol tempo.',
            },
            {
                title: 'Tampil dengan percaya diri',
                description: 'Unit hadir lewat demo, latihan terbuka, atau kesiapan tanding.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Teknik berkala' },
            { label: 'Tampil', value: 'Demo & tanding' },
            { label: 'Nuansa', value: 'Fokus tinggi' },
        ],
        objectPosition: 'center 26%',
    },
    {
        slug: 'jurnalistik',
        name: 'Jurnalistik',
        category: 'Media',
        image: '/images/sekolah/kegiatan_siswa.jpg',
        accent: '#0284C7',
        icon: Megaphone,
        summary:
            'Tim liputan yang mengolah berita, dokumentasi visual, dan publikasi kegiatan sekolah untuk kanal digital resmi.',
        headline: 'Liputan cepat, redaksi rapi, dan karya yang langsung terpublikasi.',
        cadence: 'Liputan event dan produksi konten',
        metric: 'Konten',
        metricSub: 'Aktif',
        focus: ['Menulis', 'Foto video', 'Redaksi'],
        highlights: ['Berita sekolah', 'Liputan event', 'Konten sosial media'],
        fit: [
            'Suka menulis dan observasi',
            'Tertarik foto atau video',
            'Nyaman kerja dengan deadline',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Menulis, framing visual, dan alur kerja redaksi sederhana.',
            },
            {
                label: 'Momen tampil',
                value: 'Liputan event, konten sekolah, dan publikasi digital.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Tajam mengamati, rapi bekerja, dan cepat mengeksekusi.',
            },
        ],
        experience: [
            {
                title: 'Masuk ritme redaksi',
                description: 'Siswa belajar membaca angle, catatan, dan alur publikasi.',
            },
            {
                title: 'Naik ke liputan',
                description: 'Mulai turun ke event untuk menulis, memotret, atau merekam.',
            },
            {
                title: 'Terbit di kanal sekolah',
                description: 'Konten yang rapi siap masuk ke kanal digital resmi sekolah.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Liputan event' },
            { label: 'Tampil', value: 'Konten publik' },
            { label: 'Nuansa', value: 'Cepat & kreatif' },
        ],
        objectPosition: 'center 42%',
    },
    {
        slug: 'tari-tradisional',
        name: 'Tari Tradisional',
        category: 'Seni',
        image: '/images/eskul/collage.png',
        accent: '#F59E0B',
        icon: Sparkles,
        summary:
            'Wadah seni untuk mengasah ekspresi, koreografi, dan keberanian tampil.',
        headline: 'Gerak, ekspresi, dan keberanian tampil di panggung budaya.',
        cadence: 'Latihan koreografi dan penampilan',
        metric: 'Seni',
        metricSub: 'Budaya',
        focus: ['Ekspresi', 'Gerak', 'Kepercayaan diri'],
        highlights: ['Pentas seni', 'Tamu sekolah', 'Hari besar budaya'],
        fit: [
            'Suka gerak dan ekspresi',
            'Nyaman latihan koreografi',
            'Senang tampil di panggung',
        ],
        routine: [
            {
                label: 'Latihan inti',
                value: 'Koreografi, sinkronisasi tim, dan penguatan ekspresi.',
            },
            {
                label: 'Momen tampil',
                value: 'Pentas seni, tamu sekolah, dan agenda budaya.',
            },
            {
                label: 'Karakter tumbuh',
                value: 'Percaya diri, rasa panggung, dan disiplin latihan.',
            },
        ],
        experience: [
            {
                title: 'Masuk koreografi dasar',
                description: 'Siswa mulai dari pola gerak, tempo, dan ekspresi inti.',
            },
            {
                title: 'Naik ke sinkronisasi',
                description: 'Latihan berfokus ke kekompakan dan transisi antarbagian.',
            },
            {
                title: 'Tampil di panggung',
                description: 'Unit hadir pada pentas seni dan agenda budaya sekolah.',
            },
        ],
        stats: [
            { label: 'Ritme', value: 'Koreografi rutin' },
            { label: 'Tampil', value: 'Pentas budaya' },
            { label: 'Nuansa', value: 'Ekspresif' },
        ],
        objectPosition: 'center 34%',
    },
] as const;

export const extracurricularProgramSlugs = extracurricularPrograms.map(
    (program) => program.slug,
);

export function getExtracurricularProgramBySlug(
    slug: string,
): ExtracurricularProgram | undefined {
    return extracurricularPrograms.find((program) => program.slug === slug);
}

export function getRelatedExtracurricularPrograms(
    slug: string,
    limit = 3,
): ExtracurricularProgram[] {
    const currentProgram = getExtracurricularProgramBySlug(slug);

    if (!currentProgram) {
        return [];
    }

    return extracurricularPrograms
        .filter((program) => program.slug !== slug)
        .sort((left, right) => {
            const leftWeight = left.category === currentProgram.category ? 1 : 0;
            const rightWeight =
                right.category === currentProgram.category ? 1 : 0;

            return rightWeight - leftWeight;
        })
        .slice(0, limit);
}
