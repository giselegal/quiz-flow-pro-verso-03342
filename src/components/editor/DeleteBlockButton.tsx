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
    
    if (typeof onDelete === 'function') {
      onDelete(blockId);
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
      <Trash2 className="w-3 h-3" />
    </button>
  );
};
