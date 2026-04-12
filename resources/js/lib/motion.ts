export const motionViewport = {
    once: true,
    amount: 0.2,
} as const;

export const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.08,
        },
    },
};

export const fadeUp = {
    hidden: {
        opacity: 0,
        y: 28,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

export const softScale = {
    hidden: {
        opacity: 0,
        scale: 0.96,
    },
    show: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.68,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};
