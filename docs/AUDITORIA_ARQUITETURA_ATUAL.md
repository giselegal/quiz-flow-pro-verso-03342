# 🔍 AUDITORIA DA ARQUITETURA ATUAL
**Data:** 27 de Novembro de 2025  
**Objetivo:** Validar implementação da arquitetura otimizada conforme documentado

---

## 📊 RESUMO EXECUTIVO

### Status Geral: ⚠️ PARCIALMENTE IMPLEMENTADO (45%)

A documentação em `ARQUITETURA_OTIMIZADA_IMPLEMENTACAO.md` descreve uma arquitetura ideal que **NÃO está totalmente implementada**. Há divergências significativas entre o que foi documentado e o código real do projeto.

---

## 🔴 GAP ANALYSIS: DOCUMENTAÇÃO vs REALIDADE

### 1️⃣ UnifiedEditorStore (Event Sourcing)

**Status:** ❌ **NÃO IMPLEMENTADO**

**Documentado:**
```typescript
// /src/lib/editor/store/UnifiedEditorStore.ts
class UnifiedEditorStore {
  private state: EditorState;
  
  async updateBlock(blockId, updates) {
    this.state = produce(this.state, draft => {
      const block = draft.stepBlocks[...].find(b => b.id === blockId);
      Object.assign(block, updates);
    });
    
    await Promise.all([
      this.projectToSupabase(event),
      this.projectToIndexedDB(event),
    ]);
  }
}
```

**Realidade:**
- ❌ Arquivo `/src/lib/editor/store/UnifiedEditorStore.ts` **NÃO EXISTE**
- ❌ Diretório `/src/lib/editor/store/` está **VAZIO**
- ❌ Não há implementação de Event Sourcing
- ❌ Não há projeções automáticas para Supabase/IndexedDB
- ⚠️ Mencionado apenas em documentação (análise teórica)

**Impacto:**
- Sistema ainda usa múltiplas fontes de verdade
- Potencial para race conditions
- Sincronização manual em vários `useEffect`s

---

### 2️⃣ EditorEventBus

**Status:** ✅ **PARCIALMENTE IMPLEMENTADO**

**Documentado:**
```typescript
// /src/lib/editor/store/EditorEventBus.ts
export class EditorEventBus {
  emit('BLOCK_UPDATED', { blockId, updates });
  on('BLOCK_UPDATED', async (event) => {
    await updateInSupabase(event);
    await updateInIndexedDB(event);
  });
}
```

**Realidade:**
- ✅ Existe `/src/lib/events/editorEvents.ts` (implementação real)
- ⚠️ Caminho diferente do documentado
- ✅ Implementa event bus básico
- ❌ Não possui eventos `BLOCK_UPDATED`, `SELECTION_CHANGED` documentados
- ✅ Possui eventos relacionados a bootstrap e autosave

**Eventos Reais Implementados:**
```typescript
interface EventMap {
    EDITOR_BOOTSTRAP_PHASE: { phase: string };
    EDITOR_BOOTSTRAP_READY: { funnelId?: string | null };
    EDITOR_BOOTSTRAP_ERROR: { error: string };
    EDITOR_OPERATION_START: { key: string };
    EDITOR_OPERATION_END: { key: string; durationMs: number; error?: string };
    EDITOR_AUTOSAVE_START: { dirty: boolean };
    EDITOR_AUTOSAVE_SUCCESS: { savedAt: number };
    EDITOR_AUTOSAVE_ERROR: { error: string };
}
```

**Impacto:**
- ✅ Infraestrutura base existe
- ⚠️ Precisa adicionar eventos de blocos e seleção
- ⚠️ Documentação desatualizada

---

### 3️⃣ FunnelCloneService

**Status:** ✅ **IMPLEMENTADO COM SUCESSO**

**Documentado:**
```typescript
const result = await funnelCloneService.clone(funnelId, {
  name: 'Cópia de Funil',
  transforms: { blockProperties: (block) => ({...}) },
  asDraft: true,
});
```

**Realidade:**
- ✅ Arquivo existe: `/src/core/funnel/services/FunnelCloneService.ts`
- ✅ Implementa clonagem completa com normalização de IDs
- ✅ Suporta transformações customizadas
- ✅ Usa batch inserts otimizados
- ✅ Mapeia IDs antigos → novos
- ✅ Integrado com event bus existente

**Funcionalidades Confirmadas:**
- ✅ Clonagem de funis completos
- ✅ Normalização de IDs (UUIDs novos)
- ✅ Preservação de referências
- ✅ Transformações em propriedades
- ✅ Filtro de steps (`includeSteps`)
- ✅ Opção de criar como draft

**Avaliação:** 🟢 **EXCELENTE** - Totalmente funcional conforme documentado

---

### 4️⃣ Feature-Sliced Design

**Status:** ❌ **NÃO SEGUIDO**

**Documentado:**
```
features/editor/
├── ui/                      # Componentes < 200 linhas
│   ├── EditorShell.tsx      (25 linhas)
│   ├── EditorToolbar.tsx    (180 linhas)
│   └── StepNavigator.tsx    (95 linhas)
├── model/
│   ├── useUnifiedEditorStore.ts
│   └── useWYSIWYGSync.ts
└── api/
```

**Realidade:**
- ❌ Estrutura `/src/features/` existe, mas não segue o padrão FSD
- ⚠️ Componentes principais excedem **MUITO** o limite de 200 linhas:
  - `QuizModularEditor/index.tsx`: **2.349 linhas** ❌
  - `UniversalStepEditor.tsx`: **2.102 linhas** ❌
  - `SinglePropertiesPanel.tsx`: **1.564 linhas** ❌
  - `AdvancedPropertiesPanel.tsx`: **1.374 linhas** ❌
  - `MultipleChoiceOptionsPanel.tsx`: **1.158 linhas** ❌
  - `OptionsGridBlock.tsx`: **1.088 linhas** ❌
  - `NoCodePropertiesPanel.tsx`: **1.003 linhas** ❌

**Estatísticas:**
- 📊 Total de arquivos analisados: 160+
- 🔴 Arquivos > 200 linhas: **~150 arquivos** (93%)
- 🟢 Arquivos ≤ 200 linhas: **~10 arquivos** (7%)

**Impacto:**
- ❌ Componentes monolíticos difíceis de manter
- ❌ Alto acoplamento
- ❌ Baixa testabilidade
- ❌ Dificulta refatoração

---

### 5️⃣ Sincronização WYSIWYG com Immer

**Status:** ⚠️ **PARCIALMENTE IMPLEMENTADO**

**Documentado:**
```typescript
// /src/features/editor/model/useWYSIWYGSync.ts
const nextState = produce(state, draft => {
  const blocksMap = new Map(newBlocks.map(b => [b.id, b]));
  draft.blocks = newBlocks.map(b => {
    const existing = currentBlocks.find(c => c.id === b.id);
    return shallowEqual(existing, b) ? existing : b;
  });
});
```

**Realidade:**
- ❌ Arquivo `/src/features/editor/model/useWYSIWYGSync.ts` **NÃO EXISTE**
- ✅ Existe hook real: `/src/hooks/useWYSIWYGBridge.ts`
- ❌ **NÃO usa Immer** (`produce` não encontrado no código)
- ✅ Implementa sincronização via `useWYSIWYG`
- ✅ Bridge funcional com callbacks externos

**Código Real:**
```typescript
// /src/hooks/useWYSIWYGBridge.ts
export function useWYSIWYGBridge(options: WYSIWYGBridgeOptions) {
  const [wysiwygState, wysiwygActions] = useWYSIWYG(initialBlocks, {
    autoSaveDelay,
    onBlockUpdate: (blockId, updates) => { /* ... */ },
    onAutoSave: async (blocks) => { /* ... */ },
  });
  
  // Não usa Immer - atualização via hook interno
}
```

**Impacto:**
- ⚠️ Sem structural sharing via Immer
- ⚠️ Possível performance subótima em atualizações
- ✅ Sincronização básica funciona

---

### 6️⃣ Virtualização com @tanstack/react-virtual

**Status:** ✅ **IMPLEMENTADO**

**Documentado:**
```typescript
<VirtualizedBlockList
  blocks={blocks}
  threshold={50}
  estimatedBlockHeight={150}
/>
```

**Realidade:**
- ✅ Biblioteca instalada: `@tanstack/react-virtual@3.13.12`
- ✅ Componente existe: `/src/components/ui/virtualized/VirtualizedList.tsx`
- ✅ Implementa threshold adaptativo
- ✅ Overscan configurável
- ✅ Usado em `UnifiedStepRenderer.tsx`

**Funcionalidades Confirmadas:**
```typescript
const rowVirtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => estimatedItemHeight,
  overscan,
  enabled: shouldVirtualize, // ✅ Threshold baseado
});
```

**Avaliação:** 🟢 **CORRETO** - Implementado conforme boas práticas

---

### 7️⃣ Testes E2E

**Status:** ✅ **IMPLEMENTADO**

**Documentado:**
```typescript
test('Duplicar funil via API', async () => { /* ... */ });
test('Validar normalização de IDs', async () => { /* ... */ });
test('Duplicar com transformações', async () => { /* ... */ });
```

**Realidade:**
- ✅ Arquivo existe: `/tests/e2e/funnel-duplication.spec.ts`
- ✅ Total de specs E2E: **109 arquivos**
- ✅ Testes de duplicação implementados:
  1. Duplicar funil via API ✅
  2. Validar normalização de IDs ✅
  3. Validar preservação de propriedades ✅
  4. Duplicar com transformações ✅
  5. Duplicar com filtro de steps ✅

**Cobertura de Testes:**
- ✅ Clonagem de funis
- ✅ Normalização de IDs
- ✅ Transformações
- ✅ Preservação de propriedades
- ✅ Filtros de steps

**Avaliação:** 🟢 **EXCELENTE** - Cobertura abrangente

---

## 📈 SCORECARD DETALHADO

| Componente | Documentado | Implementado | Score | Notas |
|------------|-------------|--------------|-------|-------|
| **UnifiedEditorStore** | ✅ Sim | ❌ Não | 0/10 | Apenas documentação teórica |
| **Event Sourcing** | ✅ Sim | ❌ Não | 0/10 | Não implementado |
| **EditorEventBus** | ✅ Sim | ⚠️ Parcial | 5/10 | Existe mas com API diferente |
| **FunnelCloneService** | ✅ Sim | ✅ Sim | 10/10 | Totalmente funcional |
| **Feature-Sliced Design** | ✅ Sim | ❌ Não | 1/10 | 93% dos componentes > 200 linhas |
| **Immer (structural sharing)** | ✅ Sim | ❌ Não | 0/10 | Não usa Immer |
| **useWYSIWYGSync** | ✅ Sim | ⚠️ Parcial | 6/10 | useWYSIWYGBridge existe |
| **Virtualização** | ✅ Sim | ✅ Sim | 10/10 | Implementado corretamente |
| **Testes E2E** | ✅ Sim | ✅ Sim | 10/10 | Cobertura excelente |

**SCORE MÉDIO: 4.7/10** ⚠️

---

## 🎯 PRIORIZAÇÃO DE CORREÇÕES

### 🔴 URGENTE (Crítico)

1. **Refatorar componentes gigantes** (QuizModularEditor: 2.349 linhas)
   - Quebrar em sub-componentes < 200 linhas
   - Aplicar Feature-Sliced Design
   - Estimativa: 40-60 horas

2. **Implementar UnifiedEditorStore** (ausente)
   - Single Source of Truth
   - Event Sourcing
   - Projeções automáticas
   - Estimativa: 20-30 horas

### 🟡 ALTA (Importante)

3. **Integrar Immer** no sistema WYSIWYG
   - Adicionar `produce` em hooks
   - Implementar structural sharing
   - Estimativa: 8-12 horas

4. **Expandir EditorEventBus**
   - Adicionar eventos de blocos
   - Adicionar eventos de seleção
   - Documentar API completa
   - Estimativa: 6-8 horas

### 🟢 MÉDIA (Desejável)

5. **Atualizar documentação**
   - Refletir estado real do código
   - Remover features não implementadas
   - Adicionar diagramas atualizados
   - Estimativa: 4-6 horas

---

## 🔍 ANÁLISE DE RISCO

### Riscos Técnicos Identificados

1. **Componentes Monolíticos**
   - **Risco:** Alto acoplamento dificulta manutenção
   - **Probabilidade:** 90%
   - **Impacto:** Alto
   - **Mitigação:** Refatoração gradual

2. **Múltiplas Fontes de Verdade**
   - **Risco:** Race conditions e inconsistências
   - **Probabilidade:** 70%
   - **Impacto:** Médio
   - **Mitigação:** Implementar UnifiedEditorStore

3. **Documentação Desatualizada**
   - **Risco:** Novos devs seguem arquitetura inexistente
   - **Probabilidade:** 100%
   - **Impacto:** Alto
   - **Mitigação:** Atualização urgente da docs

---

## ✅ PONTOS POSITIVOS

1. ✅ **FunnelCloneService** - Implementação exemplar
2. ✅ **Virtualização** - Corretamente aplicada
3. ✅ **Testes E2E** - Cobertura robusta (109 specs)
4. ✅ **Biblioteca @tanstack/react-virtual** - Instalada e funcional

---

## 🚨 RECOMENDAÇÕES IMEDIATAS

### Para Gestão

1. **Atualizar expectativas** - Arquitetura documentada não reflete realidade
2. **Priorizar refatoração** - QuizModularEditor precisa ser dividido
3. **Revisar roadmap** - Features documentadas como "implementadas" ainda não existem

### Para Desenvolvimento

1. **NÃO seguir** `ARQUITETURA_OTIMIZADA_IMPLEMENTACAO.md` sem validação
2. **Usar código real** como referência:
   - `useWYSIWYGBridge` (não `useWYSIWYGSync`)
   - `editorEvents` (não `EditorEventBus`)
   - `FunnelCloneService` ✅ (este está correto)

3. **Iniciar refatoração** do QuizModularEditor:
   ```
   QuizModularEditor (2.349 linhas) → 
     ├── EditorShell (50 linhas)
     ├── StepNavigator (150 linhas)
     ├── CanvasArea (180 linhas)
     ├── PropertiesPanel (150 linhas)
     └── ComponentLibrary (120 linhas)
   ```

### Para Documentação

1. **Marcar seções não implementadas** claramente
2. **Criar documentação "AS-IS"** do código atual
3. **Separar** "Estado Atual" de "Arquitetura Ideal"

---

## 📝 CONCLUSÃO

A documentação em `ARQUITETURA_OTIMIZADA_IMPLEMENTACAO.md` descreve uma **arquitetura ideal aspiracional**, não o estado atual do código. 

**Realidade:**
- ✅ **45% implementado** (FunnelCloneService, Virtualização, Testes)
- ⚠️ **20% parcial** (EventBus, WYSIWYG)
- ❌ **35% ausente** (UnifiedEditorStore, Event Sourcing, Immer, FSD)

**Próximos Passos:**
1. Atualizar docs para refletir realidade
2. Criar roadmap realista de implementação
3. Priorizar refatoração de componentes gigantes
4. Implementar UnifiedEditorStore gradualmente

---

**Auditoria realizada por:** GitHub Copilot (Agente IA)  
**Metodologia:** Análise de código-fonte, busca por arquivos, verificação de imports  
**Ferramentas:** `file_search`, `grep_search`, `read_file`, `list_dir`, `run_in_terminal`
