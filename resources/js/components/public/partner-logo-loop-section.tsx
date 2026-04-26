import LogoLoop from '@/components/LogoLoop';
import type { LogoItem } from '@/components/LogoLoop';
import { cn } from '@/lib/utils';

type PartnerLogo = Extract<LogoItem, { src: string }> & {
    imageClassName?: string;
};

const partnerLogos: PartnerLogo[] = [
    {
        src: '/images/partners/provinsi-jawa-barat.svg',
        alt: 'Provinsi Jawa Barat',
        imageClassName: 'max-h-10 md:max-h-[4.9rem]',
    },
    {
        src: '/images/logo_clean.png',
        alt: 'SMAN 1 Tenjo',
        imageClassName: 'max-h-11 md:max-h-[4.8rem]',
    },
    {
        src: '/images/partners/kurikulum-merdeka.svg',
        alt: 'Kurikulum Merdeka',
        imageClassName:
            'max-h-8 max-w-24 md:max-h-[3.6rem] md:max-w-[9.8rem]',
    },
    {
        src: '/images/partners/merdeka-belajar.png',
        alt: 'Merdeka Belajar',
        imageClassName: 'max-h-10 md:max-h-[5rem]',
    },
    {
        src: '/images/partners/merdeka-mengajar.png',
        alt: 'Merdeka Mengajar',
        imageClassName:
            'max-h-9 max-w-24 md:max-h-[4.5rem] md:max-w-[9.8rem]',
    },
    {
        src: '/images/partners/tut-wuri-handayani.svg',
        alt: 'Tut Wuri Handayani',
        imageClassName: 'max-h-10 md:max-h-[5.1rem]',
    },
    {
        src: '/images/partners/adiwiyata.png',
        alt: 'Adiwiyata',
        imageClassName: 'max-h-10 md:max-h-[5rem]',
    },
];

function renderPartnerLogo(partner: PartnerLogo) {
    return (
        <img
            src={partner.src}
            alt={partner.alt}
            className={cn(
                'block h-auto max-w-[11rem] object-contain drop-shadow-[0_10px_16px_rgba(4,47,46,0.12)] transition-transform duration-300 group-hover/item:scale-105 md:max-w-[12rem]',
                partner.imageClassName,
            )}
            loading="lazy"
            decoding="async"
            draggable={false}
        />
    );
}

export function PartnerLogoLoopSection() {
    return (
        <section
            id="mitra-sekolah"
            aria-label="Logo kerja sama SMAN 1 Tenjo"
            className="relative overflow-hidden py-2"
        >
            <LogoLoop
                logos={partnerLogos}
                speed={70}
                direction="left"
                logoHeight={96}
                gap={72}
                hoverSpeed={8}
                fadeOut
                fadeOutColor="#f8f5ed"
                scaleOnHover
                renderItem={(item: LogoItem) => renderPartnerLogo(item as PartnerLogo)}
                ariaLabel="Logo kerja sama SMAN 1 Tenjo"
                className="py-3"
            />
        </section>
    );
}
