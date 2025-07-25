import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '@/components/editor/sidebar/ComponentsSidebar';
import { EditPreview } from '@/components/editor/preview/EditPreview';
import PropertiesPanel from '@/components/editor/properties/PropertiesPanel';
import { EditorToolbar } from '@/components/editor/toolbar/EditorToolbar';
import { useEditor } from '@/hooks/useEditor';
import { useEditorPersistence } from '@/hooks/editor/useEditorPersistence';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EditorQuizProvider } from '@/context/EditorQuizContext';

const EditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const { config, addBlock, updateBlock, deleteBlock, setConfig } = useEditor();
  const { saveFunnel, loadFunnel, isSaving, isLoading } = useEditorPersistence();

  // Extract funnel ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const funnelId = urlParams.get('id');

  // Load funnel on mount if ID is provided
  useEffect(() => {
    if (funnelId) {
      loadFunnel(funnelId).then(data => {
        if (data) {
          // Convert funnel data to editor config
          const editorConfig = {
            id: data.id,
            title: data.name,
            description: data.description || '',
            blocks: data.pages.length > 0 ? data.pages[0].blocks : [],
            settings: data.settings || {}
          };
          setConfig(editorConfig);
        }
      });
    }
  }, [funnelId, loadFunnel, setConfig]);

  const handleSave = async () => {
    const funnelData = {
      id: config.id || `funnel_${Date.now()}`,
      name: config.title || 'Novo Funil',
      description: config.description || '',
      isPublished: false,
      version: 1,
      settings: config.settings || {},
      pages: [{
        id: `page_${Date.now()}`,
        pageType: 'landing',
        pageOrder: 0,
        title: config.title || 'Página Principal',
        blocks: config.blocks,
        metadata: {}
      }]
    };

    await saveFunnel(funnelData);
  };

  const handleGoBack = () => {
    setLocation('/admin/funis');
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Carregando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorToolbar 
        onSave={handleSave}
        onGoBack={handleGoBack}
        isPreviewing={isPreviewing}
        onPreviewToggle={() => setIsPreviewing(!isPreviewing)}
        isSaving={isSaving}
        funnelTitle={config.title || 'Novo Funil'}
      />
      
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Components Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <ComponentsSidebar 
            onComponentSelect={(type) => {
              const id = addBlock(type);
              setSelectedComponentId(id);
            }} 
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Area */}
        <ResizablePanel defaultSize={55}>
          <EditPreview 
            isPreviewing={isPreviewing}
            onPreviewToggle={() => setIsPreviewing(!isPreviewing)}
            onSelectComponent={setSelectedComponentId}
            selectedComponentId={selectedComponentId}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Properties Panel */}
        <ResizablePanel defaultSize={25}>
          <PropertiesPanel
            selectedComponentId={selectedComponentId}
            onClose={() => setSelectedComponentId(null)}
            blocks={config.blocks}
            onUpdate={(content) => {
              if (selectedComponentId) {
                updateBlock(selectedComponentId, content);
              }
            }}
            onDelete={() => {
              if (selectedComponentId) {
                deleteBlock(selectedComponentId);
                setSelectedComponentId(null);
              }
            }}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EditorPage;