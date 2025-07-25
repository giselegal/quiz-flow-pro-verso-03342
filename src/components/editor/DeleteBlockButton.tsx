import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteBlockButtonProps {
  blockId: string;
  onDelete: (blockId: string) => void;
  className?: string;
}

export const DeleteBlockButton: React.FC<DeleteBlockButtonProps> = ({
  blockId,
  onDelete,
  className = ''
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🗑️ BOTÃO CLICADO - Bloco: ${blockId}`);
    console.log('📋 Função onDelete recebida:', typeof onDelete);
    
    // FORÇAR EXCLUSÃO - tentar múltiplas abordagens
    try {
      // Método 1: Usar a função passada
      if (typeof onDelete === 'function') {
        console.log('🚀 Executando onDelete...');
        onDelete(blockId);
      }
      
      // Método 2: Tentar encontrar e remover o elemento DOM diretamente
      setTimeout(() => {
        const element = document.querySelector(`[data-block-id="${blockId}"]`) as HTMLElement;
        if (element) {
          console.log('🧨 FORÇANDO remoção visual do elemento');
          element.style.display = 'none';
          element.remove();
        }
      }, 100);
      
      // Método 3: Disparar evento customizado
      window.dispatchEvent(new CustomEvent('forceDeleteBlock', { 
        detail: { blockId } 
      }));
      
      console.log(`✅ TODAS AS TENTATIVAS DE EXCLUSÃO EXECUTADAS PARA: ${blockId}`);
      
    } catch (error) {
      console.error('❌ ERRO na exclusão:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={`
        w-8 h-8 
        bg-red-500 hover:bg-red-600 
        text-white 
        rounded-md 
        flex items-center justify-center 
        shadow-sm hover:shadow-md 
        transition-all duration-200
        border-2 border-red-600
        ${className}
      `}
      title="Excluir Componente"
      aria-label="Excluir Componente"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
};
