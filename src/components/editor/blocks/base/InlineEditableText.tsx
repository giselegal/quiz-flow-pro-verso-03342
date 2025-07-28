import React from 'react';
import { cn } from '@/lib/utils';

interface InlineEditableTextProps {
  value: string;
  onChange: (value: string) => void;
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
 * Componente de texto editável inline otimizado para componentes horizontais
 * Suporte a diferentes tamanhos, pesos e alinhamentos
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const baseClasses = cn(
    'w-full bg-transparent outline-none resize-none',
    'placeholder-gray-400 text-gray-700',
    'transition-all duration-200',
    'focus:placeholder-gray-300',
    
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
    disabled && 'opacity-50 cursor-not-allowed',
    
    className
  );

  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={baseClasses}
        rows={maxLines}
        style={{
          minHeight: '1.5rem',
          maxHeight: `${maxLines * 1.5}rem`
        }}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      className={baseClasses}
    />
  );
};

export default InlineEditableText;
