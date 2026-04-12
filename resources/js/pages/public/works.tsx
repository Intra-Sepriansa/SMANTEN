import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Package2 } from 'lucide-react';
import { PageIntro } from '@/components/public/page-intro';
import { Button } from '@/components/ui/button';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { FeaturedWork, SchoolProfilePayload } from '@/types';

type WorksPageProps = {
    school: SchoolProfilePayload;
    featuredWorks: FeaturedWork[];
};

export default function WorksPage({ school, featuredWorks }: WorksPageProps) {
    return (
        <>
            <Head title="Karya Siswa">
                <meta
                    name="description"
                    content={`Galeri karya siswa ${school.name}: P5, Panen Karya, MUSTIKARASA, dan showcase pembelajaran lintas tema.`}
                />
                <meta property="og:title" content={`Karya Siswa — ${school.name}`} />
                <meta property="og:description" content="Hasil belajar yang tampil sebagai ekosistem showcase publik." />
            </Head>

            <div className="space-y-8">
                <PageIntro
                    eyebrow="Galeri Karya"
                    title="P5, Panen Karya, dan MUSTIKARASA ditampilkan sebagai ekosistem showcase."
                    description={`${school.name} menempatkan hasil belajar sebagai sesuatu yang bisa dinikmati publik, dipresentasikan, dan diarsipkan lintas tahun ajaran.`}
                    stats={[
                        {
                            label: 'Kategori Inti',
                            value: 'P5 • Panen Karya • Gastronomi',
                        },
                        {
                            label: 'Total Karya',
                            value: String(featuredWorks.length),
                        },
                    ]}
                />

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="grid gap-5 xl:grid-cols-3"
                >
                    {featuredWorks.map((work) => (
                        <motion.article
                            key={work.id}
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/88 shadow-[0_28px_80px_-50px_rgba(15,118,110,0.45)]"
                        >
                            <div
                                className="h-56 bg-cover bg-center"
                                style={{
                                    backgroundImage: work.imageUrl
                                        ? `linear-gradient(180deg, rgba(4,47,46,0.12), rgba(4,47,46,0.25)), url(${work.imageUrl})`
                                        : 'linear-gradient(135deg, rgba(4,47,46,0.95), rgba(15,118,110,0.88) 58%, rgba(245,158,11,0.82))',
                                }}
                            />
                            <div className="space-y-4 p-6">
                                <div className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)]">
                                    <Compass className="size-4" />
                                    {work.itemType}
                                </div>
                                <h2 className="text-2xl font-semibold text-[var(--school-ink)]">
                                    {work.title}
                                </h2>
                                <p className="text-sm leading-7 text-[var(--school-muted)]">
                                    {work.summary}
                                </p>
                                <div className="rounded-[1.4rem] border border-[var(--school-green-100)] bg-[rgba(248,252,251,0.82)] p-4 text-sm leading-7 text-[var(--school-muted)]">
                                    <div>Proyek: {work.projectTitle ?? 'Showcase karya'}</div>
                                    <div>Tema: {work.themeName ?? 'Eksplorasi siswa'}</div>
                                    <div>Pembuat: {work.creatorName ?? 'Tim siswa'}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-[var(--school-green-700)]">
                                        <Package2 className="size-4" />
                                        Karya publik
                                    </div>
                                    {work.slug ? (
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="outline"
                                            className="rounded-full border-[var(--school-green-200)] bg-white/80"
                                        >
                                            <Link href={`/karya/${work.slug}`}>
                                                Detail <ArrowRight className="size-3.5" />
                                            </Link>
                                        </Button>
                                    ) : null}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </>
    );
}
