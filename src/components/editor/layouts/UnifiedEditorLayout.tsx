import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditorProvider } from '@/context/EditorContext';
import { useResultPageConfig } from '@/hooks/useResultPageConfig';
import React, { useState } from 'react';
import { EditorCanvas } from '../canvas/EditorCanvas';
import PropertiesPanel from '../properties/PropertiesPanel';
import ComponentsSidebar from '../sidebar/ComponentsSidebar';

interface UnifiedEditorLayoutProps {
  className?: string;
}

export const UnifiedEditorLayout: React.FC<UnifiedEditorLayoutProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'result' | 'sales'>('result');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing] = useState(false);

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

  const handleReorderBlocks = (sourceIndex: number, destinationIndex: number) => {
    console.log('Blocks reordered:', sourceIndex, destinationIndex);
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
          <div className="border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quiz">Quiz Editor</TabsTrigger>
              <TabsTrigger value="result">Result Page</TabsTrigger>
              <TabsTrigger value="sales">Sales Page</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="result" className="flex-1 mt-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <ComponentsSidebar onComponentSelect={handleComponentSelect} />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={55}>
                <EditorCanvas
                  blocks={config.blocks || []}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlock={handleBlockUpdate}
                  onDeleteBlock={handleBlockDelete}
                  onReorderBlocks={handleReorderBlocks}
                  isPreviewing={isPreviewing}
                  viewportSize="lg"
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={25}>
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
            <div className="h-full flex items-center justify-center">
              <p style={{ color: '#8B7355' }}>Quiz Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center">
              <p style={{ color: '#8B7355' }}>Sales Page Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EditorProvider>
  );
};
