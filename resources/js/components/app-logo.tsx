export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg border border-white/40 bg-white/70 shadow-sm dark:border-white/10 dark:bg-white/10">
                <img
                    src="/images/logo_clean.png"
                    alt="Logo SMAN 1 Tenjo"
                    className="size-8 object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="text-[10px] tracking-[0.2em] text-sidebar-foreground/60 uppercase">
                    SMANTEN
                </span>
                <span className="truncate leading-tight font-semibold">
                    Portal Internal
                </span>
            </div>
        </>
    );
}
