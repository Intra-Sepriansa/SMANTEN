type SchoolMarkProps = {
    compact?: boolean;
};

export function SchoolMark({ compact = false }: SchoolMarkProps) {
    return (
        <div className="flex items-center gap-3">
            <img
                src="/images/logo_clean.png"
                alt="Logo SMAN 1 Tenjo"
                width={44}
                height={44}
                className="h-10 w-10 object-contain drop-shadow-md md:h-11 md:w-11"
            />
            <div className="flex flex-col justify-center">
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--school-green-600)] opacity-90 transition-opacity hover:opacity-100">
                    Kabupaten Bogor
                </div>
                <div className="text-sm font-semibold uppercase tracking-wide text-[var(--school-ink)] md:text-base">
                    SMAN 1 Tenjo
                </div>
            </div>
        </div>
    );
}
