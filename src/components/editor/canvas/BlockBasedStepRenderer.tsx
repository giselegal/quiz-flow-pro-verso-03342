/**
 * 🎯 BLOCK-BASED STEP RENDERER - FASE 3: Renderização Baseada em Blocos
 * 
 * Componente que substitui os steps monolíticos (IntroStep, QuestionStep, ResultStep)
 * por uma renderização unificada usando StepCanvas e blocos independentes.
 * 
 * FEATURES:
 * ✅ Usa StepCanvas para renderização
 * ✅ Integrado com EditorProviderUnified
 * ✅ Context compartilhado entre blocos
 * ✅ Modo editor/preview
 * ✅ Suporte a quiz session data
 */

import React, { useState, useCallback } from 'react';
import { useEditor } from '../EditorProviderMigrationAdapter';
import { StepCanvas } from './StepCanvas';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Block, BlockType } from '@/types/editor';
import { AddBlockModal } from './AddBlockModal';

export interface BlockBasedStepRendererProps {
  /** Número do step (1-21) */
  stepNumber: number;
  
  /** Modo de visualização */
  mode: 'editor' | 'preview';
  
  /** Dados da sessão do quiz (para preview interativo) */
  sessionData?: Record<string, any>;
  
  /** Callback ao atualizar dados da sessão */
  onSessionDataUpdate?: (key: string, value: any) => void;
  
  /** Classe CSS customizada */
  className?: string;
}

/**
 * BlockBasedStepRenderer - Renderiza um step usando blocos independentes
 */
export function BlockBasedStepRenderer({
  stepNumber,
  mode,
  sessionData: externalSessionData,
  onSessionDataUpdate,
  className = '',
}: BlockBasedStepRendererProps) {
  
  // Editor context
  const editorContext = useEditor();
  
  if (!editorContext) {
    console.error('❌ BlockBasedStepRenderer: Editor context não disponível');
    return (
      <div className="p-4 border-2 border-red-300 rounded-lg bg-red-50">
        <p className="text-red-600">❌ Editor context não disponível</p>
      </div>
    );
  }
  
  const { state, actions } = editorContext;
  
  // Session data local (se não fornecido externamente)
  const [localSessionData, setLocalSessionData] = useState<Record<string, any>>({});
  
  // Modal de adicionar bloco
  const [isAddBlockModalOpen, setIsAddBlockModalOpen] = useState(false);
  
  // Usar session data externo ou local
  const sessionData = externalSessionData || localSessionData;
  
  /**
   * Handler para atualizar session data
   */
  const handleUpdateSessionData = useCallback((key: string, value: any) => {
    if (onSessionDataUpdate) {
      onSessionDataUpdate(key, value);
    } else {
      setLocalSessionData(prev => ({ ...prev, [key]: value }));
    }
  }, [onSessionDataUpdate]);
  
  // Step key para buscar blocos
  const stepKey = `step-${String(stepNumber).padStart(2, '0')}`;
  
  // 🎯 Buscar blocos do step (priorizar flat structure)
  const blocks = actions.getBlocksForStep?.(stepKey) || state.stepBlocks[stepKey] || [];

  // 🐛 DEBUG: Log de renderização
  console.log(`🎨 BlockBasedStepRenderer rendering step ${stepNumber}:`, {
    stepKey,
    mode,
    totalBlocks: blocks.length,
    blockTypes: blocks.map((b: any) => b.type),
    blockIds: blocks.map((b: any) => b.id),
    selectedBlockId: state.selectedBlockId,
    hasGetBlocksForStep: !!actions.getBlocksForStep,
    flatStructureAvailable: !!(state.blocks && state.blocksByStep)
  });
  
  // Context compartilhado para todos os blocos
  const sharedContext = {
    ...sessionData,
    stepNumber,
    totalSteps: 21,
    updateSessionData: handleUpdateSessionData,
  };
  
  /**
   * Handler para abrir modal de adicionar bloco
   */
  const handleAddBlock = useCallback(() => {
    setIsAddBlockModalOpen(true);
  }, []);
  
  /**
   * Handler para selecionar tipo de bloco e adicionar
   */
  const handleSelectBlockType = useCallback((blockType: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: blockType,
      order: blocks.length,
      content: {},
      properties: {},
    };
    
    actions.addBlock(stepKey, newBlock);
    console.log('✅ Bloco adicionado:', blockType);
  }, [blocks.length, stepKey, actions]);
  
  /**
   * Handler para duplicar bloco
   */
  const handleDuplicateBlock = useCallback((blockId: string) => {
    const blockToDuplicate = blocks.find((b: Block) => b.id === blockId);
    if (!blockToDuplicate) return;
    
    const newBlock: Block = {
      ...blockToDuplicate,
      id: `${blockId}-copy-${Date.now()}`,
      order: blockToDuplicate.order + 1,
    };
    
    // Adicionar após o bloco original
    const index = blocks.findIndex((b: Block) => b.id === blockId);
    actions.addBlockAtIndex(stepKey, newBlock, index + 1);
  }, [blocks, stepKey, actions]);
  
  return (
    <>
      {/* Modal de adicionar bloco */}
      <AddBlockModal
        open={isAddBlockModalOpen}
        onOpenChange={setIsAddBlockModalOpen}
        onSelectBlock={handleSelectBlockType}
      />
      
      <div className={`block-based-step-renderer ${className}`} data-step={stepNumber}>
        {/* Header do step (apenas em modo editor) */}
        {mode === 'editor' && (
          <div className="flex items-center justify-between mb-4 pb-2 border-b">
            <div>
              <h3 className="text-lg font-semibold">
                Step {stepNumber}
              </h3>
              <p className="text-sm text-muted-foreground">
                {blocks.length} {blocks.length === 1 ? 'bloco' : 'blocos'}
              </p>
            </div>
            
            <Button
              size="sm"
              onClick={handleAddBlock}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Bloco
            </Button>
          </div>
        )}
        
        {/* Canvas com blocos */}
        <StepCanvas
          stepId={stepKey}
          blocks={blocks}
          mode={mode}
          sharedContext={sharedContext}
          selectedBlockId={state.selectedBlockId}
          onBlockSelect={actions.setSelectedBlockId}
          onBlockUpdate={actions.updateBlock.bind(null, stepKey)}
          onBlockDelete={actions.removeBlock.bind(null, stepKey)}
          onBlockDuplicate={handleDuplicateBlock}
          onBlockReorder={(oldIndex, newIndex) => 
            actions.reorderBlocks(stepKey, oldIndex, newIndex)
          }
        />
      </div>
    </>
  );
}

BlockBasedStepRenderer.displayName = 'BlockBasedStepRenderer';

export default BlockBasedStepRenderer;
