# 🎯 Análise: Transformar Componentes de Steps em Blocos JSON Editáveis

**Data:** 24 de outubro de 2025  
**Objetivo:** Mapear estrutura modular existente para JSON v3 editável no `/editor`

---

## ✅ Componentes Modulares Existentes

### 1. **ModularQuestionStep** ❓
**Arquivo:** `src/components/editor/quiz-estilo/ModularQuestionStep.tsx`

**Componentes atômicos identificados:**
- Barra de progresso (`progress-inline`)
- Número da pergunta (`heading-inline` com `questionNumber`)
- Texto da pergunta (`text-inline` com `questionText`)
- Grid de opções (`options-grid`)
- Botão de ação (`button-inline`)

**Props editáveis:**
```typescript
{
  questionNumber: string,      // "Pergunta 1 de 10"
  questionText: string,         // Pergunta principal
  requiredSelections: number,   // 1 ou 3
  options: Array<{
    id: string,
    text: string,
    image?: string
  }>
}
```

**Estrutura JSON v3:**
```json
{
  "type": "question",
  "sections": [
    {
      "type": "progress-inline",
      "id": "step-02-progress",
      "content": { "value": 10, "max": 100 },
      "position": 0
    },
    {
      "type": "heading-inline",
      "id": "step-02-title",
      "content": { "text": "Pergunta 1 de 10" },
      "position": 1
    },
    {
      "type": "text-inline",
      "id": "step-02-question",
      "content": { "text": "Qual é a sua preferência?" },
      "position": 2
    },
    {
      "type": "options-grid",
      "id": "step-02-options",
      "content": {
        "options": [
          { "id": "opt1", "text": "Natural", "image": "/quiz-assets/natural.webp" }
        ],
        "columns": 2,
        "multipleSelection": true,
        "minSelections": 3,
        "maxSelections": 3,
        "showImages": true
      },
      "position": 3
    },
    {
      "type": "button-inline",
      "id": "step-02-cta",
      "content": { "buttonText": "Continuar", "buttonUrl": "#next" },
      "position": 4
    }
  ]
}
```

---

### 2. **ModularStrategicQuestionStep** 🎯
**Arquivo:** `src/components/editor/quiz-estilo/ModularStrategicQuestionStep.tsx`

**Diferença para QuestionStep:**
- Mesma estrutura base
- Lógica de navegação condicional (`skipTo`)
- Pesos/scores nas opções

**Estrutura JSON v3:**
```json
{
  "type": "strategic-question",
  "sections": [
    {
      "type": "heading-inline",
      "id": "step-13-title",
      "content": { "text": "Pergunta Estratégica 1" }
    },
    {
      "type": "options-grid",
      "id": "step-13-options",
      "content": {
        "options": [
          { 
            "id": "opt1", 
            "text": "Opção A",
            "scoreValues": { "natural": 5, "classico": 2 }
          }
        ]
      }
    }
  ],
  "logic": {
    "skipTo": {
      "opt1": "step-15",
      "opt2": "step-14"
    }
  }
}
```

---

### 3. **ModularTransitionStep** ⏳
**Arquivo:** `src/components/editor/quiz-estilo/ModularTransitionStep.tsx`

**Componentes atômicos:**
- Título de transição (`transition-title` / `heading-inline`)
- Imagem opcional (`transition-image` / `image-inline`)
- Texto de progresso (`transition-text` / `text-inline`)

**Props editáveis:**
```typescript
{
  title: string,
  subtitle?: string,
  image?: string,
  autoAdvanceDelay: number  // ms
}
```

**Estrutura JSON v3:**
```json
{
  "type": "transition",
  "sections": [
    {
      "type": "heading-inline",
      "id": "step-12-title",
      "content": { "text": "Analisando suas respostas..." },
      "position": 0
    },
    {
      "type": "image-inline",
      "id": "step-12-image",
      "content": { "url": "/assets/loading-animation.gif" },
      "position": 1
    },
    {
      "type": "text-inline",
      "id": "step-12-text",
      "content": { "text": "Aguarde um momento..." },
      "position": 2
    }
  ],
  "navigation": {
    "autoAdvanceDelay": 3000
  }
}
```

---

### 4. **ModularResultStep** 🏆
**Arquivo:** `src/components/editor/quiz-estilo/ModularResultStep.tsx`

**Componentes atômicos:**
- Congratulações (`result-congrats` / `heading-inline`)
- Nome do estilo (`result-main` / `text-inline`)
- Imagem do resultado (`result-image` / `image-inline`)
- Descrição (`result-description` / `text-inline`)
- Barras de progresso (`result-progress-bars`)
- Características (`result-characteristics`)
- Estilos secundários (`result-secondary-styles`)
- CTA final (`result-cta` / `button-inline`)

**Props editáveis (injeção dinâmica):**
```typescript
{
  userProfile: {
    userName: string,          // → {userName}
    resultStyle: string,       // → {resultStyle}
    secondaryStyles: string[],
    scores: Array<{
      name: string,
      score: number
    }>
  }
}
```

**Estrutura JSON v3:**
```json
{
  "type": "result",
  "sections": [
    {
      "type": "heading-inline",
      "id": "step-20-congrats",
      "content": { "text": "Parabéns, {userName}!" },
      "position": 0
    },
    {
      "type": "text-inline",
      "id": "step-20-result",
      "content": { "text": "Seu estilo é: {resultStyle}" },
      "position": 1
    },
    {
      "type": "image-inline",
      "id": "step-20-image",
      "content": { "url": "/styles/{resultStyle}.jpg" },
      "position": 2
    },
    {
      "type": "text-inline",
      "id": "step-20-description",
      "content": { "text": "Descrição do estilo {resultStyle}..." },
      "position": 3
    },
    {
      "type": "result-progress-bars",
      "id": "step-20-scores",
      "content": { "scores": [] },
      "position": 4
    },
    {
      "type": "result-secondary-styles",
      "id": "step-20-secondary",
      "content": { "styles": [] },
      "position": 5
    },
    {
      "type": "button-inline",
      "id": "step-20-cta",
      "content": { 
        "buttonText": "Ver Consultoria Personalizada",
        "buttonUrl": "/step-21"
      },
      "position": 6
    }
  ]
}
```

---

### 5. **ModularOfferStep** 💎
**Arquivo:** `src/components/editor/quiz-estilo/ModularOfferStep.tsx`

**Componentes atômicos:**
- Título da oferta (`heading-inline`)
- Subtítulo (`text-inline`)
- Imagem do produto (`image-inline`)
- Lista de benefícios (`benefits` / múltiplos `text-inline`)
- Preço (`pricing-card-inline`)
- CTA de compra (`button-inline`)
- Garantia (`guarantee` / `text-inline`)

**Estrutura JSON v3:**
```json
{
  "type": "offer",
  "sections": [
    {
      "type": "heading-inline",
      "id": "step-21-title",
      "content": { "text": "Consultoria Personalizada de Estilo" }
    },
    {
      "type": "image-inline",
      "id": "step-21-product",
      "content": { "url": "/products/consultoria.jpg" }
    },
    {
      "type": "text-inline",
      "id": "step-21-benefit-1",
      "content": { "text": "✓ Análise completa do seu guarda-roupa" }
    },
    {
      "type": "pricing-card-inline",
      "id": "step-21-pricing",
      "content": { 
        "price": "497",
        "currency": "R$",
        "period": "único"
      }
    },
    {
      "type": "button-inline",
      "id": "step-21-cta",
      "content": { 
        "buttonText": "Começar Agora",
        "buttonUrl": "/checkout"
      }
    },
    {
      "type": "text-inline",
      "id": "step-21-guarantee",
      "content": { "text": "🔒 Garantia de 30 dias" }
    }
  ]
}
```

---

## 🧩 Componentes Auxiliares (já modulares)

### **QuizProgress** 📊
- **Tipo de bloco:** `progress-inline`
- **Props:** `{ value: number, max: number, label?: string }`

### **QuizOption** ☑️
- **Tipo de bloco:** parte de `options-grid`
- **Props:** `{ id, text, image?, selected, onClick }`

### **QuizNavigation** ⬅️➡️
- **Tipo de bloco:** `button-inline` (prev/next)
- **Props:** `{ onPrev?, onNext?, canProceed }`

### **QuizHeader** 📝
- **Tipo de bloco:** `header` ou `heading-inline`
- **Props:** `{ title, subtitle? }`

---

## 📦 Tipos de Blocos Existentes no Editor

**Verificados em:** `src/types/editor.ts`

### ✅ Blocos já disponíveis:
- `heading-inline`
- `text-inline`
- `image-inline`
- `button-inline`
- `options-grid`
- `progress-inline`
- `result-congrats`
- `result-main`
- `result-image`
- `result-description`
- `result-progress-bars`
- `result-secondary-styles`
- `result-cta`
- `pricing-card-inline`

### ⚠️ Blocos que podem precisar de ajustes:
- `quiz-navigation` → Usar `button-inline` com navegação customizada
- `quiz-header` → Usar `heading-inline` + `text-inline`
- `testimonial-card-inline` → Já existe
- `guarantee` → Usar `text-inline` com ícone

---

## 🎯 Mapeamento Completo: Componente → JSON v3

| Componente React | Tipo de Step | Sections (blocos atômicos) | Status |
|-----------------|--------------|---------------------------|--------|
| `ModularQuestionStep` | `question` | `progress-inline`, `heading-inline`, `text-inline`, `options-grid`, `button-inline` | ✅ Pronto |
| `ModularStrategicQuestionStep` | `strategic-question` | Idem + lógica `skipTo` | ✅ Pronto |
| `ModularTransitionStep` | `transition` | `heading-inline`, `image-inline`, `text-inline` | ✅ Pronto |
| `ModularResultStep` | `result` | `result-congrats`, `result-main`, `result-image`, `result-description`, `result-progress-bars`, `result-secondary-styles`, `button-inline` | ✅ Pronto |
| `ModularOfferStep` | `offer` | `heading-inline`, `image-inline`, `text-inline` (benefits), `pricing-card-inline`, `button-inline`, `text-inline` (guarantee) | ✅ Pronto |

---

## 🔧 Processo de Conversão para JSON Editável

### 1. **Estrutura Base do Step:**
```json
{
  "templateVersion": "3.0",
  "metadata": {
    "id": "step-XX",
    "name": "Nome do Step",
    "category": "question|transition|result|offer",
    "version": "3.0.0"
  },
  "theme": { /* cores, fontes */ },
  "sections": [ /* blocos atômicos */ ],
  "validation": { /* regras */ },
  "behavior": { /* autoAdvance, etc */ },
  "navigation": { /* nextStep, skipTo */ }
}
```

### 2. **Converter Propriedades do Componente:**

**Exemplo: QuestionStep**
```tsx
// Props do componente
{
  questionNumber: "Pergunta 1 de 10",
  questionText: "Qual sua preferência?",
  options: [...]
}
```

**↓ Transforma em:**
```json
{
  "sections": [
    {
      "type": "heading-inline",
      "content": { "text": "Pergunta 1 de 10" }
    },
    {
      "type": "text-inline",
      "content": { "text": "Qual sua preferência?" }
    },
    {
      "type": "options-grid",
      "content": { "options": [...] }
    }
  ]
}
```

### 3. **Garantir Reordenação:**
- Cada section tem `position` (0, 1, 2...)
- Drag-and-drop muda o `position`
- `onBlocksReorder` persiste a nova ordem

### 4. **Garantir Inserção:**
- Adicionar nova section via editor
- Novo bloco recebe `position` baseado na inserção
- `addBlockAtIndex` do editor insere no array

---

## 🚀 Como Usar no /editor

### Passos:

1. **Carregar o master JSON v3:**
   - Já existe em `public/templates/quiz21-complete.json`
   - Todos os 21 steps presentes e validados ✅

2. **Abrir o editor:**
   ```
   http://localhost:5173/editor?template=quiz21StepsComplete
   ```

3. **Selecionar um step (ex: step-02):**
   - O `TemplateLoader` carrega as sections do JSON
   - Cada section vira um bloco no canvas

4. **Editar propriedades:**
   - Clicar no bloco abre o painel de propriedades
   - Editar `content.text`, `content.buttonText`, etc.

5. **Reordenar blocos:**
   - Drag-and-drop no canvas
   - Nova ordem persiste no JSON

6. **Inserir novos blocos:**
   - Arrastar da biblioteca de componentes
   - Drop entre blocos existentes
   - Novo bloco salvo nas sections

---

## ✅ Próximos Passos

1. **Validar no runtime:**
   - Reiniciar dev server com `.env.local`
   - Abrir `/editor?template=quiz21StepsComplete`
   - Testar reordenação e inserção no step-01

2. **Estender atomização:**
   - Steps 02-11 já têm sections no JSON ✅
   - Steps 12-21 também ✅
   - Validar que cada section tem `type`, `id`, `content`

3. **Documentar fluxo de edição:**
   - Canvas → Painel de Propriedades → Save
   - Persistência: JSON → Cache → Editor State

4. **Testar preview:**
   - Modo preview usa mesmas sections
   - Sem drag-and-drop, apenas renderização

---

## 📋 Resumo

✅ **Todos os componentes modulares já existem:**
- ModularQuestionStep
- ModularStrategicQuestionStep
- ModularTransitionStep
- ModularResultStep
- ModularOfferStep

✅ **Estrutura JSON v3 já está pronta:**
- `quiz21-complete.json` tem todos os 21 steps
- Cada step tem `sections` com blocos atômicos
- Validador confirma: 21/21 steps presentes ✅

✅ **Editor já suporta:**
- Drag-and-drop de blocos (@dnd-kit)
- Painel de propriedades editável
- Persistência via EditorProvider
- Mapeamento automático de types

🎯 **Falta apenas:**
- Reiniciar servidor para aplicar `.env.local`
- Validar visualmente no `/editor`
- Confirmar que `VITE_USE_MASTER_JSON=true` está ativo

---

**Conclusão:** A infraestrutura completa já está implementada. Basta validar no runtime.
