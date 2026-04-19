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
                href: '/profil',
                label: 'Profil',
                description: 'Identitas sekolah',
            },
            {
                href: '/profil#sejarah',
                label: 'Sejarah Singkat',
                description: 'Riwayat sekolah',
            },
            {
                href: '/profil#visi-misi',
                label: 'Visi & Misi',
                description: 'Arah dan nilai sekolah',
            },
            {
                href: '/profil#sarana-prasarana',
                label: 'Sarana Prasarana',
                description: 'Fasilitas sekolah',
            },
            {
                href: '/profil#prestasi',
                label: 'Prestasi Sekolah',
                description: 'Capaian sekolah',
            },
        ],
    },
    {
        href: '/organisasi',
        label: 'Komunitas',
        children: [
            {
                href: '/organisasi',
                label: 'Struktur Organisasi',
                description: 'Struktur sekolah',
            },
            {
                href: '/guru',
                label: 'Tenaga Pendidik',
                description: 'Profil guru',
            },
            {
                href: '/alumni',
                label: 'Forum Alumni',
                description: 'Jejak lulusan',
            },
            {
                href: '/alumni/tulis-cerita',
                label: 'Tulis Cerita',
                description: 'Kirim cerita alumni',
            },
            {
                href: '/virtual-tour',
                label: 'Virtual Tour',
                description: 'Jelajah sekolah',
            },
        ],
    },
    {
        href: '/akademik',
        label: 'Akademik',
        children: [
            {
                href: '/akademik',
                label: 'Akademik',
                description: 'Kurikulum dan pembelajaran',
            },
            {
                href: '/akademik#kurikulum',
                label: 'Kurikulum Merdeka',
                description: 'Kurikulum sekolah',
            },
            {
                href: '/akademik#p5',
                label: 'Projek P5',
                description: 'Projek penguatan karakter',
            },
        ],
    },
    {
        href: '/kesiswaan',
        label: 'Kesiswaan',
        children: [
            {
                href: '/ekstrakurikuler',
                label: 'Ekstrakurikuler',
                description: 'Kegiatan minat bakat',
            },
            {
                href: '/kesiswaan',
                label: 'Kesiswaan',
                description: 'Pembinaan siswa',
            },
            {
                href: '/kesiswaan#osis-mpk',
                label: 'OSIS & MPK',
                description: 'Organisasi siswa',
            },
            {
                href: '/kesiswaan#prestasi-siswa',
                label: 'Prestasi Siswa',
                description: 'Capaian siswa',
            },
            {
                href: '/kesiswaan#beasiswa',
                label: 'Beasiswa',
                description: 'Informasi bantuan',
            },
            {
                href: '/kesiswaan#bimbingan-konseling',
                label: 'Bimbingan Konseling',
                description: 'Pendampingan siswa',
            },
        ],
    },
    { href: '/ppdb', label: 'PPDB' },
    {
        href: '/media',
        label: 'Informasi',
        children: [
            {
                href: '/berita',
                label: 'Berita & Artikel',
                description: 'Rilis dan artikel sekolah',
            },
            {
                href: '/media',
                label: 'Dokumentasi',
                description: 'Galeri foto dan video sekolah',
            },
            {
                href: '/layanan',
                label: 'Layanan',
                description: 'FAQ dan kontak sekolah',
            },
            {
                href: '/dokumen',
                label: 'Dokumen',
                description: 'Unduhan resmi',
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
            'Lahan sekolah mendukung ruang belajar, kegiatan siswa, dan aktivitas luar kelas.',
        metric: '11.396 m²',
    },
    {
        title: 'Moving Class Nyata',
        description:
            '30 rombel dan 21 ruang kelas dikelola dengan jadwal belajar yang tertata.',
        metric: '30 : 21',
    },
    {
        title: 'Fasilitas Akademik Kunci',
        description:
            'Laboratorium dan perpustakaan mendukung pembelajaran, literasi, dan projek siswa.',
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
            'BATARA KRESNA menjadi dasar pembinaan sikap, budaya sekolah, dan kegiatan siswa.',
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
            'Karya siswa menunjukkan hasil pembelajaran lintas tema dan lintas disiplin.',
        longDescription:
            'Proyek Penguatan Profil Pelajar Pancasila menghasilkan produk, presentasi, dan dokumentasi belajar.',
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
            'Produk gastronomi melatih kreativitas, kewirausahaan, dan kerja tim siswa.',
        longDescription:
            'Program kuliner menghubungkan praktik memasak, perencanaan produk, dan kewirausahaan.',
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
            'Ekstrakurikuler menjadi ruang pengembangan minat, disiplin, dan kepemimpinan siswa.',
        longDescription:
            'Jurnalistik, tari, dan paskibra memperkuat publikasi, budaya, dan kedisiplinan siswa.',
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
            'Dokumentasi tari tradisional dengan fokus pada koreografi, kostum, dan disiplin latihan.',
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
                'Koordinator utama program OSIS dan representasi kepemimpinan siswa.',
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
                'Mengelola publikasi, dokumentasi, dan komunikasi kegiatan siswa.',
        },
        {
            id: 'sekbid-budaya',
            title: 'Sekbid Budaya',
            tier: 3,
            description:
                'Menguatkan kegiatan seni, tradisi, dan ekspresi kolektif sekolah.',
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
            'Gerbang utama menjadi titik orientasi pertama pengunjung.',
            'Area ini menunjukkan akses masuk dari jalan raya ke lingkungan sekolah.',
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
            'Area praktik untuk mendukung pembelajaran sains, teknologi, dan observasi.',
        imageUrl: '/virtual-tour/panoramas/laboratorium.svg',
        accentColor: '#0369a1',
        initialYaw: 18,
        facts: [
            'Koridor laboratorium dibuat sebagai jalur transisi dari teori ke praktik.',
            'Hotspot dapat diperluas ke ruang laboratorium yang lebih spesifik.',
            'Ruang ini mendukung eksplorasi dan observasi siswa.',
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
            'Ruang literasi untuk membaca, diskusi, dan belajar mandiri.',
        imageUrl: '/virtual-tour/panoramas/perpustakaan.svg',
        accentColor: '#a16207',
        initialYaw: -12,
        facts: [
            'Perpustakaan mendukung literasi, riset sederhana, dan refleksi belajar.',
            'Panorama membantu pengunjung melihat konteks ruang secara utuh.',
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
            'Area terbuka untuk upacara, olahraga, latihan, dan kegiatan siswa.',
        imageUrl: '/virtual-tour/panoramas/lapangan-pusat.svg',
        accentColor: '#15803d',
        initialYaw: 8,
        facts: [
            'Lapangan digunakan untuk upacara, latihan, dan kegiatan terbuka.',
            'Panorama ini memberi gambaran ruang komunal sekolah.',
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
