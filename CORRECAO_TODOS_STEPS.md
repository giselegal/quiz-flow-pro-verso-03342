# 🔧 CORREÇÃO EM MASSA: Todos os Steps com Drag & Drop

**Data:** 17 de outubro de 2025  
**Status:** Em progresso

---

## 📊 COMPONENTES IDENTIFICADOS

### ✅ Já Corrigidos:
1. ✅ **ModularTransitionStep.tsx** - Steps 12-19
2. ✅ **ModularResultStep.tsx** - Steps 20-21

### ⏳ Pendentes:
3. ⏳ **ModularIntroStep.tsx** - Step 1
4. ⏳ **ModularQuestionStep.tsx** - Steps 2-11 (perguntas)
5. ⏳ **ModularStrategicQuestionStep.tsx** - Steps estratégicas
6. ❓ **ModularOfferStep.tsx** - Step de oferta (verificar se usa D&D)

---

## 🎯 PADRÃO DE CORREÇÃO

Para cada componente, aplicar:

### 1. Atualizar Imports
```tsx
// ANTES:
import { DndContext, closestCenter, useSensors, useSensor, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// DEPOIS:
import { useDroppable } from '@dnd-kit/core';
```

### 2. Remover sensors e handleDragEnd
```tsx
// REMOVER:
const sensors = useSensors(...);
const handleDragEnd = (event: DragEndEvent) => { ... };
```

### 3. Adicionar BlockWrapper e DropZoneEnd
```tsx
const BlockWrapper: React.FC<{ id: string; children: React.ReactNode; index: number }> = ({ id, children, index }) => {
    const dropZoneId = `drop-before-${id}`;
    const { setNodeRef, isOver } = useDroppable({
        id: dropZoneId,
        data: {
            dropZone: 'before',
            blockId: id,
            stepKey: stepKey,
            insertIndex: index
        }
    });
    // ... resto do código
};

const DropZoneEnd: React.FC<{ insertIndex: number }> = ({ insertIndex }) => {
    const dropZoneId = `drop-end-${stepKey}`;
    const { setNodeRef, isOver } = useDroppable({
        id: dropZoneId,
        data: {
            dropZone: 'after',
            stepKey: stepKey,
            insertIndex: insertIndex
        }
    });
    // ... resto do código
};
```

### 4. Substituir renderização
```tsx
// ANTES:
<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    <SortableContext items={localOrder}>
        {orderedBlocks.map((block, index) => (
            <SortableBlock key={block.id} id={block.id} index={index}>
                <UniversalBlockRenderer block={block} />
            </SortableBlock>
        ))}
    </SortableContext>
</DndContext>

// DEPOIS:
<div className="space-y-2">
    {orderedBlocks.map((block, index) => (
        <BlockWrapper key={block.id} id={block.id} index={index}>
            <UniversalBlockRenderer block={block} />
        </BlockWrapper>
    ))}
    <DropZoneEnd insertIndex={orderedBlocks.length} />
</div>
```

---

## 🚀 EXECUTANDO CORREÇÕES

Corrigindo os componentes restantes...
