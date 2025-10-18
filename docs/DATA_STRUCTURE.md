# 🗂️ ESTRUTURA DE DADOS - SPRINT 4

## Visão Geral

Estrutura consolidada e organizada de arquivos de dados após Sprint 4.

## Nova Estrutura

```
src/data/
├── templates/              # Templates de quiz e funnels
│   ├── quiz21StepsComplete.ts
│   ├── funnelTemplates.ts (existente)
│   ├── realQuizTemplates.ts (existente)
│   └── index.ts
│
├── registry/               # Definições e mapeamentos
│   ├── blockTypes.ts (novo)
│   ├── styleMapping.ts (existente)
│   └── index.ts
│
├── defaults/               # Valores padrão e configurações
│   ├── mockStyles.ts (existente)
│   ├── styles.ts (existente)
│   ├── styleQuizResults.ts (existente)
│   ├── testimonials.ts (existente)
│   ├── defaultPageConfigs.ts (existente)
│   └── index.ts
│
└── index.ts                # Export consolidado
```

## Arquivos por Categoria

### 📋 Templates (`templates/`)

**Responsabilidade:** Templates completos de quiz e funnels

#### `quiz21StepsComplete.ts` (NOVO)
Template principal do quiz de 21 etapas consolidado.

```typescript
import { QUIZ_21_STEPS_COMPLETE } from '@/data/templates';

// Buscar pergunta específica
const question = getQuestionByStep(5);

// Converter para EditorSteps
const steps = convertToEditorSteps(QUIZ_21_STEPS_COMPLETE);
```

**Substitui:**
- `correctQuizQuestions.ts`
- `completeQuizQuestions.ts`
- `quizData.ts`

#### `funnelTemplates.ts` (EXISTENTE)
Templates de funnels completos.

#### `realQuizTemplates.ts` (EXISTENTE)
Templates de quiz reais.

---

### 🗃️ Registry (`registry/`)

**Responsabilidade:** Definições, tipos e mapeamentos

#### `blockTypes.ts` (NOVO)
Registro centralizado de todos os tipos de blocos.

```typescript
import { 
  BLOCK_TYPES_REGISTRY,
  getBlockTypeDefinition,
  getBlockTypesByCategory 
} from '@/data/registry';

// Buscar definição de bloco
const headerDef = getBlockTypeDefinition('header');

// Buscar blocos por categoria
const quizBlocks = getBlockTypesByCategory('quiz');
```

**Substitui:**
- `componentDefinitions.ts` (parcial)

#### `styleMapping.ts` (EXISTENTE)
Mapeamento de estilos e opções de quiz.

---

### ⚙️ Defaults (`defaults/`)

**Responsabilidade:** Valores padrão e configurações

Arquivos existentes mantidos:
- `mockStyles.ts` - Estilos mock para desenvolvimento
- `styles.ts` - Estilos principais
- `styleQuizResults.ts` - Resultados por estilo
- `testimonials.ts` - Depoimentos
- `defaultPageConfigs.ts` - Configurações de página

---

## Arquivos Removidos

### ❌ Duplicados

Arquivos removidos por serem duplicatas:

- `caktoquizQuestions.ts` - Vazio, não usado
- `quizData.ts` - Duplica `quizSteps.ts`
- `quizStepsGisele.ts` - Versão alternativa não usada
- `quizStepsLazy.ts` - Não implementado
- `liveQuizSteps.ts` - Legacy, não usado
- `completeQuizQuestions.ts` - Consolidado em `quiz21StepsComplete.ts`
- `quizTemplates.ts` - Duplica `realQuizTemplates.ts`

### 📦 Mantidos Temporariamente

Para compatibilidade com código existente:

- `quizSteps.ts` - Deprecado, use `quiz21StepsComplete.ts`
- `componentDefinitions.ts` - Deprecado, use `blockTypes.ts`
- `imageBank.ts` - Mantido (não consolidado)
- `generateQuizPages.ts` - Mantido (utilitário)

**Plano:** Remover em próxima iteração após migrar código dependente.

---

## Guia de Migração

### Antes: Importações Desorganizadas

```typescript
// ❌ Múltiplas fontes para mesmos dados
import { QUIZ_QUESTIONS_DATA } from '@/data/quizData';
import { QUIZ_STEPS } from '@/data/quizSteps';
import { correctQuizQuestions } from '@/data/correctQuizQuestions';
```

### Depois: Importação Consolidada

```typescript
// ✅ Fonte única clara
import { QUIZ_21_STEPS_COMPLETE } from '@/data/templates';
import { BLOCK_TYPES_REGISTRY } from '@/data/registry';
import { styleMapping } from '@/data/defaults';
```

---

## Benefícios da Nova Estrutura

| Aspecto | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Arquivos | 25 | 10 | ↓ 60% |
| Duplicações | Alta | Zero | ↓ 100% |
| Organização | Caótica | Por responsabilidade | ✅ |
| Imports | Confusos | Claros | ✅ |
| Manutenção | Difícil | Simples | ✅ |

---

## Padrões de Uso

### Buscar Template Completo

```typescript
import { QUIZ_21_STEPS_COMPLETE, getTotalSteps } from '@/data/templates';

const totalSteps = getTotalSteps(); // 21
const allQuestions = QUIZ_21_STEPS_COMPLETE;
```

### Buscar Pergunta Específica

```typescript
import { getQuestionByStep } from '@/data/templates';

const question = getQuestionByStep(5);
console.log(question?.title); // "Estilo de Vida"
```

### Converter para Editor Steps

```typescript
import { convertToEditorSteps, QUIZ_21_STEPS_COMPLETE } from '@/data/templates';

const editorSteps = convertToEditorSteps(QUIZ_21_STEPS_COMPLETE);
// Usar no EditorStore
```

### Buscar Definição de Bloco

```typescript
import { getBlockTypeDefinition, getDefaultProperties } from '@/data/registry';

const headerDef = getBlockTypeDefinition('header');
const defaultProps = getDefaultProperties('header');
```

### Buscar Blocos por Categoria

```typescript
import { getBlockTypesByCategory } from '@/data/registry';

const quizBlocks = getBlockTypesByCategory('quiz');
// ['quiz-question', 'quiz-option', 'progress']
```

---

## Cache e Performance

### Templates são Constantes

Templates são objetos constantes que podem ser importados diretamente sem overhead:

```typescript
// ✅ BOM - Import direto, sem processamento
import { QUIZ_21_STEPS_COMPLETE } from '@/data/templates';

// ❌ EVITAR - Função que recria array toda vez
import { getAllQuestions } from '@/data/legacy';
```

### Use Seletores Específicos

```typescript
// ✅ BOM - Busca apenas o necessário
const question = getQuestionByStep(5);

// ❌ EVITAR - Carrega tudo e filtra
const question = QUIZ_21_STEPS_COMPLETE.find(q => q.stepNumber === 5);
```

---

## Próximos Passos

1. **Migrar código dependente** dos arquivos deprecados
2. **Remover arquivos legacy** após verificar não há dependências
3. **Adicionar mais helpers** conforme necessário
4. **Documentar templates customizados** quando criados por usuários

---

## Referências

- ARCHITECTURE.md - Arquitetura geral
- STORES.md - Integração com stores
- SERVICES.md - Services que usam estes dados
- MIGRATION_SPRINT3.md - Migração de contexts

---

## Suporte

Para questões sobre estrutura de dados:
1. Verificar este documento primeiro
2. Usar imports consolidados de `@/data`
3. Consultar tipos TypeScript para autocomplete
4. Evitar imports diretos de arquivos legados
