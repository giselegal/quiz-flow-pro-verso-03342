import React, { useState } from 'react';
import { UniversalBlockRenderer } from './blocks/UniversalBlockRenderer';
import type { BlockData } from '../../types/blocks';

const TestEditor: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      id: '1',
      type: 'heading',
      properties: {
        text: 'Título de Exemplo',
        level: 2,
        textAlign: 'center',
        textColor: '#2563eb',
        fontSize: '2xl'
      }
    },
    {
      id: '2',
      type: 'text',
      properties: {
        text: 'Este é um parágrafo de exemplo para demonstrar o editor.',
        fontSize: 'base',
        textAlign: 'left',
        textColor: '#374151'
      }
    },
    {
      id: '3',
      type: 'button',
      properties: {
        text: 'Clique Aqui',
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        size: 'lg'
      }
    },
    {
      id: '4',
      type: 'cta',
      properties: {
        title: 'Oferta Especial',
        description: 'Aproveite agora esta oportunidade única!',
        buttonText: 'Quero Aproveitar',
        backgroundColor: '#dc2626',
        textColor: '#ffffff'
      }
    }
  ]);

  const handleBlockClick = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  const handleSaveInline = (blockId: string, updates: Partial<BlockData>) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId 
        ? { ...block, ...updates }
        : block
    ));
  };

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Teste do Universal Block Renderer
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Canvas */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Canvas do Editor
            </h2>
            
            <div className="space-y-4">
              {blocks.map((block) => (
                <UniversalBlockRenderer
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onClick={() => handleBlockClick(block.id)}
                  onSaveInline={handleSaveInline}
                  className="w-full"
                />
              ))}
            </div>
          </div>

          {/* Properties Panel */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              Painel de Propriedades
            </h2>
            
            {selectedBlock ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tipo do Bloco
                  </label>
                  <div className="bg-gray-100 p-2 rounded text-sm">
                    {selectedBlock.type}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    ID do Bloco
                  </label>
                  <div className="bg-gray-100 p-2 rounded text-sm font-mono">
                    {selectedBlock.id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Propriedades
                  </label>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(selectedBlock.properties, null, 2)}
                  </pre>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    ✨ As alterações são salvas automaticamente através do sistema onPropertyChange
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <div className="text-4xl mb-4">👆</div>
                <p>Clique em um bloco no canvas para ver suas propriedades</p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🧪 Como testar
          </h3>
          <ul className="text-blue-700 space-y-2">
            <li>• Clique em qualquer bloco para selecioná-lo</li>
            <li>• Veja as propriedades no painel à direita</li>
            <li>• O sistema UniversalBlockRenderer mapeia automaticamente os componentes</li>
            <li>• As alterações são propagadas através do onPropertyChange</li>
            <li>• Diferentes tipos de bloco são renderizados com componentes específicos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestEditor;
