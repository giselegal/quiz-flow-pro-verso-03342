/**
 * 🎯 EDITOR PRO REFATORADO
 * 
 * Editor principal dividido em componentes modulares com lazy loading
 */

import React, { Suspense, useCallback, useState } from 'react';
import { Block } from '@/types/editor';
import { useEditor } from '../EditorProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { createBlockFromComponent } from '@/utils/editorUtils';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CANVAS_ROOT_ID, SLOT_ID_PREFIX, BLOCK_ID_PREFIX } from '@/components/editor/dnd/constants';

// Lazy loading dos componentes pesados
const EditorLayout = React.lazy(() => import('./EditorLayout'));
const EditorCanvas = React.lazy(() => import('./EditorCanvas'));
const EditorToolbar = React.lazy(() => import('./EditorToolbar'));

// Loading component otimizado
const LoadingFallback = () => (
  <div className="h-screen w-full bg-background flex items-center justify-center">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-muted h-3 w-3"></div>
      <div className="rounded-full bg-muted h-3 w-3"></div>
      <div className="rounded-full bg-muted h-3 w-3"></div>
    </div>
  </div>
);

interface EditorProProps {
  onSave?: (blocks: Block[]) => void;
}

const EditorPro: React.FC<EditorProProps> = ({ onSave }) => {
  const { state, actions } = useEditor();
  const currentStep = state.currentStep;
  const selectedBlockId = state.selectedBlockId;
  const currentStepKey = `step-${currentStep}`;
  const blocks = state.stepBlocks[currentStepKey] || [];

  const { debounce } = useOptimizedScheduler();
  const notification = useNotification();

  // Estado local para UI
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const canUndo = Boolean((actions as any)?.canUndo);
  const canRedo = Boolean((actions as any)?.canRedo);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handlers otimizados
  const handleBlockSelect = useCallback((id: string) => {
    actions.setSelectedBlockId(id);
  }, [actions]);

  const handleBlockUpdate = useCallback(
    (blockId: string, updates: Partial<Block>) => {
      debounce(`update:${blockId}`, () => {
        actions.updateBlock(currentStepKey, blockId, updates as any);
      }, 300);
    },
    [actions, debounce, currentStepKey]
  );

  const handleComponentSelect = useCallback((componentType: string) => {
    const newBlock = createBlockFromComponent(componentType as any, blocks);
    if (newBlock) {
      // Adicionar bloco ao estado
      actions.addBlock(currentStepKey, newBlock);
      actions.setSelectedBlockId(newBlock.id);
      notification.success?.(`Componente ${componentType} adicionado`);
    }
  }, [blocks, actions, currentStepKey, notification]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave?.(blocks);
      notification.success?.('Projeto salvo com sucesso!');
    } catch (error) {
      notification.error?.('Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  }, [blocks, onSave, notification]);

  const handleUndo = useCallback(() => {
    (actions as any)?.undo?.();
  }, [actions]);

  const handleRedo = useCallback(() => {
    (actions as any)?.redo?.();
  }, [actions]);

  const getIndexFromOver = useCallback((overId: string | null): number => {
    if (!overId) return blocks.length;
    const id = String(overId);
    if (id === CANVAS_ROOT_ID) return blocks.length;
    if (id.startsWith(SLOT_ID_PREFIX)) {
      const n = parseInt(id.replace(SLOT_ID_PREFIX, ''), 10);
      return Number.isFinite(n) ? Math.max(0, Math.min(n, blocks.length)) : blocks.length;
    }
    if (id.startsWith(BLOCK_ID_PREFIX)) {
      const cleaned = id.replace(BLOCK_ID_PREFIX, '');
      const idx = blocks.findIndex(b => String(b.id) === cleaned);
      return idx >= 0 ? idx : blocks.length;
    }
    return blocks.length;
  }, [blocks]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeType = (active.data.current as any)?.type;

    // Reorder de blocos existentes
    if (activeType === 'canvas-block') {
      const activeId = String(active.id).replace(BLOCK_ID_PREFIX, '');
      const oldIndex = blocks.findIndex(b => String(b.id) === activeId);
      const newIndex = getIndexFromOver(String(over.id));
      if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
        (actions as any)?.reorderBlocks?.(currentStepKey, oldIndex, newIndex);
      }
      return;
    }

    // Inserção a partir da sidebar
    if (activeType === 'sidebar-component') {
      const compType = (active.data.current as any)?.blockType as string;
      const insertIndex = getIndexFromOver(String(over.id));
      const newBlock = createBlockFromComponent(compType as any, blocks);
      if (newBlock) {
        (actions as any)?.addBlockAtIndex?.(currentStepKey, newBlock, insertIndex);
        (actions as any)?.setSelectedBlockId?.(newBlock.id);
        notification.success?.(`Componente ${compType} adicionado`);
      }
    }
  }, [actions, blocks, currentStepKey, getIndexFromOver, notification]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <Suspense fallback={<LoadingFallback />}>
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            isSaving={isSaving}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Layout Principal */}
          <EditorLayout
            currentStep={currentStep}
            blocks={blocks}
            selectedBlock={blocks.find(b => b.id === selectedBlockId) || null}
            onStepChange={actions.setCurrentStep}
            onComponentSelect={handleComponentSelect}
            onBlockSelect={handleBlockSelect}
            onUpdateSelectedBlock={(updates: Partial<Block>) => {
              const id = selectedBlockId;
              if (id) actions.updateBlock(currentStepKey, id, updates as any);
            }}
            onDeleteSelectedBlock={() => {
              const id = selectedBlockId;
              if (id) actions.removeBlock(currentStepKey, id);
            }}
          >
            {/* Canvas */}
            <EditorCanvas
              blocks={blocks}
              selectedBlock={blocks.find(b => b.id === selectedBlockId) || null}
              currentStep={currentStep}
              onSelectBlock={handleBlockSelect}
              onUpdateBlock={handleBlockUpdate}
              onDeleteBlock={(blockId) => actions.removeBlock(currentStepKey, blockId)}
              isPreviewMode={isPreviewMode}
            />
          </EditorLayout>
        </div>
      </Suspense>
    </DndContext>
  );
};
EditorPro.displayName = 'EditorPro';

export default EditorPro;