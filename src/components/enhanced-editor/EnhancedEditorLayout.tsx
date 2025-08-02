import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '../sidebar/ComponentsSidebar';
import { EditorCanvas } from '../canvas/EditorCanvas';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { EditorProvider } from '@/contexts/EditorContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface EnhancedEditorLayoutProps {
  className?: string;
}

const EnhancedEditorLayout: React.FC<EnhancedEditorLayoutProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'result' | 'sales'>('result');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const {
    blocks,
    actions
  } = useEditor();

  const handleComponentSelect = (type: string) => {
    console.log('Component selected:', type);
  };

  const handleBlockUpdate = (id: string, updates: any) => {
    console.log('Block updated:', id, updates);
  };

  const handleBlockDelete = (id: string) => {
    console.log('Block deleted:', id);
  };

  const handleReorderBlocks = (sourceIndex: number, destinationIndex: number) => {
    console.log('Blocks reordered:', sourceIndex, destinationIndex);
  };

  return (
    <EditorProvider>
      <div className={`h-screen flex flex-col ${className}`}>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1">
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
                  blocks={blocks}
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
              selectedBlock={selectedBlockId ? blocks.find(b => b.id === selectedBlockId) || null : null}
              blocks={blocks}
              onClose={() => setSelectedBlockId(null)}
              onUpdate={handleBlockUpdate}
              onDelete={handleBlockDelete}
              isMobile={isMobile}
            />
          </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent value="quiz" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Quiz Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="flex-1 mt-0">
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Sales Page Editor - Em desenvolvimento</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EditorProvider>
  );
};

export default EnhancedEditorLayout;
