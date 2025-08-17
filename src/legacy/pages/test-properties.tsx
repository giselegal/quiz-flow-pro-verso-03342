import UniversalPropertiesPanel from '@/components/universal';
import { UnifiedBlock } from '@/hooks/useUnifiedProperties';
import { useState } from 'react';

const TestPropertiesPanel = () => {
  const [selectedBlock, setSelectedBlock] = useState<UnifiedBlock | null>({
    id: 'test-block-1',
    type: 'text-inline',
    properties: {
      content: 'Este é um texto de teste',
      fontSize: 18,
      textColor: '#333333',
    },
  });

  const handleUpdate = (blockId: string, updates: Record<string, any>) => {
    console.log('🔄 Atualizando bloco:', blockId, updates);
    setSelectedBlock(prev => {
      if (!prev) return null;
      return {
        ...prev,
        properties: { ...prev.properties, ...updates },
      };
    });
  };

  const handleDelete = (blockId: string) => {
    console.log('🗑️ Deletando bloco:', blockId);
    setSelectedBlock(null);
  };

  return (
    <div style={{ backgroundColor: '#FAF9F7' }}>
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Teste do Painel de Propriedades</h1>

        <div className="mb-6 space-y-4">
          <button
            onClick={() =>
              setSelectedBlock({
                id: 'test-text',
                type: 'text-inline',
                properties: { content: 'Texto teste', fontSize: 16, textColor: '#000000' },
              })
            }
            style={{ backgroundColor: '#FAF9F7' }}
          >
            Selecionar Texto
          </button>

          <button
            onClick={() =>
              setSelectedBlock({
                id: 'test-heading',
                type: 'heading-inline',
                properties: { content: 'Título teste', level: 'h2', textAlign: 'left' },
              })
            }
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Selecionar Título
          </button>

          <button
            onClick={() =>
              setSelectedBlock({
                id: 'test-button',
                type: 'button-inline',
                properties: { text: 'Botão teste', variant: 'primary', backgroundColor: '#007bff' },
              })
            }
            style={{ backgroundColor: '#FAF9F7' }}
          >
            Selecionar Botão
          </button>

          <button onClick={() => setSelectedBlock(null)} style={{ backgroundColor: '#FAF9F7' }}>
            Limpar Seleção
          </button>
        </div>

        {selectedBlock && (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-bold">Bloco Selecionado:</h3>
            <p>
              <strong>ID:</strong> {selectedBlock.id}
            </p>
            <p>
              <strong>Tipo:</strong> {selectedBlock.type}
            </p>
            <p>
              <strong>Propriedades:</strong>
            </p>
            <pre style={{ backgroundColor: '#E5DDD5' }}>
              {JSON.stringify(selectedBlock.properties, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="w-80 border-l">
        <UniversalPropertiesPanel
          selectedBlock={selectedBlock}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onClose={() => setSelectedBlock(null)}
        />
      </div>
    </div>
  );
};

export default TestPropertiesPanel;
