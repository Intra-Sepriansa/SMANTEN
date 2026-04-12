import { Head } from '@inertiajs/react';
import { InteractiveOrgChart } from '@/components/org/interactive-org-chart';
import { PageIntro } from '@/components/public/page-intro';
import { SectionHeading } from '@/components/public/section-heading';
import { Skeleton } from '@/components/ui/skeleton';
import { useHistoricalOrganizationQuery } from '@/lib/query/public-site';
import { useSiteUiStore } from '@/stores/site-ui-store';
import type { OrganizationNode, SchoolProfilePayload } from '@/types';

type OrganizationPageProps = {
    school: SchoolProfilePayload;
    leadership: OrganizationNode[];
};

export default function OrganizationPage({
    school,
    leadership,
}: OrganizationPageProps) {
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        month: 'short',
        year: 'numeric',
    });
    const scope = useSiteUiStore((state) => state.organizationScope);
    const setScope = useSiteUiStore((state) => state.setOrganizationScope);

    const items = leadership.filter((item) => item.scope === scope);
    const activeCount = items.filter((item) => item.isCurrent).length;
    const { data: historicalArchive, isLoading: isArchiveLoading } =
        useHistoricalOrganizationQuery(scope);

    return (
        <>
            <Head title="Organisasi" />

            <div className="space-y-8">
                <PageIntro
                    eyebrow="Struktur Organisasi"
                    title="Kepemimpinan aktif dan struktur siswa dipisahkan dengan tegas dari data historis."
                    description={`${school.name} membutuhkan bagan organisasi yang bisa dibaca cepat, dibuka detailnya, dan tetap menjaga kejelasan antara manajemen sekolah dengan OSIS.`}
                />

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => setScope('school_management')}
                        className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                            scope === 'school_management'
                                ? 'bg-[var(--school-green-700)] text-white'
                                : 'border border-[var(--school-green-200)] bg-white/80 text-[var(--school-muted)]'
                        }`}
                    >
                        Manajemen Sekolah
                    </button>
                    <button
                        type="button"
                        onClick={() => setScope('student_organization')}
                        className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                            scope === 'student_organization'
                                ? 'bg-[var(--school-gold-500)] text-[var(--school-ink)]'
                                : 'border border-[var(--school-green-200)] bg-white/80 text-[var(--school-muted)]'
                        }`}
                    >
                        OSIS
                    </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-[0.72fr_0.28fr]">
                    <div className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-46px_rgba(15,118,110,0.42)]">
                        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                            Prinsip Struktur
                        </div>
                        <h2 className="mt-4 font-heading text-3xl leading-tight text-[var(--school-ink)]">
                            Data aktif dipertahankan tegas, sementara arsip historis tidak
                            dicampur ke bagan yang sedang berjalan.
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--school-muted)]">
                            Halaman ini menampilkan struktur aktif untuk pembacaan cepat.
                            Ketika data historis dipublikasikan penuh pada fase berikutnya,
                            arsip kepemimpinan dan periode OSIS akan ditempatkan sebagai
                            lapisan terpisah agar pembaca tidak salah mengira figur yang
                            sedang menjabat.
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                        <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-46px_rgba(15,118,110,0.4)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-muted)]">
                                Scope Aktif
                            </div>
                            <div className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                {scope === 'school_management' ? 'Sekolah' : 'OSIS'}
                            </div>
                        </div>
                        <div className="rounded-[1.6rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-46px_rgba(15,118,110,0.4)]">
                            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-muted)]">
                                Node Terisi
                            </div>
                            <div className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                {activeCount}
                            </div>
                        </div>
                    </div>
                </div>

                <InteractiveOrgChart nodes={items} scope={scope} />

                <section className="space-y-6">
                    <SectionHeading
                        eyebrow="Arsip Historis"
                        title={
                            scope === 'school_management'
                                ? 'Riwayat kepemimpinan sekolah ditampilkan terpisah dari struktur aktif.'
                                : 'Riwayat kepengurusan OSIS dipisahkan dari struktur siswa yang sedang berjalan.'
                        }
                        description="Kontrak backend publik sudah membuka data arsip berdasarkan periode efektif, sehingga figur lama tidak lagi bercampur dengan node aktif."
                    />

                    {isArchiveLoading ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="rounded-[1.75rem] border border-white/70 bg-white/85 p-5"
                                >
                                    <Skeleton className="h-5 w-28" />
                                    <Skeleton className="mt-4 h-8 w-3/4" />
                                    <Skeleton className="mt-3 h-4 w-full" />
                                    <Skeleton className="mt-2 h-4 w-5/6" />
                                </div>
                            ))}
                        </div>
                    ) : historicalArchive && historicalArchive.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {historicalArchive.map((entry) => (
                                <article
                                    key={entry.id}
                                    className="rounded-[1.75rem] border border-white/70 bg-white/88 p-5 shadow-[0_22px_60px_-44px_rgba(15,118,110,0.42)]"
                                >
                                    <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--school-green-700)]">
                                        {entry.periodLabel}
                                    </div>
                                    <h3 className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                        {entry.position}
                                    </h3>
                                    <div className="mt-2 text-base text-[var(--school-muted)]">
                                        {entry.name}
                                    </div>
                                    <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                        {entry.biography ??
                                            'Arsip ini menjaga memori kepemimpinan tanpa mengganggu pembacaan struktur aktif.'}
                                    </p>
                                    <div className="mt-4 text-xs uppercase tracking-[0.24em] text-[var(--school-muted)]">
                                        {entry.startsAt
                                            ? dateFormatter.format(
                                                  new Date(entry.startsAt),
                                              )
                                            : 'Awal tidak dipublikasikan'}
                                        {' • '}
                                        {entry.endsAt
                                            ? dateFormatter.format(
                                                  new Date(entry.endsAt),
                                              )
                                            : 'Akhir tidak dipublikasikan'}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[1.8rem] border border-dashed border-[var(--school-green-200)] bg-white/72 p-8 text-sm leading-7 text-[var(--school-muted)]">
                            Arsip historis untuk scope ini belum dipublikasikan. Kontrak
                            backend sudah dibuka, sehingga catatan kepemimpinan atau
                            kepengurusan lama dapat ditampilkan tanpa mengubah struktur
                            aktif.
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
