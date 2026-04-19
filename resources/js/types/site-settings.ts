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

export type PublicPortalSettings = {
    hero: {
        slides: PublicPortalHeroSlide[];
        primary_cta: PublicPortalPrimaryCta;
    };
    navigation: {
        items: PublicPortalNavigationItemSetting[];
    };
};

export type SharedSiteSettings = {
    publicPortal?: PublicPortalSettings | null;
};
