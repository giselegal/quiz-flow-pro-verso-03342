
import React, { useState } from 'react';
import { EditorBlock } from '@/types/editor';
import { SimpleComponent } from '@/types/quiz';
import { PropertiesPanel } from './properties/PropertiesPanel';

interface EnhancedEditorProps {
  blocks: EditorBlock[];
  onUpdateBlock: (id: string, updates: Partial<EditorBlock>) => void;
  onDeleteBlock: (id: string) => void;
}

export const EnhancedEditor: React.FC<EnhancedEditorProps> = ({
  blocks,
  onUpdateBlock,
  onDeleteBlock
}) => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  // Convert EditorBlock to SimpleComponent for the PropertiesPanel
  const convertToSimpleComponent = (block: EditorBlock): SimpleComponent => {
    const data = { ...block.content };
    
    // Convert string dimensions to numbers for SimpleComponent
    if (typeof data.height === 'string') {
      const numHeight = parseFloat(data.height);
      data.height = isNaN(numHeight) ? undefined : numHeight;
    }
    
    if (typeof data.width === 'string') {
      const numWidth = parseFloat(data.width);
      data.width = isNaN(numWidth) ? undefined : numWidth;
    }

    return {
      id: block.id,
      type: block.type as SimpleComponent['type'],
      data: data as SimpleComponent['data'],
      style: {}
    };
  };

  const handleUpdateComponent = (componentId: string, newData: Partial<SimpleComponent>) => {
    const content = { ...newData.data };
    
    // Convert number dimensions back to strings for EditorBlock
    if (typeof content.height === 'number') {
      content.height = content.height.toString();
    }
    
    if (typeof content.width === 'number') {
      content.width = content.width.toString();
    }

    const editorUpdates: Partial<EditorBlock> = {
      content: content,
      type: newData.type as EditorBlock['type']
    };
    onUpdateBlock(componentId, editorUpdates);
  };

  const handleDeleteComponent = (componentId: string) => {
    onDeleteBlock(componentId);
  };

  return (
    <div className="flex h-full">
      {/* Main editor area */}
      <div className="flex-1 p-4">
        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedBlockId === block.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedBlockId(block.id)}
            >
              <div className="text-sm font-medium text-gray-600 mb-2">
                {block.type}
              </div>
              <div className="text-gray-800">
                {block.content?.title || block.content?.text || 'No content'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Properties panel */}
      <div className="w-80 border-l border-gray-200 bg-white">
        {selectedBlock ? (
          <PropertiesPanel
            selectedComponent={convertToSimpleComponent(selectedBlock)}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Select a block to edit its properties
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedEditor;
