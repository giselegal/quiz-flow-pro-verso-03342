import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  disabled?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  className = '',
  multiline = false,
  disabled = false,
  isSelected = false,
  onClick
}) => {
  return (
    <span
      className={cn(
        'cursor-pointer hover:bg-yellow-50 hover:outline hover:outline-1 hover:outline-yellow-300 rounded px-1 transition-all duration-200',
        !value && 'text-gray-400 italic',
        isSelected && 'bg-yellow-50 outline outline-1 outline-yellow-500',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onClick={!disabled ? onClick : undefined}
      title="Clique para selecionar e editar no painel de propriedades"
    >
      {value || placeholder}
    </span>
  );
};