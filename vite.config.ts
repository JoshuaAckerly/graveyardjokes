import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    let server;
    if (env.VITE_SERVER_ENV === 'production') {
        server = {
            port: 443,
            host: '0.0.0.0',
            origin: 'https://graveyardjokes.com',
            allowedHosts: ['graveyardjokes.com'],
        };
    } else if (env.VITE_SERVER_ENV === 'test' || env.VITE_SERVER_ENV === 'testing') {
        server = {
            port: 8081,
            host: '127.0.0.1',
            origin: 'http://graveyardjokes.testing:8081',
            allowedHosts: ['graveyardjokes.testing'],
        };
    } else {
        // default: local/development
        server = {
            port: 8081,
            host: '0.0.0.0',
            origin: 'http://graveyardjokes.local:8081',
            cors: {
                origin: [
                    'http://graveyardjokes.local',
                    'http://localhost:8000',
                    'http://graveyardjokes.local:8000',
                    'http://thevelvetpulse.graveyardjokes.local',
                    'http://hollowpress.graveyardjokes.local',
                    'http://lunarblood.graveyardjokes.local',
                    'http://velvetradio.graveyardjokes.local',
                    'http://synthveil.graveyardjokes.local',
                    'http://auth-system.graveyardjokes.local'
                ],
                credentials: true
            },
            allowedHosts: [
                'graveyardjokes.local',
                'thevelvetpulse.graveyardjokes.local',
                'hollowpress.graveyardjokes.local',
                'lunarblood.graveyardjokes.local',
                'velvetradio.graveyardjokes.local',
                'synthveil.graveyardjokes.local',
                'auth-system.graveyardjokes.local'
            ],
        };
    }

    return {
        server,
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                ssr: 'resources/js/ssr.tsx',
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        esbuild: {
            jsx: 'automatic',
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, 'resources/js'),
                'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            },
        },
        ssr: {
            noExternal: ['react', 'react-dom', '@inertiajs/react', '@inertiajs/core'],
        },
    };
});