/* ESLint config adicionando barreira contra imports legados de providers e services deprecated */
const deprecatedServicePatterns = [
  'src/services/__deprecated/',
  'src/services/deprecated/',
  'src/core/funnel/services/TemplateService.ts'
];
const deprecatedProviderFiles = [
  'src/components/editor/EditorProviderAdapter.tsx',
  'src/components/editor/EditorProviderMigrationAdapter.tsx',
  'src/components/editor-bridge/EditorProviderUnified.ts'
];

module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['@typescript-eslint','import','react','react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-unresolved': 'error',
    'import/no-deprecated': 'warn',
    // Impede novos imports de paths deprecated
    'no-restricted-imports': [
      'error',
      {
        paths: [
          ...deprecatedProviderFiles.map(p => ({ name: p, message: 'Provider deprecated: use EditorProviderCanonical.' })),
        ],
        patterns: [
          ...deprecatedServicePatterns.map(p => ({ group: [p+'*'], message: 'Service deprecated: use services/canonical/*.' }))
        ]
      }
    ]
  }
};
