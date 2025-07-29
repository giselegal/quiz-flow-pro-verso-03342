// =====================================================================
// components/editor/blocks/BasicTextBlock.tsx - Componente de texto básico
// =====================================================================

import React, { useState } from 'react';
import { cn } from '../../../lib/utils';
import { Type, Edit3 } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';

/**
 * BasicTextBlock - Componente de texto simples e funcional
 * Usado como fallback quando TextInlineBlock não está disponível
 */
const BasicTextBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(block.properties?.content || 'Clique para editar o texto...');

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onPropertyChange) {
      onPropertyChange('content', text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setText(block.properties?.content || 'Clique para editar o texto...');
    }
  };

  return (
    <div
      className={cn(
        // Layout base
        'w-full p-3 rounded-lg border transition-all duration-200',
        // Estados visuais
        'border-gray-200 bg-white hover:bg-gray-50',
        isSelected && 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
        // Cursor
        'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-2 mb-2">
        <Type className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-medium text-gray-600">Texto</span>
        {isSelected && <Edit3 className="w-3 h-3 text-blue-500" />}
      </div>

      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full p-2 border border-gray-300 rounded resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none"
          rows={3}
          placeholder="Digite seu texto aqui..."
        />
      ) : (
        <p className="text-gray-800 whitespace-pre-wrap">
          {text}
        </p>
      )}

      {isSelected && (
        <div className="mt-2 text-xs text-gray-500">
          Clique para editar • Enter para salvar • Esc para cancelar
        </div>
      )}
    </div>
  );
};

export default BasicTextBlock;
