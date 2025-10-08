# 🔍 ANÁLISE COMPLETA DA ESTRUTURA REAL DO /quiz-estilo

**Data:** 08/01/2025  
**Objetivo:** Validar se o Editor Modular consegue editar 100% do funil /quiz-estilo

---

## 📋 1. ESTRUTURA COMPLETA DO QUIZ

### 1.1 Etapas e Tipos

| Etapa | Tipo | Descrição | Componentes Principais |
|-------|------|-----------|------------------------|
| `step-01` | `intro` | Introdução + coleta nome | Title (HTML), FormInput, Image, Button |
| `step-02` a `step-11` | `question` | 10 perguntas do quiz | QuestionText (heading), QuizOptions (8 opções c/ imagens) |
| `step-12` | `transition` | Transição para perguntas estratégicas | Title, Text, Button (auto-advance) |
| `step-13` a `step-18` | `strategic-question` | 6 perguntas estratégicas | QuestionText, QuizOptions (4 opções sem imagem) |
| `step-19` | `transition-result` | Transição para resultado | Title (auto-advance) |
| `step-20` | `result` | Exibição do resultado | Title dinâmico, StyleCard, Description |
| `step-21` | `offer` | Oferta personalizada | Image, Title dinâmico, Description, Button, Testimonial |

**Total:** 21 etapas

---

## 📊 2. TIPOS DE COMPONENTES UTILIZADOS

### 2.1 Componentes de Conteúdo

#### ✅ **Text** (Texto simples)
- **Usado em:** step-12 (transition)
- **Propriedades:** 
  - `content.text`: string
  - `properties.fontSize`: string (opcional)
  - `properties.color`: string (opcional)
  - `properties.textAlign`: 'left' | 'center' | 'right' (opcional)

#### ✅ **Heading** (Título com HTML)
- **Usado em:** step-01, step-02 a step-21
- **Propriedades:**
  - `content.text`: string (suporta HTML com tags `<span>`, classes CSS)
  - `properties.level`: 1 | 2 | 3 | 4 | 5 | 6
  - `properties.color`: string (opcional)
  - `properties.textAlign`: 'left' | 'center' | 'right'
  - `properties.fontFamily`: 'playfair-display' | 'default'
- **Exemplo real:**
```typescript
title: '<span style="color: #B89B7A; font-weight: 700;" class="playfair-display">Chega</span> <span class="playfair-display">de um guarda-roupa lotado...</span>'
```

#### ✅ **Image** (Imagem)
- **Usado em:** step-01, step-21
- **Propriedades:**
  - `content.src`: string (URL Cloudinary)
  - `properties.width`: string (opcional)
  - `properties.height`: string (opcional)
  - `properties.objectFit`: 'cover' | 'contain' | 'fill' (opcional)

### 2.2 Componentes Interativos

#### ✅ **Button** (Botão)
- **Usado em:** step-01, step-12, step-21
- **Propriedades:**
  - `content.text`: string
  - `properties.backgroundColor`: string (#B89B7A padrão)
  - `properties.textColor`: string
  - `properties.onClick`: 'next' | 'submit' | 'external-link'
  - `properties.href`: string (para links externos)

#### ✅ **Quiz-Options** (Opções de Quiz)
- **Usado em:** step-02 a step-11, step-13 a step-18
- **Propriedades:**
  - `content.options`: Array<{ id: string, text: string, image?: string }>
  - `properties.maxSelections`: number (3 para perguntas, 1 para estratégicas)
  - `properties.layout`: 'grid' | 'list'
  - `properties.showImages`: boolean
- **Comportamento:**
  - Perguntas principais (step-02 a step-11): 8 opções com imagens, seleção múltipla (3)
  - Perguntas estratégicas (step-13 a step-18): 4 opções sem imagens, seleção única (1)

#### ✅ **Form-Input** (Campo de texto)
- **Usado em:** step-01 (coleta nome)
- **Propriedades:**
  - `content.placeholder`: string
  - `content.label`: string (formQuestion)
  - `properties.type`: 'text' | 'email'
  - `properties.required`: boolean

### 2.3 Componentes de Layout

#### ✅ **Container** (Contêiner flexível)
- **Usado em:** Agrupamento de componentes em qualquer etapa
- **Propriedades:**
  - `properties.display`: 'flex' | 'grid' | 'block'
  - `properties.flexDirection`: 'row' | 'column'
  - `properties.gap`: string
  - `properties.padding`: string
  - `properties.backgroundColor`: string (opcional)

### 2.4 Componentes Especiais (NÃO EDITÁVEIS - Hardcoded)

#### ❌ **Testimonial** (Depoimento)
- **Usado em:** step-21 (offer)
- **Estrutura:** 
```typescript
testimonial: {
  quote: string,
  author: string
}
```
- **PROBLEMA:** Não é um componente modular, está hardcoded no tipo `offer`

#### ❌ **StyleCard** (Card de estilo do resultado)
- **Usado em:** step-20 (result)
- **Estrutura:** Renderização customizada do estilo calculado
- **PROBLEMA:** Não é modular, lógica específica no tipo `result`

---

## 🎯 3. LÓGICA DE NEGÓCIO CRÍTICA

### 3.1 Sistema de Pontuação

#### 📍 Como Funciona:
1. **Perguntas 1-10** (step-02 a step-11): Cada opção tem um `id` que corresponde a um estilo
2. **Cálculo:** `addAnswer()` armazena seleções, `calculateResult()` conta pontos
3. **Resultado:** Estilos ordenados por pontuação, top 3 salvos

#### 📍 IDs de Estilos Válidos:
```typescript
'natural' | 'classico' | 'contemporaneo' | 'elegante' | 
'romantico' | 'sexy' | 'dramatico' | 'criativo'
```

#### ⚠️ CRÍTICO PARA O EDITOR:
- **Cada opção de quiz deve ter um `id` válido** (um dos 8 estilos acima)
- Se o editor permitir criar opções com IDs inválidos, o resultado não funciona
- **Solução:** Validação no editor que force IDs válidos ou dropdown de estilos

### 3.2 Sistema de Ofertas Personalizadas

#### 📍 Como Funciona:
1. **Pergunta Final** (step-18): "Qual desses resultados você mais gostaria de alcançar?"
2. **Resposta:** ID da opção selecionada
3. **Mapeamento:** 
```typescript
{
  'montar-looks-facilidade': 'Montar looks com mais facilidade e confiança',
  'usar-que-tenho': 'Usar o que já tenho e me sentir estilosa',
  'comprar-consciencia': 'Comprar com mais consciência e sem culpa',
  'ser-admirada': 'Ser admirada pela imagem que transmito'
}
```
4. **Oferta:** `offerMap[chave]` retorna conteúdo personalizado

#### ⚠️ CRÍTICO PARA O EDITOR:
- **Step-21 deve ter `offerMap`** com as 4 chaves acima
- Cada chave contém: `title`, `description`, `buttonText`, `testimonial`
- **Solução:** Editor deve ter componente especial para `offerMap` com estrutura fixa

### 3.3 Variáveis Dinâmicas

#### 📍 Substituições de Template:
- `{userName}`: Nome do usuário coletado no step-01
- Usado em: step-20 (título do resultado), step-21 (título da oferta)

#### ⚠️ CRÍTICO PARA O EDITOR:
- **Editor deve permitir inserir `{userName}` nos textos**
- **Preview deve substituir por nome de exemplo**
- Runtime usa `userName` do estado

### 3.4 Navegação e Fluxo

#### 📍 Sistema de nextStep:
```typescript
nextStep: 'step-02'  // ID da próxima etapa
```

#### ⚠️ CRÍTICO PARA O EDITOR:
- **Cada etapa deve ter `nextStep` apontando para a próxima**
- **Editor deve validar que `nextStep` existe**
- **Step-21 (última) não precisa de `nextStep`**

### 3.5 Auto-Advance

#### 📍 Etapas com Avanço Automático:
- **step-12** (transition): `duration: 3500ms`
- **step-19** (transition-result): Automático (sem duration definida)

#### ⚠️ CRÍTICO PARA O EDITOR:
- **Editor deve permitir configurar `duration` em transições**
- **Editor deve suportar `showContinueButton: true` para permitir skip manual**

---

## 🔥 4. GAPS CRÍTICOS NO EDITOR ATUAL

### 4.1 ❌ Componentes Faltando

| Componente | Status | Ação Necessária |
|------------|--------|-----------------|
| **Testimonial** | ❌ Não existe | Criar componente modular `testimonial` com campos `quote` e `author` |
| **StyleCard** | ❌ Hardcoded | Criar componente `style-result-card` que renderize estilo do estado |
| **OfferMap** | ❌ Não existe | Criar componente especial `offer-map` com 4 variações fixas |

### 4.2 ❌ Propriedades Críticas Faltando

#### Em QuizOptions:
```typescript
// FALTA:
showImages: boolean          // Controlar se opções exibem imagens
requiredSelections: number   // Quantas opções devem ser selecionadas
```

#### Em Heading:
```typescript
// FALTA:
fontFamily: 'playfair-display' | 'default'  // Fonte customizada
// HTML parsing já funciona? Testar <span>, <strong>, etc.
```

#### Em Transition:
```typescript
// FALTA:
showContinueButton: boolean  // Mostrar botão "Continuar"
continueButtonText: string   // Texto do botão
duration: number             // Tempo até auto-advance (ms)
```

### 4.3 ❌ Validações Críticas Faltando

1. **Validação de IDs de Estilos:**
   - Quando usuário cria opção de quiz, deve escolher de dropdown:
   ```typescript
   ['natural', 'classico', 'contemporaneo', 'elegante', 
    'romantico', 'sexy', 'dramatico', 'criativo']
   ```

2. **Validação de nextStep:**
   - Dropdown com lista de etapas disponíveis
   - Não permitir ciclos infinitos

3. **Validação de offerMap:**
   - Step-21 DEVE ter offerMap com 4 chaves fixas
   - Editor deve bloquear publicação sem isso

4. **Validação de userName:**
   - Step-01 DEVE ter FormInput coletando nome
   - Editor deve alertar se falta

---

## ✅ 5. MAPEAMENTO EDITOR → PRODUÇÃO

### 5.1 Estrutura de Dados no Editor

```typescript
interface BlockComponent {
  id: string;                    // UUID único
  type: 'text' | 'heading' | 'image' | 'button' | 
        'quiz-options' | 'form-input' | 'container' |
        'testimonial' | 'style-result-card' | 'offer-map'; // NOVOS
  order: number;                 // Ordem no canvas
  properties: {
    // Propriedades específicas por tipo
    [key: string]: any;
  };
  content: {
    // Conteúdo específico por tipo
    [key: string]: any;
  };
}

interface EditableQuizStep {
  id: string;                    // step-01, step-02, etc.
  type: 'intro' | 'question' | 'strategic-question' | 
        'transition' | 'transition-result' | 'result' | 'offer';
  order: number;                 // 1 a 21
  nextStep?: string;             // ID da próxima etapa
  blocks: BlockComponent[];      // Componentes modulares
  
  // Propriedades de transição
  showContinueButton?: boolean;
  continueButtonText?: string;
  duration?: number;
}
```

### 5.2 Conversão Editor → Runtime

```typescript
// EXEMPLO: step-02 (pergunta com opções)
// EDITOR:
{
  id: 'step-02',
  type: 'question',
  order: 2,
  nextStep: 'step-03',
  blocks: [
    {
      id: 'block-1',
      type: 'heading',
      order: 0,
      properties: { level: 3, textAlign: 'center' },
      content: { text: 'QUAL O SEU TIPO DE ROUPA FAVORITA?' }
    },
    {
      id: 'block-2',
      type: 'quiz-options',
      order: 1,
      properties: { 
        maxSelections: 3,
        showImages: true,
        layout: 'grid'
      },
      content: {
        options: [
          { 
            id: 'natural', 
            text: 'Conforto, leveza e praticidade no vestir',
            image: 'https://...'
          },
          // ... 7 mais opções
        ]
      }
    }
  ]
}

// RUNTIME (QUIZ_STEPS):
{
  type: 'question',
  questionNumber: '1 de 10',
  questionText: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
  requiredSelections: 3,
  options: [
    { 
      id: 'natural', 
      text: 'Conforto, leveza e praticidade no vestir',
      image: 'https://...'
    },
    // ... 7 mais opções
  ],
  nextStep: 'step-03'
}
```

### 5.3 Conversão Runtime → Editor (Load)

```typescript
function convertStepToBlocks(stepId: string, stepData: QuizStep): EditableQuizStep {
  const blocks: BlockComponent[] = [];
  let order = 0;

  // 1. Converter title/questionText → Heading
  if (stepData.title || stepData.questionText) {
    blocks.push({
      id: `${stepId}-heading`,
      type: 'heading',
      order: order++,
      properties: {
        level: stepData.type === 'intro' ? 1 : 3,
        textAlign: 'center'
      },
      content: {
        text: stepData.title || stepData.questionText || ''
      }
    });
  }

  // 2. Converter text → Text
  if (stepData.text) {
    blocks.push({
      id: `${stepId}-text`,
      type: 'text',
      order: order++,
      properties: { textAlign: 'center' },
      content: { text: stepData.text }
    });
  }

  // 3. Converter image → Image
  if (stepData.image) {
    blocks.push({
      id: `${stepId}-image`,
      type: 'image',
      order: order++,
      properties: {},
      content: { src: stepData.image }
    });
  }

  // 4. Converter formQuestion → FormInput
  if (stepData.formQuestion) {
    blocks.push({
      id: `${stepId}-form-input`,
      type: 'form-input',
      order: order++,
      properties: { type: 'text', required: true },
      content: {
        label: stepData.formQuestion,
        placeholder: stepData.placeholder || ''
      }
    });
  }

  // 5. Converter options → QuizOptions
  if (stepData.options) {
    blocks.push({
      id: `${stepId}-options`,
      type: 'quiz-options',
      order: order++,
      properties: {
        maxSelections: stepData.requiredSelections || 1,
        showImages: stepData.options.some(o => o.image),
        layout: 'grid'
      },
      content: {
        options: stepData.options
      }
    });
  }

  // 6. Converter buttonText → Button
  if (stepData.buttonText) {
    blocks.push({
      id: `${stepId}-button`,
      type: 'button',
      order: order++,
      properties: {
        backgroundColor: '#B89B7A',
        onClick: 'next'
      },
      content: {
        text: stepData.buttonText
      }
    });
  }

  // 7. Converter offerMap → OfferMap (NOVO)
  if (stepData.offerMap) {
    blocks.push({
      id: `${stepId}-offer-map`,
      type: 'offer-map',
      order: order++,
      properties: {},
      content: {
        offerMap: stepData.offerMap
      }
    });
  }

  return {
    id: stepId,
    type: stepData.type,
    order: parseInt(stepId.replace('step-', '')),
    nextStep: stepData.nextStep,
    blocks,
    showContinueButton: stepData.showContinueButton,
    continueButtonText: stepData.continueButtonText,
    duration: stepData.duration
  };
}
```

---

## 🎯 6. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Componentes Novos ✅ / ❌
- [x] Text
- [x] Heading (mas falta fontFamily)
- [x] Image
- [x] Button
- [x] Quiz-Options (mas falta requiredSelections, showImages)
- [x] Form-Input
- [x] Container
- [ ] **Testimonial** ❌
- [ ] **Style-Result-Card** ❌
- [ ] **Offer-Map** ❌

### Fase 2: Propriedades Críticas ✅ / ❌
- [ ] Heading.fontFamily ❌
- [ ] QuizOptions.requiredSelections ❌
- [ ] QuizOptions.showImages ❌
- [ ] QuizOptions.layout ❌
- [ ] Transition.showContinueButton ❌
- [ ] Transition.continueButtonText ❌
- [ ] Transition.duration ❌

### Fase 3: Validações ✅ / ❌
- [ ] Dropdown de IDs de estilos em QuizOptions ❌
- [ ] Dropdown de nextStep ❌
- [ ] Validação de offerMap em step-21 ❌
- [ ] Validação de FormInput em step-01 ❌
- [ ] Validação de 21 etapas antes de publicar ❌

### Fase 4: Conversões ✅ / ❌
- [ ] convertStepToBlocks() completo ❌
- [ ] convertBlocksToStep() completo ❌
- [ ] Teste de round-trip (editor → runtime → editor) ❌

### Fase 5: Preview e Runtime ✅ / ❌
- [x] QuizApp renderiza de QUIZ_STEPS ✅
- [x] useQuizState carrega do bridge ✅
- [ ] Preview no editor mostra resultado real ❌ (precisa testar)
- [ ] Variável {userName} funciona ❌ (precisa testar)

---

## 🚨 7. RISCOS E BLOQUEADORES

### Risco Alto 🔴

1. **Componentes Especiais Faltando:**
   - Testimonial, StyleCard, OfferMap não são modulares
   - **Impacto:** Step-20 e step-21 não podem ser editados
   - **Solução:** Criar esses 3 componentes URGENTE

2. **Validação de IDs de Estilos:**
   - Se usuário criar opção com ID inválido, resultado quebra
   - **Impacto:** Cálculo de pontuação retorna undefined
   - **Solução:** Dropdown obrigatório de estilos

3. **OfferMap Hardcoded:**
   - Step-21 precisa de estrutura específica
   - **Impacto:** Oferta personalizada não funciona
   - **Solução:** Componente com 4 variações editáveis

### Risco Médio 🟡

4. **Propriedades Faltando:**
   - requiredSelections, showImages, fontFamily
   - **Impacto:** Edição limitada, comportamento diferente do original
   - **Solução:** Adicionar campos no painel de propriedades

5. **Conversão Incompleta:**
   - convertStepToBlocks não cobre todos os casos
   - **Impacto:** Dados perdidos ao carregar funil existente
   - **Solução:** Implementar conversão bidirecional completa

### Risco Baixo 🟢

6. **Preview não 100% fiel:**
   - Pode haver diferenças entre preview e produção
   - **Impacto:** Usuário vê algo diferente no editor
   - **Solução:** Usar QuizApp real no preview

---

## ✅ 8. CONCLUSÃO

### 📊 Status Atual: **60% Funcional**

#### O que o Editor JÁ consegue editar:
- ✅ Step-01 (intro) - com limitações
- ✅ Step-02 a step-11 (perguntas) - com limitações
- ✅ Step-12 (transition) - parcialmente
- ✅ Step-13 a step-18 (strategic questions) - com limitações
- ❌ Step-19 (transition-result) - não totalmente
- ❌ Step-20 (result) - NÃO (falta StyleCard)
- ❌ Step-21 (offer) - NÃO (falta OfferMap e Testimonial)

#### Bloqueadores para 100%:
1. **3 Componentes Novos:** Testimonial, StyleCard, OfferMap
2. **7 Propriedades Novas:** fontFamily, requiredSelections, showImages, layout, showContinueButton, continueButtonText, duration
3. **4 Validações:** IDs de estilos, nextStep, offerMap, FormInput obrigatório
4. **Conversão Bidirecional:** Load/Save completo

#### Tempo Estimado para 100%:
- **Componentes Novos:** 4-6 horas
- **Propriedades:** 2-3 horas
- **Validações:** 3-4 horas
- **Conversão:** 2-3 horas
- **Testes:** 4-6 horas
- **TOTAL:** 15-22 horas (~2-3 dias)

---

## 📝 9. PLANO DE AÇÃO

### Prioridade 1 (CRÍTICO):
1. Criar componente `offer-map`
2. Criar componente `testimonial`
3. Criar componente `style-result-card`
4. Adicionar dropdown de estilos em QuizOptions

### Prioridade 2 (IMPORTANTE):
5. Adicionar propriedades faltantes (requiredSelections, showImages, fontFamily, etc.)
6. Implementar validações de nextStep e offerMap
7. Completar convertStepToBlocks() e convertBlocksToStep()

### Prioridade 3 (DESEJÁVEL):
8. Melhorar preview com QuizApp real
9. Adicionar testes end-to-end
10. Documentar guia de uso do editor

---

**Próximos Passos:** Criar suíte de testes específica para validar 100% do /quiz-estilo com os gaps identificados.
