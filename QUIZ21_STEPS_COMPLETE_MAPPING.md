# 📚 Mapeamento Completo: Quiz de 21 Etapas

**Data:** 2025-11-03  
**Versão:** 2.0  
**Status:** ✅ Documentação Completa com Schemas

---

## 📋 VISÃO GERAL

Este documento fornece o mapeamento completo das 21 etapas do Quiz de Estilo Pessoal, incluindo todos os tipos de blocos, propriedades editáveis e schemas Zod.

---

## 🎯 ESTRUTURA DAS 21 ETAPAS

### FASE 1: INTRODUÇÃO (Step 01)

**Objetivo:** Coletar nome do usuário e apresentar o quiz

#### Step-01: Tela de Boas-Vindas
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| intro-logo | `intro-logo` | Logo da marca | src, alt, width, height, animationType |
| intro-title | `intro-title` | Título principal | title, textAlign, fontSize, fontWeight |
| intro-image | `intro-image` | Imagem de apresentação | src, alt, objectFit, maxWidth, borderRadius |
| intro-description | `intro-description` | Texto descritivo | text, textAlign, animationType |
| intro-form | `intro-form` | Formulário de nome | label, placeholder, buttonText, required |

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

### FASE 2: PERGUNTAS DE PONTUAÇÃO (Steps 02-11)

**Objetivo:** 10 perguntas que pontuam para os 8 estilos de personalidade

#### Steps 02-11: Perguntas de Estilo (Estrutura Repetida)
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| progress-bar | `question-progress` | Barra de progresso | stepNumber, totalSteps, barColor, showPercentage |
| title | `question-title` | Título da pergunta | text, subtitle, backgroundColor, animationType |
| options | `options-grid` | Grade de opções | options[], columns, multipleSelection, minSelections, maxSelections |
| navigation | `question-navigation` | Botões voltar/avançar | backLabel, nextLabel, showBack, showNext, variants |

**Configuração das Perguntas:**
- **Colunas:** 2 colunas de opções
- **Seleção:** Múltipla (mín: 3, máx: 3)
- **Imagens:** Todas as opções têm imagens
- **Pontuação:** Cada opção pontua para 1 ou mais estilos

**8 Estilos Pontuados:**
1. Natural - Conforto e praticidade
2. Clássico - Discrição e sobriedade
3. Contemporâneo - Estilo atual e prático
4. Elegante - Elegância refinada
5. Romântico - Delicadeza e feminilidade
6. Sexy - Sensualidade
7. Dramático - Impacto visual
8. Criativo - Originalidade e ousadia

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

### FASE 3: TRANSIÇÃO 1 (Step 12)

**Objetivo:** Transição motivacional entre perguntas de pontuação e estratégicas

#### Step-12: Você está indo muito bem!
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| hero | `transition-hero` | Hero de transição | title, subtitle, autoAdvance, autoAdvanceDelay |
| text | `transition-text` | Texto motivacional | text, textAlign, animationType |

**Comportamento:**
- Auto-avanço: 2000ms (2 segundos)
- Animação: Fade

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

### FASE 4: PERGUNTAS ESTRATÉGICAS (Steps 13-18)

**Objetivo:** 6 perguntas que NÃO pontuam, usadas para personalizar a oferta final

#### Steps 13-18: Perguntas de Contexto (Estrutura Similar)
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| progress-bar | `question-progress` | Barra de progresso | stepNumber, totalSteps, barColor |
| title | `question-title` | Título da pergunta | text, subtitle, backgroundColor |
| options | `options-grid` | Grade de opções | options[], columns, multipleSelection (false) |
| navigation | `question-navigation` | Botões voltar/avançar | backLabel, nextLabel, variants |

**Diferenças das Perguntas de Pontuação:**
- **Seleção:** Única (mín: 1, máx: 1)
- **Pontuação:** NÃO pontua para estilos
- **Objetivo:** Coletar informações para personalização

**Perguntas Estratégicas:**
1. Step 13: Objetivo principal com o quiz
2. Step 14: Descrição do estilo atual
3. Step 15: Faixa etária
4. Step 16: Ocasião de uso mais frequente
5. Step 17: Nível de interesse em moda
6. Step 18: Motivação para renovar guarda-roupa

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

### FASE 5: TRANSIÇÃO 2 (Step 19)

**Objetivo:** Preparando resultados e criando expectativa

#### Step-19: Preparando seus resultados...
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| hero | `transition-hero` | Hero de transição | title, subtitle, autoAdvance, autoAdvanceDelay |
| text | `transition-text` | Texto de loading | text, animationType (pulse) |

**Comportamento:**
- Auto-avanço: 3000ms (3 segundos)
- Animação: Pulse (loading)

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

### FASE 6: RESULTADO (Step 20)

**Objetivo:** Mostrar estilo predominante, secundários e insights personalizados

#### Step-20: Seu Estilo Pessoal
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| congrats | `result-congrats` | Parabéns com nome | text, userName (variável) |
| main | `result-main` | Resultado principal | title, styleName, percentage, description |
| image | `result-image` | Imagem do estilo | src, alt, borderRadius |
| description | `result-description` | Descrição detalhada | text, textAlign |
| progress-bars | `result-progress-bars` | Barras de pontuação | styles[], showPercentage, barColor |
| secondary | `result-secondary-styles` | Estilos secundários | title, styles[] (2º e 3º lugar) |
| cta | `result-cta` | Chamada para ação | title, description, buttonText, buttonUrl |
| share | `result-share` | Compartilhar | title, platforms[] |

**Personalização Dinâmica:**
- `{userName}` - Nome coletado no Step 01
- `{resultStyle}` - Estilo com maior pontuação
- `{resultPercentage}` - Porcentagem do estilo predominante
- `{secondaryStyle1}` - 2º maior score
- `{secondaryStyle2}` - 3º maior score

**Cálculo de Resultado:**
1. Somar pontos de cada estilo (Steps 02-11)
2. Identificar os 3 estilos com maior pontuação
3. Calcular porcentagem: (score / maxScore) * 100
4. Substituir variáveis no template

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

### FASE 7: OFERTA (Step 21)

**Objetivo:** Apresentar oferta personalizada com base nas respostas estratégicas

#### Step-21: Continue sua jornada de estilo!
| Bloco | Tipo | Descrição | Propriedades Principais |
|-------|------|-----------|------------------------|
| hero | `offer-hero` | Hero da oferta | title, subtitle, imageUrl, ctaText, ctaUrl |
| pricing | `pricing` | Preço e condições | price, oldPrice, discount, installments |
| cta | `result-cta` | CTA final | title, description, buttonText, buttonUrl |
| share | `result-share` | Compartilhar | title, platforms[] |

**Personalização da Oferta:**
Baseada nas respostas das perguntas estratégicas (Steps 13-18):
- Objetivo (Step 13) → Tipo de produto sugerido
- Faixa etária (Step 15) → Linguagem e abordagem
- Nível de interesse (Step 17) → Complexidade da oferta
- Motivação (Step 18) → Ângulo de venda

**Schema Zod:** ✅ Todos os tipos possuem schema completo

---

## 📊 ESTATÍSTICAS COMPLETAS

### Resumo de Etapas
| Fase | Etapas | Tipo | Pontuação |
|------|--------|------|-----------|
| Introdução | 1 | intro | - |
| Perguntas Principais | 10 | question | ✅ Sim |
| Transição 1 | 1 | transition | - |
| Perguntas Estratégicas | 6 | strategic | ❌ Não |
| Transição 2 | 1 | transition | - |
| Resultado | 1 | result | - |
| Oferta | 1 | offer | - |
| **TOTAL** | **21** | - | **10 pontuam** |

### Tipos de Blocos Únicos

**Total:** 26 tipos diferentes

#### Por Categoria:

**Content (8 tipos):**
- intro-logo, intro-title, intro-description
- question-title, transition-hero, transition-text
- result-congrats, result-description

**Media (2 tipos):**
- intro-image, result-image

**Interactive (4 tipos):**
- intro-form, question-navigation
- result-cta, result-share

**Quiz (5 tipos):**
- question-progress, options-grid
- result-main, result-progress-bars, result-secondary-styles

**Layout (3 tipos):**
- fade, slideUp, scale

**Commerce (2 tipos):**
- offer-hero, pricing

**Utility (2 tipos):**
- text-inline, button

### Schema Coverage

**Antes da Correção:**
- 5/26 tipos com schema (19%)
- 21 tipos SEM schema (81%)

**Depois da Correção:**
- **26/26 tipos com schema (100%)** ✅
- 0 tipos SEM schema (0%)

---

## 🛠️ PROPRIEDADES EDITÁVEIS POR TIPO

### 1. Intro Components

#### intro-logo
```json
{
  "src": "URL da imagem (image-upload)",
  "alt": "Texto alternativo (text)",
  "width": "Largura em pixels (number)",
  "height": "Altura em pixels (number)",
  "padding": "Espaçamento (number)",
  "animationType": "fade | slideUp | scale (dropdown)",
  "animationDuration": "Duração em ms (number)"
}
```

#### intro-title
```json
{
  "title": "Texto do título (textarea)",
  "textAlign": "left | center | right (dropdown)",
  "fontSize": "Tamanho da fonte (text)",
  "fontWeight": "Peso da fonte (text)",
  "padding": "Espaçamento (number)",
  "animationType": "fade | slideUp (dropdown)"
}
```

#### intro-image
```json
{
  "src": "URL da imagem (image-upload)",
  "alt": "Texto alternativo (text)",
  "width": "Largura (number)",
  "height": "Altura (number)",
  "objectFit": "contain | cover | fill (dropdown)",
  "maxWidth": "Largura máxima (number)",
  "borderRadius": "Raio da borda (text)"
}
```

#### intro-description
```json
{
  "text": "Texto descritivo (textarea)",
  "textAlign": "left | center | right (dropdown)",
  "padding": "Espaçamento (number)",
  "animationType": "fade | slideUp (dropdown)",
  "animationDuration": "Duração em ms (number)"
}
```

#### intro-form
```json
{
  "label": "Rótulo do campo (text)",
  "placeholder": "Placeholder (text)",
  "buttonText": "Texto do botão (text)",
  "required": "Campo obrigatório (toggle)",
  "helperText": "Texto de ajuda (text)",
  "padding": "Espaçamento (number)",
  "animationType": "fade | slideUp (dropdown)"
}
```

### 2. Question Components

#### question-progress
```json
{
  "stepNumber": "Número da etapa (number)",
  "totalSteps": "Total de etapas (number)",
  "showPercentage": "Mostrar % (toggle)",
  "barColor": "Cor da barra (color-picker)",
  "backgroundColor": "Cor de fundo (color-picker)",
  "padding": "Espaçamento (number)"
}
```

#### question-title
```json
{
  "text": "Texto principal (text)",
  "subtitle": "Subtítulo (textarea)",
  "backgroundColor": "Cor de fundo (color-picker)",
  "padding": "Espaçamento (number)",
  "animationType": "fade | slideUp (dropdown)"
}
```

#### options-grid
```json
{
  "options": "Array de opções (json-editor)",
  "columns": "Número de colunas (number)",
  "gap": "Espaçamento entre opções (number)",
  "multipleSelection": "Seleção múltipla (toggle)",
  "minSelections": "Mínimo de seleções (number)",
  "maxSelections": "Máximo de seleções (number)",
  "showImages": "Mostrar imagens (toggle)",
  "padding": "Espaçamento (number)",
  "animationType": "fade | slideUp (dropdown)"
}
```

#### question-navigation
```json
{
  "backLabel": "Texto botão voltar (text)",
  "nextLabel": "Texto botão avançar (text)",
  "showBack": "Mostrar voltar (toggle)",
  "showNext": "Mostrar avançar (toggle)",
  "backVariant": "default | outline | secondary (dropdown)",
  "nextVariant": "default | outline | secondary (dropdown)",
  "padding": "Espaçamento (number)"
}
```

### 3. Transition Components

#### transition-hero
```json
{
  "title": "Título (textarea)",
  "subtitle": "Subtítulo (textarea)",
  "animationType": "fade | slideUp (dropdown)",
  "autoAdvance": "Avançar automaticamente (toggle)",
  "autoAdvanceDelay": "Atraso em ms (number)"
}
```

#### transition-text
```json
{
  "text": "Texto (textarea)",
  "textAlign": "left | center | right (dropdown)",
  "animationType": "fade | pulse (dropdown)"
}
```

### 4. Result Components

#### result-main
```json
{
  "title": "Título (textarea)",
  "styleName": "Nome do estilo - usar {resultStyle} (text)",
  "percentage": "Porcentagem - usar {resultPercentage}% (text)",
  "description": "Descrição do estilo (textarea)"
}
```

#### result-image
```json
{
  "src": "URL da imagem (image-upload)",
  "alt": "Texto alternativo (text)",
  "borderRadius": "Raio da borda (text)"
}
```

#### result-description
```json
{
  "text": "Texto descritivo (textarea)",
  "textAlign": "left | center | right (dropdown)"
}
```

#### result-progress-bars
```json
{
  "styles": "Array de estilos e pontuações (json-editor)",
  "showPercentage": "Mostrar % (toggle)",
  "barColor": "Cor da barra (color-picker)"
}
```

#### result-secondary-styles
```json
{
  "title": "Título (text)",
  "styles": "Array de estilos secundários (json-editor)"
}
```

#### result-congrats
```json
{
  "text": "Texto de parabéns (textarea)",
  "userName": "Nome do usuário - usar {userName} (text)"
}
```

#### result-cta
```json
{
  "title": "Título (text)",
  "description": "Descrição (textarea)",
  "buttonText": "Texto do botão (text)",
  "buttonUrl": "URL do botão (text)"
}
```

#### result-share
```json
{
  "title": "Título (text)",
  "platforms": "Array de plataformas (json-editor)"
}
```

### 5. Offer Components

#### offer-hero
```json
{
  "title": "Título (textarea)",
  "subtitle": "Subtítulo (textarea)",
  "imageUrl": "URL da imagem (image-upload)",
  "ctaText": "Texto do CTA (text)",
  "ctaUrl": "URL do CTA (text)"
}
```

#### pricing
```json
{
  "price": "Preço (text)",
  "oldPrice": "Preço antigo (text)",
  "discount": "Desconto % (text)",
  "installments": "Parcelamento (text)"
}
```

### 6. Animation Wrappers

#### fade, slideUp, scale
```json
{
  "duration": "Duração em ms (number)",
  "delay": "Atraso em ms (number)",
  "from": "Escala inicial (number) - apenas scale",
  "to": "Escala final (number) - apenas scale"
}
```

---

## 🔧 INTEGRAÇÃO COM O EDITOR

### Painel de Propriedades

**Localização:** `src/components/editor/quiz/QuizModularEditor/components/PropertiesColumn/`

**Funcionamento:**
1. Usuário seleciona um bloco no canvas
2. PropertiesColumn busca o schema do tipo do bloco
3. SchemaInterpreter retorna definições de propriedades
4. DynamicPropertyControls renderiza controles visuais
5. Usuário edita propriedades
6. Mudanças são aplicadas ao bloco em tempo real

**Tipos de Controles Suportados:**
- `text` - Input de texto simples
- `textarea` - Input de texto multi-linha
- `number` - Input numérico
- `toggle` - Switch on/off
- `color-picker` - Seletor de cores
- `image-upload` - Upload de imagem com preview
- `dropdown` - Lista suspensa de opções
- `json-editor` - Editor JSON para estruturas complexas

### Sistema de Validação Zod

**Arquivo:** `src/core/schema/SchemaValidator.ts`

**Funcionalidades:**
- Validação de tipos
- Validação de valores obrigatórios
- Validação de ranges (min/max)
- Validação de patterns (regex)
- Validação customizada

---

## 🗄️ INTEGRAÇÃO COM SUPABASE

### Tabelas Necessárias

#### funnels
```sql
CREATE TABLE funnels (
  id uuid PRIMARY KEY,
  name text,
  template_id text,
  created_at timestamp,
  updated_at timestamp
);
```

#### funnel_components (blocos)
```sql
CREATE TABLE funnel_components (
  id uuid PRIMARY KEY,
  funnel_id uuid REFERENCES funnels(id),
  step_key text,
  type text,
  order integer,
  properties jsonb,
  content jsonb,
  created_at timestamp,
  updated_at timestamp
);
```

### Fluxo de Persistência

1. **Carregamento:**
   - Usuário abre `/editor?template=quiz21StepsComplete`
   - EditorProviderUnified carrega template
   - Se `funnelId` presente: carrega do Supabase
   - Senão: carrega do JSON local

2. **Edição:**
   - Usuário edita blocos no Painel de Propriedades
   - Mudanças marcam estado como "dirty"
   - Auto-save persiste a cada 2 segundos (se habilitado)

3. **Salvamento:**
   - Manual: Botão "Save" no header
   - Automático: useEditorPersistence hook
   - Destino: Supabase (se funnelId) ou localStorage

---

## ✅ STATUS DE COMPLETUDE

### Schemas ✅
- [x] 26/26 tipos com schema Zod (100%)
- [x] Todos os controles mapeados
- [x] Valores default definidos
- [x] Validação implementada

### Editor ✅
- [x] Rota `/editor` configurada
- [x] QuizModularEditor implementado
- [x] Painel de Propriedades funcional
- [x] Sistema de drag & drop
- [x] Preview em tempo real

### Integração ✅
- [x] Supabase configurado
- [x] EditorProviderUnified
- [x] Sistema de cache otimizado
- [x] Auto-save implementado

### Testes ⚠️
- [ ] Testar carregamento de todos os 21 steps
- [ ] Testar edição de todos os 26 tipos de blocos
- [ ] Testar salvamento no Supabase
- [ ] Testar preview live vs production

---

## 🚀 PRÓXIMOS PASSOS

### Fase de Testes
1. Executar dev server
2. Abrir `/editor?template=quiz21StepsComplete`
3. Navegar pelos 21 steps
4. Testar edição de cada tipo de bloco
5. Validar Properties Panel
6. Testar salvamento

### Fase de Validação
7. Criar funnel de teste no Supabase
8. Testar carregamento via `funnelId`
9. Testar modo preview
10. Validar renderização de todos os blocos

### Fase de Documentação
11. Screenshots de cada step
12. Vídeo demonstrativo
13. Guia de uso para editores
14. Documentação técnica para desenvolvedores

---

## 📚 REFERÊNCIAS

- **Arquivo Template:** `src/templates/quiz21StepsComplete.ts`
- **Schemas:** `src/core/schema/defaultSchemas.json`
- **Editor:** `src/components/editor/quiz/QuizModularEditor/`
- **Provider:** `src/components/editor/EditorProviderUnified.tsx`
- **Auditoria:** `AUDIT_QUIZ21_STEPS_COMPLETE_EDITOR.md`

---

**Última Atualização:** 2025-11-03  
**Autor:** GitHub Copilot  
**Status:** ✅ Documentação Completa
