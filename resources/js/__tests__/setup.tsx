import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock env
vi.mock('../env', () => ({
    getEnvVar: vi.fn((key: string, defaultValue?: string) => {
        const env: Record<string, string> = {
            VITE_ASSET_URL: 'https://cdn.example.com',
            VITE_SNAPCHAT_IMAGE_URL: 'https://example.com/snapchat.png',
            VITE_SNAPCODE_IMAGE_URL: 'https://example.com/snapcode.png',
        };
        return env[key] || defaultValue || '';
    }),
    getProjectUrl: vi.fn(() => 'https://example.com'),
    getAuthSystemUrl: vi.fn(() => 'https://auth-system.example.com'),
    getLoginUrl: vi.fn((subdomain: string) => `https://auth-system.example.com/login?return_url=https://${subdomain}.example.com`),
}));

// Mock Inertia
(global as any).route = vi.fn(() => '/');

// Mock Inertia router
vi.mock('@inertiajs/react', () => ({
    router: {
        post: vi.fn(),
        get: vi.fn(),
        visit: vi.fn(),
    },
    usePage: vi.fn(() => ({
        props: {},
        url: '/',
        component: 'Test',
    })),
    Head: ({ children }: { children: any }) => children,
    Link: ({ children, href }: { children: any; href: string }) => <a href={href}>{children}</a>,
}));

// Mock layouts and components
vi.mock('@/Layouts/MainLayout', () => ({
    default: ({ children }: { children: any }) => <div data-testid="main-layout">{children}</div>,
}));

vi.mock('@/Components/InertiaHead', () => ({
    __esModule: true,
    default: ({ children }: { children: any }) => children,
}));

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    },
    AnimatePresence: ({ children }: any) => children,
}));

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn(() => []),
    })),
});

Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    })),
});
