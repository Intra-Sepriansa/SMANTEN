import { Head } from '@inertiajs/react';
import { PageIntro } from '@/components/public/page-intro';
import type { AlumniSpotlight, SchoolProfilePayload } from '@/types';

type AlumniPageProps = {
    school: SchoolProfilePayload;
    alumniSpotlight: AlumniSpotlight[];
};

export default function AlumniPage({
    school,
    alumniSpotlight,
}: AlumniPageProps) {
    return (
        <>
            <Head title="Alumni" />

            <div className="space-y-8">
                <PageIntro
                    eyebrow="Alumni dan Tracer"
                    title="Halaman alumni dibangun untuk tumbuh dari spotlight sederhana ke tracer study yang lebih kaya."
                    description={`${school.name} dapat menampilkan perjalanan lulusan tanpa membuka seluruh data pribadi, sehingga publikasi tetap terukur dan bermartabat.`}
                />

                <div className="grid gap-5 lg:grid-cols-3">
                    {alumniSpotlight.length > 0 ? (
                        alumniSpotlight.map((alumnus) => (
                            <article
                                key={alumnus.id}
                                className="rounded-[1.8rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_70px_-44px_rgba(15,118,110,0.42)]"
                            >
                                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    Lulusan {alumnus.graduationYear}
                                </div>
                                <h2 className="mt-3 text-2xl font-semibold text-[var(--school-ink)]">
                                    {alumnus.fullName}
                                </h2>
                                <p className="mt-3 text-sm leading-7 text-[var(--school-muted)]">
                                    {alumnus.occupationTitle ?? alumnus.institutionName}
                                </p>
                                <div className="mt-4 text-sm text-[var(--school-muted)]">
                                    {alumnus.city}, {alumnus.province}
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-[1.8rem] border border-dashed border-[var(--school-green-200)] bg-white/76 p-8 text-sm leading-7 text-[var(--school-muted)] lg:col-span-3">
                            Belum ada spotlight alumni publik yang aktif. Pondasi halaman
                            dan contract datanya sudah tersedia untuk diperluas.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
