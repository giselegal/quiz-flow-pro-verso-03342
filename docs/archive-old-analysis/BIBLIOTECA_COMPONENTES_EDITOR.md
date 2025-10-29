# 📚 BIBLIOTECA DE COMPONENTES DO /editor

## 🎯 Biblioteca Utilizada: `EnhancedBlockRegistry`

### **Arquivo Principal:**
📁 `src/components/editor/blocks/EnhancedBlockRegistry.tsx`

---

## 🏗️ ARQUITETURA DA BIBLIOTECA

### **Estrutura em 3 Camadas:**

```
┌─────────────────────────────────────────────────────────────┐
│         1. ENHANCED_BLOCK_REGISTRY (Registro)              │
│  Record<string, ComponentType<any>> - Mapeamento dos       │
│  componentes React (150+ componentes)                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         2. AVAILABLE_COMPONENTS (Metadados)                │
│  Array com type, label, category, description              │
│  (usado para popular a biblioteca visual no editor)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│         3. COMPONENT_LIBRARY (Editor UI)                   │
│  Versão adaptada para o QuizModularProductionEditor        │
│  (adiciona ícones, defaultProps, defaultContent)           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 1. ENHANCED_BLOCK_REGISTRY (Registro de Componentes)

### **Localização:**
`src/components/editor/blocks/EnhancedBlockRegistry.tsx` (linhas 60-349)

### **Descrição:**
Registro canônico com **150+ componentes** mapeados. É um `Record<string, ComponentType<any>>` que associa tipos de blocos a componentes React.

### **Exemplo:**
```typescript
export const ENHANCED_BLOCK_REGISTRY: Record<string, ComponentType<any>> = {
    // Componentes estáticos (carregam imediatamente)
    'text-inline': TextInlineBlock,
    'button-inline': ButtonInlineBlock,
    'image-inline': ImageInlineBlock,
    'options-grid': OptionsGridBlock,
    'form-input': FormInputBlock,
    
    // Componentes lazy (carregam sob demanda)
    'quiz-logo': QuizLogoBlock,
    'quiz-progress-bar': QuizProgressBlock,
    'container': lazy(() => import('./BasicContainerBlock')),
    
    // ... 150+ componentes
};
```

### **Categorias de Componentes:**

1. **🧩 Modulares do Quiz** (quiz-logo, quiz-progress-bar, etc)
2. **🏗️ Estruturais** (container, section)
3. **📝 Conteúdo** (heading, text, image)
4. **🎨 Visuais** (decorative-bar, gradient-animation)
5. **🎯 Quiz** (options-grid, strategic-question)
6. **📋 Formulários** (form-input, lead-form)
7. **🔘 Ação** (button, legal-notice)
8. **⏳ Transição** (transition-title, transition-loader)
9. **📊 Resultado** (result-header, style-card)
10. **💰 Oferta/Vendas** (sales-hero, testimonials, guarantee)
11. **🧭 Navegação** (quiz-navigation)
12. **🤖 IA** (fashion-ai-generator)

---

## 📋 2. AVAILABLE_COMPONENTS (Metadados da Biblioteca)

### **Localização:**
`src/components/editor/blocks/EnhancedBlockRegistry.tsx` (linhas 350-540)

### **Descrição:**
Array com metadados de cada componente disponível. Usado para popular a **UI da biblioteca** no editor.

### **Estrutura:**
```typescript
export const AVAILABLE_COMPONENTS = [
    {
        type: 'quiz-logo',
        label: 'Logo do Quiz',
        category: 'quiz',
        description: 'Logo com dimensões e estilos editáveis',
    },
    {
        type: 'quiz-progress-bar',
        label: 'Barra de Progresso',
        category: 'quiz',
        description: 'Indicador visual de progresso com estilos customizáveis',
    },
    {
        type: 'options-grid',
        label: 'Grid de Opções',
        category: 'quiz',
        description: 'Grade de opções selecionáveis com imagens',
    },
    // ... 60+ componentes
];
```

### **Total de Componentes Disponíveis:**
📊 **60+ componentes** listados com metadados completos

---

## 🎨 3. COMPONENT_LIBRARY (Biblioteca do Editor)

### **Localização:**
`src/components/editor/quiz/QuizModularProductionEditor.tsx` (linhas 130-255)

### **Descrição:**
Adaptação do `AVAILABLE_COMPONENTS` para o editor. Adiciona:
- ✅ **Ícones React** para cada categoria
- ✅ **defaultProps** (propriedades padrão)
- ✅ **defaultContent** (conteúdo inicial)

### **Como é Gerado:**
```typescript
import { AVAILABLE_COMPONENTS } from '@/components/editor/blocks/EnhancedBlockRegistry';

const COMPONENT_LIBRARY: ComponentLibraryItem[] = AVAILABLE_COMPONENTS.map(comp => ({
    type: comp.type,
    label: comp.label,
    icon: getCategoryIcon(comp.category), // ← Adiciona ícone
    category: comp.category,
    defaultProps: { // ← Adiciona props padrão por tipo
        ...(comp.type.includes('text') && {
            text: comp.label,
            fontSize: '16px',
            color: '#432818',
            textAlign: 'left'
        }),
        ...(comp.type.includes('heading') && {
            text: comp.label,
            level: 2,
            fontSize: '24px',
            color: '#432818',
            textAlign: 'center'
        }),
        ...(comp.type.includes('button') && {
            text: 'Continuar',
            backgroundColor: '#B89B7A',
            textColor: '#FFFFFF',
            action: 'next-step'
        }),
        // ... etc
    },
    ...(comp.type === 'options-grid' && { // ← Adiciona conteúdo padrão
        defaultContent: {
            options: [
                { id: 'opt1', text: 'Opção 1', imageUrl: '...', points: 10 },
                { id: 'opt2', text: 'Opção 2', imageUrl: '...', points: 20 },
                { id: 'opt3', text: 'Opção 3', imageUrl: '...', points: 30 }
            ]
        }
    })
}));
```

### **Resultado:**
A biblioteca visual que aparece na **Coluna 2** do editor:

```
┌──────────────────────┐
│  BIBLIOTECA          │
├──────────────────────┤
│ 📝 Título            │ ← heading
│ 📄 Texto             │ ← text-inline
│ 🔘 Botão             │ ← button-inline
│ 🖼️ Imagem            │ ← image-inline
│ ❓ Grid de Opções    │ ← options-grid
│ 📦 Container         │ ← container
│ 🎨 Barra Decorativa  │ ← decorative-bar
│ 📋 Campo de Texto    │ ← form-input
│ ...                  │
└──────────────────────┘
```

---

## 🔍 COMO FUNCIONA NO EDITOR

### **Fluxo Completo:**

```
1. Editor carrega
   ↓
2. Importa AVAILABLE_COMPONENTS do EnhancedBlockRegistry
   ↓
3. Transforma em COMPONENT_LIBRARY (adiciona ícones e defaults)
   ↓
4. Renderiza biblioteca visual (Coluna 2)
   ↓
5. Usuário arrasta componente
   ↓
6. handleDragEnd busca componente no COMPONENT_LIBRARY
   ↓
7. Cria novo bloco com defaultProps e defaultContent
   ↓
8. BlockRenderer busca componente no ENHANCED_BLOCK_REGISTRY
   ↓
9. Renderiza componente React correspondente
```

---

## 📊 ESTATÍSTICAS DA BIBLIOTECA

### **ENHANCED_BLOCK_REGISTRY:**
- **Total:** 150+ componentes registrados
- **Estáticos:** ~30 componentes (carregam imediatamente)
- **Lazy:** ~120 componentes (carregam sob demanda)

### **AVAILABLE_COMPONENTS:**
- **Total:** 60+ componentes com metadados
- **Categorias:** 12 categorias diferentes

### **COMPONENT_LIBRARY:**
- **Total:** Mesmo que AVAILABLE_COMPONENTS
- **Enriquecido:** Com ícones, defaultProps, defaultContent

---

## 🎯 COMPONENTES MAIS USADOS

### **Top 10:**

| Rank | Componente | Type | Uso |
|------|------------|------|-----|
| 1 | **Grid de Opções** | `options-grid` | Perguntas do quiz |
| 2 | **Título** | `heading` | Títulos de seções |
| 3 | **Texto** | `text-inline` | Parágrafos |
| 4 | **Botão** | `button-inline` | Ações/navegação |
| 5 | **Imagem** | `image-inline` | Mídia visual |
| 6 | **Campo de Texto** | `form-input` | Captura de dados |
| 7 | **Container** | `container` | Agrupamento |
| 8 | **Barra Decorativa** | `decorative-bar` | Separadores |
| 9 | **Logo do Quiz** | `quiz-logo` | Branding |
| 10 | **Barra de Progresso** | `quiz-progress-bar` | Feedback visual |

---

## 🔧 COMO ADICIONAR NOVO COMPONENTE

### **Passo 1: Criar o Componente**
```typescript
// src/components/editor/blocks/MeuNovoBloco.tsx
export default function MeuNovoBloco({ properties, content, isEditing }) {
    return (
        <div style={{ padding: properties.padding }}>
            {content.texto}
        </div>
    );
}
```

### **Passo 2: Registrar no ENHANCED_BLOCK_REGISTRY**
```typescript
// EnhancedBlockRegistry.tsx
import MeuNovoBloco from './MeuNovoBloco';

export const ENHANCED_BLOCK_REGISTRY = {
    // ... componentes existentes
    'meu-novo-bloco': MeuNovoBloco, // ← ADICIONAR AQUI
};
```

### **Passo 3: Adicionar aos AVAILABLE_COMPONENTS**
```typescript
// EnhancedBlockRegistry.tsx
export const AVAILABLE_COMPONENTS = [
    // ... componentes existentes
    {
        type: 'meu-novo-bloco',
        label: 'Meu Novo Bloco',
        category: 'content',
        description: 'Descrição do que faz',
    },
];
```

### **Passo 4: (Opcional) Adicionar defaultProps**
```typescript
// QuizModularProductionEditor.tsx
const COMPONENT_LIBRARY = AVAILABLE_COMPONENTS.map(comp => ({
    // ...
    defaultProps: {
        ...(comp.type === 'meu-novo-bloco' && {
            padding: '16px',
            backgroundColor: '#F5F5F5'
        }),
    }
}));
```

### **Pronto!** 🎉
O componente aparecerá automaticamente na biblioteca do editor.

---

## 🗂️ ORGANIZAÇÃO POR CATEGORIA

### **📦 Layout (layout)**
- container
- section
- progress-header

### **📝 Conteúdo (content)**
- heading
- text-inline
- image-inline
- image-display-inline

### **🎨 Visual (visual)**
- decorative-bar
- gradient-animation

### **🎯 Quiz (quiz)**
- quiz-logo
- quiz-progress-bar
- quiz-back-button
- quiz-question-header
- quiz-transition-loader
- quiz-result-header
- quiz-offer-hero
- quiz-intro-header
- options-grid
- question-hero
- strategic-question
- transition-hero
- progress-bar
- loading-animation

### **📋 Formulários (forms)**
- form-input
- lead-form
- connected-lead-form

### **🔘 Ação (action)**
- button-inline
- legal-notice

### **⏳ Transição (transition)**
- transition-title
- transition-loader
- transition-text
- transition-progress
- transition-message

### **📊 Resultado (result)**
- result-card
- result-header
- style-card
- step20-result-header
- step20-style-reveal
- step20-user-greeting
- step20-compatibility
- step20-secondary-styles
- step20-personalized-offer

### **💰 Oferta (offer)**
- offer-hero
- sales-hero
- urgency-timer
- before-after
- value-anchoring
- bonus
- testimonials
- guarantee
- secure-purchase
- benefits
- mentor-section

### **🧭 Navegação (navigation)**
- quiz-navigation

### **🤖 IA (ai)**
- fashion-ai-generator

### **🔧 Avançado (advanced)**
- connected-template-wrapper

---

## 🎓 CONCEITOS-CHAVE

### **1. Type vs BlockType**
```typescript
{
    type: 'subtitle',       // ID único na biblioteca
    blockType: 'text',      // Tipo real do componente
    label: 'Subtítulo',     // Nome visual
}
```
- **type:** Identificador único na biblioteca (ex: `subtitle`)
- **blockType:** Tipo do componente renderizado (ex: `text`)
- **label:** Nome que aparece na UI

### **2. Props vs Content**
```typescript
{
    properties: {          // Estilos e configurações
        fontSize: '16px',
        color: '#432818',
        textAlign: 'center'
    },
    content: {            // Dados do bloco
        text: 'Meu texto',
        imageUrl: 'https://...'
    }
}
```
- **properties:** Estilos, configurações visuais
- **content:** Dados, conteúdo textual, opções

### **3. Static vs Lazy**
```typescript
// Static (carrega imediatamente)
import ButtonInlineBlock from './ButtonInlineBlock';

// Lazy (carrega sob demanda)
const QuizLogoBlock = lazy(() => import('./QuizLogoBlock'));
```
- **Static:** Componentes essenciais (text, button, image)
- **Lazy:** Componentes opcionais (reduz bundle inicial)

---

## 🔍 BUSCAR COMPONENTE NA BIBLIOTECA

### **Por Tipo:**
```typescript
const component = COMPONENT_LIBRARY.find(c => c.type === 'options-grid');
console.log(component.label); // "Grid de Opções"
```

### **Por Categoria:**
```typescript
const quizComponents = COMPONENT_LIBRARY.filter(c => c.category === 'quiz');
console.log(quizComponents.length); // 15 componentes
```

### **Por Label:**
```typescript
const component = COMPONENT_LIBRARY.find(c => c.label === 'Título');
console.log(component.type); // "heading"
```

---

## 📝 ALIASES DE COMPONENTES

Alguns componentes têm múltiplos aliases:

```typescript
{
    'text': TextInlineBlock,
    'text-inline': TextInlineBlock,  // Mesmo componente!
    
    'image': ImageInlineBlock,
    'image-inline': ImageInlineBlock, // Mesmo componente!
    
    'button': ButtonInlineBlock,
    'button-inline': ButtonInlineBlock, // Mesmo componente!
    
    'quiz-options': OptionsGridBlock,
    'options-grid': OptionsGridBlock,  // Mesmo componente!
}
```

---

## 🚀 RESUMO

### **Biblioteca Utilizada:**
✅ **EnhancedBlockRegistry** (`src/components/editor/blocks/EnhancedBlockRegistry.tsx`)

### **3 Camadas:**
1. **ENHANCED_BLOCK_REGISTRY** - Registro de componentes React (150+)
2. **AVAILABLE_COMPONENTS** - Metadados para UI (60+)
3. **COMPONENT_LIBRARY** - Biblioteca enriquecida no editor (60+)

### **Como Aparece no Editor:**
- **Coluna 2** exibe o `COMPONENT_LIBRARY`
- **Arrasta** componente da biblioteca
- **Solta** no canvas
- **Cria** novo bloco com `defaultProps` e `defaultContent`
- **Renderiza** usando `ENHANCED_BLOCK_REGISTRY`

### **Principais Componentes:**
- options-grid (quiz)
- heading (títulos)
- text-inline (texto)
- button-inline (botões)
- image-inline (imagens)
- form-input (formulários)
- container (layout)

**A biblioteca é dinâmica, extensível e totalmente modular!** 🎉
