import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

type AnimatedCounterProps = {
    value: number;
    delay?: number;
    className?: string;
    suffix?: string;
    prefix?: string;
};

export function AnimatedCounter({ value, delay = 0, className, suffix = '', prefix = '' }: AnimatedCounterProps) {
    const springValue = useSpring(0, {
        stiffness: 40,
        damping: 15,
        mass: 1,
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            springValue.set(value);
        }, delay * 1000);

        return () => clearTimeout(timeout);
    }, [springValue, value, delay]);

    const display = useTransform(springValue, (current) => {
        return `${prefix}${Math.round(current).toLocaleString('id-ID')}${suffix}`;
    });

    return <motion.span className={className}>{display}</motion.span>;
}
