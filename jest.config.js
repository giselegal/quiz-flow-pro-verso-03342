/** @type {import('jest').Config} */
export default {
    // Ambiente de teste
    testEnvironment: 'jsdom',

    // Preset para TypeScript + ESM
    preset: 'ts-jest/presets/default-esm',

    // Tratar como módulos ESM
    extensionsToTreatAsEsm: ['.ts', '.tsx'],

    // Mapeamento de módulos para resolver @ paths
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },

    // Setup inicial dos testes
    setupFilesAfterEnv: ['<rootDir>/src/tests/setup-testes.js'],

    // Transformações
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            useESM: true,
            tsconfig: {
                jsx: 'react-jsx'
            }
        }]
    },

    // Ignorar transformações em node_modules (exceto ESM)
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))'
    ],

    // Padrão de arquivos de teste
    testMatch: [
        '<rootDir>/src/tests/**/*.test.(ts|tsx|js|jsx)'
    ],

    // Cobertura de código
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/tests/**/*',
        '!src/**/*.stories.{ts,tsx}',
        '!src/vite-env.d.ts'
    ],

    // Timeout para testes assíncronos
    testTimeout: 10000,

    // Mock para recursos estáticos
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Configurações globais
    globals: {
        'ts-jest': {
            useESM: true
        }
    }
};