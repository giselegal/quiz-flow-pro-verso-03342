
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ComponentsSidebar } from '../sidebar/ComponentsSidebar';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import EditPreview from '../preview/EditPreview';
import { useEditorState } from '../hooks/useEditorState';
import { EditorProvider } from '@/contexts/EditorContext';

interface EditorWorkspaceProps {
  className?: string;
}

const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'result' | 'sales'>('result');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  
  const { blocks, addBlock, updateBlock, deleteBlock, reorderBlocks } = useEditorState();

  const handleComponentSelect = (type: string) => {
    const newBlockId = addBlock(type);
    setSelectedBlockId(newBlockId);
  };

  const handleBlockUpdate = (id: string, updates: any) => {
    updateBlock(id, updates);
  };

  const handleBlockDelete = (id: string) => {
    deleteBlock(id);
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  const handleReorderBlocks = (sourceIndex: number, destinationIndex: number) => {
    reorderBlocks(sourceIndex, destinationIndex);
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
                <EditPreview
                  blocks={blocks}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  isPreviewing={isPreviewing}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={25}>
                <PropertiesPanel
                  selectedBlock={selectedBlockId ? blocks.find(b => b.id === selectedBlockId) || null : null}
                  onClose={() => setSelectedBlockId(null)}
                  onUpdate={handleBlockUpdate}
                  onDelete={handleBlockDelete}
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

export default EditorWorkspace;
