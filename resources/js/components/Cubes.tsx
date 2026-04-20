import gsap from 'gsap';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';

import { cn } from '@/lib/utils';

interface Gap {
    row: number;
    col: number;
}

interface Duration {
    enter: number;
    leave: number;
}

interface GridPosition {
    rowFloat: number;
    colFloat: number;
    rowHit: number;
    colHit: number;
}

export interface CubesProps {
    gridSize?: number;
    cubeSize?: number;
    maxAngle?: number;
    radius?: number;
    easing?: gsap.EaseString;
    duration?: Duration;
    cellGap?: number | Gap;
    borderStyle?: string;
    faceColor?: string;
    shadow?: boolean | string;
    autoAnimate?: boolean;
    rippleOnClick?: boolean;
    rippleColor?: string;
    rippleSpeed?: number;
    showCursor?: boolean;
    cursorColor?: string;
    className?: string;
}

const DEFAULT_DURATION: Duration = {
    enter: 0.3,
    leave: 0.6,
};

const FACE_TRANSFORMS = [
    'translateY(-50%) rotateX(90deg)',
    'translateY(50%) rotateX(-90deg)',
    'translateX(-50%) rotateY(-90deg)',
    'translateX(50%) rotateY(90deg)',
    'rotateY(-90deg) translateX(50%) rotateY(90deg)',
    'rotateY(90deg) translateX(-50%) rotateY(-90deg)',
] as const;

function resolveGap(
    value: CubesProps['cellGap'],
    axis: keyof Gap,
    fallback: string,
): string {
    if (typeof value === 'number') {
        return `${value}px`;
    }

    if (value && typeof value[axis] === 'number') {
        return `${value[axis]}px`;
    }

    return fallback;
}

function randomTarget(gridSize: number): { x: number; y: number } {
    return {
        x: Math.random() * Math.max(gridSize - 1, 1),
        y: Math.random() * Math.max(gridSize - 1, 1),
    };
}

export default function Cubes({
    gridSize = 10,
    cubeSize,
    maxAngle = 45,
    radius = 3,
    easing = 'power3.out',
    duration = DEFAULT_DURATION,
    cellGap,
    borderStyle = '1px solid #fff',
    faceColor = '#120F17',
    shadow = false,
    autoAnimate = true,
    rippleOnClick = true,
    rippleColor = '#fff',
    rippleSpeed = 2,
    showCursor = true,
    cursorColor,
    className,
}: CubesProps) {
    const sceneRef = useRef<HTMLDivElement | null>(null);
    const cubesRef = useRef<HTMLDivElement[]>([]);
    const cursorGlowRef = useRef<HTMLDivElement | null>(null);
    const cursorDotRef = useRef<HTMLDivElement | null>(null);
    const pointerFrameRef = useRef<number | null>(null);
    const autoFrameRef = useRef<number | null>(null);
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const userActiveRef = useRef(false);
    const simPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const simTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    const colGap = resolveGap(cellGap, 'col', '5%');
    const rowGap = resolveGap(cellGap, 'row', '5%');
    const enterDuration = duration.enter;
    const leaveDuration = duration.leave;
    const safeRadius = Math.max(radius, 0.1);
    const safeRippleSpeed = Math.max(rippleSpeed, 0.1);
    const resolvedCursorColor = cursorColor ?? rippleColor;
    const shadowStyle =
        shadow === true ? '0 0 14px rgba(15, 23, 42, 0.24)' : shadow || 'none';
    const indexes = useMemo(
        () => Array.from({ length: gridSize }, (_, index) => index),
        [gridSize],
    );

    const wrapperStyle = useMemo(
        (): CSSProperties =>
            ({
                '--cube-face-border': borderStyle,
                '--cube-face-bg': faceColor,
                '--cube-face-shadow': shadowStyle,
                ...(cubeSize
                    ? {
                          width: `${gridSize * cubeSize}px`,
                          height: `${gridSize * cubeSize}px`,
                      }
                    : {}),
            }) as CSSProperties,
        [borderStyle, cubeSize, faceColor, gridSize, shadowStyle],
    );

    const sceneStyle = useMemo(
        (): CSSProperties => ({
            gridTemplateColumns: cubeSize
                ? `repeat(${gridSize}, ${cubeSize}px)`
                : `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: cubeSize
                ? `repeat(${gridSize}, ${cubeSize}px)`
                : `repeat(${gridSize}, 1fr)`,
            columnGap: colGap,
            rowGap: rowGap,
            perspective: '1800px',
            gridAutoRows: '1fr',
            touchAction: 'none',
        }),
        [colGap, cubeSize, gridSize, rowGap],
    );

    const cacheCubes = useCallback(() => {
        if (!sceneRef.current) {
            cubesRef.current = [];

            return;
        }

        cubesRef.current = Array.from(
            sceneRef.current.querySelectorAll<HTMLDivElement>('.cube'),
        );
    }, []);

    const clearIdleTimer = useCallback(() => {
        if (idleTimerRef.current !== null) {
            clearTimeout(idleTimerRef.current);
            idleTimerRef.current = null;
        }
    }, []);

    const stopPointerFrame = useCallback(() => {
        if (pointerFrameRef.current !== null) {
            cancelAnimationFrame(pointerFrameRef.current);
            pointerFrameRef.current = null;
        }
    }, []);

    const stopAutoFrame = useCallback(() => {
        if (autoFrameRef.current !== null) {
            cancelAnimationFrame(autoFrameRef.current);
            autoFrameRef.current = null;
        }
    }, []);

    const resetAll = useCallback(() => {
        if (prefersReducedMotion) {
            return;
        }

        cubesRef.current.forEach((cube) => {
            gsap.to(cube, {
                duration: leaveDuration,
                rotateX: 0,
                rotateY: 0,
                ease: 'power3.out',
                overwrite: true,
            });
        });
    }, [leaveDuration, prefersReducedMotion]);

    const tiltAt = useCallback(
        (rowCenter: number, colCenter: number) => {
            if (prefersReducedMotion) {
                return;
            }

            cubesRef.current.forEach((cube) => {
                const row = Number(cube.dataset.row);
                const col = Number(cube.dataset.col);
                const distance = Math.hypot(row - rowCenter, col - colCenter);

                if (distance <= safeRadius) {
                    const intensity = 1 - distance / safeRadius;
                    const angle = intensity * maxAngle;
                    gsap.to(cube, {
                        duration: enterDuration,
                        ease: easing,
                        overwrite: true,
                        rotateX: -angle,
                        rotateY: angle,
                        force3D: true,
                    });

                    return;
                }

                gsap.to(cube, {
                    duration: leaveDuration,
                    ease: 'power3.out',
                    overwrite: true,
                    rotateX: 0,
                    rotateY: 0,
                    force3D: true,
                });
            });
        },
        [
            easing,
            enterDuration,
            leaveDuration,
            maxAngle,
            prefersReducedMotion,
            safeRadius,
        ],
    );

    const getGridPosition = useCallback(
        (clientX: number, clientY: number): GridPosition | null => {
            const scene = sceneRef.current;

            if (!scene) {
                return null;
            }

            const rect = scene.getBoundingClientRect();
            const cellWidth = rect.width / gridSize;
            const cellHeight = rect.height / gridSize;
            const relativeX = clientX - rect.left;
            const relativeY = clientY - rect.top;

            return {
                colFloat: relativeX / cellWidth,
                rowFloat: relativeY / cellHeight,
                colHit: Math.min(
                    Math.max(Math.floor(relativeX / cellWidth), 0),
                    gridSize - 1,
                ),
                rowHit: Math.min(
                    Math.max(Math.floor(relativeY / cellHeight), 0),
                    gridSize - 1,
                ),
            };
        },
        [gridSize],
    );

    const scheduleIdleReset = useCallback(() => {
        clearIdleTimer();
        idleTimerRef.current = setTimeout(() => {
            userActiveRef.current = false;
        }, 2200);
    }, [clearIdleTimer]);

    const triggerRipple = useCallback(
        (rowHit: number, colHit: number) => {
            if (!rippleOnClick || prefersReducedMotion) {
                return;
            }

            const rings = new Map<number, HTMLElement[]>();

            cubesRef.current.forEach((cube) => {
                const row = Number(cube.dataset.row);
                const col = Number(cube.dataset.col);
                const ring = Math.round(Math.hypot(row - rowHit, col - colHit));
                const faces = Array.from(
                    cube.querySelectorAll<HTMLElement>('.cube-face'),
                );

                rings.set(ring, [...(rings.get(ring) ?? []), ...faces]);
            });

            const spreadDelay = 0.15 / safeRippleSpeed;
            const animationDuration = 0.28 / safeRippleSpeed;
            const holdDuration = 0.45 / safeRippleSpeed;

            [...rings.keys()]
                .sort((left, right) => left - right)
                .forEach((ring) => {
                    const faces = rings.get(ring) ?? [];
                    const delay = ring * spreadDelay;

                    gsap.to(faces, {
                        backgroundColor: rippleColor,
                        duration: animationDuration,
                        delay,
                        ease: 'power3.out',
                        overwrite: true,
                    });

                    gsap.to(faces, {
                        backgroundColor: faceColor,
                        duration: animationDuration,
                        delay: delay + animationDuration + holdDuration,
                        ease: 'power3.out',
                        overwrite: true,
                    });
                });
        },
        [
            faceColor,
            prefersReducedMotion,
            rippleColor,
            rippleOnClick,
            safeRippleSpeed,
        ],
    );

    const moveCursorIndicator = useCallback(
        (clientX: number, clientY: number, immediate = false) => {
            if (!showCursor || !sceneRef.current) {
                return;
            }

            const bounds = sceneRef.current.getBoundingClientRect();
            const x = clientX - bounds.left;
            const y = clientY - bounds.top;
            const duration = immediate ? 0 : 0.18;

            [cursorGlowRef.current, cursorDotRef.current].forEach((node) => {
                if (!node) {
                    return;
                }

                gsap.to(node, {
                    x,
                    y,
                    duration,
                    ease: 'power3.out',
                    overwrite: true,
                });
            });
        },
        [showCursor],
    );

    const showCursorIndicator = useCallback(() => {
        if (!showCursor || prefersReducedMotion) {
            return;
        }

        [cursorGlowRef.current, cursorDotRef.current].forEach((node) => {
            if (!node) {
                return;
            }

            gsap.to(node, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.18,
                ease: 'power2.out',
                overwrite: true,
            });
        });
    }, [prefersReducedMotion, showCursor]);

    const hideCursorIndicator = useCallback(() => {
        if (!showCursor) {
            return;
        }

        [cursorGlowRef.current, cursorDotRef.current].forEach((node) => {
            if (!node) {
                return;
            }

            gsap.to(node, {
                autoAlpha: 0,
                scale: 0.8,
                duration: 0.22,
                ease: 'power2.out',
                overwrite: true,
            });
        });
    }, [showCursor]);

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            const gridPosition = getGridPosition(event.clientX, event.clientY);

            if (!gridPosition) {
                return;
            }

            userActiveRef.current = true;
            scheduleIdleReset();
            stopPointerFrame();

            if (event.pointerType !== 'touch') {
                moveCursorIndicator(event.clientX, event.clientY);
                showCursorIndicator();
            }

            pointerFrameRef.current = requestAnimationFrame(() => {
                tiltAt(gridPosition.rowFloat, gridPosition.colFloat);
            });
        },
        [
            getGridPosition,
            moveCursorIndicator,
            scheduleIdleReset,
            showCursorIndicator,
            stopPointerFrame,
            tiltAt,
        ],
    );

    const handlePointerEnter = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (event.pointerType === 'touch') {
                return;
            }

            moveCursorIndicator(event.clientX, event.clientY, true);
            showCursorIndicator();
        },
        [moveCursorIndicator, showCursorIndicator],
    );

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            const gridPosition = getGridPosition(event.clientX, event.clientY);

            if (!gridPosition) {
                return;
            }

            if (event.pointerType !== 'touch' && showCursor) {
                gsap.fromTo(
                    cursorDotRef.current,
                    { scale: 1 },
                    {
                        scale: 1.18,
                        duration: 0.14,
                        ease: 'power2.out',
                        yoyo: true,
                        repeat: 1,
                        overwrite: true,
                    },
                );
            }

            triggerRipple(gridPosition.rowHit, gridPosition.colHit);
        },
        [getGridPosition, showCursor, triggerRipple],
    );

    const handlePointerLeave = useCallback(() => {
        userActiveRef.current = false;
        clearIdleTimer();
        stopPointerFrame();
        hideCursorIndicator();
        resetAll();
    }, [clearIdleTimer, hideCursorIndicator, resetAll, stopPointerFrame]);

    useEffect(() => {
        cacheCubes();

        return () => {
            cubesRef.current = [];
        };
    }, [cacheCubes, gridSize]);

    useEffect(() => {
        if (
            !autoAnimate ||
            prefersReducedMotion ||
            cubesRef.current.length === 0
        ) {
            return;
        }

        simPosRef.current = randomTarget(gridSize);
        simTargetRef.current = randomTarget(gridSize);

        const loop = () => {
            if (!userActiveRef.current) {
                const position = simPosRef.current;
                const target = simTargetRef.current;

                position.x += (target.x - position.x) * 0.018;
                position.y += (target.y - position.y) * 0.018;

                tiltAt(position.y, position.x);

                if (
                    Math.hypot(position.x - target.x, position.y - target.y) <
                    0.1
                ) {
                    simTargetRef.current = randomTarget(gridSize);
                }
            }

            autoFrameRef.current = requestAnimationFrame(loop);
        };

        autoFrameRef.current = requestAnimationFrame(loop);

        return () => {
            stopAutoFrame();
        };
    }, [autoAnimate, gridSize, prefersReducedMotion, stopAutoFrame, tiltAt]);

    useEffect(() => {
        const cursorNodes = [
            cursorGlowRef.current,
            cursorDotRef.current,
        ].filter(Boolean);

        return () => {
            clearIdleTimer();
            stopPointerFrame();
            stopAutoFrame();
            gsap.killTweensOf(cubesRef.current);
            gsap.killTweensOf(cursorNodes);
            cubesRef.current.forEach((cube) => {
                gsap.killTweensOf(
                    Array.from(
                        cube.querySelectorAll<HTMLElement>('.cube-face'),
                    ),
                );
            });
        };
    }, [clearIdleTimer, stopAutoFrame, stopPointerFrame]);

    useEffect(() => {
        if (!showCursor) {
            return;
        }

        [cursorGlowRef.current, cursorDotRef.current].forEach((node) => {
            if (!node) {
                return;
            }

            gsap.set(node, {
                xPercent: -50,
                yPercent: -50,
                autoAlpha: 0,
                scale: 0.8,
            });
        });
    }, [showCursor]);

    return (
        <div
            className={cn(
                'relative aspect-square w-full [perspective:1800px]',
                className,
            )}
            style={wrapperStyle}
        >
            <div
                ref={sceneRef}
                className={cn(
                    'grid h-full w-full',
                    showCursor && 'cursor-none',
                )}
                style={sceneStyle}
                onPointerEnter={handlePointerEnter}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerDown={handlePointerDown}
            >
                {indexes.map((row) =>
                    indexes.map((col) => (
                        <div
                            key={`${row}-${col}`}
                            className="cube relative aspect-square h-full w-full [transform-style:preserve-3d]"
                            data-row={row}
                            data-col={col}
                        >
                            <span className="pointer-events-none absolute -inset-7" />

                            {FACE_TRANSFORMS.map((transform) => (
                                <div
                                    key={`${row}-${col}-${transform}`}
                                    className="cube-face absolute inset-0 flex items-center justify-center"
                                    style={{
                                        background: 'var(--cube-face-bg)',
                                        border: 'var(--cube-face-border)',
                                        boxShadow: 'var(--cube-face-shadow)',
                                        transform,
                                    }}
                                />
                            ))}
                        </div>
                    )),
                )}
            </div>

            {showCursor && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    <div
                        ref={cursorGlowRef}
                        className="absolute size-28 rounded-full bg-current/18 blur-3xl"
                        style={{ color: resolvedCursorColor }}
                    />
                    <div
                        ref={cursorDotRef}
                        className="absolute flex size-5 items-center justify-center rounded-full border border-current bg-white/80 shadow-[0_0_0_10px_rgba(255,255,255,0.35)] backdrop-blur-sm"
                        style={{ color: resolvedCursorColor }}
                    >
                        <span className="size-1.5 rounded-full bg-current" />
                    </div>
                </div>
            )}
        </div>
    );
}
