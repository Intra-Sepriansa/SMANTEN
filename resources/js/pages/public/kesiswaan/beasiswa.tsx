import {
    BadgeDollarSign,
    CalendarClock,
    ClipboardList,
    FileCheck2,
    HandHeart,
    ShieldCheck,
    WalletCards,
} from 'lucide-react';
import { StudentAffairsFocusPage } from '@/components/public/student-affairs-focus-page';
import type { StudentAffairsFocusConfig } from '@/components/public/student-affairs-focus-page';
import type { SchoolProfilePayload } from '@/types';

type BeasiswaPageProps = {
    school: SchoolProfilePayload;
};

const focus: StudentAffairsFocusConfig = {
    title: 'Beasiswa',
    shortTitle: 'Beasiswa',
    eyebrow: 'Akses Dukungan Pendidikan',
    headTitle: 'Beasiswa',
    metaDescription:
        'Halaman khusus beasiswa untuk informasi peluang bantuan pendidikan, syarat, jadwal, dan pendampingan administrasi.',
    heroImage: '/images/profil/hero-banner.png',
    heroImageAlt: 'Layanan beasiswa SMAN 1 Tenjo',
    accent: '#7C3AED',
    accentSoft: 'rgba(124,58,237,0.2)',
    accentDark: '#4C1D95',
    intro: 'Ruang beasiswa yang fokus pada informasi peluang bantuan, syarat administrasi, jadwal penting, dan pendampingan siswa.',
    promise:
        'Beasiswa menjadi jalur dukungan agar akses pendidikan tetap terbuka.',
    stats: [
        {
            label: 'Peluang',
            value: 'Dipantau',
            helper: 'Informasi bantuan pendidikan dikumpulkan secara tertib.',
            icon: BadgeDollarSign,
        },
        {
            label: 'Syarat',
            value: 'Jelas',
            helper: 'Kebutuhan dokumen dibuat mudah dibaca siswa.',
            icon: ClipboardList,
        },
        {
            label: 'Jadwal',
            value: 'Terkawal',
            helper: 'Batas waktu bantuan tidak mudah terlewat.',
            icon: CalendarClock,
        },
        {
            label: 'Dampingan',
            value: 'Siap',
            helper: 'Siswa dibantu memahami alur administrasi.',
            icon: HandHeart,
        },
    ],
    steps: [
        {
            label: '01',
            title: 'Pantau Peluang',
            description: 'Pantau jalur bantuan.',
            icon: WalletCards,
        },
        {
            label: '02',
            title: 'Cek Syarat',
            description: 'Baca dokumen dan tenggat.',
            icon: ClipboardList,
        },
        {
            label: '03',
            title: 'Siapkan Berkas',
            description: 'Susun berkas pengajuan.',
            icon: FileCheck2,
        },
        {
            label: '04',
            title: 'Tindak Lanjut',
            description: 'Pantau status bantuan.',
            icon: ShieldCheck,
        },
    ],
    panels: [
        {
            title: 'Informasi Peluang',
            description: 'Peluang bantuan pendidikan.',
            metric: 'Akses',
            value: 'Bantu',
            icon: BadgeDollarSign,
        },
        {
            title: 'Checklist Syarat',
            description: 'Dokumen yang harus siap.',
            metric: 'Syarat',
            value: 'Cek',
            icon: ClipboardList,
        },
        {
            title: 'Pendampingan Administrasi',
            description: 'Bantu proses pengajuan.',
            metric: 'Support',
            value: 'Damping',
            icon: HandHeart,
        },
    ],
    serviceSignals: ['Peluang', 'Syarat', 'Dampingan'],
    finalTitle: 'Fokus halaman ini hanya beasiswa.',
    finalDescription:
        'Semua informasi diarahkan untuk peluang bantuan, syarat, dan pendampingan administrasi tanpa mencampur OSIS, prestasi, atau BK.',
};

export default function BeasiswaPage({ school }: BeasiswaPageProps) {
    return <StudentAffairsFocusPage school={school} focus={focus} />;
}
