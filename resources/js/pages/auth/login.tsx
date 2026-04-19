import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    securityProfile: {
        guard: string;
        supportsTwoFactor: boolean;
        loginAttemptsPerMinute: number;
    };
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Masuk Portal Internal" />

            <div className="space-y-6 text-white">
                {status && (
                    <div className="rounded-lg border border-cyan-300/40 bg-cyan-400/15 p-4 text-sm leading-6 text-cyan-50 backdrop-blur-sm">
                        <p className="font-semibold">Status sistem</p>
                        <p className="mt-1">{status}</p>
                    </div>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-semibold text-white/90"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="nama@smantenjo.sch.id"
                                        className="h-12 rounded-xl border-white/25 bg-white/12 text-white shadow-none placeholder:text-white/55 focus-visible:border-white/40 focus-visible:ring-white/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-semibold text-white/90"
                                        >
                                            Kata sandi
                                        </Label>
                                        {canResetPassword && (
                                            <TextLink
                                                href={request()}
                                                className="ml-auto text-sm text-white/75 decoration-white/35 hover:text-white"
                                                tabIndex={5}
                                            >
                                                Lupa kata sandi?
                                            </TextLink>
                                        )}
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Masukkan kata sandi"
                                        className="h-12 rounded-xl border-white/25 bg-white/12 text-white shadow-none placeholder:text-white/55 focus-visible:border-white/40 focus-visible:ring-white/20"
                                        toggleClassName="text-white/45 hover:text-white/80"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-white/85"
                                    >
                                        Tetap masuk di perangkat ini
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="mt-1 h-12 w-full rounded-xl bg-[linear-gradient(135deg,var(--school-green-700),var(--school-gold-500),var(--color-blue))] text-white shadow-lg shadow-violet-950/20 hover:bg-[var(--school-gold-700)]"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    {processing
                                        ? 'Memverifikasi akses...'
                                        : 'Masuk ke portal'}
                                </Button>
                            </div>

                            {canRegister && (
                                <div className="rounded-lg border border-white/20 bg-white/10 p-4 text-sm leading-6 text-white/78 backdrop-blur-sm">
                                    <span className="font-medium text-white">
                                        Belum punya akun?
                                    </span>{' '}
                                    Registrasi hanya tersedia untuk jalur yang
                                    dibuka sistem.
                                    <div className="mt-2">
                                        <TextLink
                                            href={register()}
                                            className="text-white/85 decoration-white/35 hover:text-white"
                                            tabIndex={5}
                                        >
                                            Buka registrasi
                                        </TextLink>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Login.layout = {
    variant: 'simple',
    title: 'Masuk',
    description: 'Gunakan akun internal Anda.',
    backgroundImage: '/images/profil/hero-banner.png',
};
