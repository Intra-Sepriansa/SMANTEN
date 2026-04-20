import { createInertiaApp } from '@inertiajs/react';
import { AppProviders } from '@/components/providers/app-providers';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = 'SMAN 1 Tenjo';
const INERTIA_APP_ID = 'app';
const MAX_BOOTSTRAP_ATTEMPTS = 120;

declare global {
    interface Window {
        __smantenInertiaBootstrapped?: boolean;
    }
}

function formatAppTitle(title?: string): string {
    if (!title) {
        return appName;
    }

    return title.includes(appName) ? title : `${title} - ${appName}`;
}

function startInertiaApp(): void {
    if (window.__smantenInertiaBootstrapped) {
        return;
    }

    window.__smantenInertiaBootstrapped = true;

    void createInertiaApp({
        title: formatAppTitle,
        layout: (name) => {
            switch (true) {
                case name.startsWith('public/'):
                    return PublicLayout;
                case name.startsWith('auth/'):
                    return AuthLayout;
                case name.startsWith('settings/'):
                    return [AppLayout, SettingsLayout];
                default:
                    return AppLayout;
            }
        },
        strictMode: true,
        withApp(app) {
            return <AppProviders>{app}</AppProviders>;
        },
        progress: {
            color: '#0f766e',
        },
    }).catch((error) => {
        window.__smantenInertiaBootstrapped = false;

        throw error;
    });
}

function bootstrapInertiaApp(attempt = 0): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (document.getElementById(INERTIA_APP_ID)) {
        startInertiaApp();

        return;
    }

    if (attempt >= MAX_BOOTSTRAP_ATTEMPTS) {
        console.error(
            `Inertia mount element "#${INERTIA_APP_ID}" was not found before bootstrap.`,
        );

        return;
    }

    window.requestAnimationFrame(() => {
        bootstrapInertiaApp(attempt + 1);
    });
}

function initializeClientApp(): void {
    if (typeof window === 'undefined') {
        return;
    }

    initializeTheme();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            bootstrapInertiaApp();
        }, { once: true });

        return;
    }

    bootstrapInertiaApp();
}

initializeClientApp();
