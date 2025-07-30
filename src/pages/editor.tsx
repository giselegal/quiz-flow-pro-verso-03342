import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../components/ui/resizable';
import { ComponentsSidebar } from '../components/editor/sidebar/ComponentsSidebar';
import { EditPreview } from '../components/editor/preview/EditPreview';
import PropertiesPanel from '../components/editor/properties/PropertiesPanel';
import { EditorToolbar } from '../components/editor/toolbar/EditorToolbar';
import { useEditor } from '../hooks/useEditor';
import { useEditorPersistence } from '../hooks/editor/useEditorPersistence';
import { useAutoSaveWithDebounce } from '../hooks/editor/useAutoSaveWithDebounce';
import { toast } from '../components/ui/use-toast';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { EditorQuizProvider } from '@/contexts/EditorQuizContext';
import { schemaDrivenFunnelService } from '../services/schemaDrivenFunnelService';

const EditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isLoadingFunnel, setIsLoadingFunnel] = useState(false);
  
  // Extract funnel ID from URL - MOVIDO PARA O INÍCIO
  const urlParams = new URLSearchParams(window.location.search);
  const funnelId = urlParams.get('id');
  
  const { config, addBlock, updateBlock, deleteBlock, setConfig } = useEditor();
  const { saveFunnel, loadFunnel, isSaving, isLoading } = useEditorPersistence();

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
            setConfig({
              blocks: firstPage.blocks,
              title: firstPage.title,
              description: schemaDrivenData.description
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
  }, [funnelId, setConfig]);
  
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
        blocks: data.blocks,
        metadata: {}
      }]
    };
    await saveFunnel(funnelData);
  };
  
  const { forceSave } = useAutoSaveWithDebounce({
    data: config,
    onSave: handleAutoSave,
    delay: 500,
    enabled: !!config?.blocks?.length,
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
          config={config}
          isSaving={isSaving}
          onPreview={() => setIsPreviewing(!isPreviewing)}
          isPreviewing={isPreviewing}
          onSave={() => forceSave()}
        />
        
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <ComponentsSidebar 
              onAddBlock={addBlock}
              selectedComponentId={selectedComponentId}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={60} minSize={30}>
            <EditPreview
              config={config}
              onSelectComponent={setSelectedComponentId}
              selectedComponentId={selectedComponentId}
              onUpdateBlock={updateBlock}
              onDeleteBlock={deleteBlock}
              isPreviewing={isPreviewing}
            />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <PropertiesPanel
              selectedComponentId={selectedComponentId}
              config={config}
              onUpdateBlock={updateBlock}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </EditorQuizProvider>
  );
};

export default EditorPage;
