# 📋 SCHEMA DO PAINEL DE PROPRIEDADES - ANÁLISE COMPLETA

**Sprint 4 - Dia 4**  
**Data:** 11 de outubro de 2025  
**Status:** 🔍 INVESTIGAÇÃO DE BUGS

---

## 🎯 ARQUITETURA DO SCHEMA

### 1. **Sistema de Propriedades Unificado**

O Painel de Propriedades utiliza um sistema de **3 camadas**:

```
┌─────────────────────────────────────────────────────────┐
│  CAMADA 1: Block Registry (Core)                       │
│  📁 src/core/blocks/registry.ts                         │
│  ▸ Define schema básico de cada tipo de bloco          │
│  ▸ Usa helper `prop()` para criar propriedades         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  CAMADA 2: Unified Properties Hook                     │
│  📁 src/hooks/useUnifiedProperties.ts                   │
│  ▸ Transforma schema do registry em UnifiedProperty[]  │
│  ▸ Adiciona propriedades universais (layout, etc)      │
│  ▸ Gerencia estado e validação                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  CAMADA 3: Properties Panel (UI)                       │
│  📁 src/components/editor/properties/PropertiesPanel.tsx│
│  ▸ Renderiza UI baseada em UnifiedProperty[]           │
│  ▸ ROTEAMENTO ESPECIAL para blocos de quiz             │
│  ▸ Usa QuestionPropertyEditor para questões            │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 SCHEMA DO BLOCO `quiz-question-inline`

### Definição no Registry (Camada 1)

```typescript
// 📁 src/core/blocks/registry.ts (linha 1202)

'quiz-question-inline': {
    type: 'quiz-question-inline',
    title: 'Pergunta de Quiz Inline',
    category: 'Quiz',
    icon: '💭',
    
    // ✅ Propriedades padrão ao criar bloco
    defaultProps: {
        title: 'Pergunta inline?',
        question: 'Pergunta inline?',
        options: [
            { id: 'opt-1', text: 'Sim', value: 'yes' },
            { id: 'opt-2', text: 'Não', value: 'no' }
        ],
        layout: 'horizontal',
        showImages: false
    },
    
    // ⚠️ PROBLEMA: Schema MUITO LIMITADO!
    propsSchema: [
        prop({ 
            key: 'title', 
            kind: 'text', 
            label: 'Título', 
            category: 'content', 
            default: 'Pergunta inline?' 
        }),
        prop({ 
            key: 'question', 
            kind: 'text', 
            label: 'Pergunta', 
            category: 'content', 
            default: 'Pergunta inline?' 
        }),
        prop({ 
            key: 'options', 
            kind: 'array',  // ⚠️ Tipo 'array' genérico!
            label: 'Opções', 
            category: 'content', 
            default: [] 
        }),
        prop({
            key: 'layout', 
            kind: 'select', 
            label: 'Layout', 
            category: 'layout', 
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' }
            ], 
            default: 'horizontal'
        }),
        prop({ 
            key: 'showImages', 
            kind: 'switch', 
            label: 'Mostrar Imagens', 
            category: 'content', 
            default: false 
        })
    ]
}
```

### 🐛 **BUGS IDENTIFICADOS NO SCHEMA**

| # | Bug | Propriedade Faltando | Status |
|---|-----|---------------------|--------|
| 1 | **Textos das opções não editáveis** | `options` definido como `array` genérico sem estrutura | ❌ CRÍTICO |
| 2 | **Sem campo de upload** | `options[].imageUrl` não tem propriedade `kind: 'upload'` | ❌ CRÍTICO |
| 3 | **Pontuação não funciona** | `options[].scoreValues` não definido no schema | ❌ CRÍTICO |
| 4 | **Tamanho da imagem** | `imageWidth`, `imageHeight`, `imageSize` não no schema | ❌ CRÍTICO |
| 5 | **Validação de seleções** | `requiredSelections`, `maxSelections`, `minSelections` não no schema | ❌ CRÍTICO |
| 6 | **Ativação condicional do botão** | `enableButtonOnlyWhenValid`, `showValidationFeedback` não no schema | ❌ CRÍTICO |

---

## 🔍 ROTEAMENTO ESPECIAL PARA QUESTÕES

### Como o Painel Lida com Questões

```typescript
// 📁 src/components/editor/properties/PropertiesPanel.tsx (linha 75)

// 🎯 ROTEAMENTO CONDICIONAL
const isQuestionBlock = selectedBlock.type === 'quiz-question-inline' ||
                       selectedBlock.type === 'options-grid' ||
                       selectedBlock.type === 'form-input' ||
                       selectedBlock.type === 'quiz-header' ||
                       selectedBlock.type === 'quiz-navigation';

if (isQuestionBlock) {
    // ✅ USA EDITOR ESPECIALIZADO
    return (
        <QuestionPropertyEditor
            block={questionBlock}
            onUpdate={(updates) => onUpdate(updates)}
            onDelete={onDelete}
            isPreviewMode={false}
        />
    );
}

// ❌ SENÃO, usa sistema genérico baseado no schema
const { properties, updateProperty } = useUnifiedProperties(
    selectedBlock.type,
    selectedBlock.id,
    selectedBlock,
    onUpdate
);
```

### ✅ **DESCOBERTA IMPORTANTE**

**Blocos de quiz NÃO usam o schema do registry!**

- ✅ Eles usam o `QuestionPropertyEditor` customizado
- ✅ Este editor tem TODAS as funcionalidades necessárias
- ⚠️ **MAS**: Pode estar com bugs na implementação

---

## 🧩 ESTRUTURA DO `QuestionPropertyEditor`

```typescript
// 📁 src/components/editor/properties/editors/QuestionPropertyEditor.tsx

interface QuestionProperties {
    // ✅ CONTENT
    question?: string;
    title?: string;
    text?: string;
    description?: string;
    questionId?: string;

    // ✅ OPTIONS - ARRAY COMPLEXO
    options?: QuestionOption[];

    // ✅ SELECTION RULES
    multipleSelection?: boolean;
    requiredSelections?: number;
    maxSelections?: number;
    minSelections?: number;

    // ✅ VALIDATION
    enableButtonOnlyWhenValid?: boolean;
    showValidationFeedback?: boolean;
    validationMessage?: string;
    progressMessage?: string;
    showSelectionCount?: boolean;

    // ✅ BEHAVIOR
    autoAdvanceOnComplete?: boolean;
    autoAdvanceDelay?: number;
    showImages?: boolean;

    // ✅ STYLING
    columns?: number;
    responsiveColumns?: boolean;
    selectionStyle?: 'border' | 'background' | 'shadow';
    selectedColor?: string;
    hoverColor?: string;
    gridGap?: number;

    // ✅ SCORE VALUES
    scoreValues?: Record<string, number>;
}

interface QuestionOption {
    id: string;
    text: string;           // ✅ Texto editável
    imageUrl?: string;      // ✅ URL da imagem
    value?: string;
    scoreValues?: Record<string, number>;  // ✅ Pontos por opção
}
```

### 🎯 **QuestionPropertyEditor TEM TODAS AS FUNCIONALIDADES!**

✅ Edição de texto das opções  
✅ Upload/URL de imagens  
✅ Sistema de pontuação  
✅ Validação de seleções  
✅ Ativação condicional do botão  
✅ Configurações de layout  

---

## 🐛 ENTÃO ONDE ESTÁ O PROBLEMA?

### Hipóteses:

### 1. **Bug de Renderização no QuestionPropertyEditor**
```typescript
// Possível problema: Campos não sendo renderizados
// Verificar se os tabs/accordions estão ocultando as opções
```

### 2. **Bug no Mapeamento de Propriedades**
```typescript
// Linha 85-100 do PropertiesPanel.tsx
const questionBlock = {
    id: selectedBlock.id,
    type: selectedBlock.type,
    properties: {
        question: selectedBlock.properties?.question || 
                 selectedBlock.properties?.text || '',  // ⚠️ Fallback pode estar errado
        // ...
        options: selectedBlock.properties?.options || [],  // ⚠️ Array vazio?
    }
};
```

### 3. **Bug nos Editores Avançados Importados**
```typescript
// QuestionPropertyEditor importa:
import BoxModelEditor from '../core/BoxModelEditor';
import AnimationPreviewEditor from '../core/AnimationPreviewEditor';
import ScoreValuesEditor from '../core/ScoreValuesEditor';  // ⚠️ Este pode ter bug

// Se ScoreValuesEditor não funciona, pontuação não aparece
```

### 4. **Bug de Estado/Tabs**
```typescript
// QuestionPropertyEditor usa Tabs
<Tabs defaultValue="content">
  <TabsList>
    <TabsTrigger value="content">Conteúdo</TabsTrigger>
    <TabsTrigger value="options">Opções</TabsTrigger>  // ⚠️ Pode não estar visível
    <TabsTrigger value="validation">Validação</TabsTrigger>
    <TabsTrigger value="scoring">Pontuação</TabsTrigger>
  </TabsList>
</Tabs>

// Se tab "options" não abre, textos não aparecem
```

---

## 🔬 PRÓXIMOS PASSOS PARA INVESTIGAÇÃO

### 1. **Testar QuestionPropertyEditor Isolado**
```bash
# Criar teste que renderiza QuestionPropertyEditor diretamente
# Verificar se campos aparecem quando não há PropertiesPanel wrapper
```

### 2. **Verificar Estado dos Tabs**
```bash
# Testar se tabs "Opções", "Pontuação", "Validação" existem
# Verificar se defaultValue dos tabs está correto
```

### 3. **Inspecionar ScoreValuesEditor**
```bash
# Ler src/components/editor/properties/core/ScoreValuesEditor.tsx
# Verificar se renderiza campos de pontuação
```

### 4. **Verificar Mapeamento de `options`**
```bash
# Adicionar logs para ver se options[] chega vazio
# Verificar se selectedBlock.properties.options existe
```

### 5. **Testar com Bloco Real do Editor**
```bash
# Abrir /editor no navegador
# Criar bloco quiz-question-inline
# Inspecionar HTML com DevTools
# Verificar se campos existem mas estão ocultos (CSS)
```

---

## 📊 RESUMO EXECUTIVO

### ✅ **O que ESTÁ funcionando:**
- Schema básico do registry (`quiz-question-inline` definido)
- Roteamento para `QuestionPropertyEditor` (detecta questões)
- Interface do `QuestionPropertyEditor` (tipo TypeScript completo)

### ❌ **O que NÃO está funcionando:**
- Campos de texto das opções não aparecem
- Upload de imagens não funciona
- Pontuação não é editável
- Validações não configuráveis
- Ativação condicional do botão não aparece

### 🎯 **Causa Provável:**
- **Problema de renderização dentro do `QuestionPropertyEditor`**
- Campos existem na interface TypeScript mas não são renderizados
- Possível bug nos tabs/accordions ocultando conteúdo
- Ou editores importados (`ScoreValuesEditor`, etc) com bugs

### 🔧 **Solução Recomendada:**
1. **Investigar `QuestionPropertyEditor.tsx` linha por linha**
2. **Verificar se tabs estão renderizando todo conteúdo**
3. **Testar editores auxiliares isoladamente**
4. **Adicionar logs de debug no mapeamento de props**

---

## 📝 ARQUIVOS PARA INVESTIGAR

```
🔍 PRIORIDADE ALTA:
1. src/components/editor/properties/editors/QuestionPropertyEditor.tsx (901 linhas)
   └─ Verificar renderização de options[] e scoring

2. src/components/editor/properties/core/ScoreValuesEditor.tsx
   └─ Verificar se renderiza campos de pontuação

3. src/components/editor/properties/PropertiesPanel.tsx (linha 75-120)
   └─ Verificar mapeamento questionBlock

🔍 PRIORIDADE MÉDIA:
4. src/core/blocks/registry.ts (linha 1202-1239)
   └─ Considerar expandir propsSchema com mais propriedades

5. src/hooks/useUnifiedProperties.ts
   └─ Verificar se há fallback para blocos sem schema completo
```

---

**Documento gerado automaticamente**  
**Sprint 4 - Dia 4**  
**Data:** 11/out/2025 05:00  
**Status:** 🔍 INVESTIGAÇÃO EM ANDAMENTO
