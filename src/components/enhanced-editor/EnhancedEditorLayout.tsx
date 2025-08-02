
import React, { useState } from 'react';
import { BlockType, EditorBlock } from '@/types/editor';

interface EnhancedEditorLayoutProps {
  onBlockAdd?: (type: BlockType) => void;
  blocks?: EditorBlock[];
  selectedBlockId?: string;
  onBlockSelect?: (id: string) => void;
}

export const EnhancedEditorLayout: React.FC<EnhancedEditorLayoutProps> = ({
  onBlockAdd,
  blocks = [],
  selectedBlockId,
  onBlockSelect
}) => {
  const [activeTab, setActiveTab] = useState('editor');

  const handleAddBlock = (type: string) => {
    if (onBlockAdd) {
      onBlockAdd(type as BlockType);
    }
  };

  return (
    <div className="enhanced-editor-layout h-full flex">
      <div className="sidebar w-64 border-r bg-white">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Componentes</h2>
          <div className="space-y-2">
            <button
              onClick={() => handleAddBlock('text')}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Texto
            </button>
            <button
              onClick={() => handleAddBlock('image')}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Imagem
            </button>
            <button
              onClick={() => handleAddBlock('button')}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Botão
            </button>
          </div>
        </div>
      </div>
      
      <div className="main-area flex-1 flex flex-col">
        <div className="toolbar border-b p-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded ${
                activeTab === 'editor' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded ${
                activeTab === 'preview' ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        
        <div className="canvas flex-1 p-4">
          {blocks.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Nenhum bloco adicionado ainda</p>
              <p className="text-sm">Use o painel lateral para adicionar componentes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={`border rounded p-4 cursor-pointer ${
                    selectedBlockId === block.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onBlockSelect?.(block.id)}
                >
                  <div className="text-xs text-gray-500 mb-2">{block.type}</div>
                  {block.content.title && <h3>{block.content.title}</h3>}
                  {block.content.text && <p>{block.content.text}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedEditorLayout;
