// Minimal stub to satisfy imports; real implementation can be added later.
import React from 'react';

export interface IntroPropertiesPanelProps {
  selectedBlock: any;
  onUpdate?: (blockId: string, updates: Record<string, any>) => void;
}

export const IntroPropertiesPanel: React.FC<IntroPropertiesPanelProps> = ({ selectedBlock }) => {
  if (!selectedBlock) return null;
  return (
    <div className="p-3 border rounded bg-white text-xs text-gray-600">
      <div className="font-medium text-gray-800 mb-2">Propriedades de Introdução (stub)</div>
      <div>Bloco: {selectedBlock?.id}</div>
      <div>Tipo: {selectedBlock?.type}</div>
    </div>
  );
};

export default IntroPropertiesPanel;
