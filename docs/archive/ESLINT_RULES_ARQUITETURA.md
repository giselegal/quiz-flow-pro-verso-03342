# 🛡️ ESLint Rules - Governança de Arquitetura

**Objetivo**: Prevenir regressão e garantir uso correto de providers durante migração V1 → V2

---

## 📋 REGRAS PROPOSTAS

### 1. Bloquear Imports Diretos de V1 (após migração)

```javascript
// .eslintrc.js ou eslint.config.js

module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/SuperUnifiedProvider', '!**/SuperUnifiedProviderV2'],
            message: '⚠️ SuperUnifiedProvider V1 está deprecado. Use SuperUnifiedProviderV2 ou hooks individuais (useAuth, useTheme, etc).',
          },
          {
            group: ['**/contexts/providers/SuperUnifiedProvider'],
            message: '⚠️ Importe de SuperUnifiedProviderV2 ao invés de V1. Ver: CHECKLIST_RESOLUCAO_DUPLICACOES.md',
          },
          {
            group: ['**/AuthContext', '**/contexts/auth/AuthContext'],
            message: '⚠️ AuthContext está deprecado. Use "useAuth" from "@/contexts/auth/AuthProvider"',
          },
          {
            group: ['**/ui/ThemeContext'],
            message: '⚠️ ThemeContext (UI) está deprecado. Use "useTheme" from "@/contexts/theme/ThemeProvider"',
          },
          {
            group: ['**/validation/ValidationContext'],
            message: '⚠️ ValidationContext está deprecado. Use "useValidation" from "@/contexts/validation/ValidationProvider"',
          },
        ],
      },
    ],
  },
};
```

### 2. Warning para Hooks Legados

```javascript
// Custom ESLint rule
{
  'no-restricted-syntax': [
    'warn',
    {
      selector: 'CallExpression[callee.name="useSuperUnified"]',
      message: '⚠️ useSuperUnified é da versão V1 monolítica. Considere migrar para hooks individuais (useAuth, useTheme, etc) para melhor performance.',
    },
    {
      selector: 'CallExpression[callee.name="useUnifiedAuth"]',
      message: '⚠️ useUnifiedAuth é do V1. Use "useAuth" from "@/contexts/auth/AuthProvider"',
    },
  ],
}
```

### 3. Bloquear Stubs em Produção

```javascript
{
  'no-restricted-imports': [
    'error',
    {
      patterns: [
        {
          group: ['**/SecurityProvider'],
          message: '⚠️ Verifique se SecurityProvider não é stub. Stubs não são permitidos em produção.',
          // Validar que contém implementação real, não apenas return true
        },
      ],
    },
  ],
}
```

### 4. Enforçar Uso de Provider Correto

```javascript
// Custom rule: enforce-v2-providers
{
  'enforce-v2-providers': [
    'error',
    {
      preferV2: true,
      allowLegacyDuring: 'migration', // Período de transição
      warnAfter: '2025-12-31', // Data limite
    },
  ],
}
```

---

## 🔧 IMPLEMENTAÇÃO

### Fase 1 - Warning (Durante Migração)
**Período**: Agora até migração completa

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'no-restricted-imports': [
        'warn', // WARNING apenas
        {
          patterns: [
            {
              group: ['**/SuperUnifiedProvider'],
              message: '💡 SuperUnifiedProvider V1 será deprecado. Planeje migração para V2.',
            },
          ],
        },
      ],
    },
  },
];
```

### Fase 2 - Error (Após Migração)
**Período**: Após 100% dos componentes migrados para V2

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'no-restricted-imports': [
        'error', // BLOQUEAR
        {
          patterns: [
            {
              group: ['**/SuperUnifiedProvider'],
              message: '🚫 SuperUnifiedProvider V1 foi removido. Use V2 ou hooks individuais.',
            },
          ],
        },
      ],
    },
  },
];
```

---

## 📝 ARQUIVO DE CONFIGURAÇÃO COMPLETO

```javascript
// eslint.config.js (Vite/ESM) ou .eslintrc.js (CommonJS)

export default [
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // 1. Bloquear providers legados
      'no-restricted-imports': [
        'warn', // Mudar para 'error' após migração
        {
          patterns: [
            // V1 SuperUnified
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
            // Providers legados específicos
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

      // 2. Warning para hooks legados
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'CallExpression[callee.name="useSuperUnified"]',
          message: 
            '💡 useSuperUnified é do V1 monolítico (re-render de TUDO).\n' +
            '✅ Migre para hooks individuais para 85% menos re-renders:\n' +
            '  - useAuth(), useTheme(), useEditorState(), etc.',
        },
        {
          selector: 'CallExpression[callee.name="useUnifiedAuth"]',
          message: '💡 useUnifiedAuth é do V1. Use "useAuth" from "@/contexts/auth/AuthProvider"',
        },
      ],

      // 3. Prevenir código duplicado
      'no-duplicate-imports': 'error',
      
      // 4. Enforçar imports organizados
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          pathGroups: [
            {
              pattern: '@/contexts/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
        },
      ],
    },
  },
];
```

---

## 🚀 ATIVAÇÃO

### 1. Instalar Dependências (se necessário)
```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install --save-dev eslint-plugin-import
```

### 2. Adicionar ao `package.json`
```json
{
  "scripts": {
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "lint:architecture": "eslint src --ext .ts,.tsx --rule 'no-restricted-imports: error'"
  }
}
```

### 3. Pre-commit Hook (Opcional)
```bash
# .husky/pre-commit ou similar
npm run lint:architecture
```

### 4. CI/CD Integration
```yaml
# .github/workflows/lint.yml
name: Lint Architecture
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint:architecture
```

---

## 📊 MÉTRICAS DE CONFORMIDADE

### Dashboard de Arquitetura
Criar script para monitorar uso de providers:

```javascript
// scripts/check-architecture.js
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkArchitecture() {
  // Contar imports de V1
  const { stdout: v1Count } = await execAsync(
    'grep -r "from.*SuperUnifiedProvider[\'\\"]" src --include="*.ts" --include="*.tsx" | wc -l'
  );
  
  // Contar imports de V2
  const { stdout: v2Count } = await execAsync(
    'grep -r "from.*SuperUnifiedProviderV2" src --include="*.ts" --include="*.tsx" | wc -l'
  );
  
  const progress = (parseInt(v2Count) / (parseInt(v1Count) + parseInt(v2Count))) * 100;
  
  console.log(`
📊 Progresso de Migração V1 → V2
────────────────────────────────
V1 (legado):  ${v1Count.trim()} arquivos
V2 (modular): ${v2Count.trim()} arquivos
Progresso:    ${progress.toFixed(1)}%
  `);
  
  if (progress < 100) {
    console.log('⚠️  Migração incompleta. Ver: CHECKLIST_RESOLUCAO_DUPLICACOES.md');
  } else {
    console.log('✅ Migração completa!');
  }
}

checkArchitecture();
```

**Adicionar ao package.json**:
```json
{
  "scripts": {
    "check:architecture": "node scripts/check-architecture.js"
  }
}
```

---

## 🎯 ROADMAP

### Semana 1-2 (Durante Migração)
- [x] Criar regras ESLint
- [ ] Configurar como 'warn'
- [ ] Executar `npm run lint` e ver warnings
- [ ] Adicionar ao CI como non-blocking

### Semana 3 (70%+ Migrado)
- [ ] Aumentar severity para 'error' em novos arquivos
- [ ] Manter 'warn' em arquivos legados

### Semana 4+ (100% Migrado)
- [ ] Trocar todas as regras para 'error'
- [ ] Bloquear pull requests com violações
- [ ] Remover código V1

---

## 📚 REFERÊNCIAS

- ESLint no-restricted-imports: https://eslint.org/docs/rules/no-restricted-imports
- ESLint no-restricted-syntax: https://eslint.org/docs/rules/no-restricted-syntax
- Custom ESLint Rules: https://eslint.org/docs/developer-guide/working-with-rules

---

**Gerado por**: GitHub Copilot  
**Data**: 21 de Novembro de 2025
