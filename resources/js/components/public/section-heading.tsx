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
                'max-w-2xl space-y-3',
                align === 'center' && 'mx-auto text-center',
            )}
        >
            <div className="inline-flex rounded-full border border-[var(--school-green-200)] bg-white/80 px-4 py-1 text-[0.68rem] font-semibold tracking-[0.16em] text-[var(--school-green-700)] uppercase shadow-[0_14px_34px_-28px_rgba(15,118,110,0.7)] backdrop-blur">
                {eyebrow}
            </div>
            <h2 className="max-w-3xl font-heading text-3xl leading-[1.15] font-semibold tracking-[-0.025em] text-balance text-[var(--school-ink)] md:text-4xl">
                {title}
            </h2>
            <p className="max-w-2xl text-base leading-7 text-pretty text-[var(--school-muted)] md:text-[1.05rem]">
                {description}
            </p>
        </div>
    );
}
