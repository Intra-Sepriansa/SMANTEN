export type PublicPortalHeroSlide = {
    image: string;
    title: string;
    subtitle: string;
};

export type PublicPortalPrimaryCta = {
    label: string;
    href: string;
};

export type PublicPortalNavigationItemSetting = {
    href: string;
    label: string;
    visible: boolean;
    position: number;
};

export type PublicPortalSeoSettings = {
    title: string;
    description: string;
    keywords: string;
};

export type PublicPortalPublishingSettings = {
    status: 'draft' | 'published' | 'scheduled';
    scheduled_at: string | null;
};

export type PublicPortalSettings = {
    hero: {
        slides: PublicPortalHeroSlide[];
        primary_cta: PublicPortalPrimaryCta;
    };
    navigation: {
        items: PublicPortalNavigationItemSetting[];
    };
    publishing: PublicPortalPublishingSettings;
    seo: PublicPortalSeoSettings;
};

export type SharedSiteSettings = {
    publicPortal?: PublicPortalSettings | null;
};
