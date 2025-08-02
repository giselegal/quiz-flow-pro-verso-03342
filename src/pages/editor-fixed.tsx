import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrandHeader } from '@/components/ui/BrandHeader';
import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import DynamicPropertiesPanel from '@/components/editor/DynamicPropertiesPanel';
import { EditableContent } from '@/types/editor';
import { getDefaultContentForType } from '@/utils/blockDefaults';

interface Block {
  id: string;
  type: string;
  properties: Record<string, any>;
}

const EditorFixedPage: React.FC = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  return (
    <div className="h-screen flex flex-col">
      <BrandHeader 
        showBackButton={true}
        onBackClick={() => navigate('/')}
      />
      
      <div className="flex-1 flex">
        <EnhancedComponentsSidebar 
          onAddComponent={(type: string) => {
            const newBlock = {
              id: `block-${Date.now()}`,
              type,
              properties: getDefaultContentForType(type)
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

        {selectedBlockId && (
          <DynamicPropertiesPanel
            block={selectedBlock!}
            blockDefinition={{
              type: selectedBlock!.type,
              name: selectedBlock!.type,
              description: `Componente ${selectedBlock!.type}`,
              category: 'basic',
              icon: null,
              defaultProps: {},
              properties: {},
              label: selectedBlock!.type
            }}
            onUpdateBlock={(blockId: string, properties: Partial<EditableContent>) => {
              setBlocks(prev => 
                prev.map(block => 
                  block.id === blockId 
                    ? { ...block, properties: { ...block.properties, ...properties } }
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
