import { jest } from '@jest/globals';
import React from 'react';
import '@testing-library/jest-dom';

// Mock env
jest.mock('../env', () => ({
    getEnvVar: jest.fn((key: string, defaultValue?: string) => {
        const env = {
            VITE_ASSET_URL: 'https://cdn.example.com',
            VITE_SNAPCHAT_IMAGE_URL: 'https://example.com/snapchat.png',
            VITE_SNAPCODE_IMAGE_URL: 'https://example.com/snapcode.png',
        };
        return env[key as keyof typeof env] || defaultValue || '';
    }),
    getProjectUrl: jest.fn(() => 'https://example.com'),
    getAuthSystemUrl: jest.fn(() => 'https://auth-system.example.com'),
    getLoginUrl: jest.fn((subdomain: string) => `https://auth-system.example.com/login?return_url=https://${subdomain}.example.com`),
}));

// Mock Inertia
(global as any).route = jest.fn(() => '/');

// Mock Inertia router
jest.mock('@inertiajs/react', () => ({
    router: {
        post: jest.fn(),
        get: jest.fn(),
        visit: jest.fn(),
    },
    usePage: jest.fn(() => ({
        props: {},
        url: '/',
        component: 'Test',
    })),
    Head: ({ children }: { children: any }) => children,
}));

// Mock layouts and components
jest.mock('@/Layouts/MainLayout', () => ({
    default: ({ children }: { children: any }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('@/Components/InertiaHead', () => ({
    default: ({ children }: { children: any }) => children,
}));

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

jest.mock('lucide-react', () => {
    const MockIcon = ({ children, ...props }: any) => (
        <svg data-testid="lucide-icon" {...props}>
            {children}
        </svg>
    );

    return new Proxy(
        { __esModule: true },
        {
            get: (_target, property: string) => {
                if (property === '__esModule') {
                    return true;
                }

                return MockIcon;
            },
        },
    );
});
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
        takeRecords: jest.fn(() => []),
    })),
});

Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    })),
});

Object.defineProperty(global, 'import', {
    configurable: true,
    writable: true,
    value: {
        meta: {
            env: {
                VITE_ASSET_URL: 'https://cdn.example.com',
            },
        },
    },
});
