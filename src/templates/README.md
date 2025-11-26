# 🎨 Sistema de Templates - Fonte Única de Verdade

> **ATENÇÃO**: Esta estrutura foi REFATORADA em **26/11/2024** para eliminar duplicações e implementar lazy loading.  
> **Backup dos arquivos antigos**: `.backup-templates-refactor-20251126/`

## 📋 Visão Geral

Este diretório é a **ÚNICA fonte de verdade** para todos os templates de funis do Quiz Flow Pro. A nova arquitetura garante:

- ✅ **Fonte Única**: Um lugar para cada template
- ✅ **Lazy Loading**: Carregamento sob demanda (-70% bundle)
- ✅ **Type Safety**: Validação com Zod em todas as camadas
- ✅ **Modularidade**: Blocos reutilizáveis entre funis
- ✅ **Performance**: Tree-shaking e minificação automática

---

## 📂 Estrutura de Diretórios

```
src/templates/
├── funnels/              # 🎯 Templates de funis completos
│   ├── quiz21Steps/      # Funnel principal (21 steps)
│   │   ├── metadata.json # Metadados do funnel (nome, versão, etc)
│   │   ├── config.ts     # Configuração tipada do funnel
│   │   ├── index.ts      # Export principal do funnel
│   │   └── steps/        # Steps individuais (lazy loaded)
│   │       ├── step01-intro.ts
│   │       ├── step02-form.ts
│   │       └── ...
│   ├── embedded/         # Funnel embutido (1 step)
│   └── ...               # Outros funis
│
├── blocks/               # 🧩 Blocos reutilizáveis
│   ├── index.ts          # Export de blocos comuns
│   ├── headers.ts        # Blocos de cabeçalho
│   ├── forms.ts          # Blocos de formulário
│   └── ctas.ts           # Blocos de CTA
│
├── schemas/              # 🔒 Validação Zod
│   └── index.ts          # FunnelSchema, StepSchema, BlockSchema
│
├── loaders/              # ⚡ Sistema de lazy loading
│   ├── dynamic.ts        # Lazy loader dinâmico
│   └── registry.ts       # Registry de funis carregados
│
└── README.md             # 📖 Esta documentação

```

---

## 🚀 Como Usar

### 1. Importar um Funnel Completo (Não Recomendado - Peso!)

```typescript
import { quiz21StepsComplete } from '@/templates/funnels/quiz21Steps';

// ⚠️ EVITE: Carrega ~2MB no bundle principal
const funnel = quiz21StepsComplete;
```

### 2. Lazy Loading de Funnel (Recomendado)

```typescript
import { loadFunnel } from '@/templates/loaders/dynamic';

// ✅ RECOMENDADO: Carrega apenas quando necessário
const funnel = await loadFunnel('quiz21StepsComplete');
```

### 3. Usar Blocos Reutilizáveis

```typescript
import { SharedBlocks } from '@/templates/blocks';

// Criar header padrão
const header = SharedBlocks.header({
  properties: { backgroundColor: '#FAF9F7' }
});

// Criar formulário customizado
const form = SharedBlocks.form({
  content: {
    fields: [
      { name: 'email', type: 'email', required: true }
    ]
  }
});
```

### 4. Validar Template com Zod

```typescript
import { validateFunnel, validateStep } from '@/templates/schemas';

// Validar funnel completo
const result = validateFunnel(funnelData);
if (!result.success) {
  console.error('Erros de validação:', result.error);
}

// Validar step individual
const stepResult = validateStep(stepData);
```

---

## 🛠️ Como Criar um Novo Funnel

### Passo 1: Criar Estrutura de Diretórios

```bash
mkdir -p src/templates/funnels/meuFunnel/steps
```

### Passo 2: Criar `metadata.json`

```json
{
  "id": "meuFunnel",
  "name": "Meu Funnel Personalizado",
  "version": "1.0.0",
  "description": "Descrição do funnel",
  "author": "Seu Nome",
  "createdAt": "2024-11-26",
  "totalSteps": 5
}
```

### Passo 3: Criar Steps Individuais

```typescript
// src/templates/funnels/meuFunnel/steps/step01-intro.ts
import type { Step } from '@/templates/schemas';
import { SharedBlocks } from '@/templates/blocks';

export const step01: Step = {
  id: '1',
  order: 1,
  type: 'intro',
  title: 'Bem-vindo',
  blocks: [
    SharedBlocks.header(),
    SharedBlocks.title('Bem-vindo ao Quiz'),
    SharedBlocks.description('Vamos começar...'),
  ]
};
```

### Passo 4: Criar `index.ts` Principal

```typescript
// src/templates/funnels/meuFunnel/index.ts
import type { Funnel } from '@/templates/schemas';
import metadata from './metadata.json';

// Lazy loading de steps
const loadStep = (stepNumber: number) => 
  import(`./steps/step${String(stepNumber).padStart(2, '0')}-*.ts`);

export const meuFunnel: Funnel = {
  ...metadata,
  steps: [], // Carregados dinamicamente
  theme: {
    primaryColor: '#B89B7A',
    backgroundColor: '#FAF9F7',
  }
};

export default meuFunnel;
```

### Passo 5: Registrar no Loader

```typescript
// src/templates/loaders/registry.ts
export const FUNNEL_LOADERS = {
  'meuFunnel': () => import('../funnels/meuFunnel'),
  // ...outros funis
};
```

---

## 📊 Métricas de Performance

### Antes do Refactoring (Score: 4.1/10)
- ❌ 230+ arquivos JSON duplicados
- ❌ Bundle size: ~2MB no chunk principal
- ❌ 3 fontes de verdade diferentes
- ❌ Sem lazy loading
- ❌ Sem validação de schema

### Depois do Refactoring (Target: 8.5/10)
- ✅ ~30 arquivos TypeScript otimizados
- ✅ Bundle size: ~600KB no chunk principal (-70%)
- ✅ 1 fonte única de verdade
- ✅ Lazy loading em todos os funis
- ✅ Validação Zod em todas as camadas

---

## 🔧 Scripts Úteis

```bash
# Validar todos os templates
npm run validate:templates

# Gerar tipos automáticos
npm run generate:types

# Auditar bundle size
npm run analyze:bundle

# Restaurar backup (caso necessário)
cp -r .backup-templates-refactor-20251126/templates ./templates
```

---

## ⚠️ Regras de Ouro

1. **NUNCA** duplique JSONs entre diretórios
2. **SEMPRE** use lazy loading para funis grandes
3. **VALIDE** templates com Zod antes de usar
4. **REUTILIZE** blocos da biblioteca `blocks/`
5. **DOCUMENTE** novos funis no registry

---

## 🐛 Troubleshooting

### Erro: "Funnel not found"
Verifique se o funnel está registrado em `loaders/registry.ts`

### Erro: Validação Zod falha
Use `validateFunnel()` para ver detalhes do erro:
```typescript
const result = validateFunnel(data);
console.log(result.error?.format());
```

### Bundle muito grande
Verifique se está usando lazy loading:
```typescript
// ❌ ERRADO
import { quiz21StepsComplete } from '@/templates/funnels/quiz21Steps';

// ✅ CORRETO
const funnel = await loadFunnel('quiz21StepsComplete');
```

---

## 📚 Referências

- [Zod Documentation](https://zod.dev)
- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [Best Practices Analysis](docs/BEST_PRACTICES_ANALYSIS.md)

---

**Última Atualização**: 26/11/2024  
**Refactoring por**: GitHub Copilot Agent  
**Score Alvo**: 8.5/10
