# 📐 Estrutura de Funil para ModernQuizEditor

## 🎯 Schema Principal

Para ser **editável no `/editor`**, o funil deve seguir o schema `QuizSchemaZ` definido em `@/schemas/quiz-schema.zod.ts`.

---

## 📋 Estrutura Completa

```typescript
{
  // Versionamento obrigatório
  "version": "1.0.0",           // Semver: x.y.z
  "schemaVersion": "4.0",        // Schema do editor
  
  // Metadados obrigatórios
  "metadata": {
    "id": "quiz-fashion-style",
    "title": "Quiz de Estilo Fashion",
    "description": "Descubra seu estilo pessoal",
    "slug": "fashion-style-quiz",
    "author": "Nome do Autor",
    "category": "fashion",
    "tags": ["moda", "estilo", "personalidade"],
    "language": "pt-BR",
    "status": "draft",           // draft | published | archived
    "createdAt": "2025-11-30T00:00:00.000Z",
    "updatedAt": "2025-11-30T00:00:00.000Z",
    "funnelId": "funnel-123"     // Opcional
  },
  
  // Tema visual
  "theme": {
    "colors": {
      "primary": "#432818",
      "primaryHover": "#5A3624",
      "primaryLight": "#E8DFD8",
      "secondary": "#7F6A5A",
      "background": "#FFFFFF",
      "text": "#1F2937",
      "border": "#E5E7EB"
    },
    "fonts": {
      "heading": "Playfair Display",
      "body": "Inter"
    },
    "spacing": {
      "xs": 4,
      "sm": 8,
      "md": 16,
      "lg": 24,
      "xl": 32
    },
    "borderRadius": {
      "sm": 4,
      "md": 8,
      "lg": 12
    }
  },
  
  // Configurações do quiz
  "settings": {
    "scoring": {
      "enabled": true,
      "method": "weighted",      // sum | weighted | majority | category-points
      "categories": ["classico", "moderno", "boho"],
      "weights": {
        "p1": 1.5,
        "p2": 1.0
      },
      "tieBreak": "natural-first"
    },
    "navigation": {
      "allowBack": false,
      "autoAdvance": true,
      "showProgress": true,
      "delayMs": 500
    },
    "validation": {
      "required": true,
      "strictMode": true
    },
    "completion": {
      "redirectUrl": "https://exemplo.com/obrigado",
      "showSummary": true,
      "saveResponses": true
    }
  },
  
  // Steps do funil (array obrigatório, mínimo 1)
  "steps": [
    // Ver seção "Estrutura de Step" abaixo
  ],
  
  // Configuração de resultados (opcional)
  "results": {
    "styles": [
      {
        "id": "classico",
        "name": "Clássico Elegante",
        "description": "Você aprecia peças atemporais...",
        "image": "https://exemplo.com/classico.jpg",
        "minScore": 0,
        "maxScore": 33,
        "recommendations": ["blazer", "alfaiataria"],
        "colors": ["#2C3E50", "#ECF0F1"]
      }
    ],
    "categories": ["classico", "moderno", "boho"],
    "defaultResult": "classico"
  },
  
  // Biblioteca de blocos reutilizáveis (opcional)
  "blockLibrary": {
    "header-padrao": {
      "template": {...},
      "metadata": {
        "name": "Header Padrão",
        "category": "headers",
        "tags": ["intro"]
      }
    }
  }
}
```

---

## 🧩 Estrutura de Step

Cada step no array `steps` deve seguir:

```typescript
{
  // ID obrigatório no formato step-XX (dois dígitos)
  "id": "step-01",
  
  // Tipo do step
  "type": "intro",  // intro | question | strategic-question | transition | result | offer
  
  // Ordem (1-50)
  "order": 1,
  
  // Título (opcional)
  "title": "Bem-vindo",
  
  // Blocos (mínimo 1)
  "blocks": [
    // Ver seção "Estrutura de Block" abaixo
  ],
  
  // Navegação OBRIGATÓRIA (formato nested)
  "navigation": {
    "nextStep": "step-02",  // ou null para último step
    "conditions": [         // Opcional: navegação condicional
      {
        "id": "cond-1",
        "if": {
          "operator": "equals",
          "field": "selectedOption",
          "value": "opt1"
        },
        "then": {
          "action": "goto",
          "target": "step-05"
        }
      }
    ]
  },
  
  // Validação (opcional)
  "validation": {
    "required": true,
    "rules": {
      "minSelections": {
        "minItems": 1,
        "errorMessage": "Selecione pelo menos 1 opção"
      }
    }
  },
  
  // Versionamento (opcional - usado para optimistic locking)
  "version": 1,
  "lastModified": "2025-11-30T00:00:00.000Z"
}
```

### ⚠️ IMPORTANTE: Formato de Navegação

❌ **ERRADO** (formato antigo):
```typescript
{
  "id": "step-01",
  "nextStep": "step-02"  // ❌ Não funciona!
}
```

✅ **CORRETO** (formato novo):
```typescript
{
  "id": "step-01",
  "navigation": {
    "nextStep": "step-02"  // ✅ Nested!
  }
}
```

---

## 🧱 Estrutura de Block

Cada block no array `blocks` de um step:

```typescript
{
  // ID único do bloco
  "id": "b1-heading",
  
  // Tipo do bloco (100+ tipos disponíveis)
  "type": "heading",  // heading | text | button | quiz-options | form-input | image...
  
  // Ordem de exibição
  "order": 1,
  
  // Propriedades específicas do tipo
  "properties": {
    "level": 1,           // Para heading: 1-6
    "textAlign": "center",
    "color": "#432818",
    "fontSize": 32
  },
  
  // Conteúdo do bloco
  "content": {
    "text": "Descubra seu estilo pessoal"
  },
  
  // Hierarquia (opcional)
  "parentId": null,  // ID do bloco pai, ou null
  
  // Metadados de edição
  "metadata": {
    "component": "HeadingBlock",
    "editable": true,
    "reorderable": true,
    "reusable": true,
    "deletable": true
  },
  
  // Regras de cálculo (opcional - para scoring)
  "calculationRule": {
    "weight": 1.5,
    "pointsMap": {
      "opt1": 10,
      "opt2": 5
    },
    "numericScale": {
      "mul": 2,
      "min": 0,
      "max": 100
    }
  }
}
```

---

## 📦 Tipos de Blocos Disponíveis

### Navigation & Progress
- `question-progress` - Barra de progresso
- `question-navigation` - Botões voltar/avançar

### Intro
- `intro-logo`, `intro-logo-header`
- `intro-title`, `intro-subtitle`, `intro-description`
- `intro-image`, `intro-form`, `intro-button`
- `quiz-intro-header`

### Question
- `question-title`, `question-description`
- `options-grid` - Grid de opções
- `form-input` - Input de formulário
- `question-hero` - Hero image
- `CTAButton` - Call to action

### Transition
- `transition-title`, `transition-text`, `transition-button`
- `transition-image`, `transition-hero`

### Result
- `result-header`, `result-title`, `result-description`
- `result-image`, `result-display`
- `result-guide-image`, `result-congrats`
- `quiz-score-display`, `result-main`
- `result-progress-bars`, `result-secondary-styles`
- `result-cta`, `result-share`

### Offer
- `offer-hero`, `quiz-offer-hero`, `offer-card`
- `benefits-list`, `testimonials`, `pricing`
- `guarantee`, `urgency-timer`, `value-anchoring`
- `secure-purchase`, `cta-button`

### Generic
- `text`, `text-inline`, `heading`, `image`, `button`
- `container`, `spacer`, `divider`, `footer-copyright`

---

## 💡 Exemplos Práticos

### Exemplo 1: Step de Intro Simples

```json
{
  "id": "step-01",
  "type": "intro",
  "order": 1,
  "title": "Bem-vindo",
  "blocks": [
    {
      "id": "b1-heading",
      "type": "heading",
      "order": 1,
      "properties": { "level": 1, "textAlign": "center" },
      "content": { "text": "Descubra seu estilo" },
      "parentId": null,
      "metadata": { "editable": true }
    },
    {
      "id": "b1-text",
      "type": "text",
      "order": 2,
      "properties": { "textAlign": "center" },
      "content": { "text": "Responda 10 perguntas rápidas" },
      "parentId": null,
      "metadata": { "editable": true }
    },
    {
      "id": "b1-button",
      "type": "button",
      "order": 3,
      "properties": { "action": "next-step" },
      "content": { "text": "Começar" },
      "parentId": null,
      "metadata": { "editable": true }
    }
  ],
  "navigation": {
    "nextStep": "step-02"
  }
}
```

### Exemplo 2: Step de Pergunta com Opções

```json
{
  "id": "step-02",
  "type": "question",
  "order": 2,
  "title": "Primeira Pergunta",
  "blocks": [
    {
      "id": "b2-title",
      "type": "question-title",
      "order": 1,
      "properties": {},
      "content": { "text": "Qual seu estilo preferido?" },
      "parentId": null,
      "metadata": { "editable": true }
    },
    {
      "id": "b2-options",
      "type": "options-grid",
      "order": 2,
      "properties": {
        "multiSelect": false,
        "requiredSelections": 1,
        "maxSelections": 1,
        "autoAdvance": true,
        "showImages": true,
        "layout": "grid-2"
      },
      "content": {
        "options": [
          {
            "id": "opt1",
            "text": "Clássico",
            "image": "https://placehold.co/320x200",
            "value": "classico"
          },
          {
            "id": "opt2",
            "text": "Moderno",
            "image": "https://placehold.co/320x200",
            "value": "moderno"
          }
        ]
      },
      "parentId": null,
      "metadata": { "editable": true },
      "calculationRule": {
        "weight": 1.0,
        "pointsMap": {
          "opt1": 10,
          "opt2": 8
        }
      }
    }
  ],
  "navigation": {
    "nextStep": "step-03"
  },
  "validation": {
    "required": true,
    "rules": {
      "minSelections": {
        "minItems": 1,
        "errorMessage": "Selecione uma opção"
      }
    }
  }
}
```

### Exemplo 3: Step de Resultado

```json
{
  "id": "step-20",
  "type": "result",
  "order": 20,
  "title": "Seu Resultado",
  "blocks": [
    {
      "id": "b20-header",
      "type": "result-header",
      "order": 1,
      "properties": {},
      "content": { "text": "Seu estilo é:" },
      "parentId": null,
      "metadata": { "editable": true }
    },
    {
      "id": "b20-display",
      "type": "result-display",
      "order": 2,
      "properties": {
        "showScore": true,
        "showPercentage": true,
        "showCategories": true
      },
      "content": {},
      "parentId": null,
      "metadata": { "editable": true }
    },
    {
      "id": "b20-cta",
      "type": "cta-button",
      "order": 3,
      "properties": {
        "action": "open-url",
        "url": "https://exemplo.com/produto"
      },
      "content": { "text": "Ver Recomendações" },
      "parentId": null,
      "metadata": { "editable": true }
    }
  ],
  "navigation": {
    "nextStep": null
  }
}
```

---

## ✅ Checklist de Validação

Antes de carregar no editor, verifique:

- [ ] `version` e `schemaVersion` presentes
- [ ] `metadata.id`, `metadata.title` preenchidos
- [ ] `theme.colors` tem todas cores obrigatórias em formato hex
- [ ] `theme.fonts.heading` e `theme.fonts.body` definidas
- [ ] `settings.scoring.method` é válido
- [ ] Cada `step.id` segue formato `step-XX` (dois dígitos)
- [ ] Cada step tem `navigation: { nextStep: ... }` (nested!)
- [ ] Cada step tem pelo menos 1 block
- [ ] Cada `block.id` é único dentro do step
- [ ] Cada block tem `type`, `order`, `properties`, `metadata`
- [ ] Último step tem `navigation: { nextStep: null }`

---

## 🛠️ Como Criar um Funil

### Opção 1: Usar o Editor (Recomendado)

1. Acesse `/editor`
2. Crie um novo quiz
3. Adicione steps e blocos visualmente
4. Exporte o JSON via botão "Salvar"

### Opção 2: Criar JSON Manualmente

1. Copie a estrutura completa acima
2. Preencha com seus dados
3. Valide com `QuizSchemaZ.parse(seuJson)`
4. Importe no editor via "Carregar" snapshot

### Opção 3: Migrar Template Antigo

Se você tem um template como `fashionStyle21PtBR.ts`:

1. Converta `nextStep` → `navigation: { nextStep }`
2. Mude IDs de `step-1` → `step-01`
3. Adicione campos obrigatórios (`version`, `schemaVersion`, `metadata.title`)
4. Ajuste tipos de blocos para os novos nomes
5. Valide com Zod antes de usar

---

## 🔍 Ferramentas de Validação

```typescript
import { QuizSchemaZ } from '@/schemas/quiz-schema.zod';

// Validar funil completo
const resultado = QuizSchemaZ.safeParse(seuJson);

if (resultado.success) {
  console.log('✅ Funil válido!', resultado.data);
} else {
  console.error('❌ Erros:', resultado.error.errors);
}
```

---

## 📚 Referências

- Schema completo: `src/schemas/quiz-schema.zod.ts`
- Store do editor: `src/components/editor/ModernQuizEditor/store/quizStore.ts`
- Exemplos de JSONs: `data/saved-quizzes/`
- Editor: `/editor` (rota principal)

---

**Última atualização:** 30/11/2025
