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
        const developmentHost = env.VITE_HOST || 'graveyardjokes.local';
        const developmentPort = Number(env.VITE_PORT || 8081);
        const developmentOrigin = env.VITE_ORIGIN || `http://${developmentHost}:${developmentPort}`;
        const allowedHosts = (env.VITE_ALLOWED_HOSTS || developmentHost)
            .split(',')
            .map((host) => host.trim())
            .filter(Boolean);

        server = {
            port: developmentPort,
            host: '0.0.0.0',
            origin: developmentOrigin,
            hmr: {
                host: developmentHost,
                port: developmentPort,
            },
            cors: {
                origin: [
                    env.APP_URL,
                    'http://graveyardjokes.local',
                    'http://localhost:8000',
                    'http://graveyardjokes.local:8000',
                    'http://thevelvetpulse.graveyardjokes.local',
                    'http://thevelvetpulse.graveyardjokes.local:8005',
                    'http://hollowpress.graveyardjokes.local',
                    'http://hollowpress.graveyardjokes.local:8001',
                    'http://lunarblood.graveyardjokes.local',
                    'http://lunarblood.graveyardjokes.local:8002',
                    'http://velvetradio.graveyardjokes.local',
                    'http://velvetradio.graveyardjokes.local:8006',
                    'http://synthveil.graveyardjokes.local',
                    'http://synthveil.graveyardjokes.local:8004',
                    'http://studio.graveyardjokes.local',
                    'http://studio.graveyardjokes.local:8003',
                    'http://auth-system.graveyardjokes.local',
                    'http://auth-system.graveyardjokes.local:8007',
                    'http://noteleks.graveyardjokes.local',
                    'http://noteleks.graveyardjokes.local:8009'
                ],
                credentials: true
            },
            allowedHosts: [
                ...allowedHosts,
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
                '@gj/env': resolve(__dirname, '../packages/env/src/index.ts'),
                '@gj/utils': resolve(__dirname, '../packages/utils/src/index.ts'),
                '@gj/hooks': resolve(__dirname, '../packages/hooks/src/index.ts'),
            },
            dedupe: ['react', 'react-dom'],
        },
        ssr: {
            noExternal: ['react', 'react-dom', '@inertiajs/react', '@inertiajs/core', 'framer-motion'],
        },
    };
});