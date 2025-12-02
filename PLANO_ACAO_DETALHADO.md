# 🎯 PLANO DE AÇÃO DETALHADO - CORREÇÃO DE GARGALOS

**Data:** 2 de dezembro de 2025  
**Versão:** 1.0  
**Status:** ✅ Pronto para execução

---

## 📋 VISÃO GERAL

Este documento contém o plano de ação detalhado para corrigir os gargalos arquiteturais identificados na auditoria técnica. Cada tarefa inclui:
- Descrição clara do que fazer
- Arquivos envolvidos
- Estimativa de tempo
- Critérios de aceite
- Riscos específicos

---

## 🔴 FASE 0: CORREÇÃO EMERGENCIAL

**Objetivo:** Restaurar build funcional  
**Duração:** 1-2 dias  
**Responsável:** Desenvolvedor sênior

---

### TAREFA 0.1: Corrigir import de TemplateDiagnosticPage

**Status:** 🟡 Pendente  
**Tempo estimado:** 5 minutos  
**Impacto:** Build passa (1 erro resolvido)

**Problema:**
```typescript
// src/App.tsx:59
const TemplateDiagnosticPage = lazy(() => import('./pages/TemplateDiagnosticPage'));
// ❌ ERRO: Arquivo não existe em ./pages/TemplateDiagnosticPage
// ✅ Arquivo real: ./pages/dashboard/.obsolete/TemplateDiagnosticPage.tsx
```

**Solução A (Preferida - Mover arquivo):**
```bash
# Mover arquivo de volta
mv src/pages/dashboard/.obsolete/TemplateDiagnosticPage.tsx src/pages/TemplateDiagnosticPage.tsx
```

**Solução B (Alternativa - Remover rota):**
```typescript
// Remover linhas 59 e 333-337 do App.tsx
// Linha 59: remover lazy import
// Linhas 333-337: remover <Route path="/debug/templates">
```

**Critério de aceite:**
- [ ] Sem erro "Could not resolve ./pages/TemplateDiagnosticPage"
- [ ] Rota /debug/templates funciona OU está removida

---

### TAREFA 0.2: Criar tipos faltantes para EditorCompatAPI

**Status:** 🟡 Pendente  
**Tempo estimado:** 2 horas  
**Impacto:** -12 erros TypeScript

**Arquivos afetados:**
- `src/core/contexts/EditorContext/EditorCompatLayer.tsx`
- `src/core/hooks/useEditorContext.ts`
- `src/components/editor/renderers/common/UnifiedStepContent.tsx`
- `src/components/editor/result/ResultPageBuilder.tsx`
- `src/components/editor/universal/UniversalStepEditorPro.tsx`

**Problema:**
```typescript
// EditorCompatAPI não tem as propriedades esperadas:
// - actions
// - addBlock
// - updateBlock
// - removeBlock
// - setCurrentStep
// - reorderBlocks
// - getStepBlocks
// - setStepBlocks
// - currentStep
```

**Solução:**
```typescript
// Atualizar src/core/contexts/EditorContext/EditorCompatLayer.tsx
export interface EditorCompatAPI {
  // Propriedades de estado
  currentStep: QuizStep | null;
  selectedBlockId: string | null;
  
  // Ações
  actions: {
    addBlock: (stepId: string, block: Block) => void;
    updateBlock: (stepId: string, blockId: string, updates: Partial<Block>) => void;
    removeBlock: (stepId: string, blockId: string) => void;
    reorderBlocks: (stepId: string, blockIds: string[]) => void;
    getStepBlocks: (stepId: string) => Block[];
    setStepBlocks: (stepId: string, blocks: Block[]) => void;
    setCurrentStep: (step: QuizStep) => void;
  };
  
  // Métodos diretos (aliases para retrocompatibilidade)
  addBlock: (stepId: string, block: Block) => void;
  updateBlock: (stepId: string, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (stepId: string, blockId: string) => void;
}
```

**Critério de aceite:**
- [ ] Sem erros "Property 'actions' does not exist"
- [ ] Sem erros "Property 'addBlock' does not exist"
- [ ] Testes unitários do EditorContext passam

---

### TAREFA 0.3: Adicionar RichText ao escopo global

**Status:** 🟡 Pendente  
**Tempo estimado:** 30 minutos  
**Impacto:** -3 erros TypeScript

**Arquivos afetados:**
- `src/components/blocks/inline/QuizIntroHeaderBlock.tsx` (2 erros)
- `src/components/funnel-blocks/QuizQuestion.tsx` (1 erro)

**Problema:**
```typescript
// Linha 223, 231: error TS2304: Cannot find name 'RichText'
<RichText content={...} />
```

**Solução:**
```typescript
// 1. Verificar se RichText existe em algum lugar
// 2. Se existir, adicionar import correto
// 3. Se não existir, criar componente ou substituir por alternativa

// Opção A: Adicionar import (se RichText existe)
import { RichText } from '@/components/ui/RichText';

// Opção B: Substituir por componente equivalente
// import { RichTextRenderer } from '@/components/shared/RichTextRenderer';
// <RichTextRenderer content={...} />

// Opção C: Criar componente simples
// src/components/ui/RichText.tsx
export const RichText: React.FC<{ content: string }> = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
);
```

**Critério de aceite:**
- [ ] Sem erros "Cannot find name 'RichText'"
- [ ] Componente renderiza HTML corretamente

---

### TAREFA 0.4: Corrigir props de UnifiedStepRenderer

**Status:** 🟡 Pendente  
**Tempo estimado:** 1 hora  
**Impacto:** -2 erros TypeScript

**Arquivos afetados:**
- `src/components/editor/modes/QuizEditorMode.tsx` (linha 423)
- `src/components/quiz/QuizApp.tsx` (linha 216)

**Problema:**
```typescript
// error TS2322: Property 'step' does not exist on type 'UnifiedStepRendererProps'
<UnifiedStepRenderer step={step} mode="preview" />
```

**Solução:**
```typescript
// 1. Verificar UnifiedStepRendererProps
// src/components/editor/renderers/UnifiedStepRenderer.tsx

// 2. A prop 'step' pode ter sido renomeada ou o componente mudou
// Verificar qual é a prop correta atual

// 3. Atualizar chamadas ou atualizar interface
interface UnifiedStepRendererProps {
  step: QuizStep;  // Adicionar se estiver faltando
  mode: 'preview' | 'edit';
  // ...outras props
}
```

**Critério de aceite:**
- [ ] Sem erros "Property 'step' does not exist"
- [ ] Preview de steps funciona corretamente

---

## 🟠 FASE 1: CONSOLIDAÇÃO DE TIPOS

**Objetivo:** Reduzir fragmentação de tipos de 67 para 15 arquivos  
**Duração:** 1 semana  
**Responsável:** Equipe frontend

---

### TAREFA 1.1: Unificar definições de Block

**Status:** 🟡 Pendente  
**Tempo estimado:** 4 horas

**Arquivos a consolidar:**
```
src/types/Block.ts          → MANTER (renomear para block.types.ts)
src/types/blockTypes.ts     → DEPRECAR (mover para block.types.ts)
src/types/blockComponentProps.ts → DEPRECAR
src/types/blocks.ts         → DEPRECAR
```

**Novo arquivo unificado:**
```typescript
// src/types/block.types.ts
import { z } from 'zod';

// Schema Zod (fonte de verdade)
export const BlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  props: z.record(z.unknown()),
  children: z.array(z.lazy(() => BlockSchema)).optional(),
});

// Tipo TypeScript derivado
export type Block = z.infer<typeof BlockSchema>;

// Props de componentes de bloco
export interface BlockComponentProps<T = unknown> {
  block: Block;
  isEditing: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  customProps?: T;
}

// Re-exports para retrocompatibilidade
export type { Block as BlockType };
export type { BlockComponentProps as BlockProps };
```

**Migrações necessárias:**
```typescript
// Antes
import { Block } from '@/types/Block';
import { BlockType } from '@/types/blockTypes';

// Depois
import { Block, BlockType } from '@/types/block.types';
```

---

### TAREFA 1.2: Unificar definições de Editor

**Status:** 🟡 Pendente  
**Tempo estimado:** 4 horas

**Arquivos a consolidar:**
```
src/types/editor.ts           → DEPRECAR
src/types/editor.interface.ts → DEPRECAR
src/types/editor-lite.ts      → DEPRECAR
src/types/editorTypes.ts      → DEPRECAR
src/types/editorActions.ts    → DEPRECAR
```

**Novo arquivo unificado:**
```typescript
// src/types/editor.types.ts
import { z } from 'zod';
import type { QuizStep, Block } from '@/schemas/quiz-schema.zod';

// Estado do editor
export interface EditorState {
  currentStepId: string | null;
  selectedBlockId: string | null;
  mode: 'edit' | 'preview';
  isDirty: boolean;
  lastSaved: Date | null;
}

// Ações do editor
export interface EditorActions {
  selectStep: (stepId: string) => void;
  selectBlock: (blockId: string | null) => void;
  setMode: (mode: 'edit' | 'preview') => void;
  addBlock: (stepId: string, block: Block) => void;
  updateBlock: (stepId: string, blockId: string, updates: Partial<Block>) => void;
  removeBlock: (stepId: string, blockId: string) => void;
  save: () => Promise<void>;
}

// API completa do editor
export interface EditorAPI extends EditorState, EditorActions {}
```

---

### TAREFA 1.3: Criar barrel exports limpos

**Status:** 🟡 Pendente  
**Tempo estimado:** 2 horas

**Novo arquivo de índice:**
```typescript
// src/types/index.ts

// Tipos canônicos (usar estes)
export * from './block.types';
export * from './editor.types';
export * from './quiz.types';
export * from './funnel.types';

// Re-exports de schemas Zod
export * from '@/schemas/quiz-schema.zod';

// DEPRECATED - Remover em v5.0
// @deprecated Use block.types em vez disso
export * from './Block';
// @deprecated Use editor.types em vez disso
export * from './editor';
```

---

## 🟠 FASE 2: CONSOLIDAÇÃO DE HOOKS

**Objetivo:** Reduzir de 216 para ~50 hooks  
**Duração:** 2 semanas

---

### TAREFA 2.1: Consolidar useQuiz* (25 → 3)

**Hooks a manter:**
1. `useQuizCore` - Estado e navegação do quiz
2. `useQuizResults` - Cálculo de resultados
3. `useQuizPersistence` - Salvar/carregar respostas

**Hooks a deprecar:**
```
useQuizAnalytics.ts        → Mover para useQuizCore
useQuizBackendIntegration.ts → Mover para useQuizPersistence
useQuizBuilder.ts          → Remover (não usado)
useQuizCRUD.ts             → Mover para useQuizPersistence
useQuizComponents.ts       → Remover (não usado)
useQuizConfig.ts           → Mover para useQuizCore
useQuizFormEvents.ts       → Mover para useQuizCore
useQuizLogic.ts            → Consolidar em useQuizCore
useQuizLogicSimplified.ts  → Consolidar em useQuizCore
useQuizNavigation.ts       → Consolidar em useQuizCore
useQuizOptimizations.ts    → Remover (otimização prematura)
useQuizQuestion.ts         → Consolidar em useQuizCore
useQuizRealTimeAnalytics.ts → Mover para useQuizCore
useQuizResult.ts           → Mover para useQuizResults
useQuizResultConfig.ts     → Mover para useQuizResults
useQuizResultEditor.ts     → Mover para useQuizResults
useQuizRulesConfig.ts      → Mover para useQuizResults
useQuizStages.ts           → Consolidar em useQuizCore
useQuizState.ts            → Consolidar em useQuizCore
useQuizTracking.ts         → Mover para useQuizCore
useQuizUserProgress.ts     → Mover para useQuizPersistence
useQuizV4Loader.ts         → Mover para useQuizPersistence
useQuizValidation.ts       → Consolidar em useQuizCore
```

---

### TAREFA 2.2: Consolidar useEditor* (12 → 2)

**Hooks a manter:**
1. `useEditorState` - Estado do editor (Zustand)
2. `useEditorActions` - Ações do editor

**Hooks a deprecar:**
```
useEditor.ts                  → Consolidar em useEditorState
useEditorAdapter.ts           → Remover (bridge desnecessária)
useEditorDiagnostics.ts       → Remover (debug only)
useEditorElements.ts          → Consolidar em useEditorState
useEditorFieldValidation.ts   → Mover para useEditorActions
useEditorHistory.ts           → Mover para useEditorActions
useEditorMode.ts              → Consolidar em useEditorState
useEditorPersistence.ts       → Mover para useEditorActions
useEditorPro.ts               → Remover (feature flag?)
useEditorReusableComponents.simple.ts → Remover
useEditorSupabase.ts          → Mover para useEditorActions
useEditorSupabaseIntegration.ts → Consolidar
```

---

## 📝 CHECKLIST DE EXECUÇÃO

### Fase 0 (Emergência)
- [ ] 0.1 Corrigir import TemplateDiagnosticPage
- [ ] 0.2 Criar tipos para EditorCompatAPI
- [ ] 0.3 Resolver RichText
- [ ] 0.4 Corrigir UnifiedStepRenderer props
- [ ] **Validação:** `npm run type-check` sem erros
- [ ] **Validação:** `npm run build` passa

### Fase 1 (Tipos)
- [ ] 1.1 Unificar Block types
- [ ] 1.2 Unificar Editor types
- [ ] 1.3 Unificar Quiz types
- [ ] 1.4 Criar barrel exports
- [ ] **Validação:** Todos os imports funcionam
- [ ] **Validação:** Testes de tipo passam

### Fase 2 (Hooks)
- [ ] 2.1 Consolidar useQuiz* (25 → 3)
- [ ] 2.2 Consolidar useEditor* (12 → 2)
- [ ] 2.3 Consolidar useTemplate* (8 → 2)
- [ ] 2.4 Consolidar useUnified* (9 → 2)
- [ ] 2.5 Consolidar useFunnel* (9 → 2)
- [ ] **Validação:** Testes E2E passam
- [ ] **Validação:** Funcionalidades preservadas

---

## 📊 MÉTRICAS DE ACOMPANHAMENTO

| Fase | Métrica | Antes | Depois | Status |
|------|---------|-------|--------|--------|
| 0 | Erros TypeScript | 48 | 0 | 🟡 |
| 1 | Arquivos de tipos | 67 | 15 | 🟡 |
| 2 | Total de hooks | 216 | 50 | 🟡 |
| 3 | Total de services | 227 | 35 | 🟡 |
| 4 | Providers aninhados | 16 | 5 | 🟡 |

---

**Documento criado em:** 2025-12-02  
**Última atualização:** 2025-12-02  
**Próxima revisão:** Após conclusão da Fase 0
