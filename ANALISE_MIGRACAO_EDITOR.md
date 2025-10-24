# 🔍 ANÁLISE COMPLETA - Migração do Editor para Canonical Services

## 📋 Rota Analisada
`/editor?template=quiz21StepsComplete`

---

## 🗺️ Fluxo Atual da Aplicação

### 1. **App.tsx** → Entry Point
```tsx
// Linha 150-232: Rota do editor
<Route path="/editor">
  <EditorErrorBoundary>
    <EditorProviderUnified enableSupabase={true}>
      <QuizModularProductionEditor />
    </EditorProviderUnified>
  </EditorErrorBoundary>
</Route>
```

**Providers Envolvidos**:
- `UnifiedAppProvider` (linha 140)
- `EditorProviderUnified` (linha 227)
- `EditorErrorBoundary` (linha 225)

---

## 🏗️ Componentes e Serviços DEPRECATED

### ❌ 1. **PureBuilderProvider** (DEPRECATED)
**Arquivo**: `src/components/editor/PureBuilderProvider.tsx`

**Status**: 
```typescript
⚠️ DEPRECATED - USE SuperUnifiedProvider
// Linha 3: "Este provider foi migrado para SuperUnifiedProvider."
// Linha 346: Warning ativo sobre deprecation
```

**Usado Por**:
- `CanvasDropZone.simple.tsx` (linha 15, 250)
- `OptionsGridBlock.tsx` (linha 5, 163)

**Imports Deprecated**:
```typescript
import { HybridTemplateService } from '@/services/aliases'; // linha 19
import { AIEnhancedHybridTemplateService } from '@/services/AIEnhancedHybridTemplateService'; // linha 22
```

---

### ❌ 2. **HybridTemplateService** (DEPRECATED)
**Arquivo**: `src/services/HybridTemplateService.ts`

**Status**:
```typescript
⚠️ DEPRECATED: HybridTemplateService está descontinuado.
Use: import { templateService } from '@/services/canonical/TemplateService'
Será removido em: v2.0.0
```

**Usado Por**:
- `PureBuilderProvider.tsx`
- Services legados via aliases

---

### ❌ 3. **UnifiedTemplateService** (DEPRECATED)
**Arquivo**: `src/services/UnifiedTemplateService.ts`

**Status**:
```typescript
⚠️ DEPRECATED: UnifiedTemplateService está descontinuado.
Use: import { templateService } from '@/services/canonical/TemplateService'
Será removido em: v2.0.0
```

---

### ❌ 4. **AIEnhancedHybridTemplateService** (DEPRECATED)
**Arquivo**: `src/services/AIEnhancedHybridTemplateService.ts`

**Usado Por**:
- `PureBuilderProvider.tsx` (linha 190, 199)
- Inicialização de IA no editor

---

## 📦 Componentes Principais do Editor

### 1. **QuizModularProductionEditor** (Principal)
**Arquivo**: `src/components/editor/quiz/QuizModularProductionEditor.tsx`

**Tamanho**: 3132 linhas

**Imports Críticos**:
```typescript
// Linha 19-22: Imports diversos
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { quizEditorBridge } from '@/services/QuizEditorBridge';
import { unifiedCacheService } from '@/services/UnifiedCacheService';
import { StepHistoryService } from '@/services/canonical/StepHistoryService'; // ✅ Canônico

// Template loading
import { loadStepTemplate } from '@/utils/loadStepTemplates';
import { loadQuizStep, loadAllQuizSteps } from '@/data/quizStepsLazy';
import { getQuiz21StepsTemplate } from '@/templates/imports';
```

**Hooks Usados**:
- `useEditor()` - EditorProviderUnified
- `usePanelWidths()`
- `useEditorHistory()`
- `useStepsBlocks()`
- `useBlocks()`
- `useSelectionClipboard()`
- `useVirtualBlocks()`
- `useLiveScoring()`
- `useValidation()`
- `useUnsavedChanges()`

---

### 2. **EditorProviderUnified**
**Arquivo**: `src/components/editor/EditorProviderUnified`

**Status**: ✅ Provider atual (não deprecated)

**Responsabilidades**:
- Gerenciar estado do editor
- Integração com Supabase
- Context para hooks do editor

---

### 3. **Componentes de Canvas**

#### CanvasArea
**Arquivo**: `src/components/editor/quiz/components/CanvasArea.tsx`

**Funcionalidade**:
- Drop zone principal
- Preview de blocos
- Integração com drag & drop

#### CanvasDropZone.simple
**Arquivo**: `src/components/editor/canvas/CanvasDropZone.simple.tsx`

**PROBLEMA**:
```typescript
// Linha 15: Usa PureBuilderProvider deprecated
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';

// Linha 250
const { state } = usePureBuilder();
```

---

### 4. **Blocos do Editor**

#### OptionsGridBlock
**Arquivo**: `src/components/editor/blocks/OptionsGridBlock.tsx`

**PROBLEMA**:
```typescript
// Linha 5: Usa PureBuilderProvider deprecated
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';

// Linha 163
const { state } = usePureBuilder();
```

---

## 🔄 Services Atuais vs Canonical

### Template Services

| Service Atual (Deprecated) | Canonical Replacement |
|---|---|
| `HybridTemplateService` | `TemplateService` (canonical) |
| `UnifiedTemplateService` | `TemplateService` (canonical) |
| `AIEnhancedHybridTemplateService` | `TemplateService` (canonical) |
| `stepTemplateService` | `TemplateService` (canonical) |
| `UnifiedTemplateRegistry` | `TemplateService` (canonical) |
| `JsonTemplateService` | `TemplateService` (canonical) |
| `TemplateEditorService` | `TemplateService` (canonical) |

### Editor Services

| Service Atual | Canonical Replacement |
|---|---|
| `PureBuilderProvider` | `EditorService` (canonical) |
| `EditorStateManager` | `EditorService` (canonical) |
| `BlockEditorService` | `EditorService` (canonical) |
| `QuizEditorService` | `EditorService` (canonical) |

### Cache Services

| Service Atual | Canonical Replacement |
|---|---|
| `UnifiedCacheService` | `CacheService` (canonical) |
| `TemplatesCacheService` | `CacheService` (canonical) |
| `EditorCacheService` | `CacheService` (canonical) |

---

## 🎯 Plano de Migração Detalhado

### Fase 1: Atualizar Imports Deprecated

#### 1.1 PureBuilderProvider → EditorService

**Arquivos Afetados**:
- `src/components/editor/canvas/CanvasDropZone.simple.tsx`
- `src/components/editor/blocks/OptionsGridBlock.tsx`

**Antes**:
```typescript
import { usePureBuilder } from '@/hooks/usePureBuilderCompat';

const { state, actions } = usePureBuilder();
```

**Depois**:
```typescript
import { EditorService } from '@/services/canonical/EditorService';

const editorService = EditorService.getInstance();
const blocks = editorService.getAllBlocks();
```

---

#### 1.2 HybridTemplateService → TemplateService

**Arquivos Afetados**:
- `src/components/editor/PureBuilderProvider.tsx`

**Antes**:
```typescript
import { HybridTemplateService } from '@/services/aliases';

const template = await HybridTemplateService.getTemplate(id);
```

**Depois**:
```typescript
import { TemplateService } from '@/services/canonical/TemplateService';

const templateService = TemplateService.getInstance();
const result = await templateService.getTemplate(id);
if (result.success) {
  const template = result.data;
}
```

---

#### 1.3 UnifiedCacheService → CacheService

**Arquivos Afetados**:
- `src/components/editor/quiz/QuizModularProductionEditor.tsx`

**Antes**:
```typescript
import { unifiedCacheService } from '@/services/UnifiedCacheService';

unifiedCacheService.set('key', data);
```

**Depois**:
```typescript
import { cacheService } from '@/services/canonical/CacheService';

cacheService.set('key', data);
```

---

### Fase 2: Migrar QuizModularProductionEditor

#### 2.1 Atualizar Hooks

**Criar novo hook**: `useCanonicalEditor`
```typescript
// src/hooks/useCanonicalEditor.ts
import { useState, useCallback, useEffect } from 'react';
import { EditorService } from '@/services/canonical/EditorService';
import { TemplateService } from '@/services/canonical/TemplateService';

export function useCanonicalEditor(templateId?: string) {
  const editorService = EditorService.getInstance({
    autoSave: { enabled: true, interval: 30000, debounce: 2000 },
    persistState: true,
    validateOnChange: true
  });
  
  const templateService = TemplateService.getInstance();
  
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Carregar template inicial
  useEffect(() => {
    if (templateId) {
      loadTemplate(templateId);
    }
  }, [templateId]);
  
  const loadTemplate = useCallback(async (id: string) => {
    const result = await templateService.getTemplate(id);
    if (result.success && result.data) {
      const blocksResult = editorService.getAllBlocks();
      if (blocksResult.success) {
        setBlocks(blocksResult.data);
      }
    }
  }, [templateService, editorService]);
  
  const createBlock = useCallback(async (block: any) => {
    const result = editorService.createBlock(block);
    if (result.success) {
      const blocksResult = editorService.getAllBlocks();
      if (blocksResult.success) {
        setBlocks(blocksResult.data);
      }
    }
    return result;
  }, [editorService]);
  
  const updateBlock = useCallback(async (id: string, updates: any) => {
    const result = editorService.updateBlock(id, updates);
    if (result.success) {
      const blocksResult = editorService.getAllBlocks();
      if (blocksResult.success) {
        setBlocks(blocksResult.data);
      }
    }
    return result;
  }, [editorService]);
  
  const deleteBlock = useCallback(async (id: string) => {
    const result = editorService.deleteBlock(id);
    if (result.success) {
      const blocksResult = editorService.getAllBlocks();
      if (blocksResult.success) {
        setBlocks(blocksResult.data);
      }
    }
    return result;
  }, [editorService]);
  
  const reorderBlocks = useCallback(async (oldIndex: number, newIndex: number) => {
    // Implementar usando moveBlock do EditorService
    const allBlocks = editorService.getAllBlocks();
    if (allBlocks.success && allBlocks.data) {
      const block = allBlocks.data[oldIndex];
      if (block) {
        const result = editorService.moveBlock(block.id, newIndex);
        if (result.success) {
          const blocksResult = editorService.getAllBlocks();
          if (blocksResult.success) {
            setBlocks(blocksResult.data);
          }
        }
      }
    }
  }, [editorService]);
  
  return {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    editorService,
    templateService
  };
}
```

---

#### 2.2 Atualizar QuizModularProductionEditor

**Antes**:
```typescript
import { useEditor } from '@/components/editor/EditorProviderUnified';

function QuizModularProductionEditor() {
  const { state, actions } = useEditor();
  // ...
}
```

**Depois**:
```typescript
import { useCanonicalEditor } from '@/hooks/useCanonicalEditor';

function QuizModularProductionEditor() {
  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    createBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks
  } = useCanonicalEditor('quiz21StepsComplete');
  
  // ...
}
```

---

### Fase 3: Atualizar Template Persistence

#### 3.1 Integrar com EditorService Auto-Save

**Arquivo**: `src/services/persistence/TemplatePersistenceService.ts`

**Status**: ✅ Já migrado (sessão anterior)

**Verificar**:
- EditorService auto-save configurado
- Events listeners para mudanças
- API backend conectada

---

### Fase 4: Remover Código Deprecated

#### 4.1 Deprecar Definitivamente

**Arquivos para Marcar**:
- `src/components/editor/PureBuilderProvider.tsx` → Adicionar throw error
- `src/hooks/usePureBuilderCompat.ts` → Adicionar throw error
- `src/services/HybridTemplateService.ts` → Adicionar throw error
- `src/services/UnifiedTemplateService.ts` → Adicionar throw error

**Exemplo**:
```typescript
// PureBuilderProvider.tsx
export const usePureBuilder = () => {
  throw new Error(
    '🚨 PureBuilderProvider is deprecated and removed. ' +
    'Use: import { useCanonicalEditor } from "@/hooks/useCanonicalEditor"'
  );
};
```

---

## 📊 Matriz de Dependências

### Componentes que Precisam Migração

| Componente | Usa Deprecated | Prioridade | Esforço |
|---|---|---|---|
| `QuizModularProductionEditor` | ❌ Parcial | Alta | Alto |
| `CanvasDropZone.simple` | ✅ Sim (usePureBuilder) | Alta | Médio |
| `OptionsGridBlock` | ✅ Sim (usePureBuilder) | Alta | Baixo |
| `EditorProviderUnified` | ❌ Não | - | - |
| `CanvasArea` | ❌ Não | - | - |
| `PropertiesPanel` | ❌ Não | - | - |

---

### Services que Precisam Migração

| Service | Status | Replacement | Prioridade |
|---|---|---|---|
| `PureBuilderProvider` | Deprecated | `EditorService` | Alta |
| `HybridTemplateService` | Deprecated | `TemplateService` | Alta |
| `UnifiedTemplateService` | Deprecated | `TemplateService` | Alta |
| `AIEnhancedHybridTemplateService` | Deprecated | `TemplateService` | Média |
| `UnifiedCacheService` | Deprecated | `CacheService` | Média |
| `quizEditorBridge` | Ativo | Verificar necessidade | Baixa |

---

## �� Cronograma de Migração

### Sprint 1 (1 semana)
- [ ] Criar `useCanonicalEditor` hook
- [ ] Migrar `CanvasDropZone.simple` 
- [ ] Migrar `OptionsGridBlock`
- [ ] Atualizar `QuizModularProductionEditor` (imports)

### Sprint 2 (1 semana)
- [ ] Refatorar template loading
- [ ] Integrar EditorService auto-save
- [ ] Testes de drag & drop
- [ ] Testes de persistência

### Sprint 3 (3 dias)
- [ ] Adicionar throws em deprecated services
- [ ] Documentação de migração
- [ ] Code review
- [ ] Deploy em staging

### Sprint 4 (2 dias)
- [ ] Testes em produção
- [ ] Monitoramento de erros
- [ ] Ajustes finais
- [ ] Remover código deprecated

---

## �� Checklist de Validação

### Funcionalidades Críticas

- [ ] **Template Loading**
  - [ ] Carrega quiz21StepsComplete
  - [ ] Carrega steps individuais (step-01 a step-21)
  - [ ] Cache funcionando
  
- [ ] **Canvas Operations**
  - [ ] Drag & drop de blocos
  - [ ] Reordenação funciona
  - [ ] Preview atualiza em tempo real
  
- [ ] **Block Operations**
  - [ ] Criar novo bloco
  - [ ] Editar propriedades
  - [ ] Deletar bloco
  - [ ] Duplicar bloco
  
- [ ] **Persistência**
  - [ ] Auto-save ativo (30s)
  - [ ] Mudanças salvas no JSON
  - [ ] Backups criados
  - [ ] Restore funcionando
  
- [ ] **Navigation**
  - [ ] Trocar entre steps
  - [ ] Estado preservado
  - [ ] Validação de steps
  
- [ ] **Properties Panel**
  - [ ] Edição de texto
  - [ ] Edição de imagens
  - [ ] Edição de estilos
  - [ ] Validação de campos

---

## 🚨 Riscos e Mitigações

### Risco 1: Quebra de Drag & Drop
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**:
- Testar extensivamente antes de deploy
- Manter flag de feature para rollback
- Documentar comportamento esperado

### Risco 2: Perda de Estado do Editor
**Probabilidade**: Baixa  
**Impacto**: Alto  
**Mitigação**:
- EditorService tem persistState=true
- LocalStorage backup
- Auto-save a cada 30s

### Risco 3: Performance Degradation
**Probabilidade**: Baixa  
**Impacto**: Médio  
**Mitigação**:
- EditorService é singleton (evita múltiplas instâncias)
- Cache inteligente do CacheService
- Lazy loading de templates

### Risco 4: Incompatibilidade com JSON Existente
**Probabilidade**: Média  
**Impacto**: Alto  
**Mitigação**:
- Adapters para converter formatos
- Validação de schema antes de salvar
- Migration scripts

---

## 📚 Documentação Necessária

### Para Desenvolvedores
- [ ] Guia de migração de PureBuilder → EditorService
- [ ] API reference do TemplateService
- [ ] Exemplos de uso do useCanonicalEditor
- [ ] Troubleshooting common issues

### Para QA
- [ ] Test cases para drag & drop
- [ ] Test cases para persistência
- [ ] Regression test checklist
- [ ] Performance benchmarks

---

## 🎉 Resultado Esperado

### Antes da Migração
```typescript
// 8 providers aninhados
<UnifiedAppProvider>
  <EditorProviderUnified>
    <PureBuilderProvider> {/* deprecated */}
      <HybridTemplateService> {/* deprecated */}
        <QuizModularProductionEditor />
      </HybridTemplateService>
    </PureBuilderProvider>
  </EditorProviderUnified>
</UnifiedAppProvider>
```

### Depois da Migração
```typescript
// 2 providers + Canonical Services
<UnifiedAppProvider>
  <EditorProviderUnified>
    <QuizModularProductionEditor />
    {/* Usa EditorService e TemplateService internamente */}
  </EditorProviderUnified>
</UnifiedAppProvider>
```

**Benefícios**:
- ✅ -3 providers deprecated removidos
- ✅ -4 services deprecated removidos
- ✅ Auto-save nativo (30s interval)
- ✅ Persistência automática
- ✅ Validação em tempo real
- ✅ Result pattern consistente
- ✅ Event-driven architecture
- ✅ Singleton services (melhor performance)

---

**Status Atual**: Análise Completa  
**Próximo Passo**: Criar `useCanonicalEditor` hook e começar Sprint 1
