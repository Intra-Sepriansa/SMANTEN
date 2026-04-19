import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
    backgroundImage,
}: AuthLayoutProps) {
    if (backgroundImage) {
        return (
            <div className="relative min-h-svh overflow-hidden">
                <img
                    src={backgroundImage}
                    alt="Latar portal internal"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.32),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.28),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.62),rgba(88,28,135,0.76),rgba(0,0,0,0.82))]" />

                <div className="relative flex min-h-svh items-center justify-center p-6 md:p-10">
                    <div className="absolute top-6 left-6">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-2xl shadow-violet-950/20 backdrop-blur-sm transition hover:bg-white/15"
                        >
                            <AppLogoIcon className="size-8 rounded-lg bg-white/10 object-contain p-1" />
                            <span>SMAN 1 Tenjo</span>
                        </Link>
                    </div>

                    <div className="w-full max-w-md">
                        <div className="glass-strong glow-multi rounded-lg p-6 text-white shadow-[0_30px_90px_-40px_rgba(0,0,0,0.65)] md:p-8">
                            <div className="flex flex-col items-center gap-4 text-center">
                                <Link
                                    href={home()}
                                    className="flex flex-col items-center gap-2 font-medium"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-white/20">
                                        <AppLogoIcon className="size-9 object-contain" />
                                    </div>
                                    <span className="sr-only">{title}</span>
                                </Link>

                                <div className="space-y-2">
                                    <h1 className="font-display text-2xl text-white">
                                        {title}
                                    </h1>
                                    <p className="text-sm leading-6 text-white/80">
                                        {description}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 md:p-10 dark:bg-[linear-gradient(180deg,#000000_0%,#0a0a0a_100%)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.18),transparent_34%)]" />
            <div className="relative w-full max-w-sm">
                <div className="flex flex-col gap-8 rounded-lg border border-white/70 bg-white/80 p-6 shadow-[0_30px_90px_-50px_rgba(88,28,135,0.72)] backdrop-blur-xl dark:border-white/10 dark:bg-white/8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-lg border border-violet-200 bg-white shadow-lg shadow-violet-950/10 dark:border-white/10 dark:bg-white/10">
                                <AppLogoIcon className="size-9 fill-current text-(--foreground) dark:text-white" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="font-display text-xl font-medium">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
