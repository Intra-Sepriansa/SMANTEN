import { Link } from '@inertiajs/react';
import { ArrowUpRight, LockKeyhole, Radar, ShieldCheck } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const controlSignals = [
    {
        label: 'Role-aware routing',
        value: 'Otomatis',
        icon: Radar,
    },
    {
        label: 'Lapisan keamanan',
        value: '2FA siap',
        icon: LockKeyhole,
    },
    {
        label: 'Perimeter login',
        value: 'Rate limited',
        icon: ShieldCheck,
    },
];

export default function AuthPortalLayout({
    children,
    title,
    description,
    eyebrow = 'Portal Internal SMAN 1 Tenjo',
}: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.28),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_32%)]" />

            <div className="relative mx-auto flex min-h-svh w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid w-full gap-6 lg:grid-cols-[1.15fr_minmax(0,30rem)]">
                    <section className="relative overflow-hidden rounded-[2rem] border border-white/18 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.22),transparent_28%),linear-gradient(135deg,#4f46e5_0%,#9333ea_48%,#ec4899_100%)] p-6 text-white shadow-[0_32px_90px_-36px_rgba(6,24,32,0.72)] lg:p-8">
                        <div className="absolute top-12 -left-12 h-32 w-32 rounded-full bg-white/8 blur-3xl" />
                        <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-[#ec4899]/18 blur-3xl" />

                        <div className="relative flex h-full flex-col gap-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <Link
                                    href={home()}
                                    className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/14"
                                >
                                    <AppLogoIcon className="size-9 rounded-full bg-white/10 object-contain p-1.5" />
                                    <span>SMAN 1 Tenjo</span>
                                </Link>

                                <Link
                                    href={home()}
                                    className="inline-flex items-center gap-2 text-sm text-white/78 transition hover:text-white"
                                >
                                    Kembali ke situs publik
                                    <ArrowUpRight className="size-4" />
                                </Link>
                            </div>

                            <div className="max-w-2xl space-y-4">
                                <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.28em] text-white/82 uppercase">
                                    {eyebrow}
                                </p>

                                <div className="space-y-3">
                                    <h1 className="max-w-xl font-heading text-4xl leading-[1.02] text-white md:text-5xl">
                                        Satu pintu untuk akses internal sekolah.
                                    </h1>
                                    <p className="max-w-xl text-sm leading-6 text-white/76 md:text-base">
                                        Masuk sesuai peran: admin, operator,
                                        guru, siswa, atau wali.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                {controlSignals.map((signal) => {
                                    const Icon = signal.icon;

                                    return (
                                        <div
                                            key={signal.label}
                                            className="rounded-[1.5rem] border border-white/15 bg-white/8 p-4 backdrop-blur-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="space-y-2">
                                                    <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-white/60 uppercase">
                                                        {signal.label}
                                                    </p>
                                                    <p className="font-heading text-2xl text-white">
                                                        {signal.value}
                                                    </p>
                                                </div>
                                                <div className="flex size-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                                                    <Icon className="size-5" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    'Super Admin',
                                    'Operator',
                                    'Guru',
                                    'Siswa',
                                    'Wali',
                                ].map((role) => (
                                    <span
                                        key={role}
                                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/78"
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center">
                        <div className="w-full rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_30px_90px_-50px_rgba(10,30,40,0.8)] backdrop-blur lg:p-8">
                            <div className="space-y-2">
                                <p className="text-[0.72rem] font-semibold tracking-[0.28em] text-violet-700 uppercase">
                                    {eyebrow}
                                </p>
                                <h2 className="font-heading text-3xl leading-tight text-slate-950">
                                    {title}
                                </h2>
                                <p className="text-sm leading-7 text-slate-600">
                                    {description}
                                </p>
                            </div>

                            <div className="mt-8">{children}</div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
