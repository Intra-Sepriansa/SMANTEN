import { Head } from '@inertiajs/react';
import {
    CheckCircle2,
    LayoutDashboard,
    Medal,
    Sparkles,
    UploadCloud,
    Users,
} from 'lucide-react';
import { AdminAdvancedCommandCenter } from '@/components/internal/admin/admin-advanced-command-center';
import {
    AdminPanel,
    AdminSectionIntro,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import { formatAdminDateTime } from '@/lib/admin-format';
import { dashboard } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { portfolio, students } from '@/routes/dashboard/admin';

type StudentDesk = {
    portfolioLeaders: Array<{
        id: number;
        name: string;
        portfolioCount: number;
    }>;
};

type PortfolioDesk = {
    recentItems: Array<{
        id: number;
        title: string;
        slug: string | null;
        status: string | null;
        statusLabel: string;
        itemType: string;
        isFeatured: boolean;
        project: string | null;
        creator: string | null;
        approver: string | null;
        publishedAt: string | null;
        updatedAt: string | null;
    }>;
    featuredCount: number;
};

type AdminStudentPortfolioProps = {
    stats: {
        studentCount: number;
        portfolioSubmittedCount: number;
        portfolioPublishedCount: number;
    };
    studentDesk: StudentDesk;
    portfolioDesk: PortfolioDesk;
};

export default function AdminStudentPortfolio({
    stats,
    studentDesk,
    portfolioDesk,
}: AdminStudentPortfolioProps) {
    const numberFormatter = new Intl.NumberFormat('id-ID');
    const leaderCount = studentDesk.portfolioLeaders.length;
    const liveRecentCount = portfolioDesk.recentItems.filter(
        (item) => item.status === 'published',
    ).length;

    return (
        <>
            <Head title="Portofolio Siswa" />

            <AdminWorkspaceShell
                current="student-portfolio"
                eyebrow="Student Portfolio"
                title="Portofolio siswa dipisah supaya dampaknya lebih terbaca."
                description="Halaman ini fokus ke sisi siswa: siapa yang produktif, karya mana yang sedang masuk, dan mana yang sudah live."
                stats={[
                    {
                        label: 'Siswa',
                        value: numberFormatter.format(stats.studentCount),
                        helper: 'Akun kontributor',
                        tone: 'sky',
                    },
                    {
                        label: 'Submitted',
                        value: numberFormatter.format(
                            stats.portfolioSubmittedCount,
                        ),
                        helper: 'Masuk dari siswa',
                        tone: 'amber',
                    },
                    {
                        label: 'Live',
                        value: numberFormatter.format(
                            stats.portfolioPublishedCount,
                        ),
                        helper: 'Karya tayang',
                        tone: 'emerald',
                    },
                ]}
                actions={[
                    {
                        label: 'Kembali ke Dashboard',
                        href: adminDashboard(),
                        detail: 'Balik ke ringkasan seluruh menu.',
                        icon: LayoutDashboard,
                        tone: 'slate',
                    },
                    {
                        label: 'Buka Karya Utama',
                        href: portfolio(),
                        detail: 'Lihat moderasi karya dari sisi admin.',
                        icon: Sparkles,
                        tone: 'emerald',
                    },
                    {
                        label: 'Buka Akses Siswa',
                        href: students(),
                        detail: 'Cocokkan kontribusi dengan kesehatan akun siswa.',
                        icon: Users,
                        tone: 'sky',
                    },
                ]}
            >
                <section className="grid gap-6">
                    <AdminAdvancedCommandCenter
                        eyebrow="Student creation command"
                        title="Dampak portofolio siswa dibuat lebih terbaca."
                        description="Kontributor, submission, karya live, dan featured dipantau dari sudut pandang siswa agar sekolah tahu siapa yang perlu diapresiasi atau didampingi."
                        icon={Sparkles}
                        metrics={[
                            {
                                label: 'Siswa',
                                value: numberFormatter.format(
                                    stats.studentCount,
                                ),
                                helper: 'Akun yang bisa berkontribusi.',
                                icon: Users,
                                tone: 'sky',
                            },
                            {
                                label: 'Submitted',
                                value: numberFormatter.format(
                                    stats.portfolioSubmittedCount,
                                ),
                                helper: 'Karya masuk dari siswa.',
                                icon: UploadCloud,
                                tone: 'amber',
                            },
                            {
                                label: 'Live',
                                value: numberFormatter.format(
                                    stats.portfolioPublishedCount,
                                ),
                                helper: 'Karya sudah tayang.',
                                icon: CheckCircle2,
                                tone: 'emerald',
                            },
                            {
                                label: 'Leader',
                                value: numberFormatter.format(leaderCount),
                                helper: 'Siswa paling produktif.',
                                icon: Medal,
                                tone: 'violet',
                            },
                        ]}
                        lanes={[
                            {
                                label: 'Create',
                                title: 'Siswa mengirim karya',
                                description:
                                    'Jumlah submitted menjadi sinyal aktivitas kreatif siswa.',
                                value: numberFormatter.format(
                                    stats.portfolioSubmittedCount,
                                ),
                                icon: UploadCloud,
                                tone: 'amber',
                            },
                            {
                                label: 'Lead',
                                title: 'Top creator teridentifikasi',
                                description:
                                    'Daftar leader membantu guru memberi apresiasi dan bimbingan.',
                                value: numberFormatter.format(leaderCount),
                                icon: Medal,
                                tone: 'violet',
                            },
                            {
                                label: 'Feature',
                                title: 'Karya pilihan muncul ke permukaan',
                                description:
                                    'Featured live memperlihatkan karya yang paling siap disorot.',
                                value: numberFormatter.format(
                                    portfolioDesk.featuredCount,
                                ),
                                icon: Sparkles,
                                tone: 'sky',
                            },
                            {
                                label: 'Publish',
                                title: 'Karya live menjadi bukti capaian',
                                description:
                                    'Karya yang sudah tayang menguatkan rekam jejak belajar siswa.',
                                value: numberFormatter.format(
                                    liveRecentCount ||
                                        stats.portfolioPublishedCount,
                                ),
                                icon: CheckCircle2,
                                tone: 'emerald',
                            },
                        ]}
                    />

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Top Students"
                            title="Siswa paling produktif"
                            description="Gunakan daftar ini untuk membaca momentum karya dari sisi peserta didik."
                        />

                        <div className="grid gap-3">
                            {studentDesk.portfolioLeaders.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada top student creator.
                                    </div>
                                </AdminPanel>
                            ) : (
                                studentDesk.portfolioLeaders.map((leader) => (
                                    <AdminPanel key={leader.id}>
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                    {leader.name}
                                                </div>
                                                <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                    Karya yang sudah dikirim
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-(--school-green-700) dark:text-(--school-green-300)">
                                                {numberFormatter.format(
                                                    leader.portfolioCount,
                                                )}
                                            </div>
                                        </div>
                                    </AdminPanel>
                                ))
                            )}

                            <AdminPanel className="border-dashed">
                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                    Featured Live
                                </div>
                                <div className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">
                                    {numberFormatter.format(
                                        portfolioDesk.featuredCount,
                                    )}
                                </div>
                            </AdminPanel>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <AdminSectionIntro
                            eyebrow="Recent Works"
                            title="Karya terbaru dari sisi siswa"
                            description="Baca kreator, proyek, status, dan waktu update dalam bentuk yang lebih ringkas."
                        />

                        <div className="grid gap-3">
                            {portfolioDesk.recentItems.length === 0 ? (
                                <AdminPanel>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Belum ada karya siswa.
                                    </div>
                                </AdminPanel>
                            ) : (
                                portfolioDesk.recentItems.map((item) => (
                                    <AdminPanel key={item.id}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-base font-semibold text-neutral-950 dark:text-white">
                                                    {item.title}
                                                </div>
                                                <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                                    {item.creator ??
                                                        'Belum ada kreator'}{' '}
                                                    •{' '}
                                                    {item.project ??
                                                        'Tanpa proyek'}
                                                </div>
                                            </div>
                                            <div className="rounded-full bg-neutral-100 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-600 uppercase dark:bg-neutral-800 dark:text-neutral-300">
                                                {item.statusLabel}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Tipe
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {item.itemType}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Update
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatAdminDateTime(
                                                        item.updatedAt,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-neutral-50 px-3 py-3 dark:bg-neutral-950/50">
                                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                                    Publish
                                                </div>
                                                <div className="mt-1 text-sm font-medium text-neutral-900 dark:text-white">
                                                    {formatAdminDateTime(
                                                        item.publishedAt,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </AdminPanel>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </AdminWorkspaceShell>
        </>
    );
}

AdminStudentPortfolio.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Dashboard Admin',
            href: adminDashboard(),
        },
        {
            title: 'Portofolio Siswa',
            href: adminDashboard(),
        },
    ],
};
