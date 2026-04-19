import { cn } from '@/lib/utils';

type SchoolMarkProps = {
    compact?: boolean;
};

export function SchoolMark({ compact = false }: SchoolMarkProps) {
    return (
        <div
            className={cn(
                'flex shrink-0 items-center whitespace-nowrap transition-all duration-300',
                compact ? 'gap-2.5' : 'gap-3.5',
            )}
        >
            <div
                className={cn(
                    'grid place-items-center rounded-[1.35rem] border border-white/80 bg-white/85 shadow-[0_18px_40px_-22px_rgba(4,47,46,0.24)] backdrop-blur-md transition-all duration-300',
                    compact
                        ? 'h-11 w-11'
                        : 'h-12 w-12 md:h-[3.2rem] md:w-[3.2rem]',
                )}
            >
                <img
                    src="/images/logo_clean.png"
                    alt="Logo SMAN 1 Tenjo"
                    width={44}
                    height={44}
                    className={cn(
                        'object-contain drop-shadow-md transition-all duration-300',
                        compact
                            ? 'h-8 w-8 md:h-9 md:w-9'
                            : 'h-10 w-10 md:h-11 md:w-11',
                    )}
                />
            </div>
            <div className="flex flex-col justify-center leading-none">
                <div
                    className={cn(
                        'font-bold text-[var(--school-green-600)] uppercase opacity-90 transition-all duration-300 hover:opacity-100',
                        compact
                            ? 'text-[0.58rem] tracking-[0.28em]'
                            : 'text-[0.65rem] tracking-[0.3em]',
                    )}
                >
                    Kabupaten Bogor
                </div>
                <div
                    className={cn(
                        'font-semibold tracking-wide text-[var(--school-ink)] uppercase transition-all duration-300',
                        compact ? 'text-[0.92rem]' : 'text-sm md:text-base',
                    )}
                >
                    SMAN 1 Tenjo
                </div>
            </div>
        </div>
    );
}
