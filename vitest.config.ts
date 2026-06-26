import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./resources/js/__tests__/setup.tsx'],
        include: ['resources/js/**/__tests__/**/*.test.{ts,tsx}'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            '@gj/env': resolve(__dirname, '../packages/env/src/index.ts'),
            '@gj/utils': resolve(__dirname, '../packages/utils/src/index.ts'),
            '@gj/hooks': resolve(__dirname, '../packages/hooks/src/index.ts'),
        },
    },
});
