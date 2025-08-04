import React from "react";

interface SimplePropertiesPanelProps {
  selectedBlock: { id: string; type: string; properties: any } | null;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
  onDelete?: (blockId: string) => void;
  onClose?: () => void;
}

const SimplePropertiesPanel: React.FC<SimplePropertiesPanelProps> = ({
  selectedBlock,
  onUpdate,
  onDelete,
  onClose,
}) => {
  if (!selectedBlock) {
    return (
      <div className="w-80 h-full bg-gray-50 border-l border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <h3 className="font-medium mb-2">Painel de Propriedades</h3>
          <p className="text-sm">Selecione um componente para editar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-l border-[#B89B7A]/30 flex flex-col">
      {/* Header */}
      <div className="bg-[#B89B7A]/10 border-b border-[#B89B7A]/30 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#432818]">Propriedades</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg font-bold"
          >
            ×
          </button>
        </div>
        <div className="mt-2">
          <span className="text-xs bg-[#B89B7A] text-white px-2 py-1 rounded">
            {selectedBlock.type}
          </span>
          <span className="text-xs text-gray-500 ml-2">#{selectedBlock.id}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        <div>
          <h4 className="font-medium text-[#432818] mb-2">🎯 TESTE FUNCIONANDO!</h4>
          <p className="text-sm text-gray-600 mb-3">
            ✅ Painel apareceu corretamente
          </p>
        </div>

        {/* Properties Display */}
        <div>
          <h4 className="font-medium text-[#432818] mb-2">Propriedades:</h4>
          <div className="bg-gray-50 p-3 rounded text-xs">
            <pre>{JSON.stringify(selectedBlock.properties, null, 2)}</pre>
          </div>
        </div>

        {/* Test Inputs */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#432818] mb-1">
              Teste - Texto:
            </label>
            <input
              type="text"
              className="w-full border border-[#B89B7A]/30 rounded px-3 py-2 text-sm"
              placeholder="Digite algo..."
              onChange={(e) => {
                if (onUpdate) {
                  onUpdate(selectedBlock.id, { testText: e.target.value });
                }
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#432818] mb-1">
              Teste - Cor:
            </label>
            <input
              type="color"
              className="w-full h-10 border border-[#B89B7A]/30 rounded"
              onChange={(e) => {
                if (onUpdate) {
                  onUpdate(selectedBlock.id, { testColor: e.target.value });
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#B89B7A]/30 p-4">
        <button
          onClick={() => onDelete && onDelete(selectedBlock.id)}
          className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-sm font-medium"
        >
          🗑️ Deletar Componente
        </button>
      </div>
    </div>
  );
};

export default SimplePropertiesPanel;
