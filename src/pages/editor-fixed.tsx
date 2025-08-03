import React, { useState } from 'react';
import BrandHeader from '@/components/ui/BrandHeader';
import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import DynamicPropertiesPanel from '@/components/editor/DynamicPropertiesPanel';
import { EditableContent, Block } from '@/types/editor';
import { getDefaultContentForType } from '@/utils/blockDefaults';
import { getRegistryStats, generateBlockDefinitions } from '@/config/enhancedBlockRegistry';
import { Type } from 'lucide-react';

const EditorFixedPage: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);
  
  // Mostrar estatísticas do registry
  const registryStats = getRegistryStats();
  console.log('📊 Registry Stats:', registryStats);

  return (
    <div className="h-screen flex flex-col">
      <BrandHeader />
      
      {/* Barra de status do registry */}
      <div className="bg-green-50 border-b border-green-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-green-600 font-medium">
              ✅ Enhanced Registry Ativo
            </span>
            <span className="text-gray-600">
              {registryStats.active} componentes validados
            </span>
            <span className="text-gray-600">
              Cobertura: {registryStats.coverage}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Sistema de validação em runtime ativo
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <EnhancedComponentsSidebar 
          onAddComponent={(type: string) => {
            const defaultContent = getDefaultContentForType(type as any);
            const newBlock: Block = {
              id: `block-${Date.now()}`,
              type: type as any,
              content: defaultContent,
              properties: {},
              order: blocks.length
            };
            setBlocks(prev => [...prev, newBlock]);
          }}
        />

        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {blocks.map((block) => (
              <div
                key={block.id}
                className={`border rounded-lg p-4 cursor-pointer hover:border-blue-300 ${
                  selectedBlockId === block.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedBlockId(block.id)}
              >
                <UniversalBlockRenderer
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {selectedBlockId && selectedBlock && (
          <DynamicPropertiesPanel
            block={selectedBlock}
            blockDefinition={{
              type: selectedBlock.type,
              name: selectedBlock.type,
              description: `Componente ${selectedBlock.type}`,
              category: 'basic',
              icon: Type,
              component: React.Fragment,
              defaultProps: {},
              properties: {},
              label: selectedBlock.type
            }}
            onUpdateBlock={(blockId: string, properties: Partial<EditableContent>) => {
              setBlocks(prev => 
                prev.map(block => 
                  block.id === blockId 
                    ? { ...block, content: { ...block.content, ...properties } }
                    : block
                )
              );
            }}
            onClose={() => setSelectedBlockId(null)}
          />
        )}
      </div>
    </div>
  );
};

export default EditorFixedPage;
