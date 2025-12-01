/**
 * 🎯 useDndHandlers - Hook para gerenciar Drag & Drop
 * 
 * Funcionalidades:
 * - Drag de blocos da biblioteca para o canvas
 * - Reordenação de blocos dentro do step
 * - Validações de drop
 */

import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useQuizStore } from '../store/quizStore';
import { useEditorStore } from '../store/editorStore';

export interface DndHandlers {
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
}

export function useDndHandlers(): DndHandlers {
  const addBlock = useQuizStore((state) => state.addBlock);
  const reorderBlocks = useQuizStore((state) => state.reorderBlocks);
  const selectedStepId = useEditorStore((state) => state.selectedStepId);
  const selectBlock = useEditorStore((state) => state.selectBlock);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('🎯 Drag Start:', active.id);
    
    // Se for um bloco existente, selecionar
    if (typeof active.id === 'string' && active.id.startsWith('block-')) {
      selectBlock(active.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      console.log('⚠️ Drop fora de zona válida');
      return;
    }

    console.log('🎯 Drag End:', { active: active.id, over: over.id });

    // CASO 1: Drag de NOVO BLOCO da biblioteca → Canvas
    if (typeof active.id === 'string' && active.id.startsWith('new-block-')) {
      if (!selectedStepId) {
        console.warn('⚠️ Nenhum step selecionado');
        return;
      }

      const blockType = active.id.replace('new-block-', '');
      
      // Determinar posição de inserção
      let targetIndex = 0;
      if (typeof over.id === 'string' && over.id.startsWith('block-')) {
        // Drop em cima de um bloco existente
        const quiz = useQuizStore.getState().quiz;
        const step = quiz?.steps?.find((s: any) => s.id === selectedStepId);
        const overBlockIndex = step?.blocks?.findIndex((b: any) => b.id === over.id);
        targetIndex = overBlockIndex !== undefined && overBlockIndex >= 0 ? overBlockIndex + 1 : step?.blocks?.length || 0;
      }

      console.log(`✅ Adicionando bloco tipo "${blockType}" no índice ${targetIndex}`);
      addBlock(selectedStepId, blockType, targetIndex);
      return;
    }

    // CASO 2: REORDENAÇÃO de blocos existentes
    if (
      typeof active.id === 'string' && active.id.startsWith('block-') &&
      typeof over.id === 'string' && over.id.startsWith('block-')
    ) {
      if (!selectedStepId) {
        console.warn('⚠️ Nenhum step selecionado');
        return;
      }

      if (active.id === over.id) {
        console.log('⏭️ Mesmo bloco, nenhuma ação');
        return;
      }

      const quiz = useQuizStore.getState().quiz;
      const step = quiz?.steps?.find((s: any) => s.id === selectedStepId);
      
      if (!step?.blocks) {
        console.warn('⚠️ Step sem blocos');
        return;
      }

      const oldIndex = step.blocks.findIndex((b: any) => b.id === active.id);
      const newIndex = step.blocks.findIndex((b: any) => b.id === over.id);

      if (oldIndex === -1 || newIndex === -1) {
        console.warn('⚠️ Índices inválidos:', { oldIndex, newIndex });
        return;
      }

      console.log(`✅ Reordenando bloco de ${oldIndex} → ${newIndex}`);
      reorderBlocks(selectedStepId, oldIndex, newIndex);
    }
  };

  return {
    handleDragStart,
    handleDragEnd,
  };
}
