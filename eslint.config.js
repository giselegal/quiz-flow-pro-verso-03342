import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import nextPlugin from '@next/eslint-plugin-next';

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
      // Arquivos de patch auxiliares não são código válido para lint
      '*.patch',
      '**/*.patch',
      'public',
      // Documentação e conteúdos arquivados/scripts fora do app
      'docs/**',
      'archived/**',
      'scripts/**',
      'server/**',
      // Scripts soltos de diagnóstico fora do fluxo de app
      'full-diagnosis-script.js',
      'isolation-test-script.js',
      // Temporário: evitar erro ENOENT intermitente neste caminho específico durante lint
      'src/components/editor/dnd/SortablePreviewBlockWrapper.tsx',
      // (Resolvido) symlink corrompido substituído por reexport válido
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
      'react-refresh': reactRefresh,
      react: reactPlugin,
      // Suporte aos dois namespaces: 'next' e '@next/next'
      next: nextPlugin,
      '@next/next': nextPlugin,
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
      'react-hooks/rules-of-hooks': isProd ? 'error' : 'warn',
      'react-hooks/exhaustive-deps': 'warn', // ⚠️ NOVO: Avisar sobre dependências faltantes
      // Temporariamente reduzir a verbosidade das novas regras do React Compiler
      // até concluirmos a migração dos pontos problemáticos.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/error-boundaries': 'off',

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
      'no-duplicate-imports': isProd ? 'error' : 'warn',
      'no-unused-expressions': isProd ? 'error' : 'warn',
      // Use TS plugin version for unused vars
      'no-unused-vars': 'off',
      'no-unreachable': isProd ? 'error' : 'warn',
      'no-constant-condition': 'warn',
      'no-prototype-builtins': isProd ? 'error' : 'warn',
      'no-useless-catch': isProd ? 'warn' : 'off',
      'no-constant-binary-expression': isProd ? 'warn' : 'off',
      'no-redeclare': isProd ? 'error' : 'warn',
      'no-import-assign': isProd ? 'error' : 'warn',
      // Evitar ruído em switch/case com declarações; tratar gradualmente
      'no-case-declarations': isProd ? 'error' : 'warn',
      // Blocos vazios são comuns durante refactors; tratar gradualmente
      'no-empty': isProd ? 'error' : 'warn',
      // Escapes desnecessários não devem travar o desenvolvimento
      'no-useless-escape': isProd ? 'warn' : 'off',
      // Duplicated case labels podem existir em backups; tratar gradualmente
      'no-duplicate-case': isProd ? 'error' : 'warn',

      // Best practices
      'prefer-const': 'error',
      // Em dev, reduzir ruído de prefer-const
      ...(isProd ? {} : { 'prefer-const': 'warn' }),
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
        isProd ? 'error' : 'warn',
        {
          patterns: [
            {
              group: ['../*/*/*/*', '../../../*', '../../../../*'],
              message: '❌ Imports profundos não são permitidos. Use aliases @/ ao invés de ../../../. Exemplo: import { X } from "@/data/X"',
            },
            // ===============================================================
            // AUDITORIA 2025-11-28: Bloquear registries legados
            // Use: @/core/registry/UnifiedBlockRegistry (925 LOC, fonte única)
            // Tipos: @/types/core/BlockInterfaces
            // ===============================================================
            {
              group: [
                '**/core/runtime/quiz/blocks/BlockRegistry',
                '**/core/editor/blocks/EnhancedBlockRegistry',
                '**/types/blockTypes#BlockComponentMap',
                '**/editor/BlockRegistry',
                // Novos padrões bloqueados
                '**/components/editor/blocks/enhancedBlockRegistry',
                '**/components/editor/quiz/schema/blockRegistry',
                '**/config/enhancedBlockRegistry',
                '**/editor/registry/BlockComponentMap',
                // Apenas bloquear imports do arquivo legado blockRegistry, não UnifiedBlockRegistry
                '**/core/registry/blockRegistry',
              ],
              message: '❌ Registries legados estão proibidos. Use "@/core/registry/UnifiedBlockRegistry" e tipos de "@/types/core/BlockInterfaces".',
            },
            // ===============================================================
            // AUDITORIA 2025-11-28: Bloquear renderers duplicados
            // Use: @/components/editor/blocks/UniversalBlockRenderer (principal)
            // ===============================================================
            {
              group: [
                '**/client/src/components/editor/blocks/UniversalBlockRenderer',
              ],
              message: '❌ Renderer duplicado (client/) está proibido. Use "@/components/editor/blocks/UniversalBlockRenderer".',
            },
            // ===============================================================
            // AUDITORIA 2025-11-28: Bloquear tipos Supabase desatualizados
            // Use: shared/types/supabase.ts (principal)
            // ===============================================================
            {
              group: [
                '**/services/integrations/supabase/types_updated',
              ],
              message: '⚠️ Arquivo types_updated.ts está obsoleto. Use "shared/types/supabase" ou regenere com "npm run supabase:gen:types".',
            },
          ],
        },
      ],

      // ⚠️ NOVO: Prevenir uso direto de localStorage
      'no-restricted-globals': [
        isProd ? 'error' : 'warn',
        {
          name: 'localStorage',
          message: '❌ Uso direto de localStorage não é permitido. Use StorageService.safeGetJSON/safeSetJSON ao invés. Exemplo: import { StorageService } from "@/services/core/StorageService"',
        },
      ],

      // Performance rules
      'no-async-promise-executor': isProd ? 'error' : 'warn',
      'no-await-in-loop': 'warn',
      'no-return-await': 'warn',

      // Security rules
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
    },
  },

  // TypeScript files: delegar undefined checks ao TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // Arquivos de tipos e declarações
  {
    files: ['**/*.d.ts', 'src/types/**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
    },
  },

  // Utils: regras mais brandas para viabilizar migração gradual
  {
    files: ['src/utils/**/*.{ts,tsx,js}'],
    rules: {
      'no-empty': isProd ? 'error' : 'warn',
      'no-script-url': isProd ? 'error' : 'warn',
      'no-new-func': isProd ? 'error' : 'warn',
      'no-case-declarations': isProd ? 'error' : 'warn',
      'no-useless-escape': isProd ? 'warn' : 'off',
      'no-prototype-builtins': isProd ? 'warn' : 'off',
      'no-control-regex': isProd ? 'warn' : 'off',
      // Hooks rules em utils podem sinalizar falsos-positivos; rebaixar severidade
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      // Novas regras do plugin
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/immutability': 'off',
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
      'no-empty': 'off',
      'no-eval': 'off',

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
      // Permitir uso direto de localStorage e blocos vazios em testes E2E
      'no-restricted-globals': 'off',
      'no-empty': 'off',
      // Permitir imports profundos em utilitários de testes
      'no-restricted-imports': 'off',
      // Flaky style rules ou edge-cases em strings regex
      'no-useless-escape': 'off',
      // Preferência de estilo não deve quebrar testes
      'prefer-const': 'off',
    },
  },

  // Supabase Edge Functions (Deno runtime)
  {
    files: ['supabase/functions/**/*.{ts,tsx,js}'],
    languageOptions: {
      globals: {
        Deno: 'readonly',
      },
    },
    rules: {
      // Deno fornece Deno global; evitar no-undef aqui
      'no-undef': 'off',
      // Não falhar por estilo de ponto e vírgula nesses handlers
      'semi': 'off',
    },
  },

  // Root-level ad-hoc test runners (test-*.ts etc.)
  {
    files: ['test*.{js,jsx,ts,tsx,mjs,cjs}', 'test-*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      'no-console': 'off',
      'prefer-const': 'off',
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