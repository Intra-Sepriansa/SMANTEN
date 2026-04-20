import { createInertiaApp } from '@inertiajs/react';
import { AppProviders } from '@/components/providers/app-providers';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = 'SMAN 1 Tenjo';

function formatAppTitle(title?: string): string {
    if (!title) {
        return appName;
    }

    return title.includes(appName) ? title : `${title} - ${appName}`;
}

createInertiaApp({
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
    withApp(app) {
        return <AppProviders>{app}</AppProviders>;
    },
});
