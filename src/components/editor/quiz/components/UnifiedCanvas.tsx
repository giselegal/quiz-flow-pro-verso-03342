/**
 * 🎯 UNIFIED CANVAS - Canvas único para Edit e Preview
 * 
 * Substitui CanvasArea.tsx com arquitetura unificada:
 * - Mesmo componente final em ambos os modos
 * - Edit Mode: Overlay de edição + Drag & Drop
 * - Preview Mode: Sem overlay, quiz interativo
 */

import React, { useMemo, useCallback } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { UnifiedBlockWrapper } from './UnifiedBlockWrapper';
import { BlockComponent, EditableQuizStep } from '../types';
import { useRealTimeSync } from '../hooks/useRealTimeSync';

export interface UnifiedCanvasProps {
  steps: EditableQuizStep[];
  selectedStep?: EditableQuizStep;
  mode: 'edit' | 'preview';
  
  // Edit mode props
  selectedBlockId?: string;
  multiSelectedIds?: Set<string>;
  onBlockClick?: (e: React.MouseEvent, block: BlockComponent) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (block: BlockComponent) => void;
  onBlocksReordered?: (blocks: BlockComponent[]) => void;
  
  // Preview mode props
  sessionData?: Record<string, any>;
  onStepChange?: (step: number) => void;
  onUpdateSessionData?: (key: string, value: any) => void;
  
  // Shared
  errors?: Record<string, any[]>;
  FixedProgressHeader?: React.ComponentType<any>;
  headerConfig?: any;
}

export const UnifiedCanvas: React.FC<UnifiedCanvasProps> = ({
  steps,
  selectedStep,
  mode,
  selectedBlockId,
  multiSelectedIds = new Set(),
  onBlockClick,
  onBlockDelete,
  onBlockDuplicate,
  onBlocksReordered,
  sessionData = {},
  onStepChange,
  onUpdateSessionData,
  errors = {},
  FixedProgressHeader,
  headerConfig
}) => {
  
  const isInteractive = mode === 'preview';
  
  // Calcular blocos raiz
  const rootBlocks = useMemo(() => {
    if (!selectedStep?.blocks) return [];
    return selectedStep.blocks
      .filter(b => !b.parentId)
      .sort((a, b) => a.order - b.order);
  }, [selectedStep]);
  
  // 🎯 Real-time sync para preview
  const { isSyncing } = useRealTimeSync(
    selectedStep?.blocks || [],
    (blocks) => {
      if (mode === 'preview' && import.meta?.env?.DEV) {
        console.log('✅ Preview atualizado:', blocks.length, 'blocos');
      }
    },
    300
  );
  
  // 🎯 DRAG & DROP (apenas Edit Mode)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Previne conflito com clicks
      }
    })
  );
  
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (mode !== 'edit' || !selectedStep?.blocks) return;
    
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;
    
    const oldIndex = rootBlocks.findIndex(b => b.id === active.id);
    const newIndex = rootBlocks.findIndex(b => b.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) return;
    
    // Reordenar blocos
    const reordered = [...rootBlocks];
    const [movedBlock] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, movedBlock);
    
    // Atualizar orders
    const updatedBlocks = reordered.map((block, index) => ({
      ...block,
      order: index
    }));
    
    // Mesclar com blocos filhos
    const childBlocks = selectedStep.blocks.filter(b => b.parentId);
    const allBlocks = [...updatedBlocks, ...childBlocks];
    
    onBlocksReordered?.(allBlocks);
  }, [mode, selectedStep, rootBlocks, onBlocksReordered]);
  
  // 🎯 RENDER: Edit Mode
  if (mode === 'edit') {
    return (
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        {selectedStep ? (
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-0">
              {/* Header fixo (se fornecido) */}
              {FixedProgressHeader && headerConfig && (
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b mb-4 rounded-t-lg">
                  <div className="px-3 py-2">
                    <FixedProgressHeader 
                      config={headerConfig} 
                      steps={steps} 
                      currentStepId={selectedStep.id} 
                    />
                  </div>
                </div>
              )}
              
              {/* Sync badge */}
              {isSyncing && (
                <div className="mb-4 flex justify-end">
                  <Badge variant="outline" className="gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Sincronizando preview...
                  </Badge>
                </div>
              )}
              
              {rootBlocks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-white/60">
                  <p className="mb-2">Canvas vazio</p>
                  <p className="text-xs">Arraste blocos da biblioteca para começar</p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={rootBlocks.map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {rootBlocks.map(block => (
                        <UnifiedBlockWrapper
                          key={block.id}
                          block={block}
                          allBlocks={selectedStep.blocks || []}
                          mode="edit"
                          isInteractive={false}
                          isSelected={selectedBlockId === block.id}
                          isMultiSelected={multiSelectedIds.has(block.id)}
                          hasErrors={!!errors[block.id]?.length}
                          errors={errors[block.id] || []}
                          onClick={(e) => onBlockClick?.(e, block)}
                          onDelete={() => onBlockDelete?.(block.id)}
                          onDuplicate={() => onBlockDuplicate?.(block)}
                          isContainer={block.type === 'container'}
                          isExpanded={true}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-sm mb-2">Nenhuma etapa selecionada</p>
              <p className="text-xs">Selecione uma etapa no navegador</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // 🎯 RENDER: Preview Mode
  return (
    <div className="flex-1 overflow-auto bg-white">
      {selectedStep && rootBlocks.length > 0 ? (
        <div className="w-full h-full">
          {rootBlocks.map(block => (
            <UnifiedBlockWrapper
              key={block.id}
              block={block}
              allBlocks={selectedStep.blocks || []}
              mode="preview"
              isInteractive={true}
              isSelected={false}
              isMultiSelected={false}
              hasErrors={false}
              errors={[]}
              sessionData={sessionData}
              onNext={() => {
                const nextStep = selectedStep.order + 1;
                onStepChange?.(nextStep);
              }}
              onUpdateSessionData={onUpdateSessionData}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <p className="text-sm mb-2">Preview vazio</p>
            <p className="text-xs">Adicione blocos no modo edição</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedCanvas;
