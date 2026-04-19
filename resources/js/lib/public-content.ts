import type { VirtualTourScene } from '@/types';

export type NavItem = {
    href: string;
    label: string;
    children?: { href: string; label: string; description?: string }[];
};

export const publicNavigation: NavItem[] = [
    { href: '/', label: 'Beranda' },
    {
        href: '/profil',
        label: 'Profil',
        children: [
            {
                href: '/profil#sejarah',
                label: 'Sejarah Singkat',
                description: 'Latar belakang dan perjalanan sekolah',
            },
            {
                href: '/profil#visi-misi',
                label: 'Visi & Misi',
                description: 'Arah dan nilai-nilai sekolah',
            },
            {
                href: '/profil#sarana-prasarana',
                label: 'Sarana Prasarana',
                description: 'Fasilitas dan infrastruktur',
            },
            {
                href: '/profil#prestasi',
                label: 'Prestasi Sekolah',
                description: 'Capaian akademik dan non-akademik',
            },
        ],
    },
    {
        href: '/akademik',
        label: 'Akademik',
        children: [
            {
                href: '/akademik#kurikulum',
                label: 'Kurikulum Merdeka',
                description: 'Implementasi kurikulum terbaru',
            },
            {
                href: '/akademik#p5',
                label: 'Projek P5',
                description: 'Penguatan Profil Pelajar Pancasila',
            },
            {
                href: '/akademik#eskul',
                label: 'Ekstrakurikuler',
                description: '6 eskul resmi terdokumentasi',
            },
        ],
    },
    { href: '/ppdb', label: 'PPDB' },
    { href: '/berita', label: 'Berita' },
    {
        href: '/dokumen',
        label: 'Dokumen',
        children: [
            {
                href: '/dokumen#unduhan',
                label: 'Unduhan',
                description: 'File publik sekolah',
            },
            {
                href: '/dokumen#formulir',
                label: 'Formulir',
                description: 'Format umum sekolah',
            },
            {
                href: '/dokumen#panduan',
                label: 'Panduan',
                description: 'Rujukan singkat layanan',
            },
        ],
    },
    {
        href: '/organisasi',
        label: 'Sekolah',
        children: [
            {
                href: '/organisasi',
                label: 'Struktur Organisasi',
                description: 'Hierarki kepemimpinan dan manajemen',
            },
            {
                href: '/guru',
                label: 'Tenaga Pendidik',
                description: 'Profil guru dan staf pengajar',
            },
            {
                href: '/alumni',
                label: 'Forum Alumni',
                description: 'Cerita, diskusi, dan jejak lulusan',
            },
            {
                href: '/alumni/tulis-cerita',
                label: 'Tulis Cerita',
                description: 'Halaman khusus untuk mengirim cerita alumni',
            },
        ],
    },
];

export const schoolSocials = {
    instagram: {
        handle: '@sman1tenjo',
        url: 'https://www.instagram.com/sman1tenjo/',
    },
    youtube: {
        handle: 'SMAN 1 Tenjo Official',
        channelHandle: '@sman1tenjoofficial115',
        url: 'https://www.youtube.com/@sman1tenjoofficial115',
    },
} as const;

export const schoolHighlights = [
    {
        title: 'Lahan Sekolah 11.396 m²',
        description:
            'Skala lahan yang luas memberi ruang untuk pembelajaran, eksplorasi proyek, dan aktivitas organisasi yang lebih hidup.',
        metric: '11.396 m²',
    },
    {
        title: 'Moving Class Nyata',
        description:
            '30 rombel dihadapkan pada 21 ruang kelas fisik, sehingga sistem belajar harus adaptif, tertata, dan antarbentrok.',
        metric: '30 : 21',
    },
    {
        title: 'Fasilitas Akademik Kunci',
        description:
            'Laboratorium dan perpustakaan menjadi simpul penting untuk pembelajaran Kurikulum Merdeka dan eksplorasi P5.',
        metric: '3 Lab + 2 Perpus',
    },
] as const;

export const signaturePrograms = [
    {
        eyebrow: 'Karakter',
        title: 'BATARA KRESNA',
        icon: 'shield-check',
        description:
            'Beriman, Bertaqwa, Berkarakter, dan Bebas Narkoba diterjemahkan ke dalam cara belajar, bersikap, dan berorganisasi.',
        longDescription:
            'Bukan sekadar slogan dinding. BATARA KRESNA menjadi parameter penilaian sikap, dasar pembinaan, dan narasi identitas yang melekat di setiap program sekolah.',
        stats: [
            { label: 'Pilar Nilai', value: '4' },
            { label: 'Integrasi Mapel', value: '100%' },
        ],
        tags: ['Pembinaan', 'Anti-Narkoba', 'Akhlak'],
        accentColor: '#0F766E',
    },
    {
        eyebrow: 'Kurikulum',
        title: 'P5 dan Panen Karya',
        icon: 'book-open',
        description:
            'Karya siswa bukan lampiran akhir semester, tetapi wajah nyata pembelajaran lintas tema dan lintas disiplin.',
        longDescription:
            'Proyek Penguatan Profil Pelajar Pancasila menghasilkan artefak nyata: produk, presentasi, dan dokumentasi yang dipamerkan secara publik tiap semester.',
        stats: [
            { label: 'Tema P5', value: '7' },
            { label: 'Karya / Semester', value: '60+' },
        ],
        tags: ['Kurikulum Merdeka', 'Projek', 'Lintas-Disiplin'],
        accentColor: '#0369A1',
    },
    {
        eyebrow: 'Gastronomi',
        title: 'MUSTIKARASA',
        icon: 'chef-hat',
        description:
            'Produk gastronomi menjadi medium kreativitas, kewirausahaan, dan dokumentasi capaian siswa yang bisa dipamerkan publik.',
        longDescription:
            'Program kuliner khas yang menghubungkan seni memasak dengan kewirausahaan. Setiap produk didokumentasikan sebagai portofolio publik dan pengalaman belajar autentik.',
        stats: [
            { label: 'Produk Aktif', value: '12' },
            { label: 'Siswa Terlibat', value: '150+' },
        ],
        tags: ['Kewirausahaan', 'Kuliner', 'Kreativitas'],
        accentColor: '#D97706',
    },
    {
        eyebrow: 'Komunitas',
        title: 'Jurnalistik, Tari, Paskibra',
        icon: 'users',
        description:
            'Ekstrakurikuler diposisikan sebagai panggung reputasi sekolah, bukan sekadar daftar kegiatan tambahan.',
        longDescription:
            'Tiga pilar komunitas yang membentuk wajah publik sekolah: narasi media oleh jurnalistik, ekspresi budaya oleh tari, dan kedisiplinan oleh paskibra.',
        stats: [
            { label: 'Ekskul Aktif', value: '18' },
            { label: 'Partisipasi', value: '85%' },
        ],
        tags: ['Media', 'Seni-Budaya', 'Kedisiplinan'],
        accentColor: '#7C3AED',
    },
] as const;

export const extracurricularVideoShowcase = [
    {
        id: 'tari-tradisional',
        title: 'Tari Tradisional',
        category: 'Budaya',
        description:
            'Highlight panggung budaya sekolah dengan fokus pada koreografi, kostum, dan disiplin penampilan.',
        state: 'Fallback Feed',
    },
    {
        id: 'paskibra',
        title: 'Paskibra',
        category: 'Kepemimpinan',
        description:
            'Visualisasi kedisiplinan, presisi gerak, dan ketahanan latihan sebagai identitas ekstrakurikuler unggulan.',
        state: 'Fallback Feed',
    },
    {
        id: 'jurnalistik-smanten',
        title: 'Jurnalistik SMANTEN',
        category: 'Media',
        description:
            'Liputan kegiatan, dokumentasi sekolah, dan karya editorial siswa yang nanti bisa dihubungkan ke YouTube API.',
        state: 'Fallback Feed',
    },
    {
        id: 'adiwiyata',
        title: 'Adiwiyata',
        category: 'Lingkungan',
        description:
            'Cerita sekolah hijau, pengelolaan lingkungan, dan pembiasaan kolektif yang membentuk budaya sekolah.',
        state: 'Fallback Feed',
    },
] as const;

export const organizationBlueprint = {
    school_management: [
        {
            id: 'kepala-sekolah',
            title: 'Kepala Sekolah',
            tier: 1,
            description:
                'Simpul kepemimpinan utama yang memegang arah institusi dan kualitas keputusan strategis.',
        },
        {
            id: 'wakasek-kurikulum',
            title: 'Wakasek Kurikulum',
            tier: 2,
            description:
                'Mengawal desain akademik, ritme pembelajaran, dan sinkronisasi program belajar.',
        },
        {
            id: 'wakasek-kesiswaan',
            title: 'Wakasek Kesiswaan',
            tier: 2,
            description:
                'Menjaga ekosistem siswa, pembinaan karakter, dan dinamika organisasi peserta didik.',
        },
        {
            id: 'wakasek-sarpras',
            title: 'Wakasek Sarpras',
            tier: 2,
            description:
                'Menata ruang, fasilitas, dan kesiapan operasional sekolah untuk kegiatan harian.',
        },
        {
            id: 'wakasek-humas',
            title: 'Wakasek Humas',
            tier: 2,
            description:
                'Mengarahkan hubungan eksternal, reputasi sekolah, dan komunikasi publik.',
        },
        {
            id: 'operator-sekolah',
            title: 'Operator Sekolah',
            tier: 3,
            description:
                'Menjaga akurasi data sekolah, sinkronisasi sistem, dan administrasi digital inti.',
        },
        {
            id: 'bk',
            title: 'Bimbingan Konseling',
            tier: 3,
            description:
                'Menjadi titik dukungan, pendampingan, dan penguatan perkembangan siswa.',
        },
        {
            id: 'wali-kelas',
            title: 'Wali Kelas',
            tier: 3,
            description:
                'Menyambungkan kebijakan sekolah dengan pembinaan harian di rombel.',
        },
    ],
    student_organization: [
        {
            id: 'ketua-osis',
            title: 'Ketua OSIS',
            tier: 1,
            description:
                'Wajah kepemimpinan siswa yang memimpin arah kerja organisasi secara publik.',
        },
        {
            id: 'wakil-ketua-osis',
            title: 'Wakil Ketua OSIS',
            tier: 2,
            description:
                'Mendukung koordinasi lintas bidang dan menjaga kesinambungan keputusan organisasi.',
        },
        {
            id: 'sekretaris-osis',
            title: 'Sekretaris OSIS',
            tier: 2,
            description:
                'Mengelola administrasi organisasi, agenda, dan arsip kegiatan siswa.',
        },
        {
            id: 'bendahara-osis',
            title: 'Bendahara OSIS',
            tier: 2,
            description:
                'Menjaga pengelolaan anggaran kegiatan agar tertib, transparan, dan bertanggung jawab.',
        },
        {
            id: 'sekbid-karakter',
            title: 'Sekbid Karakter',
            tier: 3,
            description:
                'Mendorong agenda karakter, disiplin, dan kultur siswa yang sehat.',
        },
        {
            id: 'sekbid-media',
            title: 'Sekbid Media',
            tier: 3,
            description:
                'Menjadi simpul publikasi, dokumentasi, dan komunikasi kegiatan siswa.',
        },
        {
            id: 'sekbid-budaya',
            title: 'Sekbid Budaya',
            tier: 3,
            description:
                'Menghidupkan kegiatan seni, tradisi, dan ekspresi kolektif sekolah.',
        },
        {
            id: 'sekbid-lingkungan',
            title: 'Sekbid Lingkungan',
            tier: 3,
            description:
                'Mengawal agenda Adiwiyata dan pembiasaan peduli lingkungan dalam kegiatan OSIS.',
        },
    ],
} as const;

export const virtualTourScenes: VirtualTourScene[] = [
    {
        id: 'gerbang-utama',
        title: 'Gerbang Utama',
        eyebrow: 'Orientasi Kawasan',
        description:
            'Titik masuk utama untuk membaca skala lingkungan sekolah, arus kedatangan, dan kesan pertama terhadap identitas SMAN 1 Tenjo.',
        imageUrl: '/virtual-tour/panoramas/gerbang-utama.svg',
        accentColor: '#0f766e',
        initialYaw: 0,
        facts: [
            'Gerbang utama menjadi orientasi pertama pengunjung terhadap skala lingkungan sekolah.',
            'Arah visual dibuat terbuka agar transisi dari jalan raya ke area sekolah terasa jelas.',
            'Hotspot berikutnya mengarah ke laboratorium dan lapangan pusat.',
        ],
        hotspots: [
            {
                id: 'to-laboratorium',
                label: 'Menuju Laboratorium',
                targetSceneId: 'laboratorium',
                yaw: 48,
                pitch: -6,
            },
            {
                id: 'to-lapangan',
                label: 'Lihat Lapangan',
                targetSceneId: 'lapangan-pusat',
                yaw: -36,
                pitch: -8,
            },
        ],
    },
    {
        id: 'laboratorium',
        title: 'Koridor Laboratorium',
        eyebrow: 'Eksperimen dan Praktik',
        description:
            'Area yang menunjukkan bagaimana pembelajaran praktikum diposisikan sebagai pengalaman, bukan sekadar prosedur.',
        imageUrl: '/virtual-tour/panoramas/laboratorium.svg',
        accentColor: '#0369a1',
        initialYaw: 18,
        facts: [
            'Koridor laboratorium dibuat sebagai jalur transisi dari teori ke praktik.',
            'Viewer ini dapat diperluas ke hotspot spesifik per-lab pada iterasi berikutnya.',
            'Ruang ini menekankan ritme belajar berbasis eksplorasi dan observasi.',
        ],
        hotspots: [
            {
                id: 'to-gerbang',
                label: 'Kembali ke Gerbang',
                targetSceneId: 'gerbang-utama',
                yaw: -78,
                pitch: -4,
            },
            {
                id: 'to-perpustakaan',
                label: 'Masuk Perpustakaan',
                targetSceneId: 'perpustakaan',
                yaw: 62,
                pitch: -3,
            },
        ],
    },
    {
        id: 'perpustakaan',
        title: 'Perpustakaan',
        eyebrow: 'Ruang Baca dan Temu',
        description:
            'Zona yang akan menonjolkan perpustakaan sebagai simpul literasi, riset kecil, dan ekosistem belajar mandiri.',
        imageUrl: '/virtual-tour/panoramas/perpustakaan.svg',
        accentColor: '#a16207',
        initialYaw: -12,
        facts: [
            'Perpustakaan diposisikan sebagai ruang temu antara literasi, riset kecil, dan refleksi.',
            'Panorama memungkinkan pembacaan ruang tanpa memutus konteks keseluruhan area sekolah.',
            'Hotspot dapat diperluas ke rak koleksi, area diskusi, dan meja baca.',
        ],
        hotspots: [
            {
                id: 'to-laboratorium',
                label: 'Kembali ke Lab',
                targetSceneId: 'laboratorium',
                yaw: -65,
                pitch: -4,
            },
            {
                id: 'to-lapangan',
                label: 'Lihat Lapangan Pusat',
                targetSceneId: 'lapangan-pusat',
                yaw: 56,
                pitch: -6,
            },
        ],
    },
    {
        id: 'lapangan-pusat',
        title: 'Lapangan Pusat',
        eyebrow: 'Aktivitas Kolektif',
        description:
            'Ruang transisi antara akademik, upacara, ekstrakurikuler, dan dinamika komunitas siswa setiap harinya.',
        imageUrl: '/virtual-tour/panoramas/lapangan-pusat.svg',
        accentColor: '#15803d',
        initialYaw: 8,
        facts: [
            'Lapangan menjadi simpul ritme kolektif: upacara, latihan, dan kegiatan terbuka.',
            'Panorama ini menutup pengalaman tur dengan gambaran ruang komunal sekolah.',
            'Scene dapat diperluas ke jalur kegiatan ekstrakurikuler dan area upacara.',
        ],
        hotspots: [
            {
                id: 'to-gerbang',
                label: 'Arah Gerbang',
                targetSceneId: 'gerbang-utama',
                yaw: 74,
                pitch: -8,
            },
            {
                id: 'to-perpustakaan',
                label: 'Menuju Perpustakaan',
                targetSceneId: 'perpustakaan',
                yaw: -52,
                pitch: -5,
            },
        ],
    },
];

export const ppdbFaqs = [
    {
        question: 'Apakah koordinat rumah wajib akurat?',
        answer: 'Ya. Preview jarak memakai titik koordinat untuk mengurangi bias alamat teks dan mempermudah evaluasi zonasi.',
    },
    {
        question: 'Apakah peta langsung menentukan hasil seleksi?',
        answer: 'Tidak. Peta memberi simulasi awal. Validasi akhir tetap mengikuti verifikasi dokumen dan aturan siklus PPDB aktif.',
    },
    {
        question: 'Bagaimana jika belum tahu latitude dan longitude rumah?',
        answer: 'Halaman ini sudah menyediakan geocoding alamat, klik peta, lokasi browser, dan input manual koordinat sebagai lapisan cadangan.',
    },
] as const;
