# 🔬 Auditoria de Duplicações - Arquitetura Frontend

**Data**: 2025-12-04  
**Status**: 🔴 Crítico - Múltiplas fontes de verdade

---

## 1️⃣ ESTADO DUPLICADO - Context vs Zustand

### EditorStateProvider (Context)
**Arquivo**: `src/contexts/editor/EditorStateProvider.tsx` (561 linhas)

```typescript
export interface EditorState {
    currentStep: number;
    selectedBlockId: string | null;
    isPreviewMode: boolean;
    isEditing: boolean;
    dragEnabled: boolean;
    clipboardData: Block | null;
    stepBlocks: Record<number, Block[]>;
    dirtySteps: Record<number, boolean>;
    totalSteps: number;
    validationErrors: ValidationError[];
    isDirty: boolean;
    lastSaved: number | null;
    lastModified: number | null;
}
```

### editorStore (Zustand) - Global
**Arquivo**: `src/contexts/store/editorStore.ts` (372 linhas)

```typescript
interface EditorState {
  steps: EditorStep[];
  currentStepId: string | null;
  selectedBlockId: string | null;
  isEditMode: boolean;
  isPreviewMode: boolean;
  isDirty: boolean;
  isSaving: boolean;
  history: EditorStep[][];
  historyIndex: number;
  funnelId: string | null;
}
```

### useEditorStore (Zustand) - ModernQuizEditor
**Arquivo**: `src/components/editor/ModernQuizEditor/store/editorStore.ts` (124 linhas)

```typescript
interface EditorStore {
  selectedStepId: string | null;
  selectedBlockId: string | null;
  isPropertiesPanelOpen: boolean;
  isBlockLibraryOpen: boolean;
  isPreviewMode: boolean;
}
```

### 🔴 Problema Identificado

**3 fontes de verdade diferentes** para:
- `selectedBlockId` (presente em todos os 3)
- `isPreviewMode` (presente em todos os 3)
- `currentStep` / `currentStepId` / `selectedStepId` (presente em todos os 3)

**Resultado**: Componentes podem ver dados diferentes dependendo de qual store acessam.

---

## 2️⃣ HOOKS DUPLICADOS DO EDITOR

### Categoria: Editor Core (27+ arquivos)

#### Hooks Primários (conflitantes)
1. **`src/hooks/useEditor.ts`** - Hook principal de acesso ao Context
2. **`src/core/hooks/useEditor.ts`** - Versão duplicada em core/
3. **`src/hooks/useEditorPro.ts`** - Versão "Pro" com features extras
4. **`src/hooks/useEditorAdapter.ts`** - Adaptador entre versões
5. **`src/core/editor/hooks/useEditorAdapter.ts`** - Adaptador duplicado
6. **`src/core/editor/hooks/useEditorUnified.ts`** - Tentativa de unificação

#### Hooks de Funcionalidades Específicas (candidatos à consolidação)
7. `src/core/editor/hooks/useEditorBlocks.ts` - Gerenciamento de blocos
8. `src/core/editor/hooks/useEditorActions.ts` - Ações do editor
9. `src/core/editor/hooks/useEditorAutoSave.ts` - Auto-save
10. `src/core/editor/hooks/useEditorDragAndDrop.ts` - DnD
11. `src/core/editor/hooks/useEditorBootstrap.ts` - Inicialização
12. `src/core/editor/hooks/useEditorTemplates.ts` - Templates
13. `src/core/editor/hooks/useEditorPersistence.ts` - Persistência
14. `src/core/editor/hooks/useEditorHistory.ts` - Undo/Redo
15. `src/core/editor/hooks/useEditorTheme.ts` - Temas
16. `src/hooks/useEditorMode.ts` - Modo de edição
17. `src/hooks/useEditorDiagnostics.ts` - Diagnósticos

### Categoria: Quiz (20+ hooks)

1. **`useQuizLogic.ts`** - Lógica principal
2. **`useQuizLogicSimplified.ts`** - Versão simplificada (duplicada)
3. **`useQuizValidation.ts`** - Validação
4. **`useQuizResult.ts`** - Resultados
5. **`useQuizStages.ts`** - Estágios
6. **`useQuizRulesConfig.ts`** - Regras

### Categoria: Funnel (12+ hooks)

1. **`useFunnelLoader.ts`** - Carregamento (+ `useFunnelContext` dentro)
2. **`useFunnelNavigation.ts`** - Navegação
3. **`useFunnelComponents.ts`** - Componentes
4. **`useFunnelLivePreview.ts`** - Preview ao vivo
5. **`useFunnelFacebookMetrics.ts`** - Métricas

### Categoria: Template (10+ hooks)

1. **`useTemplateConfig.ts`** - Configuração
2. **`useTemplatePerformance.ts`** - Performance (+ `useQuiz21Performance`)

---

## 3️⃣ PLANO DE CONSOLIDAÇÃO

### Fase 1: Escolher Fonte Única de Verdade ✅

**Decisão**: Zustand como fonte única

**Razões**:
- Performance superior (re-renders seletivos)
- DevTools integrado
- Middleware rico (persist, immer, devtools)
- Melhor para estado global
- Mais simples de testar

### Fase 2: Criar Adapter de Migração

**Arquivo**: `src/hooks/useEditor.ts` (REFATORAR)

```typescript
/**
 * 🔄 Hook Adaptador - Migração Context → Zustand
 * 
 * Mantém API do Context mas usa Zustand internamente.
 * Permite migração gradual sem quebrar componentes existentes.
 */

import { useEditorStore } from '@/contexts/store/editorStore';
import type { EditorContextType } from '@/types/editor';

export function useEditor(): EditorContextType {
  const store = useEditorStore();
  
  // Mapear API do Zustand para API do Context
  return {
    // Estado
    currentStep: store.steps.find(s => s.id === store.currentStepId)?.order ?? 0,
    selectedBlockId: store.selectedBlockId,
    isPreviewMode: store.isPreviewMode,
    isEditing: store.isEditMode,
    isDirty: store.isDirty,
    
    // Ações
    setCurrentStep: (step: number) => {
      const stepId = store.steps.find(s => s.order === step)?.id;
      if (stepId) store.setCurrentStep(stepId);
    },
    selectBlock: store.setSelectedBlock,
    togglePreview: store.setPreviewMode,
    // ... resto das ações
  };
}
```

### Fase 3: Deprecar Hooks Duplicados

**Hooks a remover**:
- ❌ `useEditorPro.ts` → Use `useEditor()`
- ❌ `useEditorAdapter.ts` → Use `useEditor()`
- ❌ `useEditorUnified.ts` → Use `useEditor()`
- ❌ `useEditorMode.ts` → Use `useEditor().isPreviewMode`
- ❌ `src/core/hooks/useEditor.ts` → Use `src/hooks/useEditor.ts`

**Hooks a consolidar**:
- ✅ Manter `useEditor()` - Hook principal
- ✅ Manter `useEditorHistory()` - Undo/redo específico
- ✅ Manter `useEditorAutoSave()` - Auto-save específico

### Fase 4: Consolidar Hooks de Funcionalidades

#### Editor (27 → 3 hooks)
```typescript
// Manter apenas:
1. useEditor() - Estado e ações principais
2. useEditorHistory() - Undo/redo
3. useEditorAutoSave() - Persistência automática
```

#### Quiz (20 → 4 hooks)
```typescript
// Manter apenas:
1. useQuizLogic() - Lógica principal (consolidar simplificado)
2. useQuizValidation() - Validações
3. useQuizResult() - Resultados
4. useQuizNavigation() - Navegação entre steps
```

#### Funnel (12 → 3 hooks)
```typescript
// Manter apenas:
1. useFunnelLoader() - Carregamento e contexto
2. useFunnelNavigation() - Navegação
3. useFunnelMetrics() - Métricas (consolidar Facebook)
```

#### Template (10 → 2 hooks)
```typescript
// Manter apenas:
1. useTemplate() - Configuração e carregamento
2. useTemplatePerformance() - Performance
```

---

## 4️⃣ REDUÇÃO ESTIMADA

### Antes
- **Stores**: 3 fontes de verdade
- **Hooks**: 200+ hooks
- **Editor hooks**: 27 arquivos
- **Quiz hooks**: 20 arquivos
- **Funnel hooks**: 12 arquivos
- **Template hooks**: 10 arquivos

### Depois
- **Stores**: 1 fonte única (Zustand)
- **Hooks**: ~40 hooks canônicos
- **Editor hooks**: 3 arquivos
- **Quiz hooks**: 4 arquivos
- **Funnel hooks**: 3 arquivos
- **Template hooks**: 2 arquivos

### Benefícios
- ⚡ **Performance**: 6-8 → 1-2 re-renders por ação
- 🧹 **Manutenção**: -75% de arquivos para gerenciar
- 🐛 **Bugs**: Elimina inconsistências de estado
- 📚 **DX**: API mais clara e previsível

---

## 5️⃣ PRÓXIMOS PASSOS

1. ✅ **Corrigir erro de build** - ConsolidatedOverviewPage.tsx (COMPLETO)
2. 🔄 **Criar useEditor adapter** - Migração Context → Zustand
3. 🔄 **Deprecar hooks duplicados** - Adicionar warnings
4. 🔄 **Consolidar hooks de funcionalidades** - Reduzir 200+ → 40
5. 🔄 **Atualizar documentação** - Guias de migração

---

## 📊 STATUS ATUAL

- ✅ Build corrigido
- 🔄 Auditoria completa de duplicações
- ⏳ Migração para Zustand pendente
- ⏳ Consolidação de hooks pendente
