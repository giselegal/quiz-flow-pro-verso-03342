import { useCallback, useState } from 'react'
import { DragEndEvent, DragOverEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core'
import type { Block } from '@/types/editor'
import { appLogger } from '@/lib/utils/appLogger';

export type DraggedItem = {
  id: string
  type: 'block' | 'library-item'
  stepKey?: string
  blockIndex?: number
  libraryType?: string
}

export function useDndSystem() {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id)

    // Parse do ID para identificar tipo de item
    const idStr = String(active.id)
    if (idStr.startsWith('lib:')) {
      // Item da biblioteca: lib:text-inline
      setDraggedItem({
        id: idStr,
        type: 'library-item',
        libraryType: idStr.slice(4), // Remove 'lib:'
      })
    } else if (idStr.includes(':')) {
      // Bloco existente: stepKey:blockId
      const [stepKey, blockId] = idStr.split(':')
      setDraggedItem({
        id: idStr,
        type: 'block',
        stepKey,
      })
    } else {
      // Fallback: item simples
      setDraggedItem({
        id: idStr,
        type: 'block',
      })
    }
  }, [])

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // 🆕 G30 FIX: @dnd-kit gerencia feedback visual internamente
    // Mantido para assinatura do handler de evento
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setDraggedItem(null)

    if (!over) return null

    // Retorna dados estruturados para o componente pai processar
    return {
      activeId: active.id,
      overId: over.id,
      draggedItem,
      dropzone: String(over.id),
    }
  }, [draggedItem])

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
    setDraggedItem(null)
  }, [])

  return {
    activeId,
    draggedItem,
    handlers: {
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
    },
  } as const
}