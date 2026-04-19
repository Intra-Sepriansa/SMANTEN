import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, FileText } from 'lucide-react';
import Folder from '@/components/reactbits/folder';
import { fadeUp, motionViewport, staggerContainer } from '@/lib/motion';
import type { SchoolProfilePayload } from '@/types';

type DocumentsPageProps = {
    school: SchoolProfilePayload;
};

const documentGroups = [
    {
        title: 'Unduhan',
        label: 'File resmi',
        color: '#0F766E',
        href: '#unduhan',
        items: ['Formulir', 'Panduan', 'Surat'],
    },
    {
        title: 'PPDB',
        label: 'Penerimaan',
        color: '#D97706',
        href: '/ppdb',
        items: ['Alur', 'Zonasi', 'Kuota'],
    },
    {
        title: 'Akademik',
        label: 'Belajar',
        color: '#0EA5E9',
        href: '/akademik',
        items: ['Kurikulum', 'P5', 'Jadwal'],
    },
    {
        title: 'Layanan',
        label: 'Bantuan',
        color: '#7C3AED',
        href: '/layanan',
        items: ['Kontak', 'FAQ', 'Konsultasi'],
    },
];

const downloadItems = [
    {
        title: 'Formulir Sekolah',
        type: 'PDF',
        href: '/layanan#kontak-layanan',
    },
    {
        title: 'Panduan PPDB',
        type: 'WEB',
        href: '/ppdb',
    },
    {
        title: 'Kurikulum Merdeka',
        type: 'WEB',
        href: '/akademik#kurikulum',
    },
    {
        title: 'Kontak Layanan',
        type: 'WEB',
        href: '/layanan#kontak-layanan',
    },
];

function FolderPaper({ text }: { text: string }) {
    return (
        <div className="grid size-full place-items-center px-2 text-center text-[0.5rem] font-black tracking-[0.18em] text-[var(--school-ink)] uppercase">
            {text}
        </div>
    );
}

export default function DocumentsPage({ school }: DocumentsPageProps) {
    return (
        <>
            <Head title={`Dokumen & Unduhan | ${school.name}`}>
                <meta
                    name="description"
                    content={`Dokumen dan unduhan publik ${school.name}.`}
                />
            </Head>

            <div className="space-y-8 md:space-y-10">
                <motion.section
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(237,247,245,0.72),rgba(255,248,231,0.82))] p-6 shadow-[0_28px_80px_-54px_rgba(15,118,110,0.58)] backdrop-blur-xl md:p-8"
                >
                    <div className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full bg-[var(--school-green-100)]/60 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-[var(--school-gold-400)]/18 blur-3xl" />

                    <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                        <motion.div variants={fadeUp}>
                            <div className="inline-flex rounded-full border border-[var(--school-green-200)] bg-white/75 px-4 py-1 text-xs font-black tracking-[0.28em] text-[var(--school-green-700)] uppercase">
                                Dokumen
                            </div>
                            <h1 className="mt-5 text-4xl font-black tracking-tight text-[var(--school-ink)] md:text-6xl">
                                Unduhan sekolah.
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-7 font-medium text-[var(--school-muted)]">
                                File penting, ringkas, dan mudah ditemukan.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeUp}
                            className="relative min-h-[320px] overflow-visible rounded-[2rem] border border-white/70 bg-white/55 shadow-inner shadow-white/60 lg:min-h-[340px]"
                        >
                            <div className="absolute top-[63%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Folder
                                    color="#0F766E"
                                    size={2.25}
                                    items={[
                                        <FolderPaper
                                            key="paper-1"
                                            text="PDF"
                                        />,
                                        <FolderPaper key="paper-2" text="SK" />,
                                        <FolderPaper
                                            key="paper-3"
                                            text="DOC"
                                        />,
                                    ]}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                <motion.section
                    id="unduhan"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={motionViewport}
                    className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
                >
                    {documentGroups.map((group) => (
                        <motion.div
                            key={group.title}
                            variants={fadeUp}
                            className="group h-full"
                        >
                            <Link
                                href={group.href}
                                className="relative flex h-full min-h-[260px] flex-col overflow-hidden rounded-[1.8rem] border border-white/70 bg-white/78 p-5 shadow-[0_24px_60px_-38px_rgba(15,118,110,0.42)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-white"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black tracking-[0.24em] text-[var(--school-muted)] uppercase">
                                        {group.label}
                                    </span>
                                    <ArrowRight className="size-4 text-[var(--school-green-700)] transition group-hover:translate-x-1" />
                                </div>

                                <div className="grid flex-1 place-items-center">
                                    <div className="translate-y-2">
                                        <Folder
                                            color={group.color}
                                            size={1.25}
                                            items={group.items.map((item) => (
                                                <FolderPaper
                                                    key={item}
                                                    text={item}
                                                />
                                            ))}
                                        />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black tracking-tight text-[var(--school-ink)]">
                                    {group.title}
                                </h2>
                            </Link>
                        </motion.div>
                    ))}
                </motion.section>

                <section className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_22px_60px_-44px_rgba(15,118,110,0.5)] backdrop-blur-xl md:p-5">
                    <div className="grid gap-3 md:grid-cols-2">
                        {downloadItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className="group flex items-center justify-between gap-4 rounded-2xl border border-[var(--school-green-100)] bg-white/70 p-4 transition hover:-translate-y-0.5 hover:border-[var(--school-green-200)] hover:bg-white"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="grid size-10 place-items-center rounded-xl bg-[var(--school-green-50)] text-[var(--school-green-700)]">
                                        <FileText className="size-5" />
                                    </span>
                                    <span>
                                        <span className="block font-black text-[var(--school-ink)]">
                                            {item.title}
                                        </span>
                                        <span className="text-xs font-bold tracking-[0.2em] text-[var(--school-muted)] uppercase">
                                            {item.type}
                                        </span>
                                    </span>
                                </span>
                                <Download className="size-4 text-[var(--school-green-700)] transition group-hover:translate-y-0.5" />
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
