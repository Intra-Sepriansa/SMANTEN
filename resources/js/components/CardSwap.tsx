import gsap from 'gsap';
import {
    Children,
    cloneElement,
    createRef,
    forwardRef,
    isValidElement,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import type {
    CSSProperties,
    FC,
    HTMLAttributes,
    MouseEvent,
    ReactElement,
    ReactNode,
    RefAttributes,
    RefObject,
} from 'react';

import { cn } from '@/lib/utils';

export interface CardSwapProps {
    width?: number | string;
    height?: number | string;
    cardDistance?: number;
    verticalDistance?: number;
    delay?: number;
    pauseOnHover?: boolean;
    onCardClick?: (idx: number) => void;
    skewAmount?: number;
    easing?: 'linear' | 'elastic';
    className?: string;
    children: ReactNode;
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, customClass, ...rest }, ref) => (
        <div
            ref={ref}
            {...rest}
            className={cn(
                'absolute top-1/2 left-1/2 rounded-lg border border-white/30 bg-slate-950 text-white shadow-2xl [will-change:transform] [backface-visibility:hidden] [transform-style:preserve-3d]',
                customClass,
                className,
            )}
        />
    ),
);
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
    x: number;
    y: number;
    z: number;
    zIndex: number;
}

const makeSlot = (
    i: number,
    distX: number,
    distY: number,
    total: number,
): Slot => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true,
    });

const CardSwap: FC<CardSwapProps> = ({
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    delay = 5000,
    pauseOnHover = false,
    onCardClick,
    skewAmount = 6,
    easing = 'elastic',
    className,
    children,
}) => {
    const config = useMemo(
        () =>
            easing === 'elastic'
                ? {
                      ease: 'elastic.out(0.6,0.9)',
                      durDrop: 2,
                      durMove: 2,
                      durReturn: 2,
                      promoteOverlap: 0.9,
                      returnDelay: 0.05,
                  }
                : {
                      ease: 'power1.inOut',
                      durDrop: 0.8,
                      durMove: 0.8,
                      durReturn: 0.8,
                      promoteOverlap: 0.45,
                      returnDelay: 0.2,
                  },
        [easing],
    );

    const childArr = useMemo(
        () => Children.toArray(children) as ReactElement<CardProps>[],
        [children],
    );
    const refs = useMemo<CardRef[]>(
        () =>
            Array.from({ length: childArr.length }, () =>
                createRef<HTMLDivElement>(),
            ),
        [childArr.length],
    );

    const order = useRef<number[]>([]);

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const intervalRef = useRef<number | null>(null);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const total = refs.length;
        order.current = Array.from({ length: total }, (_, i) => i);

        refs.forEach((ref, i) => {
            if (ref.current) {
                placeNow(
                    ref.current,
                    makeSlot(i, cardDistance, verticalDistance, total),
                    skewAmount,
                );
            }
        });

        const clearSwapInterval = () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };

        const swap = () => {
            if (order.current.length < 2) {
                return;
            }

            const [front, ...rest] = order.current;
            const elFront = refs[front]?.current;

            if (!elFront) {
                return;
            }

            tlRef.current?.kill();

            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(elFront, {
                y: '+=500',
                duration: config.durDrop,
                ease: config.ease,
            });

            tl.addLabel(
                'promote',
                `-=${config.durDrop * config.promoteOverlap}`,
            );
            rest.forEach((idx, i) => {
                const el = refs[idx]?.current;

                if (!el) {
                    return;
                }

                const slot = makeSlot(
                    i,
                    cardDistance,
                    verticalDistance,
                    refs.length,
                );
                tl.set(el, { zIndex: slot.zIndex }, 'promote');
                tl.to(
                    el,
                    {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        duration: config.durMove,
                        ease: config.ease,
                    },
                    `promote+=${i * 0.15}`,
                );
            });

            const backSlot = makeSlot(
                refs.length - 1,
                cardDistance,
                verticalDistance,
                refs.length,
            );
            tl.addLabel(
                'return',
                `promote+=${config.durMove * config.returnDelay}`,
            );
            tl.call(
                () => {
                    gsap.set(elFront, { zIndex: backSlot.zIndex });
                },
                undefined,
                'return',
            );
            tl.to(
                elFront,
                {
                    x: backSlot.x,
                    y: backSlot.y,
                    z: backSlot.z,
                    duration: config.durReturn,
                    ease: config.ease,
                },
                'return',
            );

            tl.call(() => {
                order.current = [...rest, front];
            });
        };

        const prefersReducedMotion =
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
            false;

        if (!prefersReducedMotion) {
            swap();
            intervalRef.current = window.setInterval(swap, delay);
        }

        const node = container.current;
        const pause = () => {
            tlRef.current?.pause();
            clearSwapInterval();
        };
        const resume = () => {
            tlRef.current?.play();
            clearSwapInterval();
            intervalRef.current = window.setInterval(swap, delay);
        };

        if (pauseOnHover && node && !prefersReducedMotion) {
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
        }

        return () => {
            if (pauseOnHover && node) {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
            }

            clearSwapInterval();
            tlRef.current?.kill();
        };
    }, [
        cardDistance,
        config,
        delay,
        pauseOnHover,
        refs,
        skewAmount,
        verticalDistance,
    ]);

    const rendered = childArr.map((child, i) =>
        isValidElement<CardProps>(child)
            ? cloneElement(child, {
                  key: i,
                  ref: refs[i],
                  style: {
                      width,
                      height,
                      ...(child.props.style ?? {}),
                  } satisfies CSSProperties,
                  onClick: (event: MouseEvent<HTMLDivElement>) => {
                      child.props.onClick?.(event);
                      onCardClick?.(i);
                  },
              } as CardProps & RefAttributes<HTMLDivElement>)
            : child,
    );

    return (
        <div
            ref={container}
            className={cn(
                'absolute right-0 bottom-0 origin-bottom-right translate-x-[5%] translate-y-[20%] transform overflow-visible perspective-[900px] max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]',
                className,
            )}
            style={{ width, height }}
        >
            {rendered}
        </div>
    );
};

export default CardSwap;
