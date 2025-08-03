# 📁 **FONTE DOS CÓDIGOS DAS ETAPAS DO FUNIL**

## 🎯 **LOCALIZAÇÃO DOS TEMPLATES DAS ETAPAS**

### 📋 **1. ARQUIVO PRINCIPAL: `/src/config/funnelSteps.ts`**

Este é o **arquivo central** que contém a configuração de todas as 21 etapas do funil:

```typescript
export const FUNNEL_STEPS_CONFIG: FunnelStepConfig[] = [
  {
    id: 'step-1',           // ✅ ID único da etapa
    stepNumber: 1,          // ✅ Número sequencial
    stepType: 'intro',      // ✅ Tipo da etapa
    title: 'Introdução ao Quiz',
    description: 'Página inicial que apresenta o quiz',
    defaultContent: {       // ✅ CONTEÚDO PADRÃO
      title: 'Descubra Seu Estilo Pessoal',
      subtitle: 'Um quiz personalizado...',
      buttonText: 'Iniciar Quiz',
      backgroundColor: '#faf8f5',
      textColor: '#432818'
    },
    requiredFields: ['title', 'buttonText']
  },
  // ... mais 20 etapas
];
```

**🔧 FUNÇÕES UTILITÁRIAS:**
- `getStepConfig(stepNumber)` - Busca configuração por número
- `getStepsByType(stepType)` - Filtra por tipo de etapa
- `getTotalSteps()` - Total de etapas (21)
- `getDefaultContentForFunnelStep(stepType)` - Conteúdo padrão

---

### 📋 **2. ARQUIVO SECUNDÁRIO: `/src/templates/stepTemplates.ts`**

Contém **templates de blocos** para montagem visual das etapas:

```typescript
// ✅ TEMPLATE DE INTRODUÇÃO
export const introTemplate = [
  { type: 'vertical-canvas-header', properties: { ... } },
  { type: 'text-inline', properties: { ... } },
  { type: 'button-inline', properties: { ... } }
];

// ✅ TEMPLATE DE PERGUNTA (FUNÇÃO DINÂMICA)
export const questionTemplate = ({
  questionNumber = 1,
  title = "QUAL O SEU TIPO DE ROUPA FAVORITA?",
  subtitle = "Selecione até 3 opções",
  multiSelect = 3,
  variant = 'image'
}: QuestionParams) => [
  { type: 'quiz-progress', properties: { ... } },
  { type: 'quiz-question', properties: { ... } },
  { type: 'options-grid', properties: { ... } }
];

// ✅ TEMPLATE ESTRATÉGICO
export const strategicTemplate = ({ ... }) => [
  // Componentes específicos para perguntas estratégicas
];
```

---

### 📋 **3. INICIALIZAÇÃO NO CONTEXT: `/src/context/EditorContext.tsx`**

As etapas são **inicializadas no contexto** com templates básicos:

```typescript
const stageTemplates = [
  { name: 'Introdução', type: 'intro', description: 'Página de apresentação' },
  { name: 'Q1 - Profissão', type: 'question', description: 'Qual é a sua profissão?' },
  { name: 'Q2 - Experiência', type: 'question', description: 'Anos de experiência' },
  // ... 18 etapas mais
];

const initialStages = stageTemplates.map((template, index) => ({
  id: `step-${index + 1}`,
  name: template.name,
  order: index + 1,
  type: template.type,
  description: template.description,
  isActive: index === 0,
  metadata: { blocksCount: 0, lastModified: new Date(), isCustom: false }
}));
```

---

## 🗂️ **ESTRUTURA HIERÁRQUICA**

```
📁 ETAPAS DO FUNIL
├── 🎯 /src/config/funnelSteps.ts          [CONFIGURAÇÃO PRINCIPAL]
│   ├── ✅ 21 etapas completas
│   ├── ✅ Conteúdo padrão para cada tipo
│   ├── ✅ Campos obrigatórios
│   └── ✅ Funções utilitárias
│
├── 🎨 /src/templates/stepTemplates.ts     [TEMPLATES VISUAIS]
│   ├── ✅ Layouts de blocos por tipo
│   ├── ✅ Templates parameterizáveis
│   └── ✅ Componentes específicos
│
└── 🔧 /src/context/EditorContext.tsx      [INICIALIZAÇÃO]
    ├── ✅ Estados básicos das 21 etapas
    ├── ✅ Metadados padrão
    └── ✅ Estrutura para o editor
```

---

## 📊 **TIPOS DE ETAPAS DISPONÍVEIS**

| Tipo | Descrição | Etapas |
|------|-----------|--------|
| `intro` | Introdução ao quiz | 1 |
| `name-collect` | Coleta de nome | 2 |
| `quiz-intro` | Introdução às perguntas | 3 |
| `question-multiple` | Perguntas principais | 4-14 |
| `quiz-transition` | Transição | 15 |
| `processing` | Processamento | 16 |
| `result-intro` | Introdução ao resultado | 17 |
| `result-details` | Detalhes do resultado | 18 |
| `result-guide` | Guia do resultado | 19 |
| `offer-transition` | Transição para oferta | 20 |
| `offer-page` | Página da oferta | 21 |

---

## 🔧 **COMO EDITAR AS ETAPAS**

### **Para Conteúdo/Configuração:**
➡️ **Editar:** `/src/config/funnelSteps.ts`
- Alterar `defaultContent` de cada etapa
- Modificar títulos, descrições, campos obrigatórios

### **Para Layout/Visual:**
➡️ **Editar:** `/src/templates/stepTemplates.ts`
- Ajustar templates de blocos
- Modificar componentes visuais

### **Para Estrutura Base:**
➡️ **Editar:** `/src/context/EditorContext.tsx`
- Alterar nomes/tipos das etapas iniciais
- Modificar metadados padrão

---

## 🎯 **RESUMO**

**ARQUIVO PRINCIPAL:** `/src/config/funnelSteps.ts`
- ✅ **21 etapas completas** com configuração detalhada
- ✅ **Conteúdo padrão** para cada tipo de etapa
- ✅ **Funções utilitárias** para busca e filtragem

**ARQUIVO VISUAL:** `/src/templates/stepTemplates.ts`
- ✅ **Templates de blocos** para montagem das páginas
- ✅ **Layouts responsivos** e componentizados

**ARQUIVO DE CONTEXTO:** `/src/context/EditorContext.tsx`
- ✅ **Inicialização** das 21 etapas no editor
- ✅ **Estados base** para o sistema de edição
