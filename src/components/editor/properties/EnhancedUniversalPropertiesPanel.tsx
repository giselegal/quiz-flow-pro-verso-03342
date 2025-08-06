import React from 'react';

interface Block {
  id: string;
  type: string;
  properties?: any;
}

interface EnhancedUniversalPropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (blockId: string, properties: any) => void;
  className?: string;
}

export const EnhancedUniversalPropertiesPanel: React.FC<EnhancedUniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  className = ''
}) => {
  if (!selectedBlock) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Propriedades</h3>
        <p className="text-gray-500">Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }
  
  const handlePropertyChange = (propertyKey: string, value: any) => {
    const updatedProperties = {
      ...selectedBlock.properties,
      [propertyKey]: value
    };
    
    onUpdateBlock(selectedBlock.id, updatedProperties);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Propriedades: {selectedBlock.type}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conteúdo/Texto
          </label>
          <input
            type="text"
            value={selectedBlock.properties?.content || selectedBlock.properties?.text || ''}
            onChange={(e) => {
              const prop = selectedBlock.properties?.content !== undefined ? 'content' : 'text';
              handlePropertyChange(prop, e.target.value);
            }}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Digite o conteúdo..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor
          </label>
          <input
            type="color"
            value={selectedBlock.properties?.color || '#000000'}
            onChange={(e) => handlePropertyChange('color', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alinhamento
          </label>
          <select
            value={selectedBlock.properties?.textAlign || selectedBlock.properties?.alignment || 'left'}
            onChange={(e) => {
              const prop = selectedBlock.properties?.textAlign !== undefined ? 'textAlign' : 'alignment';
              handlePropertyChange(prop, e.target.value);
            }}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <div>ID: {selectedBlock.id}</div>
          <div>Tipo: {selectedBlock.type}</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedUniversalPropertiesPanel;