/**
 * ❌ DEPRECADO - BasicPropertiesPanel
 *
 * Este componente foi substituído pelo EnhancedUniversalPropertiesPanel
 * localizado em /src/components/universal/
 *
 * ⚠️ NÃO USE ESTE ARQUIVO - Será removido em versão futura
 * Use: /src/components/universal/EnhancedUniversalPropertiesPanel.tsx
 */

import { getInlineComponentProperties } from "../../../hooks/useUnifiedProperties";
import React, { useCallback } from "react";

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

// 🎯 Suporte otimizado para componentes inline
const getComponentProperties = useCallback((block: any) => {
  if (block.type?.includes("inline") || ["form-input"].includes(block.type)) {
    return getInlineComponentProperties(block.type, block.properties);
  }
  return block.properties || {};
}, []);

export const BasicPropertiesPanel: React.FC<EnhancedUniversalPropertiesPanelProps> = ({
  selectedBlock,
  onUpdateBlock,
  className = "",
}) => {
  if (!selectedBlock) {
    return (
      <div style={{ backgroundColor: '#FAF9F7' }}>
        <h3 className="text-lg font-semibold mb-4">Propriedades</h3>
        <p style={{ color: '#8B7355' }}>Selecione um bloco para editar suas propriedades</p>
      </div>
    );
  }

  const handlePropertyChange = (propertyKey: string, value: any) => {
    const updatedProperties = {
      ...selectedBlock.properties,
      [propertyKey]: value,
    };

    onUpdateBlock(selectedBlock.id, updatedProperties);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Propriedades: {selectedBlock.type}</h3>

      <div className="space-y-4">
        <div>
          <label style={{ color: '#6B4F43' }}>Conteúdo/Texto</label>
          <input
            type="text"
            value={selectedBlock.properties?.content || selectedBlock.properties?.text || ""}
            onChange={e => {
              const prop = selectedBlock.properties?.content !== undefined ? "content" : "text";
              handlePropertyChange(prop, e.target.value);
            }}
            style={{ borderColor: '#E5DDD5' }}
            placeholder="Digite o conteúdo..."
          />
        </div>

        <div>
          <label style={{ color: '#6B4F43' }}>Cor</label>
          <input
            type="color"
            value={selectedBlock.properties?.color || "#000000"}
            onChange={e => handlePropertyChange("color", e.target.value)}
            style={{ borderColor: '#E5DDD5' }}
          />
        </div>

        <div>
          <label style={{ color: '#6B4F43' }}>Alinhamento</label>
          <select
            value={
              selectedBlock.properties?.textAlign || selectedBlock.properties?.alignment || "left"
            }
            onChange={e => {
              const prop =
                selectedBlock.properties?.textAlign !== undefined ? "textAlign" : "alignment";
              handlePropertyChange(prop, e.target.value);
            }}
            style={{ borderColor: '#E5DDD5' }}
          >
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </div>
      </div>

      <div style={{ borderColor: '#E5DDD5' }}>
        <div style={{ color: '#8B7355' }}>
          <div>ID: {selectedBlock.id}</div>
          <div>Tipo: {selectedBlock.type}</div>
        </div>
      </div>
    </div>
  );
};

export default BasicPropertiesPanel;
