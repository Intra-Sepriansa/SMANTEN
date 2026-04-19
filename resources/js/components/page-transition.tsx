import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
    const page = usePage();

    return (
        <div
            key={page.url}
            className="admin-page-transition flex flex-1 flex-col"
        >
            {children}
        </div>
    );
}
