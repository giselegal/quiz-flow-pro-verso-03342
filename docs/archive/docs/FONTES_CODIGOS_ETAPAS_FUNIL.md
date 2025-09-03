# 📁 **FONTE DOS CÓDIGOS DAS ETAPAS DO FUNIL**

## 🎯 **LOCALIZAÇÃO DOS TEMPLATES DAS ETAPAS**

### 📋 **1. ARQUIVO PRINCIPAL: `/src/config/funnelSteps.ts`**

Este é o **arquivo central** que contém a configuração de todas as 21 etapas do funil:

```typescript
export const FUNNEL_STEPS_CONFIG: FunnelStepConfig[] = [
  {
    id: 'step-1', // ✅ ID único da etapa
    stepNumber: 1, // ✅ Número sequencial
    stepType: 'intro', // ✅ Tipo da etapa
    title: 'Introdução ao Quiz',
    description: 'Página inicial que apresenta o quiz',
    defaultContent: {
      // ✅ CONTEÚDO PADRÃO
      title: 'Descubra Seu Estilo Pessoal',
      subtitle: 'Um quiz personalizado...',
      buttonText: 'Iniciar Quiz',
      backgroundColor: '#faf8f5',
      textColor: '#432818',
    },
    requiredFields: ['title', 'buttonText'],
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
  {
    name: 'Q1 - Profissão',
    type: 'question',
    description: 'Qual é a sua profissão?',
  },
  {
    name: 'Q2 - Experiência',
    type: 'question',
    description: 'Anos de experiência',
  },
  // ... 18 etapas mais
];

const initialStages = stageTemplates.map((template, index) => ({
  id: `step-${index + 1}`,
  name: template.name,
  order: index + 1,
  type: template.type,
  description: template.description,
  isActive: index === 0,
  metadata: { blocksCount: 0, lastModified: new Date(), isCustom: false },
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

| Tipo                | Descrição               | Etapas |
| ------------------- | ----------------------- | ------ |
| `intro`             | Introdução ao quiz      | 1      |
| `name-collect`      | Coleta de nome          | 2      |
| `quiz-intro`        | Introdução às perguntas | 3      |
| `question-multiple` | Perguntas principais    | 4-14   |
| `quiz-transition`   | Transição               | 15     |
| `processing`        | Processamento           | 16     |
| `result-intro`      | Introdução ao resultado | 17     |
| `result-details`    | Detalhes do resultado   | 18     |
| `result-guide`      | Guia do resultado       | 19     |
| `offer-transition`  | Transição para oferta   | 20     |
| `offer-page`        | Página da oferta        | 21     |

---

# � **FONTE DOS CÓDIGOS DAS ETAPAS DO FUNIL**

## 🎯 **TEMPLATES ESPECÍFICOS IMPLEMENTADOS**

### ✅ **SISTEMA ATUALIZADO: TEMPLATES STEP01 a STEP21**

Agora o sistema está configurado para usar os **templates específicos** de cada etapa:

```
📁 TEMPLATES ESPECÍFICOS
├── /src/components/steps/Step01Template.tsx  ✅ IMPLEMENTADO
├── /src/components/steps/Step02Template.tsx  ✅ IMPLEMENTADO
├── /src/components/steps/Step03Template.tsx  ✅ IMPLEMENTADO
├── ... (todas as 21 etapas)
└── /src/components/steps/Step21Template.tsx  ✅ IMPLEMENTADO
```

---

## 🔧 **NOVA ARQUITETURA IMPLEMENTADA**

### 📋 **1. MAPEAMENTO CENTRAL: `/src/config/stepTemplatesMapping.ts`**

**NOVO ARQUIVO** que mapeia cada etapa para seu template específico:

```typescript
// ✅ IMPORTA TODOS OS TEMPLATES
import { getStep01Template } from '@/components/steps/Step01Template';
import { getStep02Template } from '@/components/steps/Step02Template';
// ... até Step21Template

// ✅ MAPEAMENTO COMPLETO
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
    name: 'Q1 - Tipo de Roupa',
    description: 'Qual o seu tipo de roupa favorita?',
  },
  // ... todas as 21 etapas
};
```

**🔧 FUNÇÕES UTILITÁRIAS:**

- `getStepTemplate(stepNumber)` - Retorna blocos do template específico
- `getStepInfo(stepNumber)` - Informações da etapa
- `getAllSteps()` - Lista todas as etapas
- `stepExists(stepNumber)` - Verifica se etapa existe

---

### 📋 **2. CONTEXT ATUALIZADO: `/src/context/EditorContext.tsx`**

O **EditorContext** agora:

✅ **Carrega templates automaticamente** quando uma etapa é selecionada  
✅ **Inicializa com dados dos templates específicos**  
✅ **Converte blocos de template para EditorBlocks**

```typescript
// ✅ CARREGAMENTO AUTOMÁTICO
const setActiveStage = useCallback(
  (stageId: string) => {
    // ... validações

    // ✅ CARREGAR TEMPLATE SE A ETAPA ESTIVER VAZIA
    const currentBlocks = stageBlocks[stageId] || [];
    if (currentBlocks.length === 0) {
      loadStageTemplate(stageId); // ✅ CARREGA TEMPLATE ESPECÍFICO
    }
  },
  [validateStageId, stageBlocks]
);

// ✅ FUNÇÃO DE CARREGAMENTO
const loadStageTemplate = useCallback(
  (stageId: string) => {
    const stepNumber = parseInt(stageId.replace('step-', ''));
    const templateBlocks = getStepTemplate(stepNumber); // ✅ USA TEMPLATE ESPECÍFICO

    // Converte para EditorBlocks e adiciona à etapa
  },
  [stages, updateStage]
);
```

---

### 📋 **3. TIPOS ATUALIZADOS: `/src/types/editor.ts`**

```typescript
export interface FunnelStage {
  id: string;
  name: string;
  order: number;
  type: 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer' | 'final';
  description?: string;
  isActive?: boolean;
  metadata?: {
    blocksCount?: number;
    lastModified?: Date;
    isCustom?: boolean;
    templateBlocks?: any[]; // ✅ NOVO: Suporte a blocos de template
  };
}
```

---

## 🎯 **COMO FUNCIONA AGORA**

### **1. Inicialização:**

- O `EditorContext` carrega informações das 21 etapas
- Cada etapa tem referência ao seu template específico
- Metadados incluem blocos de template

### **2. Seleção de Etapa:**

- Usuário clica em uma etapa no `FunnelStagesPanel`
- Se a etapa estiver vazia, carrega automaticamente o template específico
- Blocos do template são convertidos para `EditorBlocks`

### **3. Edição:**

- Usuário pode editar os blocos carregados do template
- Pode adicionar novos blocos via `EnhancedComponentsSidebar`
- Mudanças são salvas no estado da etapa

---

## 📊 **ETAPAS E SEUS TEMPLATES**

| Etapa | Template         | Nome                | Descrição                          |
| ----- | ---------------- | ------------------- | ---------------------------------- |
| 1     | `Step01Template` | Introdução          | Página inicial do quiz             |
| 2     | `Step02Template` | Q1 - Tipo de Roupa  | Qual o seu tipo de roupa favorita? |
| 3     | `Step03Template` | Q2 - Estilo Pessoal | Como você descreveria seu estilo?  |
| 4     | `Step04Template` | Q3 - Ocasiões       | Para quais ocasiões você se veste? |
| 5     | `Step05Template` | Q4 - Cores          | Quais cores você mais usa?         |
| ...   | ...              | ...                 | ...                                |
| 21    | `Step21Template` | Finalização         | Conclusão e próximos passos        |

---

## 🔧 **COMO EDITAR OS TEMPLATES**

### **Para Modificar um Template Específico:**

➡️ **Editar:** `/src/components/steps/StepXXTemplate.tsx`

Exemplo para Step01:

```typescript
// src/components/steps/Step01Template.tsx
export const getStep01Template = () => {
  return [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://...',
        title: 'Seu Título Personalizado',
        // ... outras propriedades
      },
    },
    // ... mais blocos
  ];
};
```

### **Para Modificar o Mapeamento:**

➡️ **Editar:** `/src/config/stepTemplatesMapping.ts`

- Alterar nomes das etapas
- Modificar descrições
- Ajustar metadados

---

## 🎯 **VANTAGENS DA NOVA IMPLEMENTAÇÃO**

✅ **Templates Específicos**: Cada etapa tem seu próprio template otimizado  
✅ **Carregamento Automático**: Templates são carregados quando necessário  
✅ **Manutenção Fácil**: Cada template é um arquivo separado  
✅ **Flexibilidade**: Pode combinar templates com edição manual  
✅ **Performance**: Carrega apenas os templates necessários  
✅ **Tipagem**: TypeScript garante consistência

---

## 📈 **STATUS ATUAL**

- ✅ **21 Templates**: Todos os StepXXTemplate implementados
- ✅ **Mapeamento**: Sistema de mapeamento funcionando
- ✅ **Context**: EditorContext atualizado para usar templates
- ✅ **Carregamento**: Automático quando etapa é selecionada
- ✅ **Tipagem**: Tipos atualizados para suportar templates
- ✅ **Integração**: Funciona com sistema de edição existente

**O sistema agora usa seus templates específicos Step01Template a Step21Template automaticamente!** 🎉
