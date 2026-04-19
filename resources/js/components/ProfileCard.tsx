import React, {
    useEffect,
    useRef,
    useCallback,
    useMemo,
    useState,
} from 'react';

const PLACEHOLDER_PREFIX = '<Placeholder';
const DEFAULT_INNER_GRADIENT =
    'linear-gradient(145deg, rgba(37, 43, 90, 0.98) 0%, rgba(43, 55, 103, 0.92) 48%, rgba(10, 45, 82, 0.88) 100%)';
const PLACEHOLDER_INNER_GRADIENT =
    'linear-gradient(180deg, rgba(248, 250, 252, 0.98) 0%, rgba(226, 232, 240, 0.95) 100%)';

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180,
} as const;

const clamp = (value: number, min = 0, max = 100): number =>
    Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number =>
    parseFloat(value.toFixed(precision));

const adjust = (
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number,
): number =>
    round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

interface ProfileCardProps {
    avatarUrl?: string;
    iconUrl?: string;
    grainUrl?: string;
    innerGradient?: string;
    behindGlowEnabled?: boolean;
    behindGlowColor?: string;
    behindGlowSize?: string;
    className?: string;
    enableTilt?: boolean;
    enableMobileTilt?: boolean;
    mobileTiltSensitivity?: number;
    miniAvatarUrl?: string;
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    contactText?: string;
    showUserInfo?: boolean;
    onContactClick?: () => void;
}

interface TiltEngine {
    setImmediate: (x: number, y: number) => void;
    setTarget: (x: number, y: number) => void;
    toCenter: () => void;
    beginInitial: (durationMs: number) => void;
    getCurrent: () => { x: number; y: number; tx: number; ty: number };
    cancel: () => void;
}

function getInitials(name: string): string {
    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join('')
        .toUpperCase();

    return initials || 'GP';
}

function getNameFontSize(name: string): string {
    const length = name.length;

    if (length >= 34) {
        return '0.78rem';
    }

    if (length >= 29) {
        return '0.9rem';
    }

    if (length >= 24) {
        return '1.02rem';
    }

    if (length >= 20) {
        return '1.16rem';
    }

    if (length >= 17) {
        return '1.34rem';
    }

    return 'clamp(1.8rem, 4.4svh, 3rem)';
}

function getTitleFontSize(title: string): string {
    const length = title.length;

    if (length >= 28) {
        return '0.72rem';
    }

    if (length >= 22) {
        return '0.8rem';
    }

    return '0.92rem';
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
    avatarUrl = '<Placeholder for avatar URL>',
    innerGradient,
    behindGlowEnabled = true,
    behindGlowColor,
    behindGlowSize,
    className = '',
    enableTilt = true,
    enableMobileTilt = false,
    mobileTiltSensitivity = 5,
    miniAvatarUrl,
    name = 'Javi A. Torres',
    title = 'Software Engineer',
    handle = 'javicodes',
    status = 'Online',
    contactText = 'Contact',
    showUserInfo = true,
    onContactClick,
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);
    const enterTimerRef = useRef<number | null>(null);
    const leaveRafRef = useRef<number | null>(null);
    const [isAvatarBroken, setIsAvatarBroken] = useState(false);

    const displayName = name.trim() || 'Tenaga Pendidik';
    const displayTitle = title.trim();
    const displayHandle = handle.trim();
    const displayStatus = status.trim();
    const initials = useMemo(() => getInitials(displayName), [displayName]);
    const hasAvatarImage = Boolean(
        avatarUrl &&
        !avatarUrl.startsWith(PLACEHOLDER_PREFIX) &&
        !isAvatarBroken,
    );

    const titleFontSize = useMemo(
        () => getTitleFontSize(displayTitle),
        [displayTitle],
    );
    const nameFontSize = useMemo(
        () => getNameFontSize(displayName),
        [displayName],
    );

    const tiltEngine = useMemo<TiltEngine | null>(() => {
        if (!enableTilt) {
            return null;
        }

        let rafId: number | null = null;
        let running = false;
        let lastTs = 0;

        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const defaultTau = 0.14;
        const initialTau = 0.6;
        let initialUntil = 0;

        const setVarsFromXY = (x: number, y: number): void => {
            const shell = shellRef.current;
            const wrap = wrapRef.current;

            if (!shell || !wrap) {
                return;
            }

            const width = shell.clientWidth || 1;
            const height = shell.clientHeight || 1;

            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);
            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties: Record<string, string> = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${round(-(centerX / 5))}deg`,
                '--rotate-y': `${round(centerY / 4)}deg`,
                '--overlay-opacity': `${hasAvatarImage ? 0.26 : 0.08}`,
            };

            for (const [key, value] of Object.entries(properties)) {
                wrap.style.setProperty(key, value);
            }
        };

        const step = (timestamp: number): void => {
            if (!running) {
                return;
            }

            if (lastTs === 0) {
                lastTs = timestamp;
            }

            const dt = (timestamp - lastTs) / 1000;
            lastTs = timestamp;

            const tau = timestamp < initialUntil ? initialTau : defaultTau;
            const easing = 1 - Math.exp(-dt / tau);

            currentX += (targetX - currentX) * easing;
            currentY += (targetY - currentY) * easing;

            setVarsFromXY(currentX, currentY);

            const stillFar =
                Math.abs(targetX - currentX) > 0.05 ||
                Math.abs(targetY - currentY) > 0.05;

            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;

                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
            }
        };

        const start = (): void => {
            if (running) {
                return;
            }

            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        return {
            setImmediate(x: number, y: number): void {
                currentX = x;
                currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget(x: number, y: number): void {
                targetX = x;
                targetY = y;
                start();
            },
            toCenter(): void {
                const shell = shellRef.current;

                if (!shell) {
                    return;
                }

                this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
            },
            beginInitial(durationMs: number): void {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent(): { x: number; y: number; tx: number; ty: number } {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel(): void {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }

                rafId = null;
                running = false;
                lastTs = 0;
            },
        };
    }, [enableTilt, hasAvatarImage]);

    const getOffsets = (
        event: PointerEvent,
        element: HTMLElement,
    ): { x: number; y: number } => {
        const rect = element.getBoundingClientRect();

        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const handlePointerMove = useCallback(
        (event: PointerEvent): void => {
            const shell = shellRef.current;

            if (!shell || !tiltEngine) {
                return;
            }

            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine],
    );

    const handlePointerEnter = useCallback(
        (event: PointerEvent): void => {
            const shell = shellRef.current;

            if (!shell || !tiltEngine) {
                return;
            }

            shell.classList.add('active');
            shell.classList.add('entering');

            if (enterTimerRef.current) {
                window.clearTimeout(enterTimerRef.current);
            }

            enterTimerRef.current = window.setTimeout(() => {
                shell.classList.remove('entering');
            }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);

            const { x, y } = getOffsets(event, shell);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine],
    );

    const handlePointerLeave = useCallback((): void => {
        const shell = shellRef.current;

        if (!shell || !tiltEngine) {
            return;
        }

        tiltEngine.toCenter();

        const checkSettle = (): void => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            const settled = Math.hypot(tx - x, ty - y) < 0.6;

            if (settled) {
                shell.classList.remove('active');
                leaveRafRef.current = null;
            } else {
                leaveRafRef.current = requestAnimationFrame(checkSettle);
            }
        };

        if (leaveRafRef.current) {
            cancelAnimationFrame(leaveRafRef.current);
        }

        leaveRafRef.current = requestAnimationFrame(checkSettle);
    }, [tiltEngine]);

    const handleDeviceOrientation = useCallback(
        (event: DeviceOrientationEvent): void => {
            const shell = shellRef.current;

            if (!shell || !tiltEngine) {
                return;
            }

            const { beta, gamma } = event;

            if (beta == null || gamma == null) {
                return;
            }

            const centerX = shell.clientWidth / 2;
            const centerY = shell.clientHeight / 2;
            const x = clamp(
                centerX + gamma * mobileTiltSensitivity,
                0,
                shell.clientWidth,
            );
            const y = clamp(
                centerY +
                    (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) *
                        mobileTiltSensitivity,
                0,
                shell.clientHeight,
            );

            tiltEngine.setTarget(x, y);
        },
        [tiltEngine, mobileTiltSensitivity],
    );

    useEffect(() => {
        if (!enableTilt || !tiltEngine) {
            return;
        }

        const shell = shellRef.current;

        if (!shell) {
            return;
        }

        const pointerMoveHandler = handlePointerMove as EventListener;
        const pointerEnterHandler = handlePointerEnter as EventListener;
        const pointerLeaveHandler = handlePointerLeave as EventListener;
        const deviceOrientationHandler =
            handleDeviceOrientation as EventListener;

        shell.addEventListener('pointerenter', pointerEnterHandler);
        shell.addEventListener('pointermove', pointerMoveHandler);
        shell.addEventListener('pointerleave', pointerLeaveHandler);

        const handleClick = (): void => {
            if (!enableMobileTilt || location.protocol !== 'https:') {
                return;
            }

            const anyMotion =
                window.DeviceMotionEvent as typeof DeviceMotionEvent & {
                    requestPermission?: () => Promise<string>;
                };

            if (
                anyMotion &&
                typeof anyMotion.requestPermission === 'function'
            ) {
                anyMotion
                    .requestPermission()
                    .then((state: string) => {
                        if (state === 'granted') {
                            window.addEventListener(
                                'deviceorientation',
                                deviceOrientationHandler,
                            );
                        }
                    })
                    .catch(console.error);
            } else {
                window.addEventListener(
                    'deviceorientation',
                    deviceOrientationHandler,
                );
            }
        };

        shell.addEventListener('click', handleClick);

        const initialX =
            (shell.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

        return () => {
            shell.removeEventListener('pointerenter', pointerEnterHandler);
            shell.removeEventListener('pointermove', pointerMoveHandler);
            shell.removeEventListener('pointerleave', pointerLeaveHandler);
            shell.removeEventListener('click', handleClick);
            window.removeEventListener(
                'deviceorientation',
                deviceOrientationHandler,
            );

            if (enterTimerRef.current) {
                window.clearTimeout(enterTimerRef.current);
            }

            if (leaveRafRef.current) {
                cancelAnimationFrame(leaveRafRef.current);
            }

            tiltEngine.cancel();
            shell.classList.remove('entering');
        };
    }, [
        enableTilt,
        enableMobileTilt,
        tiltEngine,
        handlePointerMove,
        handlePointerEnter,
        handlePointerLeave,
        handleDeviceOrientation,
    ]);

    const cardRadius = '30px';
    const showFooterMeta = Boolean(
        showUserInfo && (displayHandle || displayStatus || onContactClick),
    );

    const cardStyle = useMemo(
        () => ({
            '--inner-gradient': hasAvatarImage
                ? (innerGradient ?? DEFAULT_INNER_GRADIENT)
                : PLACEHOLDER_INNER_GRADIENT,
            '--behind-glow-color': behindGlowColor ?? 'rgba(96, 165, 250, 0.3)',
            '--behind-glow-size': behindGlowSize ?? '52%',
            '--pointer-x': '50%',
            '--pointer-y': '50%',
            '--pointer-from-center': '0',
            '--pointer-from-top': '0.5',
            '--pointer-from-left': '0.5',
            '--rotate-x': '0deg',
            '--rotate-y': '0deg',
            '--background-x': '50%',
            '--background-y': '50%',
            '--overlay-opacity': hasAvatarImage ? '0.26' : '0.08',
        }),
        [hasAvatarImage, innerGradient, behindGlowColor, behindGlowSize],
    );

    const handleContactClick = useCallback((): void => {
        onContactClick?.();
    }, [onContactClick]);

    const nameTextStyle: React.CSSProperties = {
        fontSize: nameFontSize,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        lineHeight: 1,
        letterSpacing: '0',
        color: hasAvatarImage ? '#f8fafc' : '#0f172a',
        textShadow: hasAvatarImage
            ? '0 12px 34px rgba(15, 23, 42, 0.32)'
            : 'none',
    };

    const titleTextStyle: React.CSSProperties = {
        fontSize: titleFontSize,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'clip',
        lineHeight: 1.15,
        letterSpacing: '0',
        color: hasAvatarImage ? 'rgba(226, 232, 240, 0.92)' : '#475569',
    };

    return (
        <div
            ref={wrapRef}
            className={`relative touch-none ${className}`.trim()}
            style={
                {
                    perspective: '500px',
                    transform: 'translate3d(0, 0, 0.1px)',
                    ...cardStyle,
                } as React.CSSProperties
            }
        >
            {behindGlowEnabled && hasAvatarImage ? (
                <div
                    className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200 ease-out"
                    style={{
                        background: `radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color) 0%, transparent var(--behind-glow-size))`,
                        filter: 'blur(42px) saturate(1.08)',
                        opacity: 0.85,
                    }}
                />
            ) : null}

            <div ref={shellRef} className="relative z-[1]">
                <section
                    className="relative grid overflow-hidden"
                    style={{
                        height: '80svh',
                        maxHeight: '540px',
                        aspectRatio: '0.718',
                        borderRadius: cardRadius,
                        transition: 'transform 1s ease',
                        transform: 'translateZ(0) rotateX(0deg) rotateY(0deg)',
                        background: hasAvatarImage
                            ? 'rgba(8, 15, 35, 0.96)'
                            : 'rgba(241, 245, 249, 0.98)',
                        boxShadow: hasAvatarImage
                            ? 'rgba(15, 23, 42, 0.55) calc((var(--pointer-from-left) * 12px) - 4px) calc((var(--pointer-from-top) * 18px) - 6px) 28px -8px'
                            : 'rgba(148, 163, 184, 0.35) 0 22px 48px -28px',
                        backfaceVisibility: 'hidden',
                    }}
                    onMouseEnter={(event) => {
                        event.currentTarget.style.transition = 'none';
                        event.currentTarget.style.transform =
                            'translateZ(0) rotateX(var(--rotate-y)) rotateY(var(--rotate-x))';
                    }}
                    onMouseLeave={(event) => {
                        const shell = shellRef.current;

                        if (shell?.classList.contains('entering')) {
                            event.currentTarget.style.transition =
                                'transform 180ms ease-out';
                        } else {
                            event.currentTarget.style.transition =
                                'transform 1s ease';
                        }

                        event.currentTarget.style.transform =
                            'translateZ(0) rotateX(0deg) rotateY(0deg)';
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'var(--inner-gradient)',
                            borderRadius: cardRadius,
                            display: 'grid',
                            gridArea: '1 / -1',
                        }}
                    />

                    {hasAvatarImage ? (
                        <>
                            <div
                                className="pointer-events-none absolute inset-0 z-[1]"
                                style={{
                                    background:
                                        'linear-gradient(180deg, rgba(15, 23, 42, 0.22) 0%, rgba(15, 23, 42, 0.12) 24%, rgba(15, 23, 42, 0.02) 40%, rgba(2, 6, 23, 0.42) 76%, rgba(2, 6, 23, 0.72) 100%)',
                                }}
                            />
                            <div
                                className="pointer-events-none absolute inset-0 z-[1]"
                                style={{
                                    background:
                                        'radial-gradient(circle at var(--pointer-x) var(--pointer-y), rgba(255, 255, 255, var(--overlay-opacity)) 0%, rgba(255, 255, 255, 0.03) 24%, rgba(255, 255, 255, 0) 50%)',
                                }}
                            />
                            <img
                                className="absolute inset-x-0 bottom-0 z-[2] mx-auto h-[76%] w-[92%] will-change-transform"
                                src={avatarUrl}
                                alt={`${displayName} avatar`}
                                loading="lazy"
                                style={{
                                    objectFit: 'cover',
                                    objectPosition: 'center top',
                                    transformOrigin: '50% 100%',
                                    transform:
                                        'translateX(calc((var(--pointer-from-left) - 0.5) * 8px)) translateY(calc((var(--pointer-from-top) - 0.5) * -4px)) scale(1.015)',
                                    borderRadius: '22px 22px 28px 28px',
                                    backfaceVisibility: 'hidden',
                                }}
                                onError={() => {
                                    setIsAvatarBroken(true);
                                }}
                            />
                        </>
                    ) : (
                        <div className="absolute inset-0 z-[1] overflow-hidden rounded-[30px]">
                            <div className="absolute inset-x-[14%] top-[16%] h-40 rounded-full bg-white/70 blur-3xl" />
                            <div className="absolute inset-x-[12%] bottom-[10%] h-56 rounded-full bg-slate-300/35 blur-3xl" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex size-40 items-center justify-center rounded-full border border-white/80 bg-white/78 text-5xl font-semibold text-slate-600 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.4)]">
                                    {initials}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="absolute inset-x-0 top-0 z-[3] px-5 pt-11 text-center">
                        <h3
                            className="mx-auto max-w-[94%] font-semibold"
                            style={nameTextStyle}
                        >
                            {displayName}
                        </h3>

                        {displayTitle ? (
                            <p
                                className="mx-auto mt-3 max-w-[90%] font-semibold"
                                style={titleTextStyle}
                            >
                                {displayTitle}
                            </p>
                        ) : null}
                    </div>

                    {showFooterMeta ? (
                        <div className="pointer-events-none absolute inset-x-5 bottom-5 z-[4]">
                            <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-[18px] border border-white/12 bg-white/12 px-4 py-3 backdrop-blur-[20px]">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="size-11 shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/10">
                                        {hasAvatarImage ? (
                                            <img
                                                className="h-full w-full object-cover"
                                                src={miniAvatarUrl || avatarUrl}
                                                alt={`${displayName} mini avatar`}
                                                loading="lazy"
                                                onError={() => {
                                                    setIsAvatarBroken(true);
                                                }}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-white/85">
                                                {initials}
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 text-left">
                                        {displayHandle ? (
                                            <div className="truncate text-sm leading-none font-medium text-white/90">
                                                @{displayHandle}
                                            </div>
                                        ) : null}

                                        {displayStatus ? (
                                            <div className="mt-1 truncate text-sm leading-none text-white/70">
                                                {displayStatus}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                {onContactClick ? (
                                    <button
                                        className="cursor-pointer rounded-lg border border-white/16 px-4 py-3 text-xs font-semibold text-white/92 transition-all duration-200 ease-out hover:-translate-y-px hover:border-white/32"
                                        onClick={handleContactClick}
                                        type="button"
                                    >
                                        {contactText}
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </section>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;
