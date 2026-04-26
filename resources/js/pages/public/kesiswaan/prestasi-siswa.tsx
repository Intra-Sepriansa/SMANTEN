import {
    Award,
    BadgeCheck,
    BarChart3,
    ClipboardCheck,
    Medal,
    Sparkles,
    Target,
    Trophy,
} from 'lucide-react';
import { StudentAffairsFocusPage } from '@/components/public/student-affairs-focus-page';
import type { StudentAffairsFocusConfig } from '@/components/public/student-affairs-focus-page';
import type { SchoolProfilePayload } from '@/types';

type PrestasiSiswaPageProps = {
    school: SchoolProfilePayload;
};

const focus: StudentAffairsFocusConfig = {
    title: 'Prestasi Siswa',
    shortTitle: 'Prestasi Siswa',
    eyebrow: 'Reputasi dan Capaian',
    headTitle: 'Prestasi Siswa',
    metaDescription:
        'Halaman khusus prestasi siswa untuk pemetaan capaian, kurasi, apresiasi, dan publikasi prestasi.',
    heroImage: '/images/sekolah/murid_belajar.jpg',
    heroImageAlt: 'Prestasi siswa SMAN 1 Tenjo',
    accent: '#D97706',
    accentSoft: 'rgba(245,158,11,0.2)',
    accentDark: '#92400E',
    intro: 'Ruang prestasi siswa yang fokus pada pendataan capaian, validasi, apresiasi, dan publikasi reputasi siswa.',
    promise:
        'Prestasi siswa dipetakan sebagai bukti pembinaan dan capaian belajar.',
    stats: [
        {
            label: 'Capaian',
            value: 'Terekam',
            helper: 'Prestasi akademik dan non-akademik mudah dicatat.',
            icon: Trophy,
        },
        {
            label: 'Kurasi',
            value: 'Selektif',
            helper: 'Capaian ditinjau agar informasi yang tampil akurat.',
            icon: BadgeCheck,
        },
        {
            label: 'Apresiasi',
            value: 'Terarah',
            helper: 'Siswa mendapat pengakuan sesuai capaian.',
            icon: Medal,
        },
        {
            label: 'Publikasi',
            value: 'Siap',
            helper: 'Prestasi bisa menjadi bagian reputasi sekolah.',
            icon: Sparkles,
        },
    ],
    steps: [
        {
            label: '01',
            title: 'Input Capaian',
            description: 'Catat capaian dan bukti.',
            icon: Award,
        },
        {
            label: '02',
            title: 'Validasi',
            description: 'Periksa data dan level lomba.',
            icon: ClipboardCheck,
        },
        {
            label: '03',
            title: 'Apresiasi',
            description: 'Berikan ruang pengakuan.',
            icon: Medal,
        },
        {
            label: '04',
            title: 'Publikasi',
            description: 'Siapkan sorotan prestasi.',
            icon: BarChart3,
        },
    ],
    panels: [
        {
            title: 'Pemetaan Prestasi',
            description: 'Petakan akademik dan non-akademik.',
            metric: 'Data',
            value: 'Map',
            icon: Target,
        },
        {
            title: 'Validasi Bukti',
            description: 'Jaga akurasi capaian.',
            metric: 'Mutu',
            value: 'Valid',
            icon: BadgeCheck,
        },
        {
            title: 'Apresiasi Publik',
            description: 'Sorot prestasi terpilih.',
            metric: 'Output',
            value: 'Sorot',
            icon: Trophy,
        },
    ],
    serviceSignals: ['Capaian', 'Validasi', 'Apresiasi'],
    finalTitle: 'Fokus halaman ini hanya prestasi siswa.',
    finalDescription:
        'Semua panel diarahkan untuk capaian, validasi, dan apresiasi prestasi tanpa mencampur OSIS, beasiswa, atau BK.',
};

export default function PrestasiSiswaPage({ school }: PrestasiSiswaPageProps) {
    return <StudentAffairsFocusPage school={school} focus={focus} />;
}
