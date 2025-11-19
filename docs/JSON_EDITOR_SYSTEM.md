# 🎨 Sistema de Edição JSON - Documentação Completa

## 📋 Visão Geral

Sistema completo para edição de templates baseado em JSON com suporte para:
- **1-30 etapas** (flexível, não fixo em 21)
- **Cálculo de resultados variáveis**
- **Regras de pontuação configuráveis**
- **4 colunas originais do editor mantidas**

---

## 🏗️ Arquitetura

### Componentes Principais

1. **JsonTemplateEditor** (`src/components/editor/JsonEditor/JsonTemplateEditor.tsx`)
   - Editor JSON completo
   - Validação em tempo real
   - Import/Export de arquivos
   - Estatísticas do template

2. **PropertiesColumnWithJson** (`src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/PropertiesColumnWithJson.tsx`)
   - Wrapper que adiciona aba JSON ao painel de propriedades
   - Mantém 4 colunas originais
   - Alterna entre Propriedades e JSON

3. **FlexibleResultCalculator** (`src/lib/utils/result/flexibleResultCalculator.ts`)
   - Sistema de cálculo de resultados
   - Suporta 3 métodos: simple, weighted, custom
   - Classificação automática baseada em regras

---

## 📐 Estrutura do Template JSON

### Template Completo

```json
{
  "templateId": "meu-quiz",
  "name": "Nome do Quiz",
  "description": "Descrição do quiz",
  "version": "1.0.0",
  
  "settings": {
    "minStages": 1,
    "maxStages": 30,
    "allowDynamicStages": true
  },
  
  "scoring": {
    "enabled": true,
    "method": "weighted",
    
    "categories": [
      {
        "id": "estilo-classico",
        "name": "Estilo Clássico",
        "weight": 0.4,
        "scoreField": "score"
      },
      {
        "id": "estilo-moderno",
        "name": "Estilo Moderno",
        "weight": 0.6,
        "scoreField": "score"
      }
    ],
    
    "classifications": [
      {
        "id": "resultado-classico",
        "name": "Você é Clássico!",
        "condition": {
          "type": "score_range",
          "min": 0,
          "max": 33
        },
        "description": "Seu estilo é clássico e atemporal",
        "metadata": {
          "image": "url-da-imagem",
          "recommendations": ["item1", "item2"]
        }
      }
    ],
    
    "customFormulas": {
      "finalScore": "(estilo_classico * 0.4) + (estilo_moderno * 0.6)"
    }
  },
  
  "stages": [
    {
      "id": "step-01",
      "name": "Introdução",
      "description": "Primeira etapa",
      "order": 0,
      "isRequired": true,
      
      "blocks": [
        {
          "id": "block-1",
          "type": "heading",
          "content": {
            "text": "Bem-vindo ao Quiz!",
            "level": 1
          }
        },
        {
          "id": "block-2",
          "type": "question-single",
          "content": {
            "question": "Qual é seu estilo preferido?",
            "options": [
              {
                "id": "opt-1",
                "text": "Clássico",
                "score": 10,
                "category": "estilo-classico"
              },
              {
                "id": "opt-2", 
                "text": "Moderno",
                "score": 10,
                "category": "estilo-moderno"
              }
            ]
          },
          "properties": {
            "required": true
          },
          "metadata": {
            "maxScore": 10,
            "category": "estilo"
          }
        }
      ],
      
      "settings": {
        "validation": {
          "required": true
        }
      }
    }
  ]
}
```

---

## 🧮 Sistema de Pontuação

### Métodos Disponíveis

#### 1. **Simple** (Soma Simples)
Soma todos os pontos de todas as respostas.

```json
{
  "scoring": {
    "enabled": true,
    "method": "simple",
    "classifications": [
      {
        "id": "baixo",
        "condition": { "type": "percentage", "min": 0, "max": 33 }
      }
    ]
  }
}
```

#### 2. **Weighted** (Ponderado por Categorias)
Cada categoria tem um peso diferente no resultado final.

```json
{
  "scoring": {
    "enabled": true,
    "method": "weighted",
    "categories": [
      { "id": "cat1", "weight": 0.3 },
      { "id": "cat2", "weight": 0.7 }
    ]
  }
}
```

#### 3. **Custom** (Fórmulas Personalizadas)
Use fórmulas matemáticas customizadas.

```json
{
  "scoring": {
    "enabled": true,
    "method": "custom",
    "customFormulas": {
      "finalScore": "(categoria1 * 2 + categoria2) / 3"
    }
  }
}
```

---

## 🎯 Tipos de Classificação

### 1. Score Range
Classifica baseado em porcentagem:

```json
{
  "condition": {
    "type": "score_range",
    "min": 0,
    "max": 33
  }
}
```

### 2. Category Dominant
Classifica baseado na categoria dominante:

```json
{
  "condition": {
    "type": "category_dominant",
    "categoryId": "estilo-classico"
  }
}
```

### 3. Custom Formula
Usa fórmula customizada para classificar:

```json
{
  "condition": {
    "type": "custom_formula",
    "formula": "categoria1 > 50 && categoria2 < 30"
  }
}
```

---

## 💻 Uso no Editor

### 1. Editor Normal (4 Colunas)

O editor mantém as 4 colunas originais:
1. **Steps** - Navegação entre etapas
2. **Biblioteca** - Componentes disponíveis
3. **Canvas** - Área de edição visual
4. **Propriedades** - Com nova aba JSON

### 2. Aba JSON no Painel de Propriedades

Acesse via:
- Painel de Propriedades (coluna direita)
- Tab "JSON"
- Edite o template completo
- Validação em tempo real
- Import/Export instantâneo

### 3. Fluxo de Trabalho

```
1. Acesse /editor?resource=quiz21StepsComplete
2. Clique na aba "JSON" no painel de propriedades
3. Edite o JSON diretamente
4. Clique em "Aplicar" para atualizar
5. Veja mudanças refletidas no canvas
```

---

## 🔧 Integração

### Carregar Template JSON

```typescript
import { JsonTemplateEditor } from '@/components/editor/JsonEditor';

<JsonTemplateEditor
  template={myTemplate}
  onTemplateChange={(newTemplate) => {
    // Processar template atualizado
    console.log('Template atualizado:', newTemplate);
  }}
  templateId="meu-quiz"
/>
```

### Calcular Resultados

```typescript
import { createCalculatorFromTemplate } from '@/lib/utils/result/flexibleResultCalculator';

const calculator = createCalculatorFromTemplate(template);
const result = calculator.calculate(userAnswers, template.stages);

console.log('Pontuação final:', result.finalScore);
console.log('Classificação:', result.classification?.name);
console.log('Por categoria:', result.categoryScores);
```

---

## 📊 Exemplos Práticos

### Quiz de 5 Etapas

```json
{
  "templateId": "quiz-rapido",
  "stages": [
    { "id": "step-01", "order": 0, "blocks": [...] },
    { "id": "step-02", "order": 1, "blocks": [...] },
    { "id": "step-03", "order": 2, "blocks": [...] },
    { "id": "step-04", "order": 3, "blocks": [...] },
    { "id": "step-05", "order": 4, "blocks": [...] }
  ]
}
```

### Quiz de 30 Etapas

```json
{
  "templateId": "quiz-completo",
  "stages": [
    { "id": "step-01", "order": 0, "blocks": [...] },
    // ... 28 stages ...
    { "id": "step-30", "order": 29, "blocks": [...] }
  ]
}
```

### Quiz com Múltiplas Categorias

```json
{
  "scoring": {
    "method": "weighted",
    "categories": [
      { "id": "estilo", "weight": 0.3 },
      { "id": "personalidade", "weight": 0.3 },
      { "id": "preferencias", "weight": 0.4 }
    ]
  }
}
```

---

## ✅ Validação

### Regras de Validação

1. **Obrigatórios:**
   - `templateId`
   - `name`
   - `stages` (array)
   - Cada stage deve ter `id`
   - Cada block deve ter `id` e `type`

2. **Limites:**
   - Mínimo: 1 stage
   - Máximo: 30 stages
   - Nome do template: string não vazia

3. **Recomendados:**
   - `description`
   - `version`
   - `settings.validation` em cada stage

---

## 🚀 Migração de Templates Antigos

### Converter quiz21StepsComplete

```javascript
// Antigo (fixo em 21 steps)
const oldTemplate = {
  steps: [...21 steps...]
};

// Novo (flexível 1-30)
const newTemplate = {
  templateId: 'quiz21StepsComplete',
  stages: oldTemplate.steps.map((step, i) => ({
    id: step.id,
    order: i,
    blocks: step.blocks || []
  })),
  scoring: {
    enabled: true,
    method: 'simple',
    classifications: [...]
  }
};
```

---

## 📝 Changelog

### v1.0.0 (2025-11-19)
- ✅ Sistema de edição JSON completo
- ✅ Suporte para 1-30 etapas
- ✅ Cálculo de resultados variáveis
- ✅ 3 métodos de pontuação (simple, weighted, custom)
- ✅ Validação em tempo real
- ✅ Import/Export de templates
- ✅ Integração com 4 colunas do editor
- ✅ Classificação automática de resultados

---

## 🔗 Arquivos Relacionados

- `src/components/editor/JsonEditor/JsonTemplateEditor.tsx`
- `src/components/editor/JsonEditor/index.tsx`
- `src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/PropertiesColumnWithJson.tsx`
- `src/lib/utils/result/flexibleResultCalculator.ts`
- `docs/auditorias/AUDIT_REPORT_2025-11-19_COMPREHENSIVE.md`
- `docs/auditorias/FINAL_AUDIT_SUMMARY.md`
