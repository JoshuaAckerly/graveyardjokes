import '../css/app.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Register GSAP plugins once on the client
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
const resolvablePages = import.meta.glob<{ default: ResolvedComponent }>([
    './pages/**/*.tsx',
    '!./pages/**/__tests__/**',
    '!./pages/**/*.test.tsx',
    '!./pages/**/*.spec.tsx',
]);

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => (await resolvePageComponent(`./pages/${name}.tsx`, resolvablePages)).default,
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
