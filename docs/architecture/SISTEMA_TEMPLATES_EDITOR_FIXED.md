# 🎯 SISTEMA DE TEMPLATES DO /editor-fixed

## ✅ **RESPOSTA DEFINITIVA:**

O `/editor-fixed` usa um **sistema de templates baseado em etapas (steps)** para alimentar as 21 etapas do funil de quiz.

---

## 🏗️ **ARQUITETURA DO SISTEMA DE TEMPLATES**

### **📁 1. ARQUIVO PRINCIPAL DE MAPEAMENTO:**

```
src/config/stepTemplatesMapping.ts
```

- **Função**: Centraliza o mapeamento das 21 etapas
- **Responsabilidade**: Conecta cada etapa ao seu template específico
- **Interface**: `StepTemplate` com função e metadados

### **📂 2. TEMPLATES DAS ETAPAS:**

```
src/components/steps/
├── Step01Template.tsx  (Introdução)
├── Step02Template.tsx  (Q1 - Rotina Diária)
├── Step03Template.tsx  (Q2 - Tipo de Roupa)
├── ...
├── Step21Template.tsx  (Resultado Final)
```

- **Total**: 21 arquivos de template
- **Função**: Cada arquivo exporta `getStepXXTemplate()`
- **Retorno**: Array de blocos pré-configurados

### **🔄 3. CONTEXTO DE INICIALIZAÇÃO:**

```
src/context/EditorContext.tsx
```

- **Função**: `getAllSteps()` carrega todos os templates
- **Processo**: Inicializa 21 stages com templates específicos
- **Fluxo**: Templates → Stages → Blocos → Editor

---

## 📋 **ESTRUTURA DOS TEMPLATES**

### **🎯 EXEMPLO - Step01Template.tsx:**

```typescript
export const getStep01Template = () => {
  return [
    // 🎯 CABEÇALHO DO QUIZ
    {
      id: 'quiz-intro-header-step01',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/...',
        logoWidth: 120,
        logoHeight: 120,
        progressValue: 0,
        // ... outras propriedades
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step01',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        // ... configurações
      },
    },

    // ... outros blocos da etapa
  ];
};
```

### **🔧 MAPEAMENTO - stepTemplatesMapping.ts:**

```typescript
export const STEP_TEMPLATES_MAPPING: Record<number, StepTemplate> = {
  1: {
    stepNumber: 1,
    templateFunction: getStep01Template,
    name: 'Introdução',
    description: 'Página inicial do quiz',
  },
  2: {
    stepNumber: 2,
    templateFunction: getStep02Template,
    name: 'Q1 - Rotina Diária',
    description: 'Como você descreveria sua rotina diária?',
  },
  // ... 19 etapas restantes
};
```

---

## 🔄 **FLUXO DE CARREGAMENTO DOS TEMPLATES**

### **📊 1. INICIALIZAÇÃO (EditorContext.tsx):**

```typescript
// ✅ PASSO 1: Carregar todos os templates
const allStepTemplates = getAllSteps();

// ✅ PASSO 2: Criar 21 stages baseadas nos templates
const initialStages = allStepTemplates.map(stepTemplate => ({
  id: `step-${stepTemplate.stepNumber}`,
  name: stepTemplate.name,
  order: stepTemplate.stepNumber,
  // ... configurações da stage
}));
```

### **⚡ 2. CARREGAMENTO DINÂMICO:**

```typescript
// ✅ Quando uma etapa é selecionada:
const templateBlocks = getStepTemplate(stepNumber);

// ✅ Conversão para blocos do editor:
const editorBlocks = templateBlocks.map((block, index) => ({
  id: block.id || `${stageId}-block-${index + 1}`,
  type: block.type,
  properties: block.properties,
  order: index + 1,
}));
```

---

## 📊 **21 ETAPAS DO SISTEMA**

### **🎯 ETAPAS PRINCIPAIS:**

1. **Step01** - Introdução (tela inicial)
2. **Step02-14** - Perguntas do quiz (13 perguntas)
3. **Step15** - Transição para resultado
4. **Step16-21** - Páginas de resultado (6 variações)

### **📱 TIPOS DE BLOCOS UTILIZADOS:**

- `quiz-intro-header` - Cabeçalho com logo e progresso
- `decorative-bar-inline` - Barras decorativas
- `heading-inline` - Títulos e subtítulos
- `text-inline` - Textos descritivos
- `options-grid` - Grid de opções para perguntas
- `form-input` - Campos de formulário
- `quiz-progress` - Barra de progresso
- ... outros componentes específicos

---

## 🎛️ **PROPRIEDADES DOS TEMPLATES**

### **🔧 PROPRIEDADES UNIVERSAIS:**

- `containerWidth` - "full", "large", "medium", "small"
- `containerPosition` - "left", "center", "right"
- `marginTop/Bottom` - Espaçamento vertical
- `backgroundColor` - Cor de fundo
- `spacing` - Padding interno

### **📱 PROPRIEDADES ESPECÍFICAS:**

- **Quiz Header**: `logoUrl`, `progressValue`, `showBackButton`
- **Options Grid**: `options`, `allowMultiple`, `columns`
- **Text Inline**: `fontSize`, `textAlign`, `fontWeight`
- **Form Input**: `inputType`, `placeholder`, `required`

---

## ✅ **CONCLUSÃO**

**🎯 SISTEMA COMPLETO E ORGANIZADO:**

O `/editor-fixed` utiliza um **sistema robusto de 21 templates** que alimenta todas as etapas do funil:

1. **📁 Centralizado** - Um arquivo de mapeamento controla tudo
2. **🔄 Modular** - Cada etapa tem seu próprio template
3. **⚡ Dinâmico** - Templates carregados conforme necessário
4. **🎨 Flexível** - Cada template pode ter blocos únicos
5. **🛠️ Configurável** - Propriedades customizáveis por bloco

**Este sistema permite criar experiências únicas para cada etapa do quiz, mantendo consistência e performance!** 🚀

---

_Análise realizada em: 8 de Agosto, 2025_
_Fonte: stepTemplatesMapping.ts + EditorContext.tsx_
