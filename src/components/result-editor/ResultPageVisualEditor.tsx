

import React, { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from './ComponentsSidebar';
import { EditorPreview } from './EditorPreview';
import PropertiesPanel from './PropertiesPanel';
import EditorToolbar from './EditorToolbar';
import { GlobalStylesEditor } from './GlobalStylesEditor';
import { useResultPageEditor } from '@/hooks/useResultPageEditor';
import { useBlockOperations } from '@/hooks/editor/useBlockOperations';
import { EditorProps } from '@/types/editorTypes';
import { toast } from '@/components/ui/use-toast';
import { ResultPageConfig } from '@/types/resultPageConfig';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyleResult, StyleType } from '@/types/quiz';

interface ResultPageVisualEditorProps extends EditorProps {
  initialConfig?: ResultPageConfig;
}

export const ResultPageVisualEditor: React.FC<ResultPageVisualEditorProps> = ({ 
  selectedStyle,
  onShowTemplates,
  initialConfig
}) => {
  const {
    resultPageConfig,
    loading,
    isPreviewing,
    isGlobalStylesOpen,
    actions: {
      handleSave,
      handleReset,
      toggleGlobalStyles,
      togglePreview,
      updateSection,
      importConfig
    }
  } = useResultPageEditor(selectedStyle.category);

  const {
    blocks,
    selectedBlockId,
    setSelectedBlockId,
    updateBlocks,
    actions: blockActions
  } = useBlockOperations();

  useEffect(() => {
    if (initialConfig && importConfig) {
      importConfig(initialConfig);
    }
  }, [initialConfig, importConfig]);

  useEffect(() => {
    if (resultPageConfig?.blocks) {
      updateBlocks(resultPageConfig.blocks);
    } else {
      updateSection('blocks', []);
    }
  }, [resultPageConfig, updateBlocks, updateSection]);

  const handleUpdateConfig = (newConfig: ResultPageConfig) => {
    if (newConfig) {
      try {
        importConfig(newConfig);
        if (newConfig.blocks) {
          updateBlocks(newConfig.blocks);
        } else {
          updateBlocks([]);
        }
        toast({
          title: "Configuração atualizada",
          description: "A configuração foi aplicada com sucesso",
          duration: 3000
        });
      } catch (error) {
        console.error('Error updating config:', error);
        toast({
          title: "Erro ao atualizar configuração",
          description: "Ocorreu um erro ao aplicar a configuração",
          variant: "destructive",
          duration: 5000
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-[#1A1818]/70">Carregando configurações...</p>
      </div>
    );
  }

  const primaryStyle: StyleResult = {
    category: selectedStyle.category as StyleType,
    score: selectedStyle.score,
    percentage: selectedStyle.percentage,
    style: selectedStyle.category as StyleType,
    points: selectedStyle.score,
    rank: 1
  };

  const selectedBlock = selectedBlockId ? blocks.find(block => block.id === selectedBlockId) : null;

  // Handle component selection - convert string to proper type
  const handleComponentSelect = (type: string) => {
    blockActions.handleAddBlock(type);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <EditorToolbar 
        onSave={handleSave}
        isPreviewMode={isPreviewing}
        onPreviewToggle={togglePreview}
        onReset={handleReset}
        onEditGlobalStyles={toggleGlobalStyles}
        resultPageConfig={resultPageConfig}
        onUpdateConfig={handleUpdateConfig}
        onShowTemplates={onShowTemplates}
      />
      
      <Tabs defaultValue="editor" className="flex-1">
        <TabsList className="hidden">
          <TabsTrigger value="editor">Editor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <ComponentsSidebar onComponentSelect={handleComponentSelect} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={55}>
              <EditorPreview
                blocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                isPreviewing={isPreviewing}
                primaryStyle={primaryStyle}
                onReorderBlocks={blockActions.handleReorderBlocks}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={25}>
              <PropertiesPanel
                selectedBlock={selectedBlock}
                onClose={() => setSelectedBlockId(null)}
                onUpdateBlock={blockActions.handleUpdateBlock}
                onDeleteBlock={blockActions.handleDeleteBlock}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </TabsContent>
      </Tabs>
      
      {isGlobalStylesOpen && (
        <GlobalStylesEditor
          globalStyles={resultPageConfig.globalStyles || {}}
          onSave={(styles) => {
            updateSection('globalStyles', styles);
            toggleGlobalStyles();
          }}
          onCancel={toggleGlobalStyles}
        />
      )}
    </div>
  );
};

