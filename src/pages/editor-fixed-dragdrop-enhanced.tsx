
import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { useEditor } from '@/context/EditorContext';
import { BlockType } from '@/types/editor';

const EditorPage: React.FC = () => {
  const {
    computed: { currentBlocks },
    selectedBlockId,
    blockActions: { setSelectedBlockId, addBlock },
    uiState: { isPreviewing, setIsPreviewing },
    persistenceActions: { save },
  } = useEditor();

  const handleSave = async () => {
    try {
      await save();
      console.log('✅ Funnel saved successfully');
    } catch (error) {
      console.error('❌ Error saving funnel:', error);
    }
  };

  const handleAddBlock = async (type: string) => {
    try {
      const blockId = await addBlock(type as BlockType);
      setSelectedBlockId(blockId);
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50">
      <div className="h-16 border-b bg-white flex items-center justify-between px-4">
        <h1 className="text-xl font-semibold">Quiz Editor</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsPreviewing(!isPreviewing)}>
            {isPreviewing ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-[calc(100%-4rem)]">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full p-4">
            <h3 className="font-medium mb-4">Components</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddBlock('text')}
              >
                Add Text Block
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAddBlock('heading')}
              >
                Add Heading Block
              </Button>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60}>
          <div className="h-full p-4">
            <div className="bg-white rounded-lg border min-h-96 p-6">
              {currentBlocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No blocks yet. Add your first block!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentBlocks.map(block => (
                    <div
                      key={block.id}
                      className={`p-4 border rounded cursor-pointer ${
                        selectedBlockId === block.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <div className="font-medium">{block.type}</div>
                      <div className="text-sm text-gray-500">ID: {block.id}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full p-4">
            <h3 className="font-medium mb-4">Properties</h3>
            {selectedBlockId ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Selected: {selectedBlockId}
                </p>
                {/* Properties panel would go here */}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Select a block to edit properties
              </p>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default EditorPage;
