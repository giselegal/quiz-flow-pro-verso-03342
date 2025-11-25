# ⚠️ Hooks Legados Incompatíveis - Plano de Ação

> **Status:** Identificado na FASE 2  
> **Prioridade:** Média  
> **Ação Requerida:** Descontinuar uso e migrar para @core

---

## 📋 Hooks com Incompatibilidades

### 1. `src/hooks/editor/useEditorAdapter.ts`

**Problemas:**
- Espera `deleteBlock` (flat) mas API fornece `removeBlock(step, blockId)`
- Espera `addBlock(block)` mas API fornece `addBlock(step, block, index?)`
- Espera `updateBlock(id, updates)` mas API fornece `updateBlock(step, id, updates)`
- Espera `reorderBlocks(startIndex, endIndex)` mas API fornece `reorderBlocks(step, blocks[])`

**Status:** ❌ DEPRECATED - Não corrigir, descontinuar uso

**Motivo:** Este hook foi criado para abstrair diferenças entre contextos legados (EditorContext.tsx e QuizV4Provider.tsx). Com o novo core, não é mais necessário.

**Ação:**
```typescript
/**
 * @deprecated Este hook está DEPRECATED e será removido.
 * 
 * INCOMPATÍVEL com @core/contexts/EditorContext.
 * Criado para abstrair diferenças entre EditorContext.tsx e QuizV4Provider.tsx (ambos legados).
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ Antigo (deprecated)
 * import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter';
 * const editor = useEditorAdapter();
 * editor.deleteBlock(blockId);
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * const editor = useEditor();
 * editor.removeBlock(step, blockId);
 * ```
 * 
 * SERÁ REMOVIDO NA FASE 3.
 */
```

---

### 2. `src/hooks/usePureBuilderCompat.ts`

**Problemas:**
- Espera `blockActions.addBlockAtPosition` (não existe)
- Espera `updateBlock(blockId, updates)` (falta parâmetro step)
- API complexa e confusa para manter compatibilidade

**Status:** ❌ DEPRECATED - Não corrigir, descontinuar uso

**Motivo:** Similar ao useEditorAdapter, foi criado para abstrair diferenças de contextos legados.

**Ação:**
```typescript
/**
 * @deprecated Este hook está DEPRECATED e será removido.
 * 
 * INCOMPATÍVEL com @core/contexts/EditorContext.
 * Criado para abstrair API "PureBuilder" (legada).
 * 
 * MIGRAÇÃO:
 * ```typescript
 * // ❌ Antigo (deprecated)
 * import { usePureBuilder } from '@/hooks/usePureBuilderCompat';
 * const { actions } = usePureBuilder();
 * actions.addBlock(stepKey, block);
 * 
 * // ✅ Novo (recomendado)
 * import { useEditor } from '@/core/hooks';
 * const editor = useEditor();
 * editor.addBlock(step, block);
 * ```
 * 
 * SERÁ REMOVIDO NA FASE 3.
 */
```

---

## ✅ Hook Funcional

### `src/hooks/useEditor.ts`

**Status:** ✅ Funcional (wrapper simples)

Este hook apenas re-exporta `useEditor` de `@core` e está funcionando corretamente.

**Mantido temporariamente para:**
- Compatibilidade com código que importa de `@/hooks/useEditor`
- Warnings guiam desenvolvedores para nova API

**Será removido na FASE 4** após migração completa.

---

## 🎯 Estratégia de Migração

### Fase Atual (FASE 2):

1. **Adicionar avisos de deprecação** nos hooks incompatíveis
2. **Documentar incompatibilidades** (este arquivo)
3. **Identificar componentes** que usam hooks legados

### FASE 3:

1. **Migrar componentes** para usar `@core/hooks/useEditor` diretamente
2. **Criar guia** de migração específico para cada uso
3. **Testes E2E** para validar migrações

### FASE 4:

1. **Remover hooks legados** (`useEditorAdapter`, `usePureBuilderCompat`)
2. **Remover wrapper** (`@/hooks/useEditor`)
3. **Limpar imports** em todo o projeto

---

## 📊 Análise de Uso

### Componentes que Usam Hooks Legados

```bash
# Buscar usages (executar no terminal)
grep -r "useEditorAdapter" src/components --include="*.tsx" --include="*.ts"
grep -r "usePureBuilder" src/components --include="*.tsx" --include="*.ts"
```

**Estimativa:** ~10-15 componentes precisarão de migração

**Esforço:** 2-3 dias de trabalho (FASE 3)

---

## 🔧 API de Migração

### Antes (useEditorAdapter):

```typescript
import { useEditorAdapter } from '@/hooks/editor/useEditorAdapter';

const editor = useEditorAdapter();

// Operações
editor.deleteBlock(blockId);
editor.addBlock(blockType);
editor.updateBlock(blockId, updates);
editor.duplicateBlock(blockId);
editor.save();
editor.setSelectedBlockId(blockId);

// State
const { selectedBlock, blocks, currentStep } = editor.state;
```

### Depois (@core/hooks):

```typescript
import { useEditor } from '@/core/hooks';

const editor = useEditor();

// Operações (com step explícito)
editor.removeBlock(editor.currentStep, blockId);
editor.addBlock(editor.currentStep, createBlock(blockType));
editor.updateBlock(editor.currentStep, blockId, updates);
// duplicateBlock não existe - usar padrão manual
const currentBlocks = editor.getStepBlocks(editor.currentStep);
const blockToDuplicate = currentBlocks.find(b => b.id === blockId);
if (blockToDuplicate) {
  const duplicate = { ...blockToDuplicate, id: `${blockToDuplicate.id}-copy` };
  editor.addBlock(editor.currentStep, duplicate);
}
editor.markSaved();
editor.selectBlock(blockId);

// State
const blocks = editor.getStepBlocks(editor.currentStep);
const selectedBlock = blocks.find(b => b.id === editor.selectedBlockId);
```

**Diferenças Principais:**
1. ✅ **Step sempre explícito** - Mais claro, menos mágico
2. ✅ **Sem métodos "helper"** - API mínima e explícita
3. ✅ **Type-safe** - TypeScript verifica todos os argumentos

---

## 📚 Referências

**Documentação:**
- `docs/CORE_ARCHITECTURE_MIGRATION.md` - Guia geral de migração
- `docs/FASE_2_PROGRESS_REPORT.md` - Progresso da FASE 2

**Código:**
- `src/core/contexts/EditorContext/EditorStateProvider.tsx` - API canônica
- `src/core/contexts/EditorContext/EditorCompatLayer.tsx` - Camada de compatibilidade
- `src/core/hooks/useEditor.ts` - Hook recomendado

---

**Última atualização:** 2025-01  
**Próxima revisão:** FASE 3 (migração de componentes)  
**Responsável:** Equipe Core Architecture
