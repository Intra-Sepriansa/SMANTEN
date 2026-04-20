import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

import { cn } from '@/lib/utils';

export interface FlowingMenuItemData {
    link: string;
    text: string;
    image: string;
    imagePosition?: string;
    imageSize?: string;
    isActive?: boolean;
}

interface FlowingMenuProps {
    items?: FlowingMenuItemData[];
    speed?: number;
    textColor?: string;
    bgColor?: string;
    marqueeBgColor?: string;
    marqueeTextColor?: string;
    borderColor?: string;
    className?: string;
    onItemClick?: () => void;
}

interface MenuItemProps extends FlowingMenuItemData {
    speed: number;
    textColor: string;
    marqueeBgColor: string;
    marqueeTextColor: string;
    borderColor: string;
    isFirst: boolean;
    onItemClick?: () => void;
}

const animationDefaults = {
    duration: 0.6,
    ease: 'expo.out',
} as const;

function findClosestEdge(
    mouseX: number,
    mouseY: number,
    width: number,
    height: number,
): 'top' | 'bottom' {
    const topEdgeDistance =
        (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDistance =
        (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;

    return topEdgeDistance < bottomEdgeDistance ? 'top' : 'bottom';
}

export default function FlowingMenu({
    items = [],
    speed = 15,
    textColor = '#163041',
    bgColor = 'transparent',
    marqueeBgColor = '#ffffff',
    marqueeTextColor = '#0f172a',
    borderColor = 'rgba(148, 163, 184, 0.16)',
    className,
    onItemClick,
}: FlowingMenuProps) {
    return (
        <div
            className={cn('h-full w-full overflow-hidden', className)}
            style={{ backgroundColor: bgColor }}
        >
            <nav className="flex h-full flex-col" aria-label="Submenu cepat">
                {items.map((item, index) => (
                    <MenuItem
                        key={`${item.link}-${item.text}`}
                        {...item}
                        speed={speed}
                        textColor={textColor}
                        marqueeBgColor={marqueeBgColor}
                        marqueeTextColor={marqueeTextColor}
                        borderColor={borderColor}
                        isFirst={index === 0}
                        onItemClick={onItemClick}
                    />
                ))}
            </nav>
        </div>
    );
}

function MenuItem({
    link,
    text,
    image,
    imagePosition = 'center',
    imageSize = '180%',
    isActive = false,
    speed,
    textColor,
    marqueeBgColor,
    marqueeTextColor,
    borderColor,
    isFirst,
    onItemClick,
}: MenuItemProps) {
    const itemRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);
    const marqueeInnerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<gsap.core.Tween | null>(null);
    const [repetitions, setRepetitions] = useState(4);

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    useEffect(() => {
        const itemNode = itemRef.current;
        const marqueeInnerNode = marqueeInnerRef.current;

        if (!itemNode || !marqueeInnerNode) {
            return;
        }

        const updateRepetitions = () => {
            const marqueePart =
                marqueeInnerNode.querySelector<HTMLElement>('.marquee-part');

            if (!marqueePart) {
                return;
            }

            const itemWidth = itemNode.offsetWidth;
            const contentWidth = marqueePart.offsetWidth;

            if (contentWidth === 0) {
                return;
            }

            const neededRepetitions =
                Math.ceil(itemWidth / contentWidth) + 3;

            setRepetitions(Math.max(4, neededRepetitions));
        };

        updateRepetitions();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateRepetitions);

            return () => {
                window.removeEventListener('resize', updateRepetitions);
            };
        }

        const resizeObserver = new ResizeObserver(() => {
            updateRepetitions();
        });

        resizeObserver.observe(itemNode);
        resizeObserver.observe(marqueeInnerNode);

        return () => {
            resizeObserver.disconnect();
        };
    }, [image, imagePosition, text]);

    useEffect(() => {
        const marqueeInnerNode = marqueeInnerRef.current;
        const marqueePart =
            marqueeInnerNode?.querySelector<HTMLElement>('.marquee-part');

        if (!marqueeInnerNode || !marqueePart || prefersReducedMotion) {
            return;
        }

        const contentWidth = marqueePart.offsetWidth;

        if (contentWidth === 0) {
            return;
        }

        animationRef.current?.kill();
        animationRef.current = gsap.to(marqueeInnerNode, {
            x: -contentWidth,
            duration: speed,
            ease: 'none',
            repeat: -1,
        });

        return () => {
            animationRef.current?.kill();
            animationRef.current = null;
        };
    }, [image, imagePosition, prefersReducedMotion, repetitions, speed, text]);

    useEffect(() => {
        return () => {
            animationRef.current?.kill();
            animationRef.current = null;
        };
    }, []);

    const handlePointerEnter = (
        event: ReactPointerEvent<HTMLAnchorElement>,
    ) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) {
            return;
        }

        if (prefersReducedMotion) {
            gsap.set([marqueeRef.current, marqueeInnerRef.current], { y: '0%' });

            return;
        }

        const rect = itemRef.current.getBoundingClientRect();
        const edge = findClosestEdge(
            event.clientX - rect.left,
            event.clientY - rect.top,
            rect.width,
            rect.height,
        );

        gsap.timeline({ defaults: animationDefaults })
            .set(marqueeRef.current, {
                y: edge === 'top' ? '-101%' : '101%',
            })
            .set(marqueeInnerRef.current, {
                y: edge === 'top' ? '101%' : '-101%',
            })
            .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
    };

    const handlePointerLeave = (
        event: ReactPointerEvent<HTMLAnchorElement>,
    ) => {
        if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) {
            return;
        }

        if (prefersReducedMotion) {
            gsap.set(marqueeRef.current, { y: '101%' });
            gsap.set(marqueeInnerRef.current, { y: '-101%' });

            return;
        }

        const rect = itemRef.current.getBoundingClientRect();
        const edge = findClosestEdge(
            event.clientX - rect.left,
            event.clientY - rect.top,
            rect.width,
            rect.height,
        );

        gsap.timeline({ defaults: animationDefaults })
            .to(marqueeRef.current, {
                y: edge === 'top' ? '-101%' : '101%',
            })
            .to(marqueeInnerRef.current, {
                y: edge === 'top' ? '101%' : '-101%',
            }, 0);
    };

    return (
        <div
            ref={itemRef}
            className="relative flex-1 overflow-hidden text-left"
            style={{
                borderTop: isFirst ? 'none' : `1px solid ${borderColor}`,
            }}
        >
            <Link
                href={link}
                prefetch
                className="group relative flex h-full min-h-[4.5rem] items-center justify-between gap-4 px-5 py-4 no-underline"
                style={{ color: isActive ? marqueeTextColor : textColor }}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onClick={onItemClick}
            >
                <div className="flex min-w-0 items-center gap-3">
                    <span
                        className="size-2.5 shrink-0 rounded-full transition-opacity duration-200"
                        style={{
                            backgroundColor: isActive
                                ? marqueeTextColor
                                : textColor,
                            opacity: isActive ? 1 : 0.32,
                        }}
                    />
                    <span className="truncate text-[clamp(0.98rem,1.1vw,1.2rem)] font-semibold tracking-[0.03em]">
                        {text}
                    </span>
                </div>

                <span className="shrink-0 text-[0.62rem] font-semibold tracking-[0.28em] uppercase opacity-45 transition-opacity duration-200 group-hover:opacity-70">
                    Buka
                </span>
            </Link>

            <div
                ref={marqueeRef}
                className="pointer-events-none absolute inset-0 translate-y-[101%] overflow-hidden"
                style={{ backgroundColor: marqueeBgColor }}
            >
                <div
                    ref={marqueeInnerRef}
                    className="flex h-full w-fit items-center"
                >
                    {Array.from({ length: repetitions }).map((_, index) => (
                        <div
                            key={`${link}-marquee-${index}`}
                            className="marquee-part flex h-full shrink-0 items-center"
                            style={{ color: marqueeTextColor }}
                        >
                            <span className="whitespace-nowrap px-5 text-[clamp(0.96rem,1.04vw,1.08rem)] font-semibold tracking-[0.28em] uppercase">
                                {text}
                            </span>
                            <div
                                className="mx-3 h-12 w-28 rounded-full border border-black/6 bg-slate-200 bg-no-repeat shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:h-14 md:w-36"
                                style={{
                                    backgroundImage: `url(${image})`,
                                    backgroundPosition: imagePosition,
                                    backgroundSize: imageSize,
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
