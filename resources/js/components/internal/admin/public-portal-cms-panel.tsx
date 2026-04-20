import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    CalendarClock,
    Eye,
    EyeOff,
    Globe,
    Image as ImageIcon,
    LayoutTemplate,
    RotateCcw,
    Save,
    SearchCheck,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { jsonHeaders } from '@/lib/http';
import {
    buildPublicNavigation,
    defaultPublicPortalSettings,
    resolvePublicPortalSettings,
    sortNavigationSettings,
} from '@/lib/public-portal-settings';
import { home } from '@/routes';
import { update } from '@/routes/internal-api/site-settings/public-portal';
import type { PublicPortalSettings, SharedSiteSettings } from '@/types';

function firstError(
    errors: Record<string, string[] | string | undefined>,
    key: string,
): string | undefined {
    const value = errors[key];

    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
}

export function PublicPortalCmsPanel() {
    const page = usePage<{ siteSettings?: SharedSiteSettings }>();
    const resolvedSettings = useMemo(
        () =>
            resolvePublicPortalSettings(page.props.siteSettings?.publicPortal),
        [page.props.siteSettings?.publicPortal],
    );
    const [settings, setSettings] =
        useState<PublicPortalSettings>(resolvedSettings);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setSettings(resolvedSettings);
    }, [resolvedSettings]);

    const visibleNavigation = useMemo(
        () => buildPublicNavigation(settings),
        [settings],
    );

    const orderedNavigationSettings = useMemo(
        () => sortNavigationSettings(settings.navigation.items),
        [settings.navigation.items],
    );

    const updateSlide = (
        slideIndex: number,
        field: 'title' | 'subtitle' | 'image',
        value: string,
    ) => {
        setSettings((current) => ({
            ...current,
            hero: {
                ...current.hero,
                slides: current.hero.slides.map((slide, index) =>
                    index === slideIndex ? { ...slide, [field]: value } : slide,
                ),
            },
        }));
    };

    const updateNavigationItem = (
        href: string,
        patch: Partial<PublicPortalSettings['navigation']['items'][number]>,
    ) => {
        setSettings((current) => ({
            ...current,
            navigation: {
                items: current.navigation.items.map((item) =>
                    item.href === href ? { ...item, ...patch } : item,
                ),
            },
        }));
    };

    const resetToDefault = () => {
        setSettings(defaultPublicPortalSettings);
        setErrors({});
    };

    const handleSave = async (): Promise<void> => {
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch(update.url(), {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: jsonHeaders(),
                body: JSON.stringify(settings),
            });

            const payload = (await response.json().catch(() => ({}))) as {
                data?: PublicPortalSettings;
                message?: string;
                errors?: Record<string, string[]>;
            };

            if (!response.ok) {
                if (payload.errors) {
                    setErrors(payload.errors);
                }

                throw new Error(
                    payload.message ??
                        firstError(
                            payload.errors ?? {},
                            'hero.slides.0.title',
                        ) ??
                        'Pengaturan website tidak berhasil disimpan.',
                );
            }

            toast.success(
                'Website publik diperbarui. Banner, CTA, dan menu siap dipakai.',
            );
            router.reload();
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Pembaruan website publik gagal diproses.',
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section id="website-ops" className="scroll-mt-28 space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                        CMS Website
                    </div>
                    <h2 className="text-xl font-semibold text-neutral-950 dark:text-white">
                        Edit banner utama, CTA, dan menu navigasi publik
                    </h2>
                </div>

                <Button variant="outline" asChild>
                    <Link href={home()} target="_blank">
                        Lihat website publik
                        <ArrowUpRight className="size-4" />
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6">
                <div className="space-y-6 rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/75">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                            <ImageIcon className="size-4" />
                            Banner Hero
                        </div>

                        <div className="grid gap-4">
                            {settings.hero.slides.map((slide, index) => (
                                <div
                                    key={`${slide.image}-${index}`}
                                    className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50"
                                >
                                    <div
                                        className="h-36 rounded-2xl bg-cover bg-center"
                                        style={{
                                            backgroundImage: `linear-gradient(135deg, rgba(7, 24, 39, 0.72), rgba(7, 24, 39, 0.32)), url(${slide.image})`,
                                        }}
                                    >
                                        <div className="flex h-full flex-col justify-end p-4 text-white">
                                            <div className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
                                                {slide.subtitle}
                                            </div>
                                            <div className="mt-2 text-lg leading-tight font-semibold">
                                                {slide.title}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-3">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`slide-image-${index}`}
                                            >
                                                Path gambar
                                            </Label>
                                            <Input
                                                id={`slide-image-${index}`}
                                                value={slide.image}
                                                onChange={(event) =>
                                                    updateSlide(
                                                        index,
                                                        'image',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={firstError(
                                                    errors,
                                                    `hero.slides.${index}.image`,
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`slide-title-${index}`}
                                            >
                                                Judul slide
                                            </Label>
                                            <Input
                                                id={`slide-title-${index}`}
                                                value={slide.title}
                                                onChange={(event) =>
                                                    updateSlide(
                                                        index,
                                                        'title',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={firstError(
                                                    errors,
                                                    `hero.slides.${index}.title`,
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`slide-subtitle-${index}`}
                                            >
                                                Subtitle
                                            </Label>
                                            <Input
                                                id={`slide-subtitle-${index}`}
                                                value={slide.subtitle}
                                                onChange={(event) =>
                                                    updateSlide(
                                                        index,
                                                        'subtitle',
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={firstError(
                                                    errors,
                                                    `hero.slides.${index}.subtitle`,
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                            <Globe className="size-4" />
                            CTA utama hero
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-2">
                                <Label htmlFor="hero-primary-cta-label">
                                    Label tombol
                                </Label>
                                <Input
                                    id="hero-primary-cta-label"
                                    value={settings.hero.primary_cta.label}
                                    onChange={(event) =>
                                        setSettings((current) => ({
                                            ...current,
                                            hero: {
                                                ...current.hero,
                                                primary_cta: {
                                                    ...current.hero.primary_cta,
                                                    label: event.target.value,
                                                },
                                            },
                                        }))
                                    }
                                />
                                <InputError
                                    message={firstError(
                                        errors,
                                        'hero.primary_cta.label',
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="hero-primary-cta-href">
                                    URL tujuan
                                </Label>
                                <Input
                                    id="hero-primary-cta-href"
                                    value={settings.hero.primary_cta.href}
                                    onChange={(event) =>
                                        setSettings((current) => ({
                                            ...current,
                                            hero: {
                                                ...current.hero,
                                                primary_cta: {
                                                    ...current.hero.primary_cta,
                                                    href: event.target.value,
                                                },
                                            },
                                        }))
                                    }
                                />
                                <InputError
                                    message={firstError(
                                        errors,
                                        'hero.primary_cta.href',
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                                <SearchCheck className="size-4" />
                                SEO halaman publik
                            </div>

                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="seo-title">SEO title</Label>
                                    <Input
                                        id="seo-title"
                                        value={settings.seo.title}
                                        onChange={(event) =>
                                            setSettings((current) => ({
                                                ...current,
                                                seo: {
                                                    ...current.seo,
                                                    title: event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="seo-description">
                                        Meta description
                                    </Label>
                                    <textarea
                                        id="seo-description"
                                        value={settings.seo.description}
                                        onChange={(event) =>
                                            setSettings((current) => ({
                                                ...current,
                                                seo: {
                                                    ...current.seo,
                                                    description:
                                                        event.target.value,
                                                },
                                            }))
                                        }
                                        rows={3}
                                        className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-800 shadow-xs transition outline-none focus:border-(--school-green-400) focus:ring-3 focus:ring-(--school-green-200)/50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="seo-keywords">
                                        Keywords
                                    </Label>
                                    <Input
                                        id="seo-keywords"
                                        value={settings.seo.keywords}
                                        onChange={(event) =>
                                            setSettings((current) => ({
                                                ...current,
                                                seo: {
                                                    ...current.seo,
                                                    keywords:
                                                        event.target.value,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                                <CalendarClock className="size-4" />
                                Jadwal publish
                            </div>

                            <div className="grid gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="publishing-status">
                                        Status konten
                                    </Label>
                                    <select
                                        id="publishing-status"
                                        value={settings.publishing.status}
                                        onChange={(event) =>
                                            setSettings((current) => ({
                                                ...current,
                                                publishing: {
                                                    ...current.publishing,
                                                    status: event.target
                                                        .value as PublicPortalSettings['publishing']['status'],
                                                },
                                            }))
                                        }
                                        className="h-10 rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 shadow-xs transition outline-none focus:border-(--school-green-400) focus:ring-3 focus:ring-(--school-green-200)/50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                                    >
                                        <option value="published">
                                            Published
                                        </option>
                                        <option value="draft">Draft</option>
                                        <option value="scheduled">
                                            Scheduled
                                        </option>
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="publishing-scheduled-at">
                                        Tayang terjadwal
                                    </Label>
                                    <Input
                                        id="publishing-scheduled-at"
                                        type="datetime-local"
                                        value={
                                            settings.publishing.scheduled_at ??
                                            ''
                                        }
                                        onChange={(event) =>
                                            setSettings((current) => ({
                                                ...current,
                                                publishing: {
                                                    ...current.publishing,
                                                    scheduled_at:
                                                        event.target.value ||
                                                        null,
                                                },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-4 py-3 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-950/45 dark:text-neutral-400">
                                    Draft dan jadwal publish disimpan sebagai
                                    metadata revisi agar admin punya alur review
                                    sebelum perubahan tayang.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950 dark:text-white">
                            <LayoutTemplate className="size-4" />
                            Navigasi utama
                        </div>

                        <div className="space-y-3">
                            {orderedNavigationSettings.map((item) => (
                                <div
                                    key={item.href}
                                    className="grid gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-[1fr_120px_100px_auto] md:items-end dark:border-neutral-800 dark:bg-neutral-950/50"
                                >
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor={`nav-label-${item.href}`}
                                        >
                                            Label menu
                                        </Label>
                                        <Input
                                            id={`nav-label-${item.href}`}
                                            value={item.label}
                                            onChange={(event) =>
                                                updateNavigationItem(
                                                    item.href,
                                                    {
                                                        label: event.target
                                                            .value,
                                                    },
                                                )
                                            }
                                        />
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {item.href}
                                        </div>
                                        <InputError
                                            message={firstError(
                                                errors,
                                                `navigation.items.${settings.navigation.items.findIndex((entry) => entry.href === item.href)}.label`,
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor={`nav-position-${item.href}`}
                                        >
                                            Urutan
                                        </Label>
                                        <Input
                                            id={`nav-position-${item.href}`}
                                            type="number"
                                            min={1}
                                            value={item.position}
                                            onChange={(event) =>
                                                updateNavigationItem(
                                                    item.href,
                                                    {
                                                        position:
                                                            Number(
                                                                event.target
                                                                    .value,
                                                            ) || 1,
                                                    },
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Tampil</Label>
                                        <div className="flex h-10 items-center gap-2">
                                            <Checkbox
                                                checked={item.visible}
                                                onCheckedChange={(checked) =>
                                                    updateNavigationItem(
                                                        item.href,
                                                        {
                                                            visible:
                                                                checked ===
                                                                true,
                                                        },
                                                    )
                                                }
                                            />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-200">
                                                {item.visible
                                                    ? 'Aktif'
                                                    : 'Sembunyi'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                                        {item.visible ? (
                                            <Eye className="size-4" />
                                        ) : (
                                            <EyeOff className="size-4" />
                                        )}
                                        {item.visible
                                            ? 'Muncul di navbar'
                                            : 'Disembunyikan'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={processing}
                        >
                            <Save className="size-4" />
                            {processing
                                ? 'Menyimpan perubahan...'
                                : 'Simpan website publik'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetToDefault}
                            disabled={processing}
                        >
                            <RotateCcw className="size-4" />
                            Reset ke default
                        </Button>
                    </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/75">
                    <div>
                        <div className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                            Live Preview Ringkas
                        </div>
                        <h3 className="mt-1 text-lg font-semibold text-neutral-950 dark:text-white">
                            Wajah publik setelah disimpan
                        </h3>
                    </div>

                    <div
                        className="rounded-[2rem] border border-neutral-200 bg-cover bg-center p-5 text-white shadow-sm dark:border-neutral-800"
                        style={{
                            backgroundImage: `linear-gradient(135deg, rgba(5, 31, 45, 0.85), rgba(8, 42, 34, 0.55)), url(${settings.hero.slides[0]?.image})`,
                        }}
                    >
                        <div className="text-xs font-semibold tracking-[0.18em] text-white/70 uppercase">
                            {settings.hero.slides[0]?.subtitle}
                        </div>
                        <div className="mt-3 text-2xl leading-tight font-semibold">
                            {settings.hero.slides[0]?.title}
                        </div>
                        <div className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                            {settings.hero.primary_cta.label}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                            Menu aktif
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {visibleNavigation.map((item) => (
                                <span
                                    key={item.href}
                                    className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                                >
                                    {item.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm leading-6 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-950/50 dark:text-neutral-300">
                        Modul ini sudah menyimpan keputusan admin untuk banner
                        hero, CTA utama, dan label/visibilitas menu navbar.
                        Untuk upload aset gambar baru dari panel, modul media
                        khusus masih perlu ditambahkan di tahap berikutnya.
                    </div>
                </div>
            </div>
        </section>
    );
}
