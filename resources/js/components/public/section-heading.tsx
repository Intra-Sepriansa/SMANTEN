import { cn } from '@/lib/utils';

type SectionHeadingProps = {
    eyebrow: string;
    title: string;
    description: string;
    align?: 'left' | 'center';
};

export function SectionHeading({
    eyebrow,
    title,
    description,
    align = 'left',
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'max-w-2xl space-y-4',
                align === 'center' && 'mx-auto text-center',
            )}
        >
            <div className="inline-flex rounded-full border border-[var(--school-green-200)] bg-white/80 px-4 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--school-green-700)] shadow-[0_14px_34px_-28px_rgba(15,118,110,0.7)] backdrop-blur">
                {eyebrow}
            </div>
            <h2 className="text-balance font-heading text-3xl leading-tight text-[var(--school-ink)] md:text-4xl">
                {title}
            </h2>
            <p className="text-pretty text-base leading-7 text-[var(--school-muted)] md:text-lg">
                {description}
            </p>
        </div>
    );
}
