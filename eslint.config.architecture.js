// 🛡️ ESLint Config - Regras de Arquitetura V1 → V2
// 
// Status: WARNINGS apenas (durante migração)
// Mudar para ERROR após migração completa
//
// Uso: Descomentar e adicionar ao eslint.config.js principal

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // 1. ⚠️ Alertar uso de V1 (não bloquear ainda)
      'no-restricted-imports': [
        'warn', // Mudar para 'error' após migração completa
        {
          patterns: [
            {
              group: ['**/contexts/providers/SuperUnifiedProvider'],
              message: 
                '⚠️ SuperUnifiedProvider V1 está deprecado (1959 linhas, monolítico).\n' +
                '✅ Use SuperUnifiedProviderV2 ou hooks individuais:\n' +
                '  - useAuth() from "@/contexts/auth/AuthProvider"\n' +
                '  - useTheme() from "@/contexts/theme/ThemeProvider"\n' +
                '  - useEditorState() from "@/contexts/editor/EditorStateProvider"\n' +
                '  Ver: CHECKLIST_RESOLUCAO_DUPLICACOES.md',
            },
            {
              group: ['**/auth/AuthContext'],
              message: '⚠️ AuthContext legado. Use "useAuth" from "@/contexts/auth/AuthProvider"',
            },
            {
              group: ['**/ui/ThemeContext'],
              message: '⚠️ ThemeContext legado. Use "useTheme" from "@/contexts/theme/ThemeProvider"',
            },
            {
              group: ['**/validation/ValidationContext'],
              message: '⚠️ ValidationContext legado. Use "useValidation" from "@/contexts/validation/ValidationProvider"',
            },
            {
              group: ['**/editor/EditorContext'],
              message: '⚠️ EditorContext legado. Use "useEditorState" from "@/contexts/editor/EditorStateProvider"',
            },
          ],
        },
      ],

      // 2. ⚠️ Warning para hooks legados
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.name="useSuperUnified"]',
          message: 
            '💡 useSuperUnified é do V1 monolítico (re-render de TUDO).\n' +
            '✅ Migre para hooks individuais para 85% menos re-renders:\n' +
            '  - useAuth(), useTheme(), useEditorState(), etc.\n' +
            '  Durante migração, pode usar useLegacySuperUnified() como bridge.',
        },
        {
          selector: 'CallExpression[callee.name="useUnifiedAuth"]',
          message: '💡 useUnifiedAuth é do V1. Use "useAuth" from "@/contexts/auth/AuthProvider"',
        },
      ],

      // 3. Prevenir código duplicado
      'no-duplicate-imports': 'error',
    },
  },

  // Configuração para testes (mais permissiva)
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      'no-restricted-imports': 'off', // Permitir imports legados em testes
      'no-restricted-syntax': 'off',
    },
  },
];
