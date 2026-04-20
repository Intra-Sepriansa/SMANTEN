import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

const viteHost = '127.0.0.1';
const vitePort = 5173;
const viteAllowedOrigins = [
    /^https?:\/\/smanten\.test$/i,
    /^https?:\/\/127\.0\.0\.1(?::\d+)?$/,
    /^https?:\/\/localhost(?::\d+)?$/,
];

export default defineConfig({
    server: {
        host: viteHost,
        port: vitePort,
        strictPort: true,
        origin: `http://${viteHost}:${vitePort}`,
        cors: {
            origin: viteAllowedOrigins,
        },
        hmr: {
            host: viteHost,
            port: vitePort,
            protocol: 'ws',
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        inertia({
            ssr: 'resources/js/ssr.tsx',
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
});
