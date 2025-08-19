/**
 * 📝 QUIZ PROPERTIES PANEL MODULAR - STUB
 *
 * Componente temporário para resolver dependências de import
 */

import React from 'react';

export interface QuizPropertiesPanelModularProps {
  blockId?: string;
  selectedBlock?: any;
  onClose?: () => void;
  onUpdate?: (blockId: string, updates: any) => void;
}

export const QuizPropertiesPanelModular: React.FC<QuizPropertiesPanelModularProps> = ({
  blockId,
  selectedBlock,
  onClose,
  onUpdate,
}) => {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-medium text-gray-800 mb-2">
        Propriedades do Quiz
        {onClose && (
          <button 
            onClick={onClose}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </h3>
      <p className="text-sm text-gray-600">Painel de propriedades em desenvolvimento...</p>
      
      {blockId && (
        <div className="mt-2 text-xs text-gray-500">
          Block ID: {blockId}
        </div>
      )}
      
      {selectedBlock && (
        <div className="mt-2 text-xs text-gray-500">
          Bloco selecionado: {selectedBlock?.type || 'Nenhum'}
        </div>
      )}
      
      {onUpdate && (
        <div className="mt-2 text-xs text-gray-400">
          Função de update disponível
        </div>
      )}
    </div>
  );
};

export default QuizPropertiesPanelModular;
