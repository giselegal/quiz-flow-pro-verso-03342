/**
 * 🎯 TITLE BLOCK - Bloco de Título
 * 
 * Componente modular para renderizar títulos.
 * Consome 100% das propriedades do JSON.
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { cn } from '@/lib/utils';

export const TitleBlock: React.FC<BlockComponentProps> = ({
  data,
  isSelected,
  isEditable,
  onSelect,
}) => {
  const {
    text = 'Título',
    html,
    fontSize = '2xl',
    fontWeight = 'bold',
    textAlign = 'center',
    color = '#432818',
    marginBottom = '1rem',
    className: customClassName
  } = data.props;

  return (
    <div
      className={cn(
        'title-block relative p-4 transition-all duration-200',
        isEditable && 'cursor-pointer hover:bg-gray-50',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50/30',
        customClassName
      )}
      style={{ marginBottom }}
      onClick={isEditable ? onSelect : undefined}
      data-block-id={data.id}
    >
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded shadow-sm z-10">
          📝 Título
        </div>
      )}

      {/* Conteúdo */}
      <div
        className={cn(
          `text-${fontSize}`,
          `font-${fontWeight}`,
          `text-${textAlign}`
        )}
        style={{ color }}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
};

export default TitleBlock;
