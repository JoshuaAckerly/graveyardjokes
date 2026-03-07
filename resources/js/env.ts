// env.ts
// Utility to get environment-based URLs for login/auth system

type RuntimeEnv = Record<string, string | undefined>;

const getRuntimeEnv = (): RuntimeEnv => {
    const mockedEnv = (globalThis as { import?: { meta?: { env?: RuntimeEnv } } }).import?.meta?.env;
    if (mockedEnv) {
        return mockedEnv;
    }

    const viteEnv = (import.meta as ImportMeta).env as RuntimeEnv | undefined;
    if (viteEnv) {
        return viteEnv;
    }

    if (typeof process !== 'undefined') {
        return process.env as RuntimeEnv;
    }

    return {};
};

export const getEnvVar = (key: string, fallback = ''): string => getRuntimeEnv()[key] ?? fallback;

// Use VITE_SERVER_ENV from .env, fallback to MODE
const getBaseDomain = () => {
    const env = getEnvVar('VITE_SERVER_ENV') || getEnvVar('MODE');
    if (env === 'production') {
        return 'graveyardjokes.com';
    }
    if (env === 'test' || env === 'testing') {
        return 'graveyardjokes.test';
    }
    // Default to development
    return 'graveyardjokes.local';
};

const getProtocol = () => (getBaseDomain() === 'graveyardjokes.local' ? 'http' : 'https');

export const getAuthSystemUrl = () => `${getProtocol()}://auth-system.${getBaseDomain()}`;
export const getProjectUrl = (subdomain: string) => `${getProtocol()}://${subdomain}.${getBaseDomain()}`;

export const getLoginUrl = (subdomain: string) => {
    const authUrl = getAuthSystemUrl();
    const returnUrl = getProjectUrl(subdomain);
    return `${authUrl}/login?return_url=${returnUrl}`;
};
