/**
 * 🎨 CANVAS COLUMN - Fase 2 Modularização
 * 
 * Coluna 3: Canvas visual com preview dos blocos
 * Extraído de QuizModularProductionEditor para melhor organização
 */

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Eye, GripVertical, Trash2, Copy } from 'lucide-react';

export interface CanvasBlock {
  id: string;
  type: string;
  label: string;
  order: number;
  isSelected?: boolean;
  preview?: React.ReactNode;
}

interface CanvasColumnProps {
  blocks: CanvasBlock[];
  isPreviewMode?: boolean;
  onTogglePreview?: () => void;
  onBlockSelect?: (blockId: string) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (blockId: string) => void;
  onBlockReorder?: (oldIndex: number, newIndex: number) => void;
  onInsertAtIndex?: (index: number) => void;
  renderBlock?: (block: CanvasBlock) => React.ReactNode;
  className?: string;
}

export const CanvasColumn: React.FC<CanvasColumnProps> = ({
  blocks,
  isPreviewMode = false,
  onTogglePreview,
  onBlockSelect,
  onBlockDelete,
  onBlockDuplicate,
  onBlockReorder,
  onInsertAtIndex,
  renderBlock,
  className,
}) => {
  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Canvas</h2>
          <p className="text-sm text-muted-foreground">
            {blocks.length} {blocks.length === 1 ? 'bloco' : 'blocos'}
          </p>
        </div>

        {onTogglePreview && (
          <Button
            variant={isPreviewMode ? 'default' : 'outline'}
            size="sm"
            onClick={onTogglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Modo Edição' : 'Preview'}
          </Button>
        )}
      </div>

      {/* Canvas Area */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {blocks.length === 0 ? (
            <Alert className="border-dashed">
              <AlertDescription>
                Arraste componentes da biblioteca para começar a construir sua etapa
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {/* Zona de inserção antes do primeiro bloco */}
              {!isPreviewMode && (
                <button
                  type="button"
                  data-testid="insert-zone-0"
                  className="w-full h-8 -my-1 border-2 border-dashed rounded text-[11px] text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  onClick={() => onInsertAtIndex?.(0)}
                >
                  + Inserir aqui
                </button>
              )}
              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  data-testid="canvas-block"
                  data-block-id={block.id}
                  className={cn(
                    'relative group rounded-lg border transition-all',
                    block.isSelected
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-border hover:border-primary/50',
                    isPreviewMode && 'pointer-events-none',
                  )}
                  onClick={() => !isPreviewMode && onBlockSelect?.(block.id)}
                >
                  {/* Toolbar (apenas em modo edição) */}
                  {!isPreviewMode && (
                    <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-grab"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <GripVertical className="h-4 w-4" />
                      </Button>
                      {onBlockReorder && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Mover para cima"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (index > 0) onBlockReorder(index, index - 1);
                            }}
                          >
                            <span className="text-xs">↑</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Mover para baixo"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (index < blocks.length - 1) onBlockReorder(index, index + 1);
                            }}
                          >
                            <span className="text-xs">↓</span>
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* Ações (apenas em modo edição) */}
                  {!isPreviewMode && (
                    <div className="absolute -right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      {onBlockDuplicate && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBlockDuplicate(block.id);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                      {onBlockDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onBlockDelete(block.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Conteúdo do bloco */}
                  <div className="p-4">
                    {renderBlock ? renderBlock(block) : (
                      <>
                        <div className="text-sm font-medium mb-2">{block.label}</div>
                        {block.preview ? block.preview : (
                          <div className="text-muted-foreground text-sm">
                            Preview não disponível
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  {/* Zona de inserção após o bloco */}
                  {!isPreviewMode && (
                    <div className="mt-2">
                      <button
                        type="button"
                        data-testid={`insert-zone-${index + 1}`}
                        className="w-full h-8 -my-1 border-2 border-dashed rounded text-[11px] text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        onClick={(e) => { e.stopPropagation(); onInsertAtIndex?.(index + 1); }}
                      >
                        + Inserir aqui
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
