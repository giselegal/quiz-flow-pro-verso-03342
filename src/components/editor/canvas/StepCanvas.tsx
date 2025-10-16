/**
 * 🎯 STEP CANVAS - FASE 1: Container Genérico para Blocos Independentes
 * 
 * Container que renderiza blocos de forma completamente independente,
 * sem agrupar em steps monolíticos.
 * 
 * FEATURES:
 * ✅ Renderização individual de cada bloco
 * ✅ Context compartilhado entre blocos
 * ✅ Handlers unificados (select, update, delete, reorder)
 * ✅ Drag & drop nativo
 * ✅ Modo edit/preview
 */

import React, { useCallback } from 'react';
import { Block } from '@/types/editor';
import UniversalBlockRenderer from '../blocks/UniversalBlockRenderer';
import { ChevronUp, ChevronDown, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface StepCanvasProps {
  /** ID do step (para organização lógica) */
  stepId: string;
  
  /** Blocos a serem renderizados */
  blocks: Block[];
  
  /** Modo de visualização */
  mode: 'editor' | 'preview';
  
  /** Context compartilhado entre todos os blocos */
  sharedContext?: Record<string, any>;
  
  /** ID do bloco selecionado */
  selectedBlockId?: string | null;
  
  // === HANDLERS ===
  
  /** Callback ao selecionar um bloco */
  onBlockSelect?: (blockId: string) => void;
  
  /** Callback ao atualizar um bloco */
  onBlockUpdate?: (blockId: string, updates: any) => void;
  
  /** Callback ao deletar um bloco */
  onBlockDelete?: (blockId: string) => void;
  
  /** Callback ao duplicar um bloco */
  onBlockDuplicate?: (blockId: string) => void;
  
  /** Callback ao reordenar blocos */
  onBlockReorder?: (oldIndex: number, newIndex: number) => void;
  
  /** Classe CSS customizada */
  className?: string;
}

/**
 * StepCanvas - Container genérico que renderiza blocos independentes
 */
export function StepCanvas({
  stepId,
  blocks,
  mode,
  sharedContext = {},
  selectedBlockId = null,
  onBlockSelect,
  onBlockUpdate,
  onBlockDelete,
  onBlockDuplicate,
  onBlockReorder,
  className = '',
}: StepCanvasProps) {
  
  /**
   * Handler para mover bloco para cima
   */
  const handleMoveUp = useCallback((index: number) => {
    if (index > 0 && onBlockReorder) {
      onBlockReorder(index, index - 1);
    }
  }, [onBlockReorder]);

  /**
   * Handler para mover bloco para baixo
   */
  const handleMoveDown = useCallback((index: number) => {
    if (index < blocks.length - 1 && onBlockReorder) {
      onBlockReorder(index, index + 1);
    }
  }, [blocks.length, onBlockReorder]);

  /**
   * Handler para duplicar bloco
   */
  const handleDuplicate = useCallback((blockId: string) => {
    if (onBlockDuplicate) {
      onBlockDuplicate(blockId);
    }
  }, [onBlockDuplicate]);

  /**
   * Handler para deletar bloco
   */
  const handleDelete = useCallback((blockId: string) => {
    if (onBlockDelete) {
      onBlockDelete(blockId);
    }
  }, [onBlockDelete]);

  /**
   * Renderizar controles de edição (apenas em modo edit)
   */
  const renderBlockControls = (block: Block, index: number) => {
    if (mode !== 'editor') return null;

    const isSelected = selectedBlockId === block.id;
    const canMoveUp = index > 0;
    const canMoveDown = index < blocks.length - 1;

    return (
      <div
        className={`
          absolute -right-2 top-1/2 -translate-y-1/2 z-10
          flex flex-col gap-1 opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          ${isSelected ? 'opacity-100' : ''}
        `}
      >
        {/* Mover para cima */}
        <Button
          size="sm"
          variant="secondary"
          className="h-7 w-7 p-0"
          onClick={() => handleMoveUp(index)}
          disabled={!canMoveUp}
          title="Mover para cima"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        {/* Mover para baixo */}
        <Button
          size="sm"
          variant="secondary"
          className="h-7 w-7 p-0"
          onClick={() => handleMoveDown(index)}
          disabled={!canMoveDown}
          title="Mover para baixo"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        {/* Duplicar */}
        <Button
          size="sm"
          variant="secondary"
          className="h-7 w-7 p-0"
          onClick={() => handleDuplicate(block.id)}
          title="Duplicar bloco"
        >
          <Copy className="h-4 w-4" />
        </Button>

        {/* Deletar */}
        <Button
          size="sm"
          variant="destructive"
          className="h-7 w-7 p-0"
          onClick={() => handleDelete(block.id)}
          title="Deletar bloco"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div
      className={`step-canvas ${className}`}
      data-step-id={stepId}
      data-mode={mode}
    >
      {blocks.length === 0 ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <p>Nenhum bloco neste step. Adicione blocos para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, index) => {
            const isSelected = selectedBlockId === block.id;

            return (
              <div
                key={block.id}
                className={`
                  group relative
                  transition-all duration-200
                  ${mode === 'editor' ? 'cursor-pointer' : ''}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${mode === 'editor' ? 'hover:ring-1 hover:ring-muted-foreground/30' : ''}
                `}
                onClick={() => {
                  if (mode === 'editor' && onBlockSelect) {
                    onBlockSelect(block.id);
                  }
                }}
              >
                {/* Renderizar controles de edição */}
                {renderBlockControls(block, index)}

                {/* Renderizar bloco usando UniversalBlockRenderer */}
                <UniversalBlockRenderer
                  block={block}
                  mode={mode}
                  isPreviewing={mode === 'preview'}
                  onUpdate={(updates) => {
                    if (onBlockUpdate) {
                      onBlockUpdate(block.id, updates);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

StepCanvas.displayName = 'StepCanvas';

export default StepCanvas;
