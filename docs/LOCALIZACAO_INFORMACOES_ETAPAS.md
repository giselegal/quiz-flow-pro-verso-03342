# 📍 Localização das Informações das Etapas no Código

## 🎯 **Principais Arquivos com Dados das Etapas**

### 1️⃣ **EditorContext.tsx - Estado Central das Etapas**

**Localização:** `src/context/EditorContext.tsx` (linhas 124-191)

```typescript
const [stages, setStages] = useState<FunnelStage[]>(() => {
  // ✅ INICIALIZAÇÃO COM 21 ETAPAS BASEADAS EM TEMPLATES
  const allStepTemplates = STEP_TEMPLATES;

  const initialStages = allStepTemplates.map((stepTemplate, index) => ({
    id: `step-${stepTemplate.stepNumber}`,           // step-1, step-2, etc.
    name: stepTemplate.name,                         // "Quiz Intro", "Pergunta 1", etc.
    order: stepTemplate.stepNumber,                  // 1, 2, 3, etc.
    type: /* Tipo baseado no número da etapa */,     // "intro", "question", "result", etc.
    description: stepTemplate.description,           // Descrição da etapa
    isActive: stepTemplate.stepNumber === 1,         // Primeira etapa ativa por padrão
    metadata: {
      blocksCount: 0,
      lastModified: new Date(),
      isCustom: false,
      templateBlocks: getTemplateByStep(stepTemplate.stepNumber)?.templateFunction() || []
    }
  }));

  return initialStages; // Retorna as 21 etapas
});
```

### 2️⃣ **stepTemplatesMapping.ts - Configuração das 21 Etapas**

**Localização:** `src/config/stepTemplatesMapping.ts` (linhas 32-110)

```typescript
export const STEP_TEMPLATES: StepTemplate[] = [
  {
    stepNumber: 1,
    templateFunction: getStep01Template,
    name: 'Quiz Intro',
    description: 'Tela inicial com nome',
  },
  {
    stepNumber: 2,
    templateFunction: getStep02Template,
    name: 'Pergunta 1',
    description: 'Tipo de roupa favorita',
  },
  {
    stepNumber: 3,
    templateFunction: getStep03Template,
    name: 'Pergunta 2',
    description: 'Personalidade',
  },
  // ... continua até step 21
  {
    stepNumber: 21,
    templateFunction: getStep21Template,
    name: 'Oferta Final',
    description: 'Página de conversão',
  },
];
```

### 3️⃣ **funnelStages.ts - Dados Detalhados das Etapas**

**Localização:** `src/data/funnelStages.ts` (linhas 12-300)

```typescript
export const defaultFunnelStages: FunnelStage[] = [
  // Step 1 - Introdução
  {
    id: 'step-1',
    name: 'Introdução',
    description: 'Página inicial do quiz',
    order: 1,
    type: 'intro',
    isActive: true,
    metadata: {
      blocksCount: 8,
      lastModified: new Date(),
      isCustom: false,
    },
  },

  // Steps 2-14 - Questões do Quiz
  {
    id: 'step-2',
    name: 'Q1 - Tipo de Roupa',
    description: 'Qual o seu tipo de roupa favorita?',
    order: 2,
    type: 'question',
    isActive: false,
    metadata: {
      blocksCount: 6,
      lastModified: new Date(),
      isCustom: false,
    },
  },

  // ... continua com todas as 21 etapas definidas
];
```

### 4️⃣ **FunnelStagesPanel.tsx - Componente que Renderiza as Etapas**

**Localização:** `src/components/editor/funnel/FunnelStagesPanel.tsx` (linhas 26-40)

```typescript
const {
  stages, // ← Array com as 21 etapas
  activeStageId, // ← ID da etapa ativa atual
  stageActions: {
    setActiveStage, // ← Função para mudar etapa ativa
    addStage,
    removeStage,
    updateStage,
  },
  blockActions: { getBlocksForStage }, // ← Pega blocos de uma etapa
  computed: { stageCount }, // ← Total de etapas (21)
} = useEditor();
```

## 🎯 **Interface TypeScript das Etapas**

**Localização:** `src/types/editor.ts` (linhas 277-295)

```typescript
export interface FunnelStage {
  id: string; // "step-1", "step-2", etc.
  name: string; // "Quiz Intro", "Pergunta 1", etc.
  order: number; // 1, 2, 3, ... 21
  type: 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer' | 'final';
  description?: string; // Descrição da etapa
  isActive?: boolean; // Se é a etapa ativa
  metadata?: {
    blocksCount?: number; // Quantos blocos tem na etapa
    lastModified?: Date; // Última modificação
    isCustom?: boolean; // Se é etapa customizada
    templateBlocks?: any[]; // Blocos do template da etapa
  };
}
```

## 🔄 **Como as Etapas São Carregadas**

```typescript
// 1. EditorProvider inicializa (EditorContext.tsx:124)
const [stages, setStages] = useState<FunnelStage[]>(() => {

  // 2. Carrega templates das 21 etapas (stepTemplatesMapping.ts)
  const allStepTemplates = STEP_TEMPLATES;

  // 3. Mapeia cada template para uma FunnelStage
  const initialStages = allStepTemplates.map((stepTemplate) => ({
    id: `step-${stepTemplate.stepNumber}`,
    name: stepTemplate.name,
    order: stepTemplate.stepNumber,
    type: /* Determinado pelo número da etapa */,
    // ... outras propriedades
  }));

  // 4. Retorna as 21 etapas inicializadas
  return initialStages;
});

// 5. FunnelStagesPanel renderiza as etapas na coluna esquerda
const { stages } = useEditor();
stages.map(stage => <StageItem key={stage.id} stage={stage} />)
```

## 🎨 **Como Usar as Informações das Etapas**

```typescript
// Para acessar as etapas em qualquer componente:
const {
  stages, // Array com todas as 21 etapas
  activeStageId, // ID da etapa atual ("step-1", "step-2", etc.)
  stageActions, // Funções para manipular etapas
} = useEditor();

// Exemplos de uso:
console.log('Total de etapas:', stages.length); // 21
console.log('Etapa ativa:', activeStageId); // "step-1"
console.log('Nome da etapa ativa:', stages.find(s => s.id === activeStageId)?.name); // "Quiz Intro"

// Mudar para próxima etapa:
const currentIndex = stages.findIndex(s => s.id === activeStageId);
const nextStage = stages[currentIndex + 1];
if (nextStage) {
  stageActions.setActiveStage(nextStage.id);
}
```

## 🏆 **Resumo dos Locais Importantes**

| Arquivo                     | Localização                                                | O que Contém                    |
| --------------------------- | ---------------------------------------------------------- | ------------------------------- |
| **EditorContext.tsx**       | `src/context/EditorContext.tsx:124-191`                    | ✅ Estado central das 21 etapas |
| **stepTemplatesMapping.ts** | `src/config/stepTemplatesMapping.ts:32-110`                | ✅ Configuração dos templates   |
| **funnelStages.ts**         | `src/data/funnelStages.ts:12-300`                          | ✅ Dados detalhados das etapas  |
| **FunnelStagesPanel.tsx**   | `src/components/editor/funnel/FunnelStagesPanel.tsx:26-40` | ✅ Renderização das etapas      |
| **editor.ts**               | `src/types/editor.ts:277-295`                              | ✅ Interface TypeScript         |

**As informações das 21 etapas estão centralizadas no EditorContext e são carregadas a partir dos templates configurados!** 🎯
