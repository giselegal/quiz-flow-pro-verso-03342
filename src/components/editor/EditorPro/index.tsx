/**
 * 🎯 EDITOR PRO REFATORADO
 * 
 * Editor principal dividido em componentes modulares com lazy loading
 */

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Block } from '@/types/editor';
import { useEditor } from '../EditorProvider';
import { useOptimizedScheduler } from '@/hooks/useOptimizedScheduler';
import { useNotification } from '@/components/ui/Notification';
import { createBlockFromComponent } from '@/utils/editorUtils';
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor, KeyboardSensor, closestCenter } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

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
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
}

const EditorPro: React.FC<EditorProProps> = ({
  initialBlocks = [],
  onSave
}) => {
  const { 
    blocks, 
    currentStep, 
    selectedBlock,
    updateBlock,
    deleteBlock,
    selectBlock,
    setCurrentStep
  } = useEditor();
  
  const { debounce } = useOptimizedScheduler();
  const { showNotification } = useNotification();
  
  // Estado local para UI
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  
  // Histórico para undo/redo
  const [history, setHistory] = useState<Block[][]>([blocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Handlers otimizados
  const handleBlockSelect = useCallback((block: Block) => {
    selectBlock(block);
  }, [selectBlock]);

  const handleBlockUpdate = useCallback(
    debounce((blockId: string, updates: Partial<Block>) => {
      updateBlock(blockId, updates);
    }, 300),
    [updateBlock, debounce]
  );

  const handleComponentSelect = useCallback((componentType: string) => {
    const newBlock = createBlockFromComponent(componentType, currentStep);
    if (newBlock) {
      // Adicionar bloco ao estado
      console.log(`✅ Adicionando componente: ${componentType}`);
    }
  }, [currentStep]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave?.(blocks);
      showNotification('Projeto salvo com sucesso!', 'success');
    } catch (error) {
      showNotification('Erro ao salvar projeto', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [blocks, onSave, showNotification]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      // Aplicar estado do histórico
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      // Aplicar estado do histórico
    }
  }, [historyIndex, history.length]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Lógica de drag and drop
      console.log('🔄 Reordenando blocos:', { from: active.id, to: over.id });
    }
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Suspense fallback={<LoadingFallback />}>
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Toolbar */}
          <EditorToolbar
            isPreviewMode={isPreviewMode}
            onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            isSaving={isSaving}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Layout Principal */}
          <EditorLayout
            currentStep={currentStep}
            blocks={blocks}
            selectedBlock={selectedBlock}
            onStepChange={setCurrentStep}
            onComponentSelect={handleComponentSelect}
            onBlockSelect={handleBlockSelect}
          >
            {/* Canvas */}
            <EditorCanvas
              blocks={blocks}
              selectedBlock={selectedBlock}
              currentStep={currentStep}
              onSelectBlock={handleBlockSelect}
              onUpdateBlock={handleBlockUpdate}
              onDeleteBlock={deleteBlock}
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