import { Head, router } from '@inertiajs/react';
import {
    CheckCheck,
    ClipboardList,
    LayoutDashboard,
    Mail,
    MapPinned,
    Phone,
    Printer,
    RefreshCcw,
    School,
    ShieldCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import {
    AdminPanel,
    AdminWorkspaceShell,
} from '@/components/internal/admin/admin-workspace-shell';
import {
    formatPpdbBytes,
    formatPpdbDateTime,
    ppdbStatusTone,
} from '@/components/internal/admin/ppdb-operations-panel';
import type {
    Option,
    PpdbApplicationItem,
} from '@/components/internal/admin/ppdb-operations-panel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { jsonHeaders } from '@/lib/http';
import { dashboard } from '@/routes';
import { ppdb as publicPpdb } from '@/routes';
import { admin as adminDashboard } from '@/routes/dashboard';
import { ppdb as adminPpdb } from '@/routes/dashboard/admin';
import { evaluate, receipt } from '@/routes/internal-api/ppdb-applications';
import { update as updatePpdbStatus } from '@/routes/internal-api/ppdb-applications/status';

type AdminPpdbDetailProps = {
    application: PpdbApplicationItem;
    decisionOptions: Option[];
};

function formatReviewType(reviewType: string): string {
    return reviewType
        .split('_')
        .map((segment) =>
            segment.length === 0
                ? segment
                : segment[0].toUpperCase() + segment.slice(1),
        )
        .join(' ');
}

export default function AdminPpdbDetail({
    application,
    decisionOptions,
}: AdminPpdbDetailProps) {
    const [decisionStatus, setDecisionStatus] = useState<string>(
        application.status ?? 'under_review',
    );
    const [decisionNotes, setDecisionNotes] = useState<string>(
        application.decisionNotes ?? '',
    );
    const [processingAction, setProcessingAction] = useState<
        'evaluate' | 'status' | null
    >(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        setDecisionStatus(application.status ?? 'under_review');
        setDecisionNotes(application.decisionNotes ?? '');
        setActionError(null);
    }, [application.decisionNotes, application.id, application.status]);

    const handleEvaluate = async (): Promise<void> => {
        setProcessingAction('evaluate');
        setActionError(null);

        try {
            const response = await fetch(
                evaluate.url({
                    ppdbApplication: application.id,
                }),
                {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: jsonHeaders(),
                },
            );

            const payload = (await response.json().catch(() => ({}))) as {
                message?: string;
            };

            if (!response.ok) {
                throw new Error(
                    payload.message ??
                        'Evaluasi otomatis PPDB tidak berhasil dijalankan.',
                );
            }

            toast.success(
                `Evaluasi ulang untuk ${application.fullName} selesai diproses.`,
            );
            router.reload();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Evaluasi otomatis gagal dijalankan.';

            setActionError(message);
            toast.error(message);
        } finally {
            setProcessingAction(null);
        }
    };

    const handleDecisionSubmit = async (): Promise<void> => {
        setProcessingAction('status');
        setActionError(null);

        try {
            const response = await fetch(
                updatePpdbStatus.url({
                    ppdbApplication: application.id,
                }),
                {
                    method: 'PATCH',
                    credentials: 'same-origin',
                    headers: jsonHeaders(),
                    body: JSON.stringify({
                        status: decisionStatus,
                        notes: decisionNotes || null,
                    }),
                },
            );

            const payload = (await response.json().catch(() => ({}))) as {
                message?: string;
                errors?: Record<string, string[]>;
            };

            if (!response.ok) {
                const firstError = Object.values(payload.errors ?? {})[0]?.[0];

                throw new Error(
                    firstError ??
                        payload.message ??
                        'Keputusan PPDB tidak berhasil disimpan.',
                );
            }

            toast.success(
                `Status ${application.fullName} diperbarui menjadi ${decisionOptions.find((option) => option.value === decisionStatus)?.label ?? decisionStatus}.`,
            );
            router.reload();
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Perubahan status PPDB gagal diproses.';

            setActionError(message);
            toast.error(message);
        } finally {
            setProcessingAction(null);
        }
    };

    const quickBadges = [
        application.trackLabel,
        application.cycle.name ? `Gelombang ${application.cycle.name}` : null,
        application.flags.ketm ? 'KETM' : null,
        application.flags.specialCondition ? 'Kondisi Khusus' : null,
    ].filter((value): value is string => value !== null);

    return (
        <>
            <Head title={`PPDB • ${application.fullName}`} />

            <AdminWorkspaceShell
                current="ppdb"
                eyebrow="Applicant Detail"
                title={application.fullName}
                description="Satu pendaftar sekarang dibuka di halaman detail sendiri supaya review, verifikasi berkas, dan keputusan operator lebih rapi."
                stats={[
                    {
                        label: 'Status',
                        value: application.statusLabel,
                        helper: application.registrationNumber,
                        tone: 'sky',
                    },
                    {
                        label: 'Berkas',
                        value: `${application.documentsSummary.verified}/${application.documentsSummary.total}`,
                        helper: 'Dokumen terverifikasi',
                        tone: 'emerald',
                    },
                    {
                        label: 'Jarak',
                        value:
                            application.distanceKm !== null
                                ? `${application.distanceKm.toLocaleString('id-ID')} km`
                                : 'Belum ada',
                        helper: 'Radius ke sekolah',
                        tone: 'amber',
                    },
                    {
                        label: 'Review',
                        value: application.reviews.length.toLocaleString(
                            'id-ID',
                        ),
                        helper: 'Riwayat keputusan',
                        tone: 'slate',
                    },
                ]}
                actions={[
                    {
                        label: 'Desk PPDB',
                        href: adminPpdb(),
                        detail: 'Pilih pendaftar lain dari daftar utama.',
                        icon: ClipboardList,
                        tone: 'slate',
                    },
                    {
                        label: 'Dashboard',
                        href: adminDashboard(),
                        detail: 'Lihat ringkasan lintas menu admin.',
                        icon: LayoutDashboard,
                        tone: 'emerald',
                    },
                    {
                        label: 'Cetak Bukti',
                        href: receipt(application.id),
                        detail: 'Buka halaman bukti pendaftaran siap print.',
                        external: true,
                        icon: Printer,
                        target: '_blank',
                        tone: 'sky',
                    },
                ]}
            >
                <div className="grid gap-6">
                    <div className="space-y-6">
                        <AdminPanel className="border-(--school-green-200)/80 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,252,250,0.96))] dark:border-(--school-green-900)/60 dark:bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.16),transparent_30%),linear-gradient(180deg,rgba(10,19,28,0.96),rgba(8,14,22,0.98))]">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="text-[0.68rem] font-semibold tracking-[0.18em] text-neutral-500 uppercase dark:text-neutral-400">
                                        Registrasi
                                    </div>
                                    <h2 className="mt-2 text-2xl font-semibold text-neutral-950 dark:text-white">
                                        {application.registrationNumber}
                                    </h2>
                                    <div className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                                        {application.fullName}
                                    </div>
                                </div>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${ppdbStatusTone(application.status)}`}
                                >
                                    {application.statusLabel}
                                </span>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {quickBadges.map((badge) => (
                                    <span
                                        key={badge}
                                        className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-xs font-semibold text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-neutral-200"
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {[
                                    {
                                        label: 'Submit',
                                        value: formatPpdbDateTime(
                                            application.submittedAt,
                                        ),
                                    },
                                    {
                                        label: 'Verified',
                                        value: formatPpdbDateTime(
                                            application.verifiedAt,
                                        ),
                                    },
                                    {
                                        label: 'Decided',
                                        value: formatPpdbDateTime(
                                            application.decidedAt,
                                        ),
                                    },
                                    {
                                        label: 'Operator',
                                        value:
                                            application.verifiedBy ??
                                            'Belum ada',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl border border-white/70 bg-white/75 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/60"
                                    >
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            {item.label}
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-neutral-950 dark:text-white">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AdminPanel>

                        <AdminPanel>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                        Kontak & alamat
                                    </div>
                                </div>
                                <Button variant="outline" asChild>
                                    <a
                                        href={publicPpdb().url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        PPDB Publik
                                    </a>
                                </Button>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                    <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                        <Mail className="size-4" />
                                        Email
                                    </div>
                                    <div className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                                        {application.email ?? 'Belum diisi'}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                    <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                        <Phone className="size-4" />
                                        Telepon
                                    </div>
                                    <div className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                                        {application.phone ?? 'Belum diisi'}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                    <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                        <School className="size-4" />
                                        Sekolah Asal
                                    </div>
                                    <div className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                                        {application.previousSchoolName ??
                                            'Belum diisi'}
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                    <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                        <MapPinned className="size-4" />
                                        Radius
                                    </div>
                                    <div className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                                        {application.distanceKm !== null
                                            ? `${application.distanceKm.toLocaleString('id-ID')} km`
                                            : 'Belum dihitung'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 rounded-2xl border border-dashed border-neutral-200 px-4 py-4 dark:border-neutral-700">
                                <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                    Alamat lengkap
                                </div>
                                <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                                    {application.address ||
                                        'Alamat belum lengkap.'}
                                </p>
                            </div>
                        </AdminPanel>

                        <AdminPanel>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                        Dokumen
                                    </div>
                                </div>
                                <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                    {application.documentsSummary.verified}/
                                    {application.documentsSummary.total}{' '}
                                    verified
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {application.documents.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
                                        Belum ada dokumen yang terunggah.
                                    </div>
                                ) : (
                                    application.documents.map((document) => (
                                        <div
                                            key={document.id}
                                            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950/60"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                        {document.type}
                                                    </div>
                                                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                        {document.originalName}{' '}
                                                        •{' '}
                                                        {formatPpdbBytes(
                                                            document.sizeBytes,
                                                        )}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${ppdbStatusTone(document.status)}`}
                                                >
                                                    {document.statusLabel}
                                                </span>
                                            </div>

                                            <div className="mt-3 text-xs leading-6 text-neutral-500 dark:text-neutral-400">
                                                {document.mimeType ??
                                                    'Mime type tidak tersedia'}
                                                {document.verifiedBy
                                                    ? ` • diverifikasi ${document.verifiedBy}`
                                                    : ''}
                                                {document.verifiedAt
                                                    ? ` • ${formatPpdbDateTime(document.verifiedAt)}`
                                                    : ''}
                                            </div>

                                            {document.rejectionReason ? (
                                                <div className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-xs leading-5 text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                                                    {document.rejectionReason}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                            </div>
                        </AdminPanel>

                        <AdminPanel>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                        Timeline review
                                    </div>
                                </div>
                                <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                    {application.reviews.length} event
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {application.reviews.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-6 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-400">
                                        Belum ada histori review.
                                    </div>
                                ) : (
                                    application.reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950/60"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                                        {review.statusLabel}
                                                    </div>
                                                    <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                        {review.reviewer ??
                                                            'System'}{' '}
                                                        •{' '}
                                                        {formatPpdbDateTime(
                                                            review.createdAt,
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="rounded-full bg-neutral-200 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-700 uppercase dark:bg-neutral-800 dark:text-neutral-200">
                                                    {formatReviewType(
                                                        review.reviewType,
                                                    )}
                                                </span>
                                            </div>
                                            {review.notes ? (
                                                <p className="mt-3 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                                                    {review.notes}
                                                </p>
                                            ) : null}
                                        </div>
                                    ))
                                )}
                            </div>
                        </AdminPanel>
                    </div>

                    <div className="self-start">
                        <div className="space-y-6">
                            <AdminPanel className="border-(--school-green-200)/80 bg-(--school-green-50)/70 dark:border-(--school-green-900)/60 dark:bg-(--school-green-950)/25">
                                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                                    <ShieldCheck className="size-4" />
                                    Keputusan operator
                                </div>

                                <div className="mt-4 grid gap-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="ppdb-decision-status">
                                            Status keputusan
                                        </Label>
                                        <Select
                                            value={decisionStatus}
                                            onValueChange={setDecisionStatus}
                                        >
                                            <SelectTrigger id="ppdb-decision-status">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {decisionOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="ppdb-decision-notes">
                                            Catatan keputusan
                                        </Label>
                                        <textarea
                                            id="ppdb-decision-notes"
                                            value={decisionNotes}
                                            onChange={(event) =>
                                                setDecisionNotes(
                                                    event.target.value,
                                                )
                                            }
                                            rows={5}
                                            className="min-h-28 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-xs transition outline-none focus:border-(--school-green-400) focus:ring-3 focus:ring-(--school-green-200)/50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                                            placeholder="Alasan keputusan, catatan verifikasi, atau tindak lanjut."
                                        />
                                    </div>

                                    <InputError
                                        message={actionError ?? undefined}
                                    />

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleEvaluate}
                                            disabled={processingAction !== null}
                                        >
                                            <RefreshCcw className="size-4" />
                                            {processingAction === 'evaluate'
                                                ? 'Memproses...'
                                                : 'Evaluasi otomatis'}
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={handleDecisionSubmit}
                                            disabled={processingAction !== null}
                                        >
                                            <CheckCheck className="size-4" />
                                            {processingAction === 'status'
                                                ? 'Menyimpan...'
                                                : 'Simpan keputusan'}
                                        </Button>
                                    </div>
                                </div>
                            </AdminPanel>

                            <AdminPanel>
                                <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                    Sinyal cepat
                                </div>

                                <div className="mt-4 grid gap-3">
                                    <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Audit jarak terakhir
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-neutral-950 dark:text-white">
                                            {application.latestDistanceAudit
                                                ? `${application.latestDistanceAudit.distanceKm.toLocaleString('id-ID')} km`
                                                : 'Belum ada audit'}
                                        </div>
                                        <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                            {application.latestDistanceAudit
                                                ? `${application.latestDistanceAudit.formulaVersion} • ${formatPpdbDateTime(application.latestDistanceAudit.calculatedAt)}`
                                                : 'Audit jarak belum pernah dijalankan.'}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Review terbaru
                                        </div>
                                        <div className="mt-2 text-sm font-semibold text-neutral-950 dark:text-white">
                                            {application.latestReview
                                                ?.statusLabel ??
                                                'Belum ada review'}
                                        </div>
                                        <div className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                                            {application.latestReview
                                                ? `${application.latestReview.reviewer ?? 'System'} • ${formatPpdbDateTime(application.latestReview.createdAt)}`
                                                : 'Belum ada operator yang meninggalkan catatan.'}
                                        </div>
                                        {application.latestReview?.notes ? (
                                            <div className="mt-3 rounded-2xl bg-white px-3 py-2 text-xs leading-5 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                                                {application.latestReview.notes}
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="rounded-2xl bg-neutral-50 px-4 py-4 dark:bg-neutral-950/50">
                                        <div className="text-[0.68rem] font-semibold tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
                                            Risiko dokumen
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {[
                                                `${application.documentsSummary.pending} pending`,
                                                `${application.documentsSummary.rejected} rejected`,
                                            ].map((item) => (
                                                <span
                                                    key={item}
                                                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </AdminPanel>
                        </div>
                    </div>
                </div>
            </AdminWorkspaceShell>
        </>
    );
}

AdminPpdbDetail.layout = {
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
            title: 'PPDB',
            href: adminPpdb(),
        },
    ],
};
