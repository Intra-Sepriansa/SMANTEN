import { publicNavigation } from '@/lib/public-content';
import type { NavItem } from '@/lib/public-content';
import type {
    PublicPortalHeroSlide,
    PublicPortalNavigationItemSetting,
    PublicPortalSettings,
} from '@/types';

export const defaultHeroSlides: PublicPortalHeroSlide[] = [
    {
        image: '/images/sekolah/guru_mengajar.jpg',
        title: 'Mendukung Sosialisasi Kurikulum Merdeka Belajar',
        subtitle: 'Menyiapkan generasi unggul',
    },
    {
        image: '/images/sekolah/murid_belajar.jpg',
        title: 'Pembelajaran Hidup dan Adaptif',
        subtitle: 'Tampil digital dan berkarakter',
    },
    {
        image: '/images/sekolah/fasilitas_lab.jpg',
        title: 'Fasilitas Belajar Modern',
        subtitle: 'Dukung penuh inovasi siswa',
    },
    {
        image: '/images/sekolah/kegiatan_siswa.jpg',
        title: 'Ekstrakurikuler Dinamis',
        subtitle: 'Gali potensi dan bakat sejati',
    },
];

export const defaultPublicPortalSettings: PublicPortalSettings = {
    hero: {
        slides: defaultHeroSlides,
        primary_cta: {
            label: 'Cek Beritanya',
            href: '/berita',
        },
    },
    navigation: {
        items: publicNavigation.map((item, index) => ({
            href: item.href,
            label: item.label,
            visible: true,
            position: index + 1,
        })),
    },
};

function resolveNavigationLabel(href: string, label: string): string {
    if (href === '/profil' && label === 'Profil Sekolah') {
        return 'Profil';
    }

    if (href === '/organisasi' && label === 'Komunitas Sekolah') {
        return 'Komunitas';
    }

    return label;
}

export function resolvePublicPortalSettings(
    settings?: PublicPortalSettings | null,
): PublicPortalSettings {
    const incomingSlides = settings?.hero?.slides ?? [];
    const mergedSlides = defaultHeroSlides.map((slide, index) => ({
        ...slide,
        ...(incomingSlides[index] ?? {}),
    }));

    const navigationByHref = new Map(
        settings?.navigation?.items?.map((item) => [item.href, item]) ?? [],
    );

    return {
        hero: {
            slides: mergedSlides,
            primary_cta: {
                ...defaultPublicPortalSettings.hero.primary_cta,
                ...(settings?.hero?.primary_cta ?? {}),
            },
        },
        navigation: {
            items: defaultPublicPortalSettings.navigation.items.map((item) => ({
                ...item,
                ...(navigationByHref.get(item.href) ?? {}),
            })),
        },
    };
}

export function buildPublicNavigation(
    settings?: PublicPortalSettings | null,
): NavItem[] {
    const resolvedSettings = resolvePublicPortalSettings(settings);
    const configuredItems = new Map(
        resolvedSettings.navigation.items.map((item) => [item.href, item]),
    );

    return publicNavigation
        .map((item) => {
            const configuredItem = configuredItems.get(item.href);

            return {
                ...item,
                label: resolveNavigationLabel(
                    item.href,
                    configuredItem?.label ?? item.label,
                ),
                __visible: configuredItem?.visible ?? true,
                __position: configuredItem?.position ?? 999,
            };
        })
        .filter((item) => item.__visible)
        .sort((left, right) => left.__position - right.__position)
        .map((item) => ({
            href: item.href,
            label: item.label,
            children: item.children,
        }));
}

export function sortNavigationSettings(
    items: PublicPortalNavigationItemSetting[],
): PublicPortalNavigationItemSetting[] {
    return [...items].sort((left, right) => left.position - right.position);
}
