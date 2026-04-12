import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { type PropsWithChildren, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { makeQueryClient } from '@/lib/query-client';

export function AppProviders({ children }: PropsWithChildren) {
    const [queryClient] = useState(makeQueryClient);

    return (
        <MotionConfig
            reducedMotion="user"
            transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
            <QueryClientProvider client={queryClient}>
                <TooltipProvider delayDuration={0}>
                    {children}
                    <Toaster />
                </TooltipProvider>
            </QueryClientProvider>
        </MotionConfig>
    );
}
