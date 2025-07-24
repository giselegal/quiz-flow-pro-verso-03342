import React from 'react';
import { Trash2 } from 'lucide-react';

// Componente de teste simples para verificar se a exclusão funciona
export const TestDeleteComponent: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  const handleClick = () => {
    console.log('🗑️ Botão de exclusão clicado!');
    onDelete();
  };

  return (
    <div className="relative w-full p-4 border border-gray-300 rounded-lg mb-4 bg-white">
      <div className="text-lg font-semibold mb-2">
        🧪 Componente de Teste de Exclusão
      </div>
      <div className="text-sm text-gray-600 mb-4">
        Este é um componente especial apenas para testar a exclusão.
      </div>
      
      {/* Botão de exclusão sempre visível */}
      <button
        onClick={handleClick}
        className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        type="button"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir Este Componente
      </button>
      
      <div className="mt-2 text-xs text-gray-500">
        Se este botão não funcionar, há um problema na função onDelete
      </div>
    </div>
  );
};
