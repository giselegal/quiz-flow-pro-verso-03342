/**
 * 🧪 TESTE - Modern Properties Panel
 * 
 * Página de teste para verificar o novo painel de propriedades
 * baseado em shadcn/ui + Radix UI
 */

import React from 'react';
import { ModernPropertiesPanel } from './src/components/editor/properties/ModernPropertiesPanel';

// Mock de bloco para teste
const mockBlock = {
  id: 'test-block-1',
  type: 'options-grid',
  properties: {
    columns: 2,
    direction: 'vertical',
    layout: 'image-text',
    borderRadius: 8,
    spacing: 4,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#e2e8f0',
    multiple: true,
    required: true,
    autoProceed: false
  },
  content: {
    'content.title': 'Teste de Quiz',
    'content.description': 'Esta é uma pergunta de teste',
    options: [
      { id: '1', text: 'Opção A', image: '', points: 1 },
      { id: '2', text: 'Opção B', image: '', points: 2 }
    ]
  }
};

export default function TestModernPropertiesPanel() {
  const [selectedBlock, setSelectedBlock] = React.useState<typeof mockBlock | null>(mockBlock);

  const handleUpdate = (updates: Record<string, any>) => {
    console.log('🔄 Update received:', updates);
    setSelectedBlock(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        ...updates
      };
    });
  };

  const handleDelete = () => {
    console.log('🗑️ Delete block');
    setSelectedBlock(null);
  };

  const handleDuplicate = () => {
    console.log('📋 Duplicate block');
  };

  const handleClose = () => {
    console.log('❌ Close panel');
    setSelectedBlock(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">🧪 Teste - Modern Properties Panel</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Bloco Selecionado</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(selectedBlock, null, 2)}
            </pre>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setSelectedBlock(mockBlock)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Selecionar Bloco
            </button>
            <button
              onClick={() => setSelectedBlock(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Desselecionar
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Propriedades */}
      <div className="w-96 bg-white border-l shadow-lg">
        <ModernPropertiesPanel
          selectedBlock={selectedBlock}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
