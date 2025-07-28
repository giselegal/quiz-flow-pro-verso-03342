import React, { useState } from 'react';
import { SchemaDrivenComponentsSidebar } from './sidebar/SchemaDrivenComponentsSidebar';
import { UniversalBlockRenderer, BlockData } from './blocks';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { useSimpleEditor } from '@/hooks/useSimpleEditor';
import { blockDefinitions } from '@/config/blockDefinitions';
import { Plus } from 'lucide-react';

const SimpleEditorTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState('blocks');
  
  const {
    funnel,
    currentPage,
    selectedBlockId,
    addBlock,
    updateBlock,
    deleteBlock,
    setSelectedBlock
  } = useSimpleEditor();

  // Handler para adicionar novo bloco
  const handleComponentSelect = (blockType: string) => {
    console.log('🔧 SIMPLE TEST: handleComponentSelect called with blockType:', blockType);
    
    const definition = blockDefinitions.find(def => def.type === blockType);
    console.log('🔧 SIMPLE TEST: definition found:', definition);
    
    if (!definition) {
      console.error('❌ Definition not found for blockType:', blockType);
      return;
    }

    // Gerar propriedades padrão baseadas no schema
    const defaultProperties: Record<string, any> = {};
    definition.propertiesSchema?.forEach(prop => {
      if (prop.defaultValue !== undefined) {
        defaultProperties[prop.key] = prop.defaultValue;
      }
    });

    console.log('🔧 SIMPLE TEST: defaultProperties:', defaultProperties);

    addBlock({
      type: blockType,
      properties: defaultProperties
    });
    
    console.log('✅ SIMPLE TEST: addBlock called successfully');
  };

  // Handler para mudanças nas propriedades dos blocos
  const handleBlockPropertyChange = (key: string, value: any) => {
    if (!selectedBlockId) return;

    const selectedBlock = currentPage?.blocks.find(b => b.id === selectedBlockId);
    const currentProperties = selectedBlock?.properties || {};
    updateBlock(selectedBlockId, {
      properties: { ...currentProperties, [key]: value }
    });
  };

  // Handler para edição inline
  const handleInlineEdit = (key: string) => (newValue: string) => {
    handleBlockPropertyChange(key, newValue);
  };

  return (
    <div className="h-screen bg-gray-100">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full border-r border-gray-200 bg-white">
            <SchemaDrivenComponentsSidebar 
              onComponentSelect={handleComponentSelect}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Main Canvas */}
        <ResizablePanel defaultSize={60} minSize={40}>
          <div className="h-full overflow-auto bg-gray-50">
            <div className="p-8">
              <div className="mx-auto bg-white min-h-[800px] shadow-lg rounded-lg max-w-4xl">
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-6">Editor de Teste</h1>
                  
                  {/* Canvas Content */}
                  {currentPage ? (
                    <div className="space-y-4">
                      {currentPage.blocks.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Plus className="w-8 h-8" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Página vazia</h3>
                          <p className="text-sm mb-4">
                            Adicione blocos da biblioteca à esquerda para começar.
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setActiveTab('blocks')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar Primeiro Bloco
                          </Button>
                        </div>
                      ) : (
                        currentPage.blocks.map((block) => (
                          <div key={block.id} className="group relative">
                            <UniversalBlockRenderer
                              block={block}
                              isSelected={block.id === selectedBlockId}
                              onClick={() => setSelectedBlock(block.id)}
                              onSaveInline={handleInlineEdit}
                            />
                            
                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteBlock(block.id);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16 text-gray-500">
                      <p>Nenhuma página carregada</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default SimpleEditorTest;
