import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

const isProd = process.env.NODE_ENV === 'production' || process.env.CI === 'true';

export default [
  // Ignore patterns
  {
    ignores: [
      'dist',
      'node_modules',
      'coverage',
      'test-results',
      'playwright-report',
      '.netlify',
      'build',
      '*.config.js',
      '*.config.ts',
      'public',
      // Temporário: evitar erro ENOENT intermitente neste caminho específico durante lint
      'src/components/editor/dnd/SortablePreviewBlockWrapper.tsx',
    ],
  },

  // Base JavaScript configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
        ...globals.node,
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      import: importPlugin,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Base rules
      ...js.configs.recommended.rules,

      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
  // Prefer const: use core rule instead of TS plugin variant (which doesn't exist)
  'prefer-const': 'error',
      '@typescript-eslint/no-var-requires': 'warn',

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn', // ⚠️ NOVO: Avisar sobre dependências faltantes

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

  // General code quality rules
  // Em produção/CI, elevar para erro para bloquear novos console.log
  'no-console': [isProd ? 'error' : 'warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-duplicate-imports': 'error',
  'no-unused-expressions': 'error',
  // Use TS plugin version for unused vars
  'no-unused-vars': 'off',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',

      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-template': 'warn',
      'prefer-arrow-callback': 'warn',

      // Formatting rules (should be handled by Prettier, but good fallbacks)
      'indent': 'off', // Let Prettier handle this
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
  'comma-dangle': ['warn', 'always-multiline'],

      // Import/Export rules
  'no-default-export': 'off',
  'import/prefer-default-export': 'off',

      // ⚠️ NOVO: Prevenir imports profundos (../../../)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*/*/*/*', '../../../*', '../../../../*'],
              message: '❌ Imports profundos não são permitidos. Use aliases @/ ao invés de ../../../. Exemplo: import { X } from "@/data/X"',
            },
          ],
        },
      ],

      // ⚠️ NOVO: Prevenir uso direto de localStorage
      'no-restricted-globals': [
        'error',
        {
          name: 'localStorage',
          message: '❌ Uso direto de localStorage não é permitido. Use StorageService.safeGetJSON/safeSetJSON ao invés. Exemplo: import { StorageService } from "@/services/core/StorageService"',
        },
      ],

      // Performance rules
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'warn',
      'no-return-await': 'warn',

      // Security rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
    },
  },

  // Test files configuration
  {
    files: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/tests/**/*.{js,jsx,ts,tsx}',
      '**/__tests__/**/*.{js,jsx,ts,tsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        vi: 'readonly',
        vitest: 'readonly',
      },
    },
    rules: {
      // Relax some rules for test files
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-unused-expressions': 'off',

      // Test-specific rules
  // Removed: was referencing a plugin we don't use. If needed, install eslint-plugin-no-only-tests.
    },
  },

  // Configuration files
  {
    files: [
      '*.config.{js,ts}',
      '*.setup.{js,ts}',
      'vite.config.*',
      'vitest.config.*',
      'playwright.config.*',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Allow console in config files
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'no-undef': 'off',
    },
  },

  // E2E test files
  {
    files: ['tests/e2e/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
        test: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        page: 'readonly',
        browser: 'readonly',
        context: 'readonly',
      },
    },
    rules: {
      // E2E specific rules
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-await-in-loop': 'off', // Common in E2E tests
    },
  },

  // Development scripts
  {
    files: ['scripts/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Storage infrastructure files (allowed to use localStorage directly)
  {
    files: [
      '**/StorageService.ts',
      '**/LocalStorageService.ts',
      '**/LocalStorageAdapter.ts',
      '**/LocalStorageManager.ts',
      '**/UnifiedStorageService.ts',
      '**/safeLocalStorage.ts',
      '**/StorageMigrationService.ts',
      '**/MigrationManager.ts',
      '**/dataMigration.ts',
      '**/storageOptimization.ts',
      '**/cleanStorage.ts',
      '**/localStorageMigration.ts',
      '**/*Migration*.ts',
      '**/context-backup-*/**',
    ],
    rules: {
      'no-restricted-globals': 'off', // Allowed in storage infrastructure
    },
  },
];