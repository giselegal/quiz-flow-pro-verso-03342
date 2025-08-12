import { EnhancedUniversalPropertiesPanel } from '@/components/universal/EnhancedUniversalPropertiesPanel';
import React, { useState } from 'react';

const TestPropertiesPanel = () => {
  const [selectedBlock, setSelectedBlock] = useState<any>({
    id: 'test-block-1',
    type: 'text',
    properties: {
      content: 'Texto de teste',
      fontSize: 18,
      textColor: '#333333',
    },
  });

  const [isVisible, setIsVisible] = useState(false);

  const handleUpdate = (blockId: string, updates: Record<string, any>) => {
    console.log('🔄 Atualizando bloco:', { blockId, updates });
    setSelectedBlock((prev: any) => ({
      ...prev,
      properties: { ...prev.properties, ...updates },
    }));
  };

  const handleDelete = (blockId: string) => {
    console.log('🗑️ Deletando bloco:', blockId);
    setSelectedBlock(null);
  };

  return (
    <div style={{ backgroundColor: '#E5DDD5' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teste do Painel de Propriedades</h1>

        <div className="mb-6 space-x-4">
          <button onClick={() => setIsVisible(!isVisible)} style={{ backgroundColor: '#B89B7A' }}>
            {isVisible ? 'Esconder' : 'Mostrar'} Painel
          </button>

          <button
            onClick={() =>
              setSelectedBlock({
                id: 'test-text',
                type: 'text',
                properties: { content: 'Novo texto', fontSize: 20, textColor: '#000000' },
              })
            }
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Bloco Texto
          </button>

          <button
            onClick={() =>
              setSelectedBlock({
                id: 'test-heading',
                type: 'heading',
                properties: { content: 'Título teste', level: 'h1' },
              })
            }
            style={{ backgroundColor: '#FAF9F7' }}
          >
            Bloco Título
          </button>

          <button
            onClick={() =>
              setSelectedBlock({
                id: 'test-button',
                type: 'button',
                properties: { text: 'Clique aqui', variant: 'primary' },
              })
            }
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Bloco Botão
          </button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-3">Bloco Selecionado:</h2>
          <pre style={{ backgroundColor: '#E5DDD5' }}>{JSON.stringify(selectedBlock, null, 2)}</pre>
        </div>

        {isVisible && (
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Área de Visualização</h2>
                {selectedBlock && (
                  <div style={{ borderColor: '#E5DDD5' }}>
                    {selectedBlock.type === 'text' && (
                      <p
                        style={{
                          fontSize: `${selectedBlock.properties?.fontSize || 16}px`,
                          color: selectedBlock.properties?.textColor || '#000000',
                        }}
                      >
                        {selectedBlock.properties?.content || 'Texto padrão'}
                      </p>
                    )}
                    {selectedBlock.type === 'heading' &&
                      React.createElement(
                        selectedBlock.properties?.level || 'h2',
                        { style: { margin: 0 } },
                        selectedBlock.properties?.content || 'Título padrão'
                      )}
                    {selectedBlock.type === 'button' && (
                      <button
                        className={`px-4 py-2 rounded ${
                          selectedBlock.properties?.variant === 'primary'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                        style={{
                          backgroundColor: selectedBlock.properties?.backgroundColor,
                        }}
                      >
                        {selectedBlock.properties?.text || 'Botão'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-80">
              <EnhancedUniversalPropertiesPanel
                selectedBlock={selectedBlock}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onClose={() => setIsVisible(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPropertiesPanel;
