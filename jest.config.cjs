module.exports = {
  testEnvironment: 'jsdom',
  injectGlobals: true,
  setupFilesAfterEnv: ['<rootDir>/resources/js/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/resources/js/$1',
  },
  testMatch: [
    '<rootDir>/resources/js/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/resources/js/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'resources/js/**/*.{ts,tsx}',
    '!resources/js/**/*.d.ts',
    '!resources/js/ssr.tsx',
    '!resources/js/app.tsx'
  ],
};