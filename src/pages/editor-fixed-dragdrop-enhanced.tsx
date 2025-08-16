import React, { useState, useEffect, useCallback } from 'react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useEditor } from '@/context/EditorContext';
import { EditorCanvas } from '@/components/enhanced-editor/canvas/EditorCanvas';
import { EnhancedUniversalPropertiesPanel } from '@/components/universal/EnhancedUniversalPropertiesPanel';
import { ComponentsSidebar } from '@/components/editor/sidebar/ComponentsSidebar';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const EditorFixedDragDropEnhanced: React.FC = () => {
  const {
    state,
    dispatch,
    stages,
    activeStageId,
    computed,
    uiState,
    blockActions,
    stageActions,
    persistenceActions,
    selectedBlockId,
  } = useEditor();
  const { toast } = useToast();

  const [funnelName, setFunnelName] = useState('Novo Funil');
  const [funnelDescription, setFunnelDescription] = useState('Descrição do funil');

  // Map viewport sizes
  const mapViewportSize = (size: string): 'desktop' | 'tablet' | 'mobile' => {
    switch (size) {
      case 'sm':
      case 'md':
        return 'mobile';
      case 'lg':
        return 'tablet';
      case 'xl':
      default:
        return 'desktop';
    }
  };

  const handleViewportChange = (size: 'sm' | 'md' | 'lg' | 'xl') => {
    const mappedSize = mapViewportSize(size);
    if (uiState.setViewportSize) {
      uiState.setViewportSize(mappedSize);
    }
  };

  const handleComponentSelect = async (type: string) => {
    try {
      const blockId = await blockActions.addBlock(type);
      if (blockId) {
        blockActions.setSelectedBlockId(blockId);
        toast({
          title: 'Bloco adicionado',
          description: `Bloco ${type} adicionado com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar bloco:', error);
      toast({
        title: 'Erro ao adicionar bloco',
        description: 'Ocorreu um erro ao adicionar o bloco. Por favor, tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleFunnelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFunnelName(e.target.value);
  };

  const handleFunnelDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFunnelDescription(e.target.value);
  };

  const handleTogglePreview = () => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: !state.isPreviewing });
  };

  const handleSave = async () => {
    try {
      await persistenceActions.save();
      console.log('✅ Funnel saved successfully');
    } catch (error) {
      console.error('❌ Error saving funnel:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b">
        <div className="container flex items-center h-16 space-x-4">
          <div className="flex-1 flex items-center space-x-2">
            <Label htmlFor="funnel-name" className="text-sm font-medium">
              Nome do Funil:
            </Label>
            <Input
              type="text"
              id="funnel-name"
              value={funnelName}
              onChange={handleFunnelNameChange}
              className="max-w-xs text-sm"
            />
          </div>

          <div className="flex-1 flex items-center space-x-2">
            <Label htmlFor="funnel-description" className="text-sm font-medium">
              Descrição:
            </Label>
            <Textarea
              id="funnel-description"
              value={funnelDescription}
              onChange={handleFunnelDescriptionChange}
              className="max-w-md text-sm"
              rows={1}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleTogglePreview}>
              {uiState.isPreviewing ? 'Esconder Preview' : 'Mostrar Preview'}
            </Button>
            <Button size="sm" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </div>
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar onComponentSelect={handleComponentSelect} />
        </ResizablePanel>

        
        <ResizablePanel defaultSize={60} minSize={40}>
          <EditorCanvas
            blocks={computed.currentBlocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={blockActions.setSelectedBlockId}
            onUpdateBlock={blockActions.updateBlock}
            onDeleteBlock={blockActions.deleteBlock}
            onReorderBlocks={blockActions.reorderBlocks}
            isPreviewing={uiState.isPreviewing}
            viewportSize={mapViewportSize('xl')}
          />
        </ResizablePanel>

        
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <EnhancedUniversalPropertiesPanel selectedBlock={computed.selectedBlock || null} onUpdate={blockActions.updateBlock} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EditorFixedDragDropEnhanced;
