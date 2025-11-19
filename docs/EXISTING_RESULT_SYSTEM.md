# 🧮 Sistema de Resultados Existente - Documentação

## 📋 Visão Geral

O sistema atual usa **duas lógicas complementares** para cálculo de resultados:

1. **ResultEngine** - Baseado em prefixos de opções
2. **computeResult** - Baseado em pesos por questão

Ambas as lógicas foram **preservadas e integradas** no novo sistema flexível.

---

## 🎯 Lógica 1: ResultEngine (Prefixos)

### Como Funciona

As opções usam **prefixos** que identificam o estilo:
- `natural_confortavel` → Estilo **Natural**
- `classico_elegante` → Estilo **Clássico**
- `contemporaneo_moderno` → Estilo **Contemporâneo**

### Estilos Disponíveis

```typescript
{
  natural: 'Natural',
  classico: 'Clássico',
  contemporâneo: 'Contemporâneo',
  elegante: 'Elegante',
  romantico: 'Romântico',
  sexy: 'Sexy',
  dramatico: 'Dramático',
  criativo: 'Criativo'
}
```

### Estrutura de Questão

```json
{
  "id": "step-02",
  "type": "question",
  "blocks": [
    {
      "type": "question-single",
      "content": {
        "question": "Qual seu estilo?",
        "options": [
          {
            "id": "natural_confortavel",
            "text": "Confortável"
          },
          {
            "id": "classico_elegante",
            "text": "Elegante"
          }
        ]
      }
    }
  ]
}
```

### Cálculo

```typescript
// Cada seleção adiciona 1 ponto ao estilo
natural_confortavel → Natural +1
classico_elegante → Clássico +1

// Com peso de questão:
natural_confortavel (weight=2) → Natural +2
```

### Uso

```typescript
import { ResultEngine } from '@/services/core/ResultEngine';

const { scores, total } = ResultEngine.computeScoresFromSelections(
  answers,
  { weightQuestions: 1 }
);

const payload = ResultEngine.toPayload(scores, total, userName);
```

---

## 🎯 Lógica 2: computeResult (Pesos)

### Como Funciona

Usa **pesos por questão** definidos no metadata:

```json
{
  "id": "step-02",
  "type": "question",
  "metadata": {
    "scoring": {
      "weight": 1.5
    }
  }
}
```

### Estrutura Completa

```json
{
  "id": "step-02",
  "type": "question",
  "blocks": [...],
  "metadata": {
    "scoring": {
      "weight": 1.5
    }
  }
}
```

### Cálculo

```typescript
// Pontuação base por opção: 1
// Multiplicado pelo peso da questão

step-02 (weight=1.5):
  option A → score * 1.5 = 1 * 1.5 = 1.5
  option B → score * 1.5 = 1 * 1.5 = 1.5
```

### Uso

```typescript
import { computeResult } from '@/lib/utils/result/computeResult';

const result = computeResult({
  answers,
  steps,
  scoring: {
    weights: { classico: 1.5 },
    optionWeights: {
      'step-02': { 'option-1': 2 }
    }
  }
});
```

---

## 🔄 Sistema Unificado

O novo `UnifiedResultCalculator` **integra ambas as lógicas**:

### Detecção Automática

```typescript
import { calculateQuizResult } from '@/lib/utils/result/unifiedResultCalculator';

// Auto-detecta o método baseado na estrutura
const result = calculateQuizResult(answers, steps);

// result contém:
// - Formato computeResult (primaryStyleId, scores, etc)
// - Formato ResultEngine (payload com primaryStyle, secondaryStyles)
// - Detalhes dos estilos (characteristics, description)
```

### Métodos Disponíveis

```typescript
import { UnifiedResultCalculator } from '@/lib/utils/result/unifiedResultCalculator';

// Método 1: Prefixos (ResultEngine)
const result1 = UnifiedResultCalculator.calculate({
  answers,
  method: 'prefix'
});

// Método 2: Pesos (computeResult)
const result2 = UnifiedResultCalculator.calculate({
  answers,
  steps,
  scoring,
  method: 'weighted'
});

// Método 3: Simples
const result3 = UnifiedResultCalculator.calculate({
  answers,
  method: 'simple'
});
```

---

## 📊 Formato de Dados

### Respostas (Answers)

```typescript
const answers: Record<string, string[]> = {
  'step-02': ['natural_confortavel'],
  'step-03': ['classico_elegante'],
  'step-04': ['natural_casual', 'natural_simples']
};
```

### Steps

```typescript
const steps: Record<string, QuizStepV3> = {
  'step-02': {
    id: 'step-02',
    type: 'question',
    name: 'Pergunta 1',
    options: [...],
    metadata: {
      scoring: {
        weight: 1.5
      }
    }
  }
};
```

### Resultado

```typescript
{
  // Formato computeResult
  primaryStyleId: 'natural',
  secondaryStyleIds: ['classico', 'contemporaneo'],
  scores: {
    natural: 15,
    classico: 12,
    contemporaneo: 8
  },
  percentages: {
    natural: 42.8,
    classico: 34.3,
    contemporaneo: 22.9
  },
  
  // Formato ResultEngine
  payload: {
    primaryStyle: {
      style: 'Natural',
      score: 15,
      percentage: 42.8
    },
    secondaryStyles: [...]
  },
  
  // Detalhes adicionais
  metadata: {
    styleDetails: [
      {
        id: 'natural',
        name: 'Natural',
        score: 15,
        percentage: 42.8,
        characteristics: ['descomplicado', 'confortável'],
        description: 'Descubra as texturas...'
      }
    ]
  }
}
```

---

## 🎨 Configuração de Estilos

### STYLE_DEFINITIONS

Todos os estilos estão definidos em `src/services/data/styles.ts`:

```typescript
export const STYLE_DEFINITIONS: Record<string, Style> = {
  classico: {
    id: 'classico',
    name: 'Clássico',
    type: 'classico',
    description: 'Descubra quais peças atemporais...',
    characteristics: ['atemporal', 'elegante'],
    recommendations: ['blazer', 'camisa branca'],
    images: ['/estilos/classico-1.jpg'],
    imageUrl: '/estilos/classico-personal.webp'
  },
  natural: {
    id: 'natural',
    name: 'Natural',
    // ...
  }
  // ... mais 6 estilos
};
```

### Ordem de Desempate

```typescript
export const STYLES_ORDER: string[] = [
  'Natural',
  'Clássico',
  'Contemporâneo',
  'Elegante',
  'Romântico',
  'Sexy',
  'Dramático',
  'Criativo'
];
```

---

## 📝 Exemplos Práticos

### Exemplo 1: Quiz com Prefixos

```json
{
  "templateId": "quiz-prefixos",
  "stages": [
    {
      "id": "step-01",
      "type": "question",
      "blocks": [
        {
          "type": "question-single",
          "content": {
            "options": [
              { "id": "natural_confortavel", "text": "Confortável" },
              { "id": "classico_elegante", "text": "Elegante" }
            ]
          }
        }
      ]
    }
  ]
}
```

**Cálculo:**
```typescript
const result = calculateQuizResult(answers);
// Detecta automaticamente método 'prefix'
// Usa ResultEngine internamente
```

### Exemplo 2: Quiz com Pesos

```json
{
  "templateId": "quiz-pesos",
  "stages": [
    {
      "id": "step-01",
      "type": "question",
      "metadata": {
        "scoring": {
          "weight": 2
        }
      },
      "blocks": [...]
    }
  ],
  "runtime": {
    "scoring": {
      "weights": {
        "classico": 1.5
      }
    }
  }
}
```

**Cálculo:**
```typescript
const result = calculateQuizResult(answers, steps, template.runtime.scoring);
// Detecta automaticamente método 'weighted'
// Usa computeResult internamente
```

### Exemplo 3: Quiz Híbrido (Prefixos + Pesos)

```json
{
  "templateId": "quiz-hibrido",
  "stages": [
    {
      "id": "step-01",
      "type": "question",
      "metadata": {
        "scoring": {
          "weight": 1.5
        }
      },
      "blocks": [
        {
          "type": "question-single",
          "content": {
            "options": [
              { "id": "natural_simples", "text": "Simples" }
            ]
          }
        }
      ]
    }
  ]
}
```

**Cálculo:**
```typescript
// Prefixos são detectados primeiro
const result = calculateQuizResult(answers, steps);
// Usa 'prefix' com pesos aplicados
```

---

## 🔧 Migração de Templates Antigos

### De quiz21StepsComplete para Novo Formato

```typescript
// Antigo
const oldTemplate = {
  steps: {
    'step-02': {
      type: 'question',
      options: ['natural_1', 'classico_1']
    }
  }
};

// Novo (compatível)
const newTemplate = {
  stages: [
    {
      id: 'step-02',
      type: 'question',
      order: 1,
      blocks: [
        {
          type: 'question-single',
          content: {
            options: [
              { id: 'natural_confortavel', text: 'Natural' },
              { id: 'classico_elegante', text: 'Clássico' }
            ]
          }
        }
      ],
      metadata: {
        scoring: { weight: 1 }
      }
    }
  ]
};
```

---

## ✅ Checklist de Compatibilidade

- [x] Usa STYLE_DEFINITIONS existentes
- [x] Suporta prefixos de opções (natural_, classico_, etc)
- [x] Suporta pesos por questão (metadata.scoring.weight)
- [x] Suporta pesos por estilo (runtime.scoring.weights)
- [x] Suporta pesos por opção (runtime.scoring.optionWeights)
- [x] Mantém ordem de desempate (STYLES_ORDER)
- [x] Integra com ResultEngine
- [x] Integra com computeResult
- [x] Formato de saída compatível com ambos sistemas
- [x] Auto-detecção de método

---

## 📚 Referências

**Arquivos Principais:**
- `src/lib/utils/result/computeResult.ts` - Lógica de pesos
- `src/services/core/ResultEngine.ts` - Lógica de prefixos
- `src/services/data/styles.ts` - Definições de estilos
- `src/lib/utils/result/unifiedResultCalculator.ts` - Sistema unificado

**Tipos:**
- `src/types/quiz.ts` - QuizStepV3, StyleType
- `src/types/quizResult.ts` - QuizResult

**Componentes:**
- `src/components/result/*` - Visualização de resultados
- `src/components/steps/Step20Result.tsx` - Página de resultado
