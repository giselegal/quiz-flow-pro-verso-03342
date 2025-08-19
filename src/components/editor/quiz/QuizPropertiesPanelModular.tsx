/**
 * 📝 QUIZ PROPERTIES PANEL MODULAR - STUB
 *
 * Componente temporário para resolver dependências de import
 */

import React from 'react';

export interface QuizPropertiesPanelModularProps {
  selectedBlock?: any;
  onBlockUpdate?: (blockId: string, updates: any) => void;
}

export const QuizPropertiesPanelModular: React.FC<QuizPropertiesPanelModularProps> = ({
  selectedBlock,
  // onBlockUpdate, - removido pois não é usado no stub
}) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium text-gray-800 mb-2">Propriedades do Quiz</h3>
      <p className="text-sm text-gray-600">Painel de propriedades em desenvolvimento...</p>
      {selectedBlock && (
        <div className="mt-2 text-xs text-gray-500">
          Bloco selecionado: {selectedBlock?.type || 'Nenhum'}
        </div>
      )}
    </div>
  );
};

export default QuizPropertiesPanelModular;
