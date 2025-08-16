import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useEditor } from '@/context/EditorContext';
import { BlockType } from '@/types/editor';
import { Funnels as useFunnels } from '@/hooks/useFunnels';

const EditorFixedPageWithDragDrop: React.FC = () => {
  const {
    state,
    addBlock,
    updateBlock,
    deleteBlock,
    setSelectedBlockId,
    selectedBlockId,
    computed: { currentBlocks, selectedBlock },
    uiState: { isPreviewing },
    persistenceActions: { save }
  } = useEditor();

  const { stages, currentStage, navigateToStage } = useFunnels();

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleComponentSelect = async (type: BlockType) => {
    try {
      const blockId = await addBlock(type);
      setSelectedBlockId(blockId);
      console.log(`Component ${type} added with ID: ${blockId}`);
    } catch (error) {
      console.error('Error adding component:', error);
    }
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const handleTogglePreview = () => {
    console.log('Toggle preview not implemented');
  };

  const handleComponentDrop = async (type: BlockType, position?: number, stageId?: string) => {
    try {
      await addBlock(type);
    } catch (error) {
      console.error('Error dropping component:', error);
    }
  };

  const handleUpdateBlock = async (id: string, content: any) => {
    try {
      await updateBlock(id, content);
      setSuccessMessage('Block updated successfully!');
      setError(null);
    } catch (err: any) {
      setError(`Failed to update block: ${err.message}`);
      setSuccessMessage(null);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    try {
      await deleteBlock(id);
      setSuccessMessage('Block deleted successfully!');
      setError(null);
    } catch (err: any) {
      setError(`Failed to delete block: ${err.message}`);
      setSuccessMessage(null);
    }
  };

  const handleSave = async () => {
    try {
      const result = await save();
      console.log('Saved successfully');
      // Show success notification
    } catch (error) {
      console.error('Save failed:', error);
      // Show error notification
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DndProvider backend={HTML5Backend}>
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Editor de Funil (Drag & Drop)
            </h1>

            <div className="space-x-3">
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Salvar
              </button>
              <button
                onClick={handleTogglePreview}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isPreviewing ? 'Esconder Preview' : 'Mostrar Preview'}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-4 sm:px-0">
            <div className="flex flex-col md:flex-row">
              {/* Sidebar */}
              <aside className="w-full md:w-1/4 bg-gray-200 p-4">
                <h2 className="text-lg font-semibold mb-2">Componentes</h2>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleComponentSelect('text-inline')}
                      className="block w-full text-left py-2 px-4 bg-white hover:bg-gray-100 rounded"
                    >
                      Texto
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleComponentSelect('image-display-inline')}
                      className="block w-full text-left py-2 px-4 bg-white hover:bg-gray-100 rounded"
                    >
                      Imagem
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleComponentSelect('button-inline')}
                      className="block w-full text-left py-2 px-4 bg-white hover:bg-gray-100 rounded"
                    >
                      Botão
                    </button>
                  </li>
                </ul>
              </aside>

              {/* Editor Canvas */}
              <div className="w-full md:w-3/4 p-4">
                <h2 className="text-lg font-semibold mb-2">Canvas</h2>
                <div className="bg-white p-4 rounded">
                  {currentBlocks.map((block) => (
                    <div
                      key={block.id}
                      className={`border-2 border-dashed p-4 mb-2 cursor-move ${
                        selectedBlockId === block.id ? 'border-blue-500' : 'border-gray-300'
                      }`}
                      onClick={() => handleBlockSelect(block.id)}
                    >
                      {block.type} - {block.id}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </DndProvider>
    </div>
  );
};

export default EditorFixedPageWithDragDrop;
