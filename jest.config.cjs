module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testMatch: [
        '<rootDir>/src/tests/**/*.test.{ts,tsx}',
        '<rootDir>/src/tests/**/*.spec.{ts,tsx}',
    ],
    collectCoverageFrom: [
        'src/adapters/**/*.{ts,tsx}',
        'src/services/QuizPageIntegrationService.{ts,tsx}',
        'src/services/UnifiedCRUDService.{ts,tsx}',
        'src/components/editor/quiz/**/*.{ts,tsx}',
        'src/hooks/useQuiz*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/tests/**/*',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
    testTimeout: 30000,
    maxWorkers: '50%',
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                },
            },
        ],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};