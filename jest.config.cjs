module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/resources/js/__tests__/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/resources/js/$1',
  },
  testMatch: [
    '<rootDir>/resources/js/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/resources/js/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverageFrom: [
    'resources/js/**/*.{ts,tsx}',
    '!resources/js/**/*.d.ts',
    '!resources/js/ssr.tsx',
    '!resources/js/app.tsx'
  ]
};