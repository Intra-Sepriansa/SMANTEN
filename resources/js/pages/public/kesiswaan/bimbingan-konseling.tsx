import {
    BookHeart,
    BrainCircuit,
    CalendarCheck2,
    HeartHandshake,
    LifeBuoy,
    MessageCircleHeart,
    Route,
    ShieldCheck,
} from 'lucide-react';
import { StudentAffairsFocusPage } from '@/components/public/student-affairs-focus-page';
import type { StudentAffairsFocusConfig } from '@/components/public/student-affairs-focus-page';
import type { SchoolProfilePayload } from '@/types';

type BimbinganKonselingPageProps = {
    school: SchoolProfilePayload;
};

const focus: StudentAffairsFocusConfig = {
    title: 'Bimbingan Konseling',
    shortTitle: 'Bimbingan Konseling',
    eyebrow: 'Pendampingan Siswa',
    headTitle: 'Bimbingan Konseling',
    metaDescription:
        'Halaman khusus Bimbingan Konseling untuk pendampingan akademik, sosial emosi, relasi, dan arah karier siswa.',
    heroImage: '/images/sekolah/murid_belajar.jpg',
    heroImageAlt: 'Bimbingan konseling siswa SMAN 1 Tenjo',
    accent: '#DC2626',
    accentSoft: 'rgba(220,38,38,0.18)',
    accentDark: '#7F1D1D',
    intro: 'Ruang BK yang fokus pada pendampingan belajar, sosial emosi, relasi, dan arah masa depan siswa.',
    promise: 'BK menjadi ruang aman untuk membaca kebutuhan siswa lebih awal.',
    stats: [
        {
            label: 'Konsultasi',
            value: 'Aman',
            helper: 'Siswa punya ruang awal untuk menyampaikan kebutuhan.',
            icon: MessageCircleHeart,
        },
        {
            label: 'Akademik',
            value: 'Terarah',
            helper: 'Hambatan belajar dibaca bersama wali dan guru.',
            icon: BookHeart,
        },
        {
            label: 'Sosial Emosi',
            value: 'Peduli',
            helper: 'Dukungan diberikan sebelum masalah berkembang besar.',
            icon: HeartHandshake,
        },
        {
            label: 'Karier',
            value: 'Dipandu',
            helper: 'Arah pilihan lanjutan dibicarakan lebih matang.',
            icon: Route,
        },
    ],
    steps: [
        {
            label: '01',
            title: 'Identifikasi Awal',
            description: 'Baca kebutuhan awal.',
            icon: BrainCircuit,
        },
        {
            label: '02',
            title: 'Konsultasi',
            description: 'Ruang bicara terarah.',
            icon: MessageCircleHeart,
        },
        {
            label: '03',
            title: 'Rencana Dampingan',
            description: 'Susun langkah dukungan.',
            icon: CalendarCheck2,
        },
        {
            label: '04',
            title: 'Pemantauan',
            description: 'Pantau perkembangan siswa.',
            icon: ShieldCheck,
        },
    ],
    panels: [
        {
            title: 'Ruang Konsultasi',
            description: 'Akses konsultasi awal.',
            metric: 'Akses',
            value: 'BK',
            icon: MessageCircleHeart,
        },
        {
            title: 'Dukungan Belajar',
            description: 'Baca hambatan akademik.',
            metric: 'Belajar',
            value: 'Arah',
            icon: BookHeart,
        },
        {
            title: 'Tindak Lanjut',
            description: 'Koordinasi dukungan lanjutan.',
            metric: 'Care',
            value: 'Follow',
            icon: LifeBuoy,
        },
    ],
    serviceSignals: ['Konsultasi', 'Belajar', 'Karier'],
    finalTitle: 'Fokus halaman ini hanya Bimbingan Konseling.',
    finalDescription:
        'Seluruh isi diarahkan untuk pendampingan siswa dan tidak mencampur OSIS, prestasi, atau beasiswa.',
};

export default function BimbinganKonselingPage({
    school,
}: BimbinganKonselingPageProps) {
    return <StudentAffairsFocusPage school={school} focus={focus} />;
}
