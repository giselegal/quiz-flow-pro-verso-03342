// =====================================================================
// components/editor/blocks/BasicTextBlock.tsx - Componente de texto básico
// =====================================================================

import React from 'react';
import { cn } from '../../../lib/utils';
import { Type } from 'lucide-react';
import type { BlockComponentProps } from '../../../types/blocks';

/**
 * BasicTextBlock - Componente de texto simples SEM edição inline
 * Edição acontece exclusivamente no Painel de Propriedades
 */
const BasicTextBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  const text = block.properties?.content || 'Clique para selecionar e editar no painel de propriedades →';

  const handleClick = () => {
    if (onClick) {
      onClick();
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
        {isSelected && (
          <span className="text-xs text-blue-500 font-medium">
            ← Edite no painel de propriedades
          </span>
        )}
      </div>

      <p className="text-gray-800 whitespace-pre-wrap">
        {text}
      </p>

      {isSelected && (
        <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
          💡 Use o painel de propriedades à direita para editar este componente
        </div>
      )}
    </div>
  );
};

export default BasicTextBlock;
