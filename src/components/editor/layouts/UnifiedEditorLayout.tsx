import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorProvider } from '../EditorProvider';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import React, { useState } from 'react';
import { CanvasDropZone } from '../canvas/CanvasDropZone.simple';
import PropertiesPanel from '../properties/PropertiesPanel';
import ComponentsSidebar from '../components/ComponentsSidebar';

interface UnifiedEditorLayoutProps {
  className?: string;
}

export const UnifiedEditorLayout: React.FC<UnifiedEditorLayoutProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'result' | 'sales'>('result');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const { resultPageConfig } = useResultPageConfig('Natural');

  const handleComponentSelect = (type: string) => {
    console.log('Component selected:', type);
  };

  const handleBlockUpdate = (updates: any) => {
    if (selectedBlockId) {
      console.log('Block updated:', selectedBlockId, updates);
    }
  };

  const handleBlockDelete = () => {
    if (selectedBlockId) {
      console.log('Block deleted:', selectedBlockId);
      setSelectedBlockId(null);
    }
  };

  // Create default config with all required properties
  const defaultConfig = {
    styleType: 'Natural',
    header: {
      visible: true,
      content: {
        title: 'Seu Resultado',
        subtitle: 'Descubra seu estilo único',
      },
    },
    mainContent: {
      visible: true,
      content: {
        description: 'Conteúdo principal do resultado',
      },
    },
    offer: {
      hero: {
        visible: true,
        content: {
          title: 'Oferta Especial',
          description: 'Descrição da oferta',
        },
      },
      benefits: { visible: true, content: {} },
      products: { visible: true, content: {} },
      pricing: { visible: true, content: {} },
      testimonials: { visible: true, content: {} },
      guarantee: { visible: true, content: {} },
    },
    blocks: [],
  };

  const config = resultPageConfig || defaultConfig;
  // Fix type compatibility by ensuring content is always defined
  const selectedBlock = selectedBlockId
    ? config.blocks?.find((b: any) => b.id === selectedBlockId) || null
    : null;

  const safeSelectedBlock = selectedBlock
    ? {
      ...selectedBlock,
      content: selectedBlock.content || {},
      properties: selectedBlock.properties || {},
    }
    : null;

  return (
    <EditorProvider>
      <div className={`h-screen flex flex-col ${className}`}>
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as any)}
          className="flex-1"
        >
          <div className="border-b border-brand-brightPink/20 bg-brand-background">
            <TabsList className="grid w-full grid-cols-3 bg-brand-darkBlue/5">
              <TabsTrigger value="quiz" className="text-brand-darkBlue data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-brightPink data-[state=active]:to-brand-brightBlue data-[state=active]:text-white">Quiz Editor</TabsTrigger>
              <TabsTrigger value="result" className="text-brand-darkBlue data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-brightPink data-[state=active]:to-brand-brightBlue data-[state=active]:text-white">Result Page</TabsTrigger>
              <TabsTrigger value="sales" className="text-brand-darkBlue data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-brightPink data-[state=active]:to-brand-brightBlue data-[state=active]:text-white">Sales Page</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="result" className="flex-1 mt-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={15} minSize={12} maxSize={30}>
                <ComponentsSidebar onComponentSelect={handleComponentSelect} />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={70} minSize={60}>
                <CanvasDropZone
                  blocks={config.blocks || []}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlock={handleBlockUpdate}
                  onDeleteBlock={handleBlockDelete}
                  scopeId={'unified-layout'}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={15} minSize={12}>
                <PropertiesPanel
                  selectedBlock={safeSelectedBlock}
                  onUpdate={handleBlockUpdate}
                  onDelete={handleBlockDelete}
                  onClose={() => setSelectedBlockId(null)}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="quiz" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center bg-brand-background">
              <p className="text-brand-darkBlue/70">Quiz Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center bg-brand-background">
              <p className="text-brand-darkBlue/70">Sales Page Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EditorProvider>
  );
};
