import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { type RouteName, route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const resolvablePages = import.meta.glob<{ default: ResolvedComponent }>([
    './pages/**/*.tsx',
    '!./pages/**/__tests__/**',
    '!./pages/**/*.test.tsx',
    '!./pages/**/*.spec.tsx',
]);

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: ReactDOMServer.renderToString,
            title: (title) => (title ? `${title} - ${appName}` : appName),
            resolve: async (name) => (await resolvePageComponent(`./pages/${name}.tsx`, resolvablePages)).default,
            setup: ({ App, props }) => {
                /* eslint-disable */
                // @ts-expect-error
                global.route<RouteName> = (name, params, absolute) =>
                    route(name, params as any, absolute, {
                        // @ts-expect-error
                        ...page.props.ziggy,
                        // @ts-expect-error
                        location: new URL(page.props.ziggy.location),
                    });
                /* eslint-enable */

                return <App {...props} />;
            },
        }),
    13714, // graveyardjokes SSR port
);
