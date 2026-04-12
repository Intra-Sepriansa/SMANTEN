import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Meteors({ number = 20 }: { number?: number }) {
    const [meteors, setMeteors] = useState<
        {
            id: number;
            xOffset: number;
            yOffset: number;
            delay: number;
            duration: number;
        }[]
    >([]);

    useEffect(() => {
        // Calculate grid cells for perfect alignment
        const gridCellSize = 84;
        const totalColumns = Math.floor(2000 / gridCellSize);
        const totalRows = Math.floor(1200 / gridCellSize);
        
        const newMeteors = new Array(number).fill(true).map((_, i) => {
            const isVertical = Math.random() > 0.4; // 60% vertical, 40% horizontal
            return {
                id: i,
                isVertical,
                offset: Math.floor(Math.random() * (isVertical ? totalColumns : totalRows)) * gridCellSize,
                delay: Math.random() * 5 + 0.2,
                duration: Math.random() * 7 + 3,
                isGold: Math.random() > 0.8,
            };
        });
        setMeteors(newMeteors as any);
    }, [number]);

    if (meteors.length === 0) return null;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {meteors.map((meteor: any) => (
                <motion.span
                    key={meteor.id}
                    initial={
                        meteor.isVertical 
                        ? { opacity: 0, top: -300, left: `${meteor.offset}px` }
                        : { opacity: 0, left: -300, top: `${meteor.offset}px` }
                    }
                    animate={
                        meteor.isVertical
                        ? { opacity: [0, 1, 1, 0], y: '120vh' }
                        : { opacity: [0, 1, 1, 0], x: '120vw' }
                    }
                    transition={{
                        duration: meteor.duration,
                        delay: meteor.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className={cn(
                        "absolute shadow-sm",
                        meteor.isVertical ? "w-[1px]" : "h-[1px]", // Perfect 1px alignment
                        meteor.isGold ? "bg-[var(--school-gold)]" : "bg-[#14b8a6]"
                    )}
                >
                    {/* Beam Tail */}
                    <div 
                        className={cn(
                            "absolute -z-10",
                            meteor.isVertical ? "top-0 h-[300px] w-full" : "left-0 w-[300px] h-full",
                            meteor.isGold 
                                ? (meteor.isVertical ? "bg-gradient-to-b" : "bg-gradient-to-r") + " from-[var(--school-gold)] to-transparent" 
                                : (meteor.isVertical ? "bg-gradient-to-b" : "bg-gradient-to-r") + " from-[#14b8a6] to-transparent"
                        )} 
                    />
                </motion.span>
            ))}
        </div>
    );
}
