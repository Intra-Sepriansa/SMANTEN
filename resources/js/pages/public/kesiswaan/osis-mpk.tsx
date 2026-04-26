import {
    CalendarDays,
    ClipboardCheck,
    MessageSquareText,
    Network,
    RadioTower,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { StudentAffairsFocusPage } from '@/components/public/student-affairs-focus-page';
import type { StudentAffairsFocusConfig } from '@/components/public/student-affairs-focus-page';
import type { SchoolProfilePayload } from '@/types';

type OsisMpkPageProps = {
    school: SchoolProfilePayload;
};

const focus: StudentAffairsFocusConfig = {
    title: 'OSIS & MPK',
    shortTitle: 'OSIS & MPK',
    eyebrow: 'Kepemimpinan Siswa',
    headTitle: 'OSIS & MPK',
    metaDescription:
        'Halaman khusus OSIS & MPK untuk aspirasi, agenda, koordinasi, dan regenerasi kepemimpinan siswa.',
    heroImage: '/images/sekolah/kegiatan_siswa.jpg',
    heroImageAlt: 'Kegiatan OSIS dan MPK SMAN 1 Tenjo',
    accent: '#0F766E',
    accentSoft: 'rgba(16,185,129,0.18)',
    accentDark: '#064E3B',
    intro: 'Ruang kepemimpinan siswa yang fokus pada aspirasi, koordinasi agenda, pelaksanaan program, dan regenerasi kepengurusan.',
    promise: 'OSIS & MPK menjadi pusat aspirasi dan koordinasi kegiatan siswa.',
    stats: [
        {
            label: 'Aspirasi',
            value: 'Terbuka',
            helper: 'Suara siswa dikumpulkan sebagai bahan program.',
            icon: MessageSquareText,
        },
        {
            label: 'Agenda',
            value: 'Terkurasi',
            helper: 'Kegiatan siswa diarahkan ke kalender yang jelas.',
            icon: CalendarDays,
        },
        {
            label: 'Koordinasi',
            value: 'Aktif',
            helper: 'MPK dan OSIS saling mengawal pelaksanaan.',
            icon: Network,
        },
        {
            label: 'Regenerasi',
            value: 'Bertahap',
            helper: 'Kepengurusan dibina agar estafet berjalan rapi.',
            icon: Users,
        },
    ],
    steps: [
        {
            label: '01',
            title: 'Aspirasi Siswa',
            description: 'Kumpulkan suara siswa.',
            icon: MessageSquareText,
        },
        {
            label: '02',
            title: 'Rapat Program',
            description: 'Pilih prioritas agenda.',
            icon: RadioTower,
        },
        {
            label: '03',
            title: 'Eksekusi Agenda',
            description: 'Jalankan peran dan dokumentasi.',
            icon: CalendarDays,
        },
        {
            label: '04',
            title: 'Evaluasi',
            description: 'Tutup dengan catatan dampak.',
            icon: ClipboardCheck,
        },
    ],
    panels: [
        {
            title: 'Ruang Aspirasi',
            description: 'Input kebutuhan dan isu siswa.',
            metric: 'Input',
            value: 'Suara',
            icon: MessageSquareText,
        },
        {
            title: 'Agenda Kepengurusan',
            description: 'Sinkron program dan kalender.',
            metric: 'Ritme',
            value: 'Agenda',
            icon: CalendarDays,
        },
        {
            title: 'Kontrol Organisasi',
            description: 'Pantau peran OSIS dan MPK.',
            metric: 'Kontrol',
            value: 'Peran',
            icon: ShieldCheck,
        },
    ],
    serviceSignals: ['Aspirasi', 'Agenda', 'Regenerasi'],
    finalTitle: 'Fokus halaman ini hanya organisasi siswa.',
    finalDescription:
        'Semua informasi di halaman ini diarahkan untuk kepemimpinan OSIS & MPK, bukan prestasi, beasiswa, atau layanan BK.',
};

export default function OsisMpkPage({ school }: OsisMpkPageProps) {
    return <StudentAffairsFocusPage school={school} focus={focus} />;
}
