import { Instagram, Youtube } from 'lucide-react';

const socialLinks = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/sman1tenjo/',
        icon: Instagram,
        handle: '@sman1tenjo',
    },
    {
        label: 'YouTube',
        href: 'https://www.youtube.com/@sman1tenjoofficial115',
        icon: Youtube,
        handle: 'SMAN 1 Tenjo Official',
    },
] as const;

export function SocialLinks() {
    return (
        <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
                <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-[var(--school-muted)] transition hover:border-[var(--school-green-200)] hover:bg-white hover:text-[var(--school-green-700)] hover:shadow-[0_8px_24px_-12px_rgba(15,118,110,0.3)]"
                >
                    <link.icon className="size-4" />
                    {link.handle}
                </a>
            ))}
        </div>
    );
}
