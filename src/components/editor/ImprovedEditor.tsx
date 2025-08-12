// @ts-nocheck
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { FileText, Layers, PanelLeft, PanelRight } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

// Importar nossos novos componentes
import type { BlockData } from '@/types/blocks';
import EditorHistory from './history/EditorHistory';
import ResponsivePreview from './preview/ResponsivePreview';
import EnhancedPropertiesPanel from './properties/EnhancedPropertiesPanel';
import ComponentsLibrary from './sidebar/ComponentsLibrary';

interface ImprovedEditorProps {
  initialBlocks?: BlockData[];
  onSave?: (blocks: BlockData[]) => void;
  onBlocksChange?: (blocks: BlockData[]) => void;
  className?: string;
  title?: string;
  stepNumber?: number;
}

const ImprovedEditor: React.FC<ImprovedEditorProps> = ({
  initialBlocks = [],
  onSave,
  onBlocksChange,
  className,
  title = 'Editor de Quiz',
  stepNumber,
}) => {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Bloco selecionado
  const selectedBlock = useMemo(
    () => blocks.find(block => block.id === selectedBlockId) || null,
    [blocks, selectedBlockId]
  );

  // Handlers
  const handleBlocksChange = useCallback(
    (newBlocks: BlockData[]) => {
      setBlocks(newBlocks);
      onBlocksChange?.(newBlocks);
    },
    [onBlocksChange]
  );

  const handleBlockSelect = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
  }, []);

  const handleBlockUpdate = useCallback(
    (updates: Partial<BlockData>) => {
      if (!selectedBlockId) return;

      const newBlocks = blocks.map(block =>
        block.id === selectedBlockId ? { ...block, ...updates } : block
      );

      handleBlocksChange(newBlocks);
    },
    [selectedBlockId, blocks, handleBlocksChange]
  );

  const handleAddBlock = useCallback(
    (blockType: string) => {
      const newBlock: BlockData = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: blockType,
        properties: {},
        position: blocks.length,
      };

      const newBlocks = [...blocks, newBlock];
      handleBlocksChange(newBlocks);
      setSelectedBlockId(newBlock.id);
    },
    [blocks, handleBlocksChange]
  );

  const handleBlockDelete = useCallback(() => {
    if (!selectedBlockId) return;

    const newBlocks = blocks.filter(block => block.id !== selectedBlockId);
    handleBlocksChange(newBlocks);
    setSelectedBlockId(null);
  }, [selectedBlockId, blocks, handleBlocksChange]);

  const handleBlockDuplicate = useCallback(() => {
    if (!selectedBlockId || !selectedBlock) return;

    const duplicatedBlock: BlockData = {
      ...selectedBlock,
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      // position: blocks.length,
    };

    const newBlocks = [...blocks, duplicatedBlock];
    handleBlocksChange(newBlocks);
    setSelectedBlockId(duplicatedBlock.id);
  }, [selectedBlockId, selectedBlock, blocks, handleBlocksChange]);

  const handleBlockReset = useCallback(() => {
    if (!selectedBlockId) return;

    const newBlocks = blocks.map(block =>
      block.id === selectedBlockId ? { ...block, properties: {} } : block
    );

    handleBlocksChange(newBlocks);
  }, [selectedBlockId, blocks, handleBlocksChange]);

  const handleSave = useCallback(async () => {
    if (onSave) {
      await onSave(blocks);
    }
  }, [onSave, blocks]);

  return (
    <TooltipProvider>
      <div className={cn('h-screen flex flex-col bg-gray-50', className)}>
        {/* Header */}
        <div className="bg-white border-b border-[#B89B7A]/20 p-4">
          <div className="flex items-center justify-between">
            {/* Título e informações */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#B89B7A] rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-[#432818]">{title}</h1>
                  {stepNumber && <p style={{ color: '#6B4F43' }}>Etapa {stepNumber}</p>}
                </div>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* Estatísticas */}
              <div style={{ color: '#6B4F43' }}>
                <div className="flex items-center gap-1">
                  <Layers className="w-4 h-4" />
                  <span>{blocks.length} blocos</span>
                </div>
                {selectedBlock && (
                  <Badge variant="secondary" className="bg-[#B89B7A]/10 text-[#432818]">
                    {selectedBlock.type}
                  </Badge>
                )}
              </div>
            </div>

            {/* Controles do header */}
            <div className="flex items-center gap-2">
              {/* Editor History */}
              <EditorHistory
                blocks={blocks}
                onBlocksChange={handleBlocksChange}
                onSave={handleSave}
                autoSave={true}
              />

              <Separator orientation="vertical" className="h-8" />

              {/* Toggle de painéis */}
              <div className="flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={leftPanelVisible ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLeftPanelVisible(!leftPanelVisible)}
                    >
                      <PanelLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {leftPanelVisible ? 'Ocultar' : 'Mostrar'} Biblioteca
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={rightPanelVisible ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRightPanelVisible(!rightPanelVisible)}
                    >
                      <PanelRight className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {rightPanelVisible ? 'Ocultar' : 'Mostrar'} Propriedades
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Principal */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
            {/* Sidebar esquerda - Biblioteca de Componentes */}
            {leftPanelVisible && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <div className="h-full p-4">
                    <ComponentsLibrary onAddBlock={handleAddBlock} />
                  </div>
                </ResizablePanel>
                <ResizableHandle className="w-1 bg-[#B89B7A]/20 hover:bg-[#B89B7A]/40 transition-colors" />
              </>
            )}

            {/* Área central - Preview */}
            <ResizablePanel defaultSize={leftPanelVisible && rightPanelVisible ? 50 : 70}>
              <div className="h-full p-4">
                <ResponsivePreview
                  blocks={blocks}
                  selectedBlockId={selectedBlockId}
                  onBlockSelect={handleBlockSelect}
                />
              </div>
            </ResizablePanel>

            {/* Sidebar direita - Propriedades */}
            {rightPanelVisible && (
              <>
                <ResizableHandle className="w-1 bg-[#B89B7A]/20 hover:bg-[#B89B7A]/40 transition-colors" />
                <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                  <div className="h-full p-4">
                    <EnhancedPropertiesPanel
                      selectedBlock={selectedBlock}
                      onUpdate={handleBlockUpdate}
                      onDelete={handleBlockDelete}
                      onDuplicate={handleBlockDuplicate}
                      onReset={handleBlockReset}
                      onClose={() => setSelectedBlockId(null)}
                      previewMode={previewMode}
                      onPreviewModeChange={setPreviewMode}
                    />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>

        {/* Status bar */}
        <div className="bg-white border-t border-[#B89B7A]/20 px-4 py-2">
          <div style={{ color: '#6B4F43' }}>
            <div className="flex items-center gap-4">
              <span>
                {blocks.length} {blocks.length === 1 ? 'bloco' : 'blocos'}
              </span>
              {selectedBlock && (
                <>
                  <span>•</span>
                  <span>Selecionado: {selectedBlock.type}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Auto-save ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ImprovedEditor;
