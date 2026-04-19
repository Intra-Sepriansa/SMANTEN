import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    ClipboardCheck,
    Clock3,
    FileSearch,
    Search,
} from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
    AdminPanel,
    AdminSectionIntro,
} from '@/components/internal/admin/admin-workspace-shell';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { show as showPpdbApplication } from '@/routes/dashboard/admin/ppdb';

export type Option = {
    value: string;
    label: string;
};

export type PpdbDocument = {
    id: number;
    type: string;
    originalName: string;
    status: string | null;
    statusLabel: string;
    verifiedAt: string | null;
    verifiedBy: string | null;
    sizeBytes: number | null;
    mimeType: string | null;
    path: string | null;
    rejectionReason: string | null;
};

export type PpdbReview = {
    id: number;
    reviewType: string;
    status: string;
    statusLabel: string;
    notes: string | null;
    reviewer: string | null;
    createdAt: string | null;
};

export type PpdbApplicationItem = {
    id: number;
    registrationNumber: string;
    fullName: string;
    trackType: string | null;
    trackLabel: string;
    status: string | null;
    statusLabel: string;
    phone: string | null;
    email: string | null;
    previousSchoolName: string | null;
    address: string;
    submittedAt: string | null;
    verifiedAt: string | null;
    decidedAt: string | null;
    decisionNotes: string | null;
    verifiedBy: string | null;
    distanceKm: number | null;
    latestDistanceAudit: {
        distanceKm: number;
        formulaVersion: string;
        calculatedAt: string | null;
    } | null;
    flags: {
        ketm: boolean;
        specialCondition: boolean;
    };
    cycle: {
        id: number | null;
        name: string | null;
    };
    documentsSummary: {
        total: number;
        verified: number;
        pending: number;
        rejected: number;
    };
    documents: PpdbDocument[];
    reviews: PpdbReview[];
    latestReview: PpdbReview | null;
};

export type PpdbDesk = {
    applications: PpdbApplicationItem[];
    statusOptions: Option[];
    trackOptions: Option[];
    decisionOptions: Option[];
};

export function formatPpdbDateTime(value: string | null): string {
    if (!value) {
        return 'Belum ada';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export function formatPpdbBytes(sizeBytes: number | null): string {
    if (!sizeBytes) {
        return 'Ukuran tidak tersedia';
    }

    if (sizeBytes < 1024) {
        return `${sizeBytes} B`;
    }

    if (sizeBytes < 1024 * 1024) {
        return `${(sizeBytes / 1024).toFixed(1)} KB`;
    }

    return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ppdbStatusTone(status: string | null): string {
    return (
        {
            accepted:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
            eligible:
                'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
            verified:
                'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200',
            under_review:
                'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
            waitlisted:
                'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200',
            rejected:
                'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
            withdrawn:
                'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
            submitted:
                'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200',
            draft: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200',
        }[status ?? 'draft'] ??
        'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
    );
}

function ppdbPriorityScore(application: PpdbApplicationItem): number {
    let score = 0;

    if (application.documentsSummary.rejected > 0) {
        score += 400;
    }

    if (application.status === 'under_review') {
        score += 300;
    }

    if (application.status === 'submitted') {
        score += 220;
    }

    if (
        application.status === 'verified' ||
        application.status === 'eligible'
    ) {
        score += 180;
    }

    score += application.documentsSummary.pending * 5;

    return score;
}

function ppdbPriorityLabel(application: PpdbApplicationItem): string | null {
    if (application.documentsSummary.rejected > 0) {
        return 'Berkas bermasalah';
    }

    if (application.status === 'under_review') {
        return 'Perlu review';
    }

    if (application.status === 'submitted') {
        return 'Baru masuk';
    }

    if (
        application.status === 'verified' ||
        application.status === 'eligible'
    ) {
        return 'Siap putuskan';
    }

    return null;
}

function ppdbTimestamp(value: string | null): number {
    return value ? new Date(value).getTime() : 0;
}

export function PpdbOperationsPanel({ desk }: { desk: PpdbDesk }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [trackFilter, setTrackFilter] = useState<string>('all');
    const deferredSearch = useDeferredValue(search.trim().toLowerCase());

    const filteredApplications = useMemo(() => {
        return desk.applications.filter((application) => {
            const matchesSearch =
                deferredSearch.length === 0 ||
                [
                    application.fullName,
                    application.registrationNumber,
                    application.email ?? '',
                    application.previousSchoolName ?? '',
                ]
                    .join(' ')
                    .toLowerCase()
                    .includes(deferredSearch);

            const matchesStatus =
                statusFilter === 'all' || application.status === statusFilter;
            const matchesTrack =
                trackFilter === 'all' || application.trackType === trackFilter;

            return matchesSearch && matchesStatus && matchesTrack;
        });
    }, [deferredSearch, desk.applications, statusFilter, trackFilter]);

    const workflowSummary = useMemo(() => {
        return {
            total: desk.applications.length,
            submitted: desk.applications.filter(
                (application) => application.status === 'submitted',
            ).length,
            review: desk.applications.filter(
                (application) => application.status === 'under_review',
            ).length,
            ready: desk.applications.filter(
                (application) =>
                    application.status === 'verified' ||
                    application.status === 'eligible',
            ).length,
            documentRisk: desk.applications.filter(
                (application) => application.documentsSummary.rejected > 0,
            ).length,
        };
    }, [desk.applications]);

    const prioritizedApplications = useMemo(() => {
        return [...filteredApplications].sort((left, right) => {
            const priorityDelta =
                ppdbPriorityScore(right) - ppdbPriorityScore(left);

            if (priorityDelta !== 0) {
                return priorityDelta;
            }

            return (
                ppdbTimestamp(right.submittedAt) -
                ppdbTimestamp(left.submittedAt)
            );
        });
    }, [filteredApplications]);

    const workflowCards = [
        {
            label: 'Baru Masuk',
            value: workflowSummary.submitted,
            helper: 'Cek kelengkapan awal',
            icon: Clock3,
            tone: 'text-sky-700 dark:text-sky-200',
            iconTone:
                'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
        },
        {
            label: 'Perlu Review',
            value: workflowSummary.review,
            helper: 'Tunggu keputusan admin',
            icon: ClipboardCheck,
            tone: 'text-amber-700 dark:text-amber-200',
            iconTone:
                'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
        },
        {
            label: 'Siap Putuskan',
            value: workflowSummary.ready,
            helper: 'Sudah lolos verifikasi',
            icon: CheckCircle2,
            tone: 'text-emerald-700 dark:text-emerald-200',
            iconTone:
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
        },
        {
            label: 'Berkas Risiko',
            value: workflowSummary.documentRisk,
            helper: 'Ada dokumen ditolak',
            icon: AlertTriangle,
            tone: 'text-rose-700 dark:text-rose-200',
            iconTone:
                'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
        },
    ];

    return (
        <section id="ppdb-ops" className="scroll-mt-28 space-y-5">
            <AdminPanel className="space-y-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <AdminSectionIntro
                        eyebrow="Workflow"
                        title="Antrian PPDB"
                        description="Fokuskan kerja admin ke pendaftar baru, review aktif, dan berkas yang perlu ditindak."
                    />

                    <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                        {filteredApplications.length.toLocaleString('id-ID')}{' '}
                        dari {workflowSummary.total.toLocaleString('id-ID')}{' '}
                        pendaftar
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {workflowCards.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-lg border border-neutral-200 bg-white/90 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/75"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-[0.68rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                                        {item.label}
                                    </div>
                                    <div
                                        className={`mt-2 text-3xl font-bold ${item.tone}`}
                                    >
                                        {item.value.toLocaleString('id-ID')}
                                    </div>
                                    <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                        {item.helper}
                                    </div>
                                </div>

                                <div
                                    className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.iconTone}`}
                                >
                                    <item.icon className="size-5" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AdminPanel>

            <AdminPanel className="space-y-5">
                <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
                    <div className="grid gap-2">
                        <Label htmlFor="ppdb-search">Cari pendaftar</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                            <Input
                                id="ppdb-search"
                                value={search}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ) => setSearch(event.target.value)}
                                className="pl-9"
                                placeholder="Nama, no. registrasi, email..."
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Status</Label>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua status
                                </SelectItem>
                                {desk.statusOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Jalur</Label>
                        <Select
                            value={trackFilter}
                            onValueChange={setTrackFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Semua jalur" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua jalur</SelectItem>
                                {desk.trackOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                    <span>
                        Urutan prioritas: masalah berkas, review, lalu pendaftar
                        baru.
                    </span>
                    <span className="font-semibold">
                        {prioritizedApplications.length.toLocaleString('id-ID')}{' '}
                        hasil
                    </span>
                </div>

                <div className="hidden grid-cols-[1.15fr_0.7fr_0.75fr_0.65fr_0.55fr] gap-3 rounded-lg bg-neutral-50 px-4 py-3 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase xl:grid dark:bg-neutral-950/50 dark:text-neutral-400">
                    <span>Pendaftar</span>
                    <span>Status</span>
                    <span>Berkas</span>
                    <span>Jalur</span>
                    <span className="text-right">Aksi</span>
                </div>

                <div className="max-h-[42rem] space-y-3 overflow-y-auto pr-1">
                    {prioritizedApplications.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
                            <FileSearch className="mx-auto mb-3 size-8 opacity-60" />
                            Tidak ada pendaftar yang cocok dengan filter saat
                            ini.
                        </div>
                    ) : (
                        prioritizedApplications.map((application) => {
                            const priorityLabel =
                                ppdbPriorityLabel(application);

                            return (
                                <Link
                                    key={application.id}
                                    href={showPpdbApplication(application.id)}
                                    prefetch
                                    className="group block rounded-lg border border-neutral-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-(--school-green-300) hover:bg-(--school-green-50)/70 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-(--school-green-700) dark:hover:bg-(--school-green-900)/20"
                                >
                                    <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[1.15fr_0.7fr_0.75fr_0.65fr_0.55fr] xl:items-start xl:gap-3">
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-semibold text-neutral-950 dark:text-white">
                                                {application.fullName}
                                            </div>
                                            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                {application.registrationNumber}
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                <span>
                                                    Masuk{' '}
                                                    {formatPpdbDateTime(
                                                        application.submittedAt,
                                                    )}
                                                </span>
                                                {priorityLabel ? (
                                                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                                        {priorityLabel}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${ppdbStatusTone(application.status)}`}
                                            >
                                                {application.statusLabel}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs leading-6 text-neutral-600 xl:block dark:text-neutral-300">
                                            <div>
                                                {
                                                    application.documentsSummary
                                                        .verified
                                                }{' '}
                                                verified
                                            </div>
                                            <div>
                                                {
                                                    application.documentsSummary
                                                        .pending
                                                }{' '}
                                                pending
                                            </div>
                                            {application.documentsSummary
                                                .rejected > 0 ? (
                                                <div className="text-rose-600 dark:text-rose-300">
                                                    {
                                                        application
                                                            .documentsSummary
                                                            .rejected
                                                    }{' '}
                                                    rejected
                                                </div>
                                            ) : null}
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs leading-6 text-neutral-600 xl:block dark:text-neutral-300">
                                            <div>{application.trackLabel}</div>
                                            <div>
                                                {application.distanceKm !== null
                                                    ? `${application.distanceKm.toLocaleString('id-ID')} km`
                                                    : 'Jarak belum ada'}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-(--school-green-700) transition-transform group-hover:translate-x-0.5 dark:text-(--school-green-300)">
                                                Detail
                                                <ChevronRight className="size-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </AdminPanel>
        </section>
    );
}
