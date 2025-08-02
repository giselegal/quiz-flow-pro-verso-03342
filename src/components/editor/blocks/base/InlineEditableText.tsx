
import React from 'react';
import { cn } from '@/lib/utils';

interface InlineEditableTextProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  maxLines?: number;
  fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  disabled?: boolean;
}

/**
 * Componente de texto somente visualização (edição desativada)
 * A edição agora é feita exclusivamente pelo painel de propriedades
 */
const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  value,
  onChange,
  placeholder = 'Digite aqui...',
  className = '',
  multiline = false,
  maxLines = 3,
  fontSize = 'base',
  fontWeight = 'normal',
  textAlign = 'left',
  disabled = false
}) => {
  const baseClasses = cn(
    'w-full cursor-default select-none',
    'text-gray-700',
    
    // Font size classes
    {
      'text-xs': fontSize === 'xs',
      'text-sm': fontSize === 'sm',
      'text-base': fontSize === 'base',
      'text-lg': fontSize === 'lg',
      'text-xl': fontSize === 'xl',
      'text-2xl': fontSize === '2xl',
      'text-3xl': fontSize === '3xl',
    },
    
    // Font weight classes
    {
      'font-normal': fontWeight === 'normal',
      'font-medium': fontWeight === 'medium',
      'font-semibold': fontWeight === 'semibold',
      'font-bold': fontWeight === 'bold',
    },
    
    // Text alignment classes
    {
      'text-left': textAlign === 'left',
      'text-center': textAlign === 'center',
      'text-right': textAlign === 'right',
    },
    
    // Disabled state
    disabled && 'opacity-50',
    
    className
  );

  // Sempre renderiza como texto estático (sem edição inline)
  return (
    <div className={baseClasses}>
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  );
};

export default InlineEditableText;
