// lib/env.ts — SSR-safe environment variable resolution and URL helpers.
// (Inlined from the former shared @gj/env package; graveyardjokes is the only consumer.)
// Works in Vite (import.meta.env), Node/SSR (process.env), and Jest/Vitest (mocked globalThis.import).

type RuntimeEnv = Record<string, string | undefined>;

const getRuntimeEnv = (): RuntimeEnv => {
    // Support jest.mock / vitest.mock injecting via globalThis.import.meta.env
    const mockedEnv = (globalThis as { import?: { meta?: { env?: RuntimeEnv } } }).import?.meta?.env;
    if (mockedEnv) return mockedEnv;

    const viteEnv = (import.meta as ImportMeta).env as RuntimeEnv | undefined;
    if (viteEnv) return viteEnv;

    if (typeof process !== 'undefined') return process.env as RuntimeEnv;

    return {};
};

export const getEnvVar = (key: string, fallback = ''): string => getRuntimeEnv()[key] ?? fallback;

const localPorts: Record<string, string> = {
    '': '8000',
    graveyardjokes: '8000',
    noteleks: '8009',
};

export interface EnvResolver {
    getProjectUrl: (subdomain?: string) => string;
    getMainSiteUrl: () => string;
}

/**
 * Creates URL helpers scoped to a specific domain.
 *
 * @param productionDomain - The live TLD domain, e.g. 'graveyardjokes.com'
 * @param testDomain       - Optional override for test env, defaults to replacing TLD with '.test'
 * @param localDomain      - Optional override for local env, defaults to replacing TLD with '.test'
 */
export function createEnvResolver(
    productionDomain: string,
    testDomain?: string,
    localDomain?: string,
): EnvResolver {
    const tld = productionDomain.replace(/^[^.]+\./, ''); // 'com' from 'graveyardjokes.com'
    const base = productionDomain.replace(`.${tld}`, ''); // 'graveyardjokes'

    const resolvedTest = testDomain ?? `${base}.test`;
    const resolvedLocal = localDomain ?? `${base}.test`;

    const getBaseDomain = (): string => {
        const env = getEnvVar('VITE_SERVER_ENV') || getEnvVar('MODE');
        if (env === 'production') return productionDomain;
        if (env === 'test' || env === 'testing') return resolvedTest;
        return resolvedLocal;
    };

    const getProtocol = (): string => {
        const domain = getBaseDomain();
        return domain === resolvedLocal || domain === resolvedTest ? 'http' : 'https';
    };

    const getProjectUrl = (subdomain = ''): string => {
        const domain = getBaseDomain();
        const host = subdomain ? `${subdomain}.${domain}` : domain;
        // In local/test dev, apps are served via nginx on port 80 (portless).
        // Set VITE_USE_DEV_PORTS=1 to link directly to the Vite/Laravel dev ports instead.
        const useDevPorts = getEnvVar('VITE_USE_DEV_PORTS') === '1';
        const isLocalLike = domain === resolvedLocal || domain === resolvedTest;
        const port = isLocalLike && useDevPorts ? localPorts[subdomain] ?? '' : '';

        return `${getProtocol()}://${host}${port ? `:${port}` : ''}`;
    };

    const getMainSiteUrl = (): string => getProjectUrl();

    return { getProjectUrl, getMainSiteUrl };
}
