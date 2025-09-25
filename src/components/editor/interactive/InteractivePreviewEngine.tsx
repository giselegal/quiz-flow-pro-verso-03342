import React, { useState, useCallback } from 'react';
import { Block } from '@/types/editor';
import { ProductionPreviewEngine } from '../unified/ProductionPreviewEngine';
import { InlineEditableBlock } from './InlineEditableBlock';
import { BlockPropertyPanel } from './BlockPropertyPanel';
import { DragDropBlockManager } from './DragDropBlockManager';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Edit3, 
  Move3D, 
  Settings2, 
  Eye, 
  RotateCcw,
  Save 
} from 'lucide-react';

interface InteractivePreviewEngineProps {
  blocks: Block[];
  onBlocksUpdate: (blocks: Block[]) => void;
  className?: string;
}

type EditMode = 'view' | 'inline' | 'drag' | 'properties';

export const InteractivePreviewEngine: React.FC<InteractivePreviewEngineProps> = ({
  blocks,
  onBlocksUpdate,
  className,
}) => {
  const [editMode, setEditMode] = useState<EditMode>('view');
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const activeBlock = blocks.find(b => b.id === activeBlockId) || null;

  const handleBlockUpdate = useCallback((blockId: string, changes: Partial<Block>) => {
    const updatedBlocks = blocks.map(block => 
      block.id === blockId 
        ? { ...block, ...changes }
        : block
    );
    onBlocksUpdate(updatedBlocks);
    setHasUnsavedChanges(true);
  }, [blocks, onBlocksUpdate]);

  const handleBlockReorder = useCallback((reorderedBlocks: Block[]) => {
    onBlocksUpdate(reorderedBlocks);
    setHasUnsavedChanges(true);
  }, [onBlocksUpdate]);

  const handleSaveChanges = () => {
    // In a real app, this would sync to backend
    console.log('🔄 Saving changes to backend...');
    setHasUnsavedChanges(false);
  };

  const handleResetChanges = () => {
    // In a real app, this would reload from backend
    console.log('🔄 Resetting changes...');
    setHasUnsavedChanges(false);
  };

  const renderBlock = (block: Block) => {
    if (editMode === 'inline') {
      return (
        <InlineEditableBlock
          key={block.id}
          block={block}
          onBlockUpdate={handleBlockUpdate}
          isActive={activeBlockId === block.id}
          onActivate={setActiveBlockId}
        >
          <ProductionPreviewEngine 
            blocks={[block]} 
            mode="preview"
          />
        </InlineEditableBlock>
      );
    }

    return (
      <div
        key={block.id}
        className={cn(
          editMode === 'properties' && 'cursor-pointer hover:ring-1 hover:ring-primary/50 rounded-lg transition-all',
          activeBlockId === block.id && editMode === 'properties' && 'ring-2 ring-primary'
        )}
        onClick={() => editMode === 'properties' && setActiveBlockId(block.id)}
      >
        <ProductionPreviewEngine 
          blocks={[block]} 
          mode="preview"
        />
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {/* Edit Mode Toolbar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">Editor Interativo</h3>
            <span className="text-sm text-muted-foreground">
              {blocks.length} blocos
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Edit Mode Buttons */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                size="sm"
                variant={editMode === 'view' ? 'default' : 'ghost'}
                onClick={() => setEditMode('view')}
                className="h-8"
              >
                <Eye className="w-4 h-4 mr-1" />
                Visualizar
              </Button>
              <Button
                size="sm"
                variant={editMode === 'inline' ? 'default' : 'ghost'}
                onClick={() => setEditMode('inline')}
                className="h-8"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button
                size="sm"
                variant={editMode === 'drag' ? 'default' : 'ghost'}
                onClick={() => setEditMode('drag')}
                className="h-8"
              >
                <Move3D className="w-4 h-4 mr-1" />
                Arrastar
              </Button>
              <Button
                size="sm"
                variant={editMode === 'properties' ? 'default' : 'ghost'}
                onClick={() => setEditMode('properties')}
                className="h-8"
              >
                <Settings2 className="w-4 h-4 mr-1" />
                Propriedades
              </Button>
            </div>

            {/* Save Controls */}
            {hasUnsavedChanges && (
              <div className="flex gap-2 ml-4">
                <Button size="sm" onClick={handleSaveChanges}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleResetChanges}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {editMode === 'view' && (
            <ProductionPreviewEngine 
              blocks={blocks} 
              mode="production"
            />
          )}

          {editMode === 'drag' && (
            <DragDropBlockManager
              blocks={blocks}
              onReorder={handleBlockReorder}
            >
              {renderBlock}
            </DragDropBlockManager>
          )}

          {(editMode === 'inline' || editMode === 'properties') && (
            <div className="space-y-6">
              {blocks.map(renderBlock)}
            </div>
          )}
        </div>

        {/* Property Panel */}
        {editMode === 'properties' && (
          <div className="flex-shrink-0">
            <div className="sticky top-32">
              <BlockPropertyPanel
                block={activeBlock}
                onBlockUpdate={handleBlockUpdate}
                onClose={() => setActiveBlockId(null)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {editMode !== 'view' && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-background border rounded-lg shadow-lg px-4 py-2 flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              Modo: <span className="font-medium capitalize">{editMode}</span>
            </div>
            {activeBlockId && (
              <div className="text-sm text-muted-foreground">
                Ativo: <span className="font-mono text-xs">#{activeBlockId.slice(-6)}</span>
              </div>
            )}
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};