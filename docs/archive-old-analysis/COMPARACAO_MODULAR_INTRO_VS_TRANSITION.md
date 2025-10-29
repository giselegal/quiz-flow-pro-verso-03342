# 🔍 COMPARAÇÃO: ModularIntroStep vs ModularTransitionStep

## 📦 IMPORTS

### ModularIntroStep (Hardcoded UI)
```tsx
import React from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
```

**Características:**
- ✅ DnDKit para arrastar blocos
- ✅ `useSortable` para blocos individuais
- ✅ `CSS` utilities do dnd-kit
- ❌ **SelectableBlock** (UI hardcoded)
- ❌ **NÃO importa** `UniversalBlockRenderer`
- ❌ **NÃO importa** `useEditor`
- ❌ **NÃO importa** `Block` type

---

### ModularTransitionStep (Dinâmico via JSON)
```tsx
import React, { useMemo } from 'react';
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';
```

**Características:**
- ✅ DnD Kit para arrastar blocos
- ❌ **NÃO importa** `useSortable` (não precisa, usa no UniversalBlockRenderer)
- ❌ **NÃO importa** `CSS` utilities
- ✅ **UniversalBlockRenderer** (renderiza blocos dinamicamente)
- ✅ **useEditor** (acessa state.stepBlocks)
- ✅ **Block** type (tipagem dos blocos)

---

## 🎯 DIFERENÇAS CRÍTICAS

| Aspecto | ModularIntroStep | ModularTransitionStep |
|---------|------------------|----------------------|
| **Renderização** | `<SelectableBlock>` | `<UniversalBlockRenderer>` |
| **Fonte de Blocos** | Hardcoded no JSX | `editor.state.stepBlocks[stepKey]` |
| **Editor Hook** | ❌ Não usa | ✅ `useEditor()` |
| **Tipo Block** | ❌ Não usa | ✅ `Block` type |
| **useSortable** | ✅ Sim (manual) | ❌ Não (UniversalBlockRenderer cuida) |
| **CSS utilities** | ✅ Sim | ❌ Não precisa |

---

## 🔧 O QUE FALTA NO ModularIntroStep?

Para torná-lo **100% modular** (como ModularTransitionStep), precisaria:

### 1. Adicionar imports necessários
```tsx
import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { useEditor } from '@/components/editor/EditorProviderUnified';
import { Block } from '@/types/editor';
```

### 2. Remover imports desnecessários
```tsx
// Remover:
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SelectableBlock } from '@/components/editor/SelectableBlock';
```

### 3. Carregar blocos do editor
```tsx
const editor = useEditor({ optional: true });
const stepKey = data?.id || 'step-intro';
const blocks = editor?.state?.stepBlocks?.[stepKey] || [];
```

### 4. Renderizar via UniversalBlockRenderer
```tsx
{orderedBlocks.map((block: Block) => (
  <UniversalBlockRenderer
    key={block.id}
    block={block}
    mode="editor"
    isSelected={selectedBlockId === block.id}
    onSelect={() => handleBlockClick(block.id)}
  />
))}
```

---

## ✅ POR QUE ModularTransitionStep JÁ ESTÁ CORRETO?

1. ✅ **Importa UniversalBlockRenderer** - renderiza blocos do registry
2. ✅ **Usa useEditor** - acessa state global de blocos
3. ✅ **Tipagem Block** - type-safe
4. ✅ **Auto-load** - carrega blocos se vazios
5. ✅ **Dinâmico** - blocos vêm do JSON

---

## 🎯 CONCLUSÃO

**ModularIntroStep:**
- Estilo antigo (hardcoded UI)
- Funciona, mas não é 100% modular
- Blocos fixos no código

**ModularTransitionStep:**
- Estilo novo (dinâmico via JSON)
- 100% modular
- Blocos carregados do template

**PADRÃO A SEGUIR:** ModularTransitionStep ✅

---

## 📝 OBSERVAÇÃO

O nome "ModularIntroStep" é **enganoso** - ele não é realmente modular no sentido de usar blocos do registry. É apenas um componente com blocos hardcoded que podem ser reordenados.

Para ser **verdadeiramente modular**, deveria:
1. Ter um JSON `step-intro.json` com `blocks: [...]`
2. Carregar via `loadStepTemplate('step-intro')`
3. Renderizar via `UniversalBlockRenderer`

**Steps REALMENTE modulares:**
- ✅ Step-12 (ModularTransitionStep)
- ✅ Step-19 (ModularTransitionStep / StrategicQuestion)
- ✅ Step-20 (ModularResultStep)

**Steps "semi-modulares" (hardcoded):**
- ⚠️ Step-01 (ModularIntroStep)
- ⚠️ Steps 02-11, 13-18 (ModularQuestionStep)
