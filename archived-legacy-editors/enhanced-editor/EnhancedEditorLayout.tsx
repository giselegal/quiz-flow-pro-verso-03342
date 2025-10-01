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
  onBlockSelect,
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
            <button onClick={() => handleAddBlock('text')} style={{ backgroundColor: '#E5DDD5' }}>
              Texto
            </button>
            <button onClick={() => handleAddBlock('image')} style={{ backgroundColor: '#E5DDD5' }}>
              Imagem
            </button>
            <button onClick={() => handleAddBlock('button')} style={{ backgroundColor: '#E5DDD5' }}>
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
                activeTab === 'editor' ? 'bg-[#B89B7A] text-white' : 'bg-gray-100'
              }`}
            >
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded ${
                activeTab === 'preview' ? 'bg-[#B89B7A] text-white' : 'bg-gray-100'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        <div className="canvas flex-1 p-4">
          {blocks.length === 0 ? (
            <div style={{ color: '#8B7355' }}>
              <p>Nenhum bloco adicionado ainda</p>
              <p className="text-sm">Use o painel lateral para adicionar componentes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map(block => (
                <div
                  key={block.id}
                  className={`border rounded p-4 cursor-pointer ${
                    selectedBlockId === block.id
                      ? 'border-[#B89B7A] bg-[#B89B7A]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onBlockSelect?.(block.id)}
                >
                  <div style={{ color: '#8B7355' }}>{block.type}</div>
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
