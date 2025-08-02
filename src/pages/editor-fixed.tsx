
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '@/components/editor/sidebar/ComponentsSidebar';
import { EditorCanvas } from '@/components/editor/canvas/EditorCanvas';
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import { useEditor } from '@/hooks/useEditor';
import { useEditorPersistence } from '@/hooks/editor/useEditorPersistence';
import { useAutoSaveWithDebounce } from '@/hooks/editor/useAutoSaveWithDebounce';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EditorQuizProvider } from '@/contexts/EditorQuizContext';
import { schemaDrivenFunnelService } from '../services/schemaDrivenFunnelService';
import type { EditorBlock } from '@/types/editor';

const EditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);
  
  // Extract funnel ID from URL - MOVIDO PARA O INÍCIO
  const urlParams = new URLSearchParams(window.location.search);
  const funnelId = urlParams.get('id');
  
  const { blocks, actions } = useEditor();
  const { saveFunnel, loadFunnel, isSaving, isLoading } = useEditorPersistence();

  // Helper para converter blocks do useEditor para formato esperado pelo EditorCanvas
  const editorBlocks = blocks.map(block => ({
    id: block.id,
    type: block.type,
    properties: block.content || block.properties || {},
    order: block.order || 0
  }));

  // Load funnel data if ID is provided in URL
  useEffect(() => {
    const loadFunnelData = async () => {
      if (!funnelId) return;
      
      setIsLoadingFunnel(true);
      try {
        console.log('🔍 Loading funnel from schema service:', funnelId);
        const schemaDrivenData = await schemaDrivenFunnelService.loadFunnel(funnelId);
        
        if (schemaDrivenData) {
          // Convert to editor format and load first page blocks
          const firstPage = schemaDrivenData.pages[0];
          if (firstPage && firstPage.blocks) {
            // Update blocks using actions
            firstPage.blocks.forEach((block: any) => {
              actions.addBlock(block.type);
            });
            console.log('✅ Loaded funnel blocks:', firstPage.blocks.length);
          }
        } else {
          console.warn('❌ Funnel not found with ID:', funnelId);
          toast({
            title: "Aviso",
            description: "Funil não encontrado. Criando novo funil.",
            variant: "default"
          });
        }
      } catch (error) {
        console.error('❌ Error loading funnel:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar funil",
          variant: "destructive"
        });
      } finally {
        setIsLoadingFunnel(false);
      }
    };

    loadFunnelData();
  }, [funnelId, actions]);
  
  // ✅ AUTO-SAVE COM DEBOUNCE - Fase 1 
  const handleAutoSave = async (data: any) => {
    // Preservar o ID original do funil carregado da URL
    const preservedId = funnelId || data.id || `funnel_${Date.now()}`;
    
    console.log('🔍 DEBUG - handleAutoSave:', {
      funnelId,
      dataId: data.id,
      preservedId,
      url: window.location.href
    });
    
    const funnelData = {
      id: preservedId,
      name: data.title || 'Novo Funil',
      description: data.description || '',
      isPublished: false,
      version: data.version || 1,
      settings: data.settings || {},
      pages: [{
        id: `page_${Date.now()}`,
        pageType: 'landing',
        pageOrder: 0,
        title: data.title || 'Página Principal',
        blocks: blocks,
        metadata: {}
      }]
    };
    await saveFunnel(funnelData);
  };
  
  const { forceSave } = useAutoSaveWithDebounce({
    data: { blocks },
    onSave: handleAutoSave,
    delay: 500,
    enabled: !!blocks?.length,
    showToasts: false
  });

  // Show loading while loading funnel
  if (isLoadingFunnel || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Carregando editor...</span>
      </div>
    );
  }

  return (
    <EditorQuizProvider>
      <div className="flex flex-col h-screen bg-background">
        <EditorToolbar
          isPreviewing={isPreviewing}
          onTogglePreview={() => setIsPreviewing(!isPreviewing)}
          onSave={() => forceSave()}
        />
        
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <ComponentsSidebar 
              onComponentSelect={(type) => {
                const newBlockId = actions.addBlock(type);
                setSelectedComponentId(newBlockId);
              }}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={60} minSize={30}>
            <EditorCanvas
              blocks={editorBlocks}
              selectedBlockId={selectedComponentId}
              onSelectBlock={setSelectedComponentId}
              onUpdateBlock={(blockId, properties) => {
                actions.updateBlock(blockId, properties);
              }}
              onDeleteBlock={(blockId) => {
                actions.deleteBlock(blockId);
                if (selectedComponentId === blockId) {
                  setSelectedComponentId(null);
                }
              }}
              onReorderBlocks={(sourceIndex, destinationIndex) => {
                // Implementar reordenação se necessário
                console.log('Reordering blocks:', sourceIndex, '->', destinationIndex);
              }}
              isPreviewing={isPreviewing}
              viewportSize="lg"
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <PropertiesPanel
              selectedBlock={selectedComponentId ? {
                id: selectedComponentId,
                type: blocks.find(b => b.id === selectedComponentId)?.type || '',
                content: blocks.find(b => b.id === selectedComponentId)?.content || {},
                order: blocks.find(b => b.id === selectedComponentId)?.order || 0
              } as EditorBlock : null}
              onClose={() => setSelectedComponentId(null)}
              onUpdate={(updates) => {
                if (selectedComponentId) {
                  actions.updateBlock(selectedComponentId, updates);
                }
              }}
              onDelete={() => {
                if (selectedComponentId) {
                  actions.deleteBlock(selectedComponentId);
                  setSelectedComponentId(null);
                }
              }}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </EditorQuizProvider>
  );
};

export default EditorPage;
