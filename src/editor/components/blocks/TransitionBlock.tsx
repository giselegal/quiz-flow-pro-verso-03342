/**
 * ⏳ TRANSITION BLOCK - Bloco de Transição/Loading
 * 
 * Bloco para telas de transição entre etapas
 */

import React from 'react';
import { BlockComponentProps } from '@/types/blockTypes';
import { Loader2 } from 'lucide-react';

interface TransitionBlockProps {
  text?: string;
  showLoader?: boolean;
  duration?: number; // segundos
  backgroundColor?: string;
  textColor?: string;
}

export const TransitionBlock: React.FC<BlockComponentProps> = ({
  data,
  isSelected,
  isEditable,
  onSelect,
}) => {
  const props = data.props as TransitionBlockProps;

  const handleClick = () => {
    if (isEditable && onSelect) {
      onSelect(data.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative p-8 rounded-lg transition-all
        flex flex-col items-center justify-center min-h-[200px]
        ${isEditable ? 'cursor-pointer hover:bg-accent/10' : ''}
        ${isSelected ? 'ring-2 ring-primary shadow-sm bg-accent/5' : ''}
      `}
      style={{
        backgroundColor: props.backgroundColor || 'transparent',
        color: props.textColor || '#432818',
      }}
    >
      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary rounded-full" />
      )}

      <div className="text-center space-y-4">
        {/* Loader animado */}
        {props.showLoader !== false && (
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
        )}

        {/* Texto da transição */}
        {props.text && (
          <p className="text-lg font-medium">
            {props.text}
          </p>
        )}

        {/* Duração (visível apenas no editor) */}
        {isEditable && props.duration && (
          <span className="text-xs text-muted-foreground">
            Duração: {props.duration}s
          </span>
        )}
      </div>
    </div>
  );
};

export default TransitionBlock;
