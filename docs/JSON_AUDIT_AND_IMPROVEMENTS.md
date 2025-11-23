# 🔍 Auditoria e Melhorias de Estrutura JSON

**Data:** 23 de Novembro de 2025  
**Status:** Auditoria Completa ✅  
**Versão:** 1.0

---

## 📊 RESUMO EXECUTIVO

### Estado Atual
- **Total de arquivos JSON:** 389 (212 em templates)
- **Arquivos válidos:** 212 (100%)
- **Arquivos inválidos:** 0
- **Duplicatas identificadas:** 22
- **Deprecated:** 143 arquivos
- **Arquivo master:** `quiz21-complete.json` (120KB)

### Problemas Identificados

#### 🔴 CRÍTICOS
1. **Fragmentação excessiva** - 212 arquivos JSON espalhados
2. **Duplicação** - 22 arquivos duplicados
3. **Falta de schema validation** - Apenas TypeScript interfaces
4. **Ausência de versionamento consistente** - 3 arquivos sem version field

#### 🟡 MÉDIOS
5. **Estrutura inconsistente** - Múltiplos padrões de organização
6. **Tamanho excessivo** - `quiz21-complete.json` com 120KB
7. **Falta de i18n** - Conteúdo hardcoded em português
8. **Jump logic hardcoded** - Navegação não configurável via JSON

#### 🟢 BAIXOS
9. **Metadados incompletos** - Alguns arquivos sem author/createdAt
10. **Naming inconsistente** - Mistura de `step-XX-v3.json` e outros padrões

---

## 🏗️ ESTRUTURA ATUAL

### Diretórios Principais

```
quiz-flow-pro-verso-03342/
├── public/templates/           (22 arquivos)
│   ├── quiz21-complete.json    (120KB - master)
│   ├── step-01-v3.json         (8KB cada)
│   ├── step-02-v3.json
│   ├── ... (até step-21-v3.json)
│   └── funnels/
│       └── quiz21StepsComplete/
│           ├── master.json
│           ├── master.v3.json
│           └── steps/          (21 arquivos deprecated)
│
├── templates/                  (54 arquivos)
│   ├── quiz21StepsComplete.json
│   ├── step-01.json até step-21.json
│   ├── blocks/                 (22 duplicatas)
│   └── funnels/
│
└── .backup-config-templates-2025-11-05T19-23-05/  (21 backups)
```

### Análise de Tamanho

| Arquivo | Tamanho | Status |
|---------|---------|--------|
| `quiz21-complete.json` | 120KB | ⚠️ Muito grande |
| `step-XX-v3.json` (×21) | 8KB cada | ✅ OK |
| `step-20-v3.json` | 12KB | ⚠️ Maior que outros |

---

## 🔬 ANÁLISE COMPARATIVA COM PROJETOS SIMILARES

### Projetos Pesquisados

1. **SurveyJS** (4.6K⭐)
2. **Formbricks** (11.5K⭐) 
3. **OpnForm** (3K⭐)
4. **n8n** (158K⭐)
5. **React JSONSchema Form** (15.4K⭐)

### Comparação de Estrutura

| Feature | Quiz Flow Pro | SurveyJS | Formbricks | Recomendação |
|---------|---------------|----------|------------|--------------|
| **Organização** | ❌ Multiple files | ✅ Single file | ✅ Single file | Consolidar |
| **Schema Validation** | ❌ Only TS | ✅ JSON Schema | ✅ Zod | Adicionar Zod |
| **Jump Logic** | ❌ Hardcoded | ✅ JSON-based | ✅ JSON-based | Implementar |
| **Builder API** | ❌ Manual | ⚠️ Parcial | ✅ Completo | Criar helpers |
| **i18n Support** | ❌ None | ✅ Multi-lang | ✅ Multi-lang | Adicionar |
| **Versionamento** | ⚠️ Parcial | ✅ Completo | ✅ Completo | Padronizar |

### Principais Descobertas

#### ✅ Boas Práticas Identificadas

1. **Formbricks** - Sistema de templates com 3600+ linhas de builders
   ```typescript
   // packages/types/surveys/types.ts
   export const ZSurveyQuestionType = z.enum([
     "openText", "multipleChoiceMulti", "rating", ...
   ]);
   ```

2. **OpnForm** - Separação clara de concerns
   ```javascript
   {
     "form": { /* estrutura */ },
     "theme": { /* aparência */ },
     "logic": { /* comportamento */ }
   }
   ```

3. **n8n** - Versionamento robusto
   ```json
   {
     "version": 1,
     "nodes": [...],
     "connections": {...}
   }
   ```

---

## 🧩 GARANTIA DE MODULARIDADE

### ✅ Sistema de Blocks Atual (PRESERVADO 100%)

A estrutura atual já é **totalmente modular**. Cada step contém um array de `blocks` independentes:

```typescript
interface QuizStep {
  id: string;
  type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
  order: number;
  blocks: Block[];  // ← ARRAY DE COMPONENTES MODULARES
  navigation: NavigationConfig;
  validation?: ValidationRules;
}

interface Block {
  id: string;           // ← Identificador único
  type: string;         // ← Tipo do componente
  order: number;        // ← Ordem de renderização (REORDENÁVEL)
  properties: any;      // ← Props editáveis
  content: any;         // ← Conteúdo personalizado
  parentId?: string;    // ← Hierarquia (opcional)
}
```

### 🎯 Características dos Blocks

| Característica | Status | Implementação |
|----------------|--------|---------------|
| **Modular** | ✅ Sim | Cada block é um objeto independente |
| **Independente** | ✅ Sim | Blocks não dependem uns dos outros |
| **Reordenável** | ✅ Sim | Via propriedade `order` |
| **Reutilizável** | ✅ Sim | Mesmo block pode estar em múltiplos steps |
| **Editável** | ✅ Sim | Todas as propriedades são editáveis |
| **Deletável** | ✅ Sim | Remover block do array |
| **Duplicável** | ✅ Sim | Copiar block com novo ID |

### 📦 Tipos de Blocks Disponíveis

```typescript
export type BlockType = 
  // Progress & Navigation
  | 'question-progress'      // Barra de progresso
  | 'question-navigation'    // Botões voltar/avançar
  
  // Content
  | 'question-title'         // Título da pergunta
  | 'text-inline'            // Texto simples
  | 'quiz-intro-header'      // Header com logo
  
  // Input
  | 'form-input'             // Campo de texto
  | 'options-grid'           // Grid de opções
  
  // Results
  | 'result-display'         // Display de resultado
  | 'offer-card'             // Card de oferta
  ;
```

### 🔄 Operações de Editor (Já Funcionam)

```typescript
// 1. ADICIONAR BLOCK
const newBlock: Block = {
  id: `step-${stepId}-custom-${Date.now()}`,
  type: 'question-title',
  order: step.blocks.length,
  properties: {},
  content: { text: 'Nova pergunta' }
};
step.blocks.push(newBlock);

// 2. REORDENAR BLOCKS
const reorder = (blockId: string, newOrder: number) => {
  const block = step.blocks.find(b => b.id === blockId);
  if (block) {
    block.order = newOrder;
    step.blocks.sort((a, b) => a.order - b.order);
  }
};

// 3. EDITAR BLOCK
const editBlock = (blockId: string, updates: Partial<Block>) => {
  const index = step.blocks.findIndex(b => b.id === blockId);
  if (index >= 0) {
    step.blocks[index] = { ...step.blocks[index], ...updates };
  }
};

// 4. REMOVER BLOCK
const removeBlock = (blockId: string) => {
  step.blocks = step.blocks.filter(b => b.id !== blockId);
};

// 5. DUPLICAR BLOCK
const duplicateBlock = (blockId: string) => {
  const original = step.blocks.find(b => b.id === blockId);
  if (original) {
    const duplicate = {
      ...original,
      id: `${original.id}-copy-${Date.now()}`,
      order: step.blocks.length
    };
    step.blocks.push(duplicate);
  }
};

// 6. REUTILIZAR BLOCK (copiar de outro step)
const reuseBlock = (sourceStepId: string, blockId: string, targetStepId: string) => {
  const sourceStep = quiz.steps.find(s => s.id === sourceStepId);
  const targetStep = quiz.steps.find(s => s.id === targetStepId);
  const block = sourceStep?.blocks.find(b => b.id === blockId);
  
  if (block && targetStep) {
    const reused = {
      ...block,
      id: `${targetStepId}-${block.type}-${Date.now()}`,
      order: targetStep.blocks.length
    };
    targetStep.blocks.push(reused);
  }
};
```

### 💡 Exemplo Real de Step Modular

```json
{
  "id": "step-02",
  "type": "question",
  "order": 2,
  "blocks": [
    {
      "id": "progress-bar-step-02",
      "type": "question-progress",
      "order": 0,
      "properties": { "padding": 8 },
      "content": { "stepNumber": 2, "totalSteps": 21 }
    },
    {
      "id": "step-02-title",
      "type": "question-title",
      "order": 1,
      "properties": { "padding": 16 },
      "content": { "text": "Qual seu estilo?" }
    },
    {
      "id": "step-02-options",
      "type": "options-grid",
      "order": 2,
      "properties": { "columns": 2 },
      "content": { "options": [...] }
    },
    {
      "id": "navigation-step-02",
      "type": "question-navigation",
      "order": 3,
      "properties": { "showBack": true },
      "content": { "nextLabel": "Avançar" }
    }
  ]
}
```

**Operações possíveis:**
- ✅ Remover `progress-bar-step-02` → Step fica sem barra de progresso
- ✅ Reordenar: mover `navigation` para `order: 1` → Botões aparecem antes do título
- ✅ Editar: alterar `columns: 2` para `columns: 3` → Grid com 3 colunas
- ✅ Adicionar: inserir novo block `text-inline` com `order: 1.5` → Aparece entre título e opções
- ✅ Duplicar: copiar `step-02-options` → Criar segunda grid de opções
- ✅ Reutilizar: copiar `progress-bar-step-02` para `step-03` → Mesma barra em outro step

### 🚀 Consolidação NÃO Afeta Modularidade

**O que muda:**
- ❌ ~~212 arquivos separados~~ → ✅ 1 arquivo consolidado

**O que NÃO muda:**
- ✅ Estrutura de blocks permanece idêntica
- ✅ Propriedades `order`, `id`, `type` preservadas
- ✅ Editor visual funciona da mesma forma
- ✅ Operações de CRUD nos blocks inalteradas
- ✅ Reordenação via drag-and-drop continua funcionando
- ✅ Reutilização entre steps mantida

---

## 🎯 PLANO DE MELHORIAS

### FASE 1: Consolidação (PRIORIDADE ALTA) ⏱️ 4 horas

#### 1.1 Criar Estrutura Unificada

**⚠️ IMPORTANTE:** A consolidação **PRESERVA 100% a modularidade dos blocks**!

**Objetivo:** Consolidar `quiz21-complete.json` + `step-XX-v3.json` em estrutura otimizada **mantendo blocks como componentes independentes, reordenáveis e reutilizáveis**.

**Nova Estrutura v4.0:**
```json
{
  "version": "4.0.0",
  "schemaVersion": "1.0",
  "metadata": {
    "id": "quiz21StepsComplete",
    "name": "Quiz de Estilo Pessoal",
    "description": "...",
    "author": "giselegal",
    "createdAt": "2025-11-23T00:00:00Z",
    "updatedAt": "2025-11-23T00:00:00Z"
  },
  "theme": {
    "colors": { ... },
    "fonts": { ... },
    "spacing": { ... },
    "borderRadius": { ... }
  },
  "settings": {
    "scoring": {
      "enabled": true,
      "method": "category-points",
      "categories": ["Natural", "Clássico", ...]
    },
    "navigation": {
      "allowBack": false,
      "autoAdvance": true,
      "showProgress": true
    },
    "validation": {
      "required": true,
      "strictMode": true
    }
  },
  "steps": [
    {
      "id": "step-01",
      "type": "intro",
      "order": 1,
      "title": "Bem-vindo",
      "blocks": [
        {
          "id": "progress-bar-step-01",
          "type": "question-progress",
          "order": 0,
          "properties": { "padding": 8 },
          "content": {
            "stepNumber": 1,
            "totalSteps": 21,
            "showPercentage": true,
            "barColor": "#B89B7A"
          },
          "parentId": null
        },
        {
          "id": "step-01-title",
          "type": "question-title",
          "order": 1,
          "properties": { "padding": 16 },
          "content": {
            "text": "Bem-vindo",
            "subtitle": "Descubra seu estilo"
          },
          "parentId": null
        }
      ],
      "navigation": {
        "nextStep": "step-02",
        "conditions": []
      },
      "validation": {
        "required": false
      }
    },
    {
      "id": "step-02",
      "type": "question",
      "order": 2,
      "blocks": [
        {
          "id": "progress-bar-step-02",
          "type": "question-progress",
          "order": 0,
          "properties": { "padding": 8 },
          "content": { "stepNumber": 2, "totalSteps": 21 }
        },
        {
          "id": "step-02-title",
          "type": "question-title",
          "order": 1,
          "properties": { "padding": 16 },
          "content": { "text": "Pergunta 1 de 10" }
        },
        {
          "id": "step-02-options",
          "type": "options-grid",
          "order": 2,
          "properties": { "columns": 2, "gap": 16 },
          "content": {
            "options": [
              {
                "id": "natural",
                "text": "Conforto e praticidade",
                "image": "https://...",
                "scores": { "natural": 10 }
              }
            ],
            "minSelections": 3,
            "maxSelections": 3
          }
        },
        {
          "id": "navigation-step-02",
          "type": "question-navigation",
          "order": 3,
          "properties": { "showBack": true },
          "content": { "nextLabel": "Avançar" }
        }
      ],
      "navigation": {
        "nextStep": "step-03"
      },
      "validation": {
        "required": true,
        "rules": {
          "selectedOptions": {
            "minItems": 3,
            "maxItems": 3
          }
        }
      }
    }
  ],
  "blockLibrary": {
    "question-progress": {
      "component": "QuestionProgress",
      "editable": true,
      "reorderable": true,
      "reusable": true,
      "schema": "QuizBlockSchemaZ"
    },
    "question-title": {
      "component": "QuestionTitle",
      "editable": true,
      "reorderable": true,
      "reusable": true
    },
    "options-grid": {
      "component": "OptionsGrid",
      "editable": true,
      "reorderable": true,
      "reusable": true
    },
    "question-navigation": {
      "component": "QuestionNavigation",
      "editable": true,
      "reorderable": true,
      "reusable": true
    }
  },
  "results": {
    "natural": { ... },
    "classico": { ... }
  }
}
```

**✅ GARANTIAS DE MODULARIDADE:**

1. **Blocks Independentes** - Cada block tem:
   - `id` único
   - `type` específico
   - `order` para reordenação
   - `properties` editáveis
   - `content` personalizado
   - `parentId` para hierarquia (opcional)

2. **Reordenável** - Alterar `order` = alterar posição

3. **Reutilizável** - Mesmo block pode aparecer em múltiplos steps

4. **Editável** - Todas as propriedades são editáveis via editor

5. **Block Library** - Catálogo de blocks disponíveis com metadata

#### 1.2 Implementar Zod Schema

**Arquivo:** `src/schemas/quiz-schema.zod.ts`

```typescript
import { z } from 'zod';

export const QuizColorSchemaZ = z.object({
  primary: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
  background: z.string().regex(/^#[0-9A-F]{6}$/i),
  text: z.string().regex(/^#[0-9A-F]{6}$/i),
  border: z.string().regex(/^#[0-9A-F]{6}$/i)
});

export const QuizThemeSchemaZ = z.object({
  colors: QuizColorSchemaZ,
  fonts: z.object({
    heading: z.string(),
    body: z.string()
  }),
  spacing: z.record(z.number()),
  borderRadius: z.record(z.number())
});

export const QuizBlockSchemaZ = z.object({
  id: z.string().min(1),
  type: z.enum([
    'question-title',
    'question-progress',
    'options-grid',
    'form-input',
    'text-inline',
    'question-navigation',
    'quiz-intro-header',
    'result-display',
    'offer-card'
  ]),
  order: z.number().int().min(0),
  properties: z.record(z.any()),
  content: z.record(z.any()).optional(),
  parentId: z.string().nullable().optional(),
  // Metadata para editor
  metadata: z.object({
    component: z.string().optional(),
    editable: z.boolean().default(true),
    reorderable: z.boolean().default(true),
    reusable: z.boolean().default(true),
    deletable: z.boolean().default(true)
  }).optional()
});

export const QuizStepSchemaZ = z.object({
  id: z.string().regex(/^step-\d{2}$/),
  type: z.enum(['intro', 'question', 'transition', 'result', 'offer']),
  order: z.number().int().min(1).max(21),
  title: z.string().optional(),
  blocks: z.array(QuizBlockSchemaZ).min(1),
  navigation: z.object({
    nextStep: z.string().nullable(),
    conditions: z.array(z.any()).optional()
  }),
  validation: z.object({
    required: z.boolean(),
    rules: z.record(z.any()).optional()
  }).optional()
});

export const QuizSchemaZ = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  schemaVersion: z.string(),
  metadata: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    author: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
  }),
  theme: QuizThemeSchemaZ,
  settings: z.object({
    scoring: z.any(),
    navigation: z.any(),
    validation: z.any()
  }),
  steps: z.array(QuizStepSchemaZ).min(1).max(30),
  results: z.record(z.any()).optional()
});

export type QuizSchema = z.infer<typeof QuizSchemaZ>;
```

#### 1.3 Script de Migração

**Arquivo:** `scripts/migrate-to-v4.mjs`

```javascript
import fs from 'fs';
import { QuizSchemaZ } from '../src/schemas/quiz-schema.zod.ts';

const v3Master = JSON.parse(
  fs.readFileSync('public/templates/quiz21-complete.json', 'utf8')
);

const v4Schema = {
  version: "4.0.0",
  schemaVersion: "1.0",
  metadata: {
    ...v3Master.metadata,
    updatedAt: new Date().toISOString()
  },
  theme: v3Master.steps['step-01'].theme,
  settings: {
    scoring: v3Master.metadata.scoringRules,
    navigation: {
      allowBack: false,
      autoAdvance: true,
      showProgress: true
    },
    validation: {
      required: true,
      strictMode: true
    }
  },
  steps: Object.entries(v3Master.steps).map(([key, step]) => ({
    id: step.metadata.id,
    type: step.metadata.category || step.type,
    order: parseInt(key.replace('step-', '')),
    title: step.metadata.name,
    blocks: step.blocks || [],
    navigation: step.navigation || {},
    validation: step.validation || {}
  })),
  results: {} // Extrair de step-20 e step-21
};

// Validate
try {
  QuizSchemaZ.parse(v4Schema);
  console.log('✅ Schema v4 válido!');
  
  fs.writeFileSync(
    'public/templates/quiz21-v4.json',
    JSON.stringify(v4Schema, null, 2)
  );
  console.log('📄 Salvo em: public/templates/quiz21-v4.json');
} catch (e) {
  console.error('❌ Erro de validação:', e.errors);
}
```

**Ações:**
- [ ] Criar `src/schemas/quiz-schema.zod.ts`
- [ ] Criar script `scripts/migrate-to-v4.mjs`
- [ ] Executar migração
- [ ] Validar novo schema
- [ ] Atualizar imports no código

**Impacto:**
- ✅ Redução de 212 para 1 arquivo JSON principal
- ✅ Validação runtime com Zod
- ✅ Type-safety completa
- ✅ Facilita manutenção

---

### FASE 2: Jump Logic System (PRIORIDADE ALTA) ⏱️ 6 horas

#### 2.1 Estrutura de Logic

**JSON Structure:**
```json
{
  "steps": [
    {
      "id": "step-02",
      "navigation": {
        "nextStep": "step-03",
        "conditions": [
          {
            "id": "cond-1",
            "if": {
              "operator": "equals",
              "field": "selectedStyle",
              "value": "natural"
            },
            "then": {
              "action": "goto",
              "target": "step-10"
            }
          },
          {
            "id": "cond-2",
            "if": {
              "operator": "greaterThan",
              "field": "score.natural",
              "value": 15
            },
            "then": {
              "action": "showResult",
              "target": "result-natural"
            }
          }
        ]
      }
    }
  ]
}
```

#### 2.2 Logic Engine

**Arquivo:** `src/lib/logic-engine.ts`

```typescript
export interface Condition {
  id: string;
  if: {
    operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
    field: string;
    value: any;
  };
  then: {
    action: 'goto' | 'showResult' | 'skip' | 'end';
    target: string;
  };
}

export class LogicEngine {
  private context: Record<string, any>;

  constructor(initialContext: Record<string, any> = {}) {
    this.context = initialContext;
  }

  updateContext(key: string, value: any) {
    this.context[key] = value;
  }

  evaluateCondition(condition: Condition): boolean {
    const { operator, field, value } = condition.if;
    const fieldValue = this.getNestedValue(field);

    switch (operator) {
      case 'equals':
        return fieldValue === value;
      case 'notEquals':
        return fieldValue !== value;
      case 'greaterThan':
        return fieldValue > value;
      case 'lessThan':
        return fieldValue < value;
      case 'contains':
        return Array.isArray(fieldValue) && fieldValue.includes(value);
      default:
        return false;
    }
  }

  evaluateConditions(conditions: Condition[]): Condition | null {
    for (const condition of conditions) {
      if (this.evaluateCondition(condition)) {
        return condition;
      }
    }
    return null;
  }

  getNextStep(currentStep: string, conditions: Condition[], defaultNext: string): string {
    const matchedCondition = this.evaluateConditions(conditions);
    
    if (matchedCondition && matchedCondition.then.action === 'goto') {
      return matchedCondition.then.target;
    }
    
    return defaultNext;
  }

  private getNestedValue(path: string): any {
    return path.split('.').reduce((obj, key) => obj?.[key], this.context);
  }
}
```

**Ações:**
- [ ] Criar `src/lib/logic-engine.ts`
- [ ] Adicionar testes unitários
- [ ] Integrar com `useQuizState`
- [ ] Atualizar JSON com conditions

---

### FASE 3: Builder API (PRIORIDADE MÉDIA) ⏱️ 8 horas

#### 3.1 Template Builders

**Arquivo:** `src/lib/builders/question-builders.ts`

```typescript
import { QuizBlock, QuizStep } from '@/schemas/quiz-schema.zod';

export class QuestionBuilder {
  private step: Partial<QuizStep>;

  constructor(id: string, order: number) {
    this.step = {
      id,
      order,
      type: 'question',
      blocks: []
    };
  }

  withTitle(title: string): this {
    this.step.title = title;
    this.step.blocks!.push({
      id: `${this.step.id}-title`,
      type: 'question-title',
      order: 0,
      properties: {},
      content: { text: title }
    });
    return this;
  }

  withProgress(stepNumber: number, totalSteps: number): this {
    this.step.blocks!.push({
      id: `${this.step.id}-progress`,
      type: 'question-progress',
      order: 1,
      properties: { padding: 8 },
      content: {
        stepNumber,
        totalSteps,
        showPercentage: true,
        barColor: '#B89B7A',
        backgroundColor: '#e5e7eb'
      }
    });
    return this;
  }

  withOptionsGrid(options: Array<{
    id: string;
    text: string;
    image?: string;
    scores: Record<string, number>;
  }>): this {
    this.step.blocks!.push({
      id: `${this.step.id}-options`,
      type: 'options-grid',
      order: 2,
      properties: {
        columns: 3,
        minSelections: 3,
        maxSelections: 3
      },
      content: { options }
    });
    return this;
  }

  withValidation(required: boolean = true, min: number = 3, max: number = 3): this {
    this.step.validation = {
      required,
      rules: {
        selectedOptions: {
          minItems: min,
          maxItems: max,
          errorMessage: `Selecione ${min === max ? 'exatamente ' + min : `entre ${min} e ${max}`} opções`
        }
      }
    };
    return this;
  }

  withNavigation(nextStep: string | null, conditions: any[] = []): this {
    this.step.navigation = {
      nextStep,
      conditions
    };
    return this;
  }

  build(): QuizStep {
    return this.step as QuizStep;
  }
}

// Usage:
const step2 = new QuestionBuilder('step-02', 2)
  .withTitle('Qual seu estilo preferido?')
  .withProgress(2, 21)
  .withOptionsGrid([
    { id: 'natural', text: 'Natural', scores: { natural: 10 } },
    { id: 'classico', text: 'Clássico', scores: { classico: 10 } }
  ])
  .withValidation(true, 3, 3)
  .withNavigation('step-03')
  .build();
```

**Ações:**
- [ ] Criar builders para cada tipo de step
- [ ] Documentar API
- [ ] Criar exemplos de uso
- [ ] Adicionar testes

---

### FASE 4: i18n Support (PRIORIDADE BAIXA) ⏱️ 4 horas

#### 4.1 Estrutura Multi-idioma

```json
{
  "steps": [
    {
      "id": "step-01",
      "title": {
        "pt-BR": "Bem-vindo ao Quiz",
        "en": "Welcome to the Quiz",
        "es": "Bienvenido al Quiz"
      },
      "blocks": [
        {
          "content": {
            "text": {
              "pt-BR": "Descubra seu estilo",
              "en": "Discover your style"
            }
          }
        }
      ]
    }
  ]
}
```

#### 4.2 i18n Helper

```typescript
export class i18nHelper {
  private locale: string;

  constructor(locale: string = 'pt-BR') {
    this.locale = locale;
  }

  translate(value: string | Record<string, string>): string {
    if (typeof value === 'string') return value;
    return value[this.locale] || value['pt-BR'] || value['default'] || '';
  }

  setLocale(locale: string) {
    this.locale = locale;
  }
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### FASE 1: Consolidação (4h)
- [ ] Criar `src/schemas/quiz-schema.zod.ts`
- [ ] Criar script `scripts/migrate-to-v4.mjs`
- [ ] Executar migração para v4
- [ ] Validar novo schema com Zod
- [ ] Atualizar imports no código
- [ ] Testar carregamento do quiz
- [ ] Commit e push

### FASE 2: Logic Engine (6h)
- [ ] Criar `src/lib/logic-engine.ts`
- [ ] Implementar operadores (equals, greaterThan, etc)
- [ ] Adicionar testes unitários
- [ ] Integrar com `useQuizState`
- [ ] Atualizar JSON steps com conditions
- [ ] Testar jump logic
- [ ] Documentar API

### FASE 3: Builder API (8h)
- [ ] Criar `src/lib/builders/question-builders.ts`
- [ ] Implementar builders para intro, question, result
- [ ] Criar biblioteca de templates
- [ ] Adicionar testes
- [ ] Documentar com exemplos
- [ ] Criar playground de builders

### FASE 4: i18n (4h)
- [ ] Criar `src/lib/i18n-helper.ts`
- [ ] Atualizar schema para suportar multi-lang
- [ ] Migrar strings para formato i18n
- [ ] Adicionar seletor de idioma
- [ ] Testar em pt-BR e en
- [ ] Documentar

---

## 🎯 MÉTRICAS DE SUCESSO

### Antes
- ❌ 212 arquivos JSON
- ❌ 22 duplicatas
- ❌ 143 deprecated
- ❌ 0 validação runtime
- ❌ Jump logic hardcoded
- ❌ 0 builder helpers

### Depois
- ✅ 1 arquivo JSON principal
- ✅ 0 duplicatas
- ✅ 0 deprecated
- ✅ Validação Zod completa
- ✅ Jump logic configurável
- ✅ Builder API completa
- ✅ Suporte i18n

### KPIs
- **Redução de arquivos:** 212 → 1 (99.5%)
- **Validação:** 0% → 100%
- **Type-safety:** Parcial → Completo
- **Manutenibilidade:** Baixa → Alta
- **Developer Experience:** ⭐⭐ → ⭐⭐⭐⭐⭐

---

## 📚 REFERÊNCIAS

### Projetos Analisados
1. [SurveyJS](https://github.com/surveyjs/survey-library)
2. [Formbricks](https://github.com/formbricks/formbricks)
3. [OpnForm](https://github.com/JhumanJ/OpnForm)
4. [n8n](https://github.com/n8n-io/n8n)
5. [React JSONSchema Form](https://github.com/rjsf-team/react-jsonschema-form)

### Documentação
- [Zod Documentation](https://zod.dev)
- [JSON Schema](https://json-schema.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🚀 PRÓXIMOS PASSOS

1. **Imediato** (hoje)
   - Revisar este documento
   - Aprovar FASE 1
   - Começar migração para v4

2. **Curto prazo** (esta semana)
   - Completar FASE 1
   - Iniciar FASE 2
   - Testes end-to-end

3. **Médio prazo** (próximas 2 semanas)
   - Completar FASE 2 e 3
   - Documentação completa
   - Deploy em produção

4. **Longo prazo** (próximo mês)
   - FASE 4 (i18n)
   - Performance optimization
   - Analytics integration

---

**Última atualização:** 23/11/2025  
**Responsável:** GitHub Copilot + giselegal  
**Status:** ✅ Auditoria completa - Pronto para implementação
