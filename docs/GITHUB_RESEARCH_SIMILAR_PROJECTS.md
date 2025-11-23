# 🔍 Pesquisa GitHub: Projetos Similares ao Quiz Flow Pro

**Data:** 23/11/2025  
**Objetivo:** Analisar estruturas JSON, schemas e patterns de projetos similares bem-sucedidos

---

## 📊 PROJETOS ANALISADOS

### 1. **SurveyJS** (surveyjs/survey-library)
- ⭐ **Stars:** 4,596
- 🔗 **URL:** https://github.com/surveyjs/survey-library
- 📝 **Descrição:** Free JavaScript form builder library with integration for React, Angular, Vue
- 🏷️ **Tipo:** Quiz/Survey Library
- 💻 **Stack:** TypeScript

**Estrutura JSON:**
```typescript
{
  "title": "American History",
  "showProgressBar": true,
  "progressBarLocation": "bottom",
  "showTimer": true,
  "timeLimitPerPage": 10,
  "timeLimit": 25,
  "firstPageIsStartPage": true,
  "startSurveyText": "Start Quiz",
  "pages": [{
    "elements": [{
      "type": "radiogroup",
      "name": "civilwar",
      "title": "When was the American Civil War?",
      "choices": ["1796-1803", "1810-1814", "1861-1865", "1939-1945"],
      "correctAnswer": "1861-1865"
    }]
  }],
  "completedHtml": "<h4>You got <b>{correctAnswers}</b> out of <b>{questionCount}</b> correct answers.</h4>"
}
```

**Características:**
- ✅ **Single JSON file** com toda configuração
- ✅ Separação clara: `pages` → `elements` → `questions`
- ✅ Validação via JSON Schema integrada
- ✅ Suporte a templates dinâmicos (`{correctAnswers}`, `{questionCount}`)
- ✅ Configurações globais no root (timer, progressBar)
- ✅ Conditional logic via `visibleIf` expressions
- ✅ Serialization via `toJSON()` / `fromJSON()`

---

### 2. **Formbricks** (formbricks/formbricks)
- ⭐ **Stars:** 11,552
- 🔗 **URL:** https://github.com/formbricks/formbricks
- 📝 **Descrição:** Open Source Qualtrics Alternative
- 🏷️ **Tipo:** Survey Platform
- 💻 **Stack:** TypeScript, React, Next.js

**Estrutura JSON:**
```typescript
{
  "name": "Customer Feedback",
  "type": "link",
  "status": "draft",
  "questions": [{
    "id": "q1",
    "type": "rating",
    "headline": { "default": "Rate us" },
    "required": true,
    "range": 5,
    "scale": "star",
    "logic": [{
      "conditions": {
        "connector": "and",
        "conditions": [{
          "leftOperand": { "value": "q1", "type": "question" },
          "operator": "isLessThanOrEqual",
          "rightOperand": { "type": "static", "value": 3 }
        }]
      },
      "actions": [{
        "objective": "jumpToQuestion",
        "target": "q3"
      }]
    }]
  }],
  "endings": [{
    "id": "end1",
    "type": "endScreen",
    "headline": { "default": "Thank you!" }
  }]
}
```

**Características:**
- ✅ **Zod Schema validation** em `packages/types/surveys/types.ts`
- ✅ **i18n support** com `{ "default": "text" }` para multilíngue
- ✅ **Jump logic** bem estruturado (conditions + actions)
- ✅ Separação: `questions` + `endings` + `hiddenFields` + `variables`
- ✅ **Templates system** em `apps/web/app/lib/templates.ts` (~3600 linhas!)
- ✅ **Builder functions** para criar tipos de perguntas:
  - `buildRatingQuestion()`
  - `buildMultipleChoiceQuestion()`
  - `buildOpenTextQuestion()`
- ✅ Validation rules por campo (min_selection, max_selection)

---

### 3. **OpnForm** (OpnForm/OpnForm)
- ⭐ **Stars:** 3,005
- 🔗 **URL:** https://github.com/OpnForm/OpnForm
- 📝 **Descrição:** Beautiful Open-Source Form Builder
- 🏷️ **Tipo:** Form Builder
- 💻 **Stack:** PHP (Laravel), Vue.js

**Estrutura JSON:**
```php
{
  "title": "Contact Form",
  "properties": [{
    "id": "field1",
    "name": "Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter your name",
    "logic": {
      "conditions": {
        "operatorIdentifier": "and",
        "children": [{
          "identifier": "email",
          "value": {
            "operator": "is_empty",
            "property_meta": { "id": "93ea", "type": "email" },
            "value": true
          }
        }]
      },
      "actions": ["make-it-optional"]
    }
  }],
  "settings": {
    "confetti_on_submission": false,
    "use_captcha": false,
    "transparent_background": false
  }
}
```

**Características:**
- ✅ **Database-driven** com migrations bem estruturadas
- ✅ Separação: `properties` (fields) + `settings` + `seo_meta`
- ✅ **AI-generated forms** via `GenerateFormPrompt`
- ✅ **Template system** com JSON schemas em `resources/data/forms/templates/`
- ✅ **Composables Vue** para estrutura: `useFormStructure`, `useFormManager`
- ✅ **Field validation** com error_conditions customizadas
- ✅ **Form modes:** classic vs focused (presentation styles)

---

### 4. **n8n** (n8n-io/n8n)
- ⭐ **Stars:** 158,188
- 🔗 **URL:** https://github.com/n8n-io/n8n
- 📝 **Descrição:** Workflow automation platform with native AI
- 🏷️ **Tipo:** Workflow Engine (relevante para funnel logic)
- 💻 **Stack:** TypeScript, Node.js

**Características (insights aplicáveis):**
- ✅ **Node-based workflow** (similar a quiz steps/funnel stages)
- ✅ **JSON Schema** para cada node type
- ✅ **Conditional routing** bem estruturado
- ✅ **Variables system** com contexto global
- ✅ **Versioning** de workflows (similar a quiz versions)

---

### 5. **React JSONSchema Form** (rjsf-team/react-jsonschema-form)
- ⭐ **Stars:** 15,438
- 🔗 **URL:** https://github.com/rjsf-team/react-jsonschema-form
- 📝 **Descrição:** React component for building Web forms from JSON Schema
- 🏷️ **Tipo:** Form Generator
- 💻 **Stack:** TypeScript, React

**Estrutura:**
```json
{
  "title": "Contact Form",
  "type": "object",
  "required": ["firstName", "email"],
  "properties": {
    "firstName": {
      "type": "string",
      "title": "First Name"
    },
    "email": {
      "type": "string",
      "format": "email",
      "title": "Email"
    }
  }
}
```

**Características:**
- ✅ **JSON Schema standard** (RFC 7396)
- ✅ Separation of concerns: schema vs UI schema
- ✅ **Validation** integrada com ajv
- ✅ **Custom widgets** para tipos específicos

---

## 🆚 COMPARAÇÃO: Patterns vs Quiz Flow Pro Atual

### ✅ **O QUE ELES FAZEM BEM (E NÓS PODEMOS MELHORAR)**

| Pattern | Projetos | Quiz Flow Pro Atual | Melhoria Sugerida |
|---------|----------|---------------------|-------------------|
| **Single JSON file** | SurveyJS, Formbricks | ❌ Multiple files (v3, theme-quiz21.json) | ✅ Consolidar em 1 arquivo |
| **Zod/JSON Schema** | Formbricks, RJSF | ⚠️ TypeScript types only | ✅ Adicionar Zod schemas |
| **Jump Logic** | Formbricks, OpnForm | ❌ Hardcoded in components | ✅ JSON-based logic system |
| **i18n support** | Formbricks | ❌ No multilingual | ✅ Structured i18n |
| **Builder functions** | Formbricks | ❌ Manual JSON editing | ✅ Helper builders |
| **Templates** | All projects | ⚠️ Scattered examples | ✅ Centralized library |
| **Versioning** | n8n, OpnForm | ❌ No version control | ✅ Schema versions |

---

## 📐 PRINCIPAIS PATTERNS ENCONTRADOS

### 1. **Separação de Concerns**

**Best Practice (Formbricks):**
```typescript
{
  // METADATA
  "id": "survey-123",
  "name": "Customer Feedback",
  "type": "link",
  "status": "draft",
  
  // CONTENT
  "questions": [...],
  "endings": [...],
  
  // BEHAVIOR
  "logic": [...],
  "variables": [...],
  
  // SETTINGS
  "displayOption": "displayOnce",
  "styling": {...}
}
```

**Quiz Flow Pro Atual:**
```json
// ❌ Tudo misturado em v3.json + theme-quiz21.json
```

---

### 2. **Schema Validation**

**Best Practice (Formbricks):**
```typescript
// packages/types/surveys/types.ts
export const ZSurveyQuestion = z.object({
  id: ZSurveyQuestionId,
  type: z.string(),
  headline: ZI18nString,
  required: z.boolean(),
  logic: z.array(ZSurveyLogic).optional()
});
```

**Quiz Flow Pro Atual:**
```typescript
// ⚠️ Apenas TypeScript interfaces sem validation runtime
```

---

### 3. **Jump Logic Structure**

**Best Practice (Formbricks):**
```json
{
  "logic": [{
    "conditions": {
      "connector": "and",
      "conditions": [{
        "leftOperand": { "value": "q1", "type": "question" },
        "operator": "isLessThanOrEqual",
        "rightOperand": { "type": "static", "value": 3 }
      }]
    },
    "actions": [{
      "objective": "jumpToQuestion",
      "target": "q3"
    }]
  }]
}
```

**Quiz Flow Pro Atual:**
```typescript
// ❌ Lógica hardcoded nos componentes React
```

---

### 4. **i18n Support**

**Best Practice (Formbricks):**
```json
{
  "headline": {
    "default": "Rate us",
    "pt-BR": "Nos avalie",
    "es": "Califícanos"
  }
}
```

**Quiz Flow Pro Atual:**
```json
{
  "headline": "Rate us" // ❌ Single language only
}
```

---

### 5. **Builder Functions**

**Best Practice (Formbricks):**
```typescript
export const buildRatingQuestion = ({
  id = createId(),
  headline,
  required = false,
  range = 5,
  scale = "number",
  lowerLabel,
  upperLabel
}: BuildRatingQuestionParams) => ({
  id,
  type: "rating",
  headline: createI18nString(headline, []),
  required,
  range,
  scale,
  lowerLabel: createI18nString(lowerLabel, []),
  upperLabel: createI18nString(upperLabel, [])
});
```

**Quiz Flow Pro Atual:**
```typescript
// ❌ Manual JSON editing sem helpers
```

---

## 🎯 SUGESTÕES CONCRETAS PARA QUIZ FLOW PRO

### 1. **Consolidar JSONs** ✅ PRIORIDADE ALTA

**Problema Atual:**
- `v3.json` (19KB) - Quiz configuration
- `theme-quiz21.json` (7KB) - Theme + steps
- Duplicação de configs

**Solução (inspirado em SurveyJS + Formbricks):**
```json
// /templates/quiz21-single.json
{
  "version": "4.0",
  "metadata": {
    "id": "quiz21",
    "name": "21 Questions Quiz",
    "description": "Interactive quiz with 21 AI-powered questions",
    "author": "Quiz Flow Pro",
    "createdAt": "2025-11-23",
    "tags": ["quiz", "assessment", "21-steps"]
  },
  
  "theme": {
    "name": "quiz21",
    "colors": {
      "primary": "#3B82F6",
      "secondary": "#10B981"
    },
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Inter"
    }
  },
  
  "settings": {
    "displayMode": "single-page",
    "progressBar": true,
    "showTimer": false,
    "saveProgress": true,
    "allowSkip": false
  },
  
  "questions": [
    {
      "id": "q1",
      "type": "rating",
      "order": 1,
      "headline": { "default": "Rate your experience" },
      "required": true,
      "config": {
        "range": 5,
        "scale": "star"
      },
      "logic": [{
        "conditions": {
          "operator": "isLessThanOrEqual",
          "value": 3
        },
        "actions": {
          "type": "jump",
          "target": "q5"
        }
      }]
    }
  ],
  
  "endings": [{
    "id": "end-positive",
    "type": "success",
    "headline": { "default": "Thank you!" },
    "trigger": {
      "condition": "score >= 80"
    }
  }]
}
```

---

### 2. **Adicionar Zod Schemas** ✅ PRIORIDADE ALTA

**Criar arquivo:** `/schemas/quiz-schema.ts`

```typescript
import { z } from 'zod';

// i18n string
export const ZI18nString = z.union([
  z.string(),
  z.record(z.string(), z.string())
]);

// Logic conditions
export const ZLogicCondition = z.object({
  operator: z.enum(['equals', 'notEquals', 'contains', 'isLessThan', 'isGreaterThan']),
  value: z.union([z.string(), z.number(), z.boolean()])
});

export const ZLogicAction = z.object({
  type: z.enum(['jump', 'skip', 'show', 'hide']),
  target: z.string()
});

export const ZQuestionLogic = z.object({
  conditions: ZLogicCondition,
  actions: ZLogicAction
});

// Question types
export const ZBaseQuestion = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number(),
  headline: ZI18nString,
  subheader: ZI18nString.optional(),
  required: z.boolean(),
  logic: z.array(ZQuestionLogic).optional()
});

export const ZRatingQuestion = ZBaseQuestion.extend({
  type: z.literal('rating'),
  config: z.object({
    range: z.number().min(2).max(10),
    scale: z.enum(['number', 'star', 'smiley'])
  })
});

// Quiz structure
export const ZQuizSchema = z.object({
  version: z.string(),
  metadata: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
  }),
  theme: z.object({
    name: z.string(),
    colors: z.record(z.string())
  }),
  settings: z.object({
    displayMode: z.enum(['single-page', 'multi-page']),
    progressBar: z.boolean(),
    saveProgress: z.boolean()
  }),
  questions: z.array(z.union([ZRatingQuestion, /* outros tipos */])),
  endings: z.array(z.object({
    id: z.string(),
    type: z.enum(['success', 'failure', 'neutral']),
    headline: ZI18nString
  }))
});

export type QuizSchema = z.infer<typeof ZQuizSchema>;
```

---

### 3. **Builder Functions** ✅ PRIORIDADE MÉDIA

**Criar arquivo:** `/lib/quiz-builder.ts`

```typescript
import { createId } from '@paralleldrive/cuid2';

export const buildRatingQuestion = (options: {
  headline: string;
  required?: boolean;
  range?: number;
  scale?: 'number' | 'star' | 'smiley';
}) => ({
  id: createId(),
  type: 'rating',
  headline: { default: options.headline },
  required: options.required ?? false,
  config: {
    range: options.range ?? 5,
    scale: options.scale ?? 'star'
  }
});

export const buildMultipleChoiceQuestion = (options: {
  headline: string;
  choices: string[];
  allowMultiple?: boolean;
}) => ({
  id: createId(),
  type: 'multiple-choice',
  headline: { default: options.headline },
  config: {
    choices: options.choices.map(c => ({ id: createId(), label: { default: c } })),
    allowMultiple: options.allowMultiple ?? false
  }
});

// Usage:
const quiz = {
  questions: [
    buildRatingQuestion({
      headline: "Rate your experience",
      range: 5,
      scale: "star"
    }),
    buildMultipleChoiceQuestion({
      headline: "What's your favorite color?",
      choices: ["Red", "Blue", "Green"]
    })
  ]
};
```

---

### 4. **Jump Logic System** ✅ PRIORIDADE ALTA

**Criar arquivo:** `/lib/logic-engine.ts`

```typescript
type LogicCondition = {
  operator: 'equals' | 'notEquals' | 'contains' | 'isLessThan' | 'isGreaterThan';
  value: string | number | boolean;
};

type LogicAction = {
  type: 'jump' | 'skip' | 'show' | 'hide';
  target: string;
};

export class LogicEngine {
  evaluateCondition(
    questionValue: any,
    condition: LogicCondition
  ): boolean {
    switch (condition.operator) {
      case 'equals':
        return questionValue === condition.value;
      case 'isLessThan':
        return questionValue < condition.value;
      case 'isGreaterThan':
        return questionValue > condition.value;
      case 'contains':
        return String(questionValue).includes(String(condition.value));
      default:
        return false;
    }
  }

  executeAction(
    action: LogicAction,
    currentQuestionId: string,
    allQuestions: any[]
  ): string | null {
    if (action.type === 'jump') {
      return action.target;
    }
    // Implementar outros tipos...
    return null;
  }
}

// Usage in component:
const logicEngine = new LogicEngine();
const nextQuestionId = logicEngine.executeAction(
  question.logic[0].actions,
  currentQuestionId,
  allQuestions
);
```

---

### 5. **Template Library** ✅ PRIORIDADE MÉDIA

**Estrutura de diretórios:**
```
/templates/
├── index.ts                 # Exports all templates
├── quiz21-single.json       # Main quiz template
├── onboarding.json          # Onboarding template
├── assessment.json          # Assessment template
└── custom/
    ├── marketing-quiz.json
    └── product-feedback.json
```

**Template Index:**
```typescript
// /templates/index.ts
import quiz21 from './quiz21-single.json';
import onboarding from './onboarding.json';

export const templates = {
  'quiz21': quiz21,
  'onboarding': onboarding,
  // ...
};

export type TemplateId = keyof typeof templates;

export const getTemplate = (id: TemplateId) => templates[id];
```

---

## 📊 COMPARAÇÃO: File Structure

### SurveyJS (Best Practice)
```
survey-library/
├── src/
│   ├── survey.ts           # Main model
│   ├── jsonobject.ts       # Serialization
│   ├── question.ts         # Base question
│   └── defaultCss/         # Theme system
└── tests/
    └── jsonobjecttests.ts
```

### Formbricks (Best Practice)
```
formbricks/
├── packages/types/
│   └── surveys/
│       └── types.ts        # Zod schemas
├── apps/web/
│   ├── app/lib/
│   │   ├── templates.ts    # 3600+ lines!
│   │   └── survey-builder.ts
│   └── modules/survey/
│       └── lib/
│           └── questions.tsx
```

### OpnForm (Best Practice)
```
opnform/
├── api/
│   ├── app/Models/Template.php
│   └── database/migrations/
│       └── *_create_forms_table.php
├── client/
│   ├── composables/
│   │   └── forms/
│   │       ├── useFormStructure.js
│   │       └── useFormManager.js
│   └── lib/forms/
│       └── composables/
```

### Quiz Flow Pro (Atual - Necessita Melhoria)
```
quiz-flow-pro/
├── templates/
│   ├── v3.json             # ❌ Scattered
│   └── theme-quiz21.json   # ❌ Scattered
├── src/
│   └── lib/
│       └── quiz/           # ⚠️ No structured lib
```

**Proposta Nova:**
```
quiz-flow-pro/
├── schemas/
│   ├── quiz-schema.ts      # ✅ Zod validation
│   └── types.ts            # ✅ TypeScript types
├── lib/
│   ├── quiz-builder.ts     # ✅ Builder functions
│   ├── logic-engine.ts     # ✅ Jump logic
│   └── validators/
│       └── schema-validator.ts
├── templates/
│   ├── index.ts            # ✅ Centralized export
│   ├── quiz21.json         # ✅ Single consolidated file
│   └── custom/
└── tests/
    └── schemas/
        └── quiz-schema.test.ts
```

---

## 🎯 PRÓXIMOS PASSOS RECOMENDADOS

### FASE 1: Consolidação (Semana 1)
1. ✅ Mesclar `v3.json` + `theme-quiz21.json` → `quiz21.json`
2. ✅ Criar `/schemas/quiz-schema.ts` com Zod
3. ✅ Adicionar validation no load time

### FASE 2: Logic System (Semana 2)
1. ✅ Implementar `LogicEngine` class
2. ✅ Adicionar jump logic ao JSON schema
3. ✅ Testar conditional navigation

### FASE 3: Builder Functions (Semana 3)
1. ✅ Criar `/lib/quiz-builder.ts`
2. ✅ Migrar templates para usar builders
3. ✅ Documentar API

### FASE 4: i18n (Semana 4)
1. ✅ Adicionar suporte a `{ default: "text", "pt-BR": "texto" }`
2. ✅ Criar helper functions para i18n strings
3. ✅ Migrar conteúdo existente

---

## 📚 RECURSOS ÚTEIS

### Documentação dos Projetos
- [SurveyJS JSON Schema](https://surveyjs.io/Documentation/Library?id=design-survey-create-a-simple-survey)
- [Formbricks Type System](https://github.com/formbricks/formbricks/tree/main/packages/types)
- [OpnForm API Docs](https://github.com/OpnForm/OpnForm/tree/main/api)
- [JSON Schema Standard](https://json-schema.org/)
- [Zod Documentation](https://zod.dev/)

### Exemplos de JSON Schemas
- SurveyJS: `/packages/survey-core/tests/jsonobjecttests.ts`
- Formbricks: `/packages/types/surveys/types.ts`
- OpnForm: `/api/app/Models/Template.php`

---

## 💡 CONCLUSÕES

### ✅ Pontos Fortes dos Projetos Analisados
1. **Single JSON file** (SurveyJS) - Simplicidade
2. **Zod validation** (Formbricks) - Type safety
3. **Jump logic** (Formbricks, OpnForm) - Flexibilidade
4. **Builder functions** (Formbricks) - DX melhorado
5. **Template library** (Todos) - Reutilização

### ⚠️ Pontos de Atenção Quiz Flow Pro
1. ❌ **Multiple JSON files** - Confuso
2. ❌ **No runtime validation** - Erros tardios
3. ❌ **Hardcoded logic** - Inflexível
4. ❌ **No i18n** - Limitado a EN
5. ❌ **Manual JSON editing** - DX ruim

### 🚀 Melhorias Imediatas Recomendadas
1. **Consolidar JSONs** - Criar `quiz21.json` único
2. **Adicionar Zod** - Schema validation
3. **Logic Engine** - JSON-based jump logic
4. **Builder Functions** - Helper API
5. **i18n Support** - Multilingual ready

---

**Relatório Gerado:** 23/11/2025  
**Autor:** GitHub Copilot AI  
**Próxima Revisão:** Após implementação Fase 1
