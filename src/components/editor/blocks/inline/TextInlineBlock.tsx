import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * TextInlineBlock - Componente modular inline horizontal
 * Texto responsivo e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const TextInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // Verificação de segurança para evitar erro de undefined
  if (!block || !block.properties) {
    return (
      <div className="p-4 border-2 border-red-300 bg-red-50 rounded-lg">
        <p className="text-red-600">Erro: Bloco não encontrado ou propriedades indefinidas</p>
      </div>
    );
  }

  const {
    content = 'Texto editável com formatação elegante.',
    fontSize = 'medium',
    fontWeight = 'normal',
    textAlign = 'left',
    color = '#374151',
    backgroundColor = 'transparent',
    maxWidth = 'auto',
    useUsername = false,
    usernamePattern = '{userName}',
    userName = 'Usuário',
    isEditable = true
  } = block.properties;

  // Processar texto com username se habilitado
  const processedContent = useUsername && usernamePattern 
    ? content.replace(new RegExp(usernamePattern.replace(/[{}]/g, '\\$&'), 'g'), userName)
    : content;

  // Tamanhos de fonte responsivos
  const fontSizeClasses = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base md:text-lg',
    large: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    xlarge: 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl'
  };

  // Pesos de fonte
  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  // Alinhamentos
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  // Larguras máximas responsivas
  const maxWidthClasses = {
    auto: 'w-auto',
    sm: 'w-full sm:max-w-sm',
    md: 'w-full sm:max-w-md',
    lg: 'w-full sm:max-w-lg',
    xl: 'w-full sm:max-w-xl',
    '2xl': 'w-full sm:max-w-2xl',
    full: 'w-full'
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0 relative group',
        // Container responsivo e editável
        'p-2 sm:p-3 rounded-lg border border-transparent',
        'hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200',
        isSelected && 'border-blue-500 bg-blue-50/30',
        maxWidthClasses[maxWidth as keyof typeof maxWidthClasses] || maxWidthClasses.auto,
        // Estados do editor
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 rounded-md p-1',
        'cursor-pointer transition-all duration-200',
        className
      )}
      style={{ backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor }}
      onClick={onClick}
    >
      <p
        className={cn(
          // Tipografia responsiva
          fontSizeClasses[fontSize as keyof typeof fontSizeClasses],
          fontWeightClasses[fontWeight as keyof typeof fontWeightClasses],
          textAlignClasses[textAlign as keyof typeof textAlignClasses],
          // Layout
          'leading-relaxed',
          // Quebra de palavras para textos longos
          'break-words hyphens-auto'
        )}
        style={{ color }}
      >
        {processedContent}
      </p>
    </div>
  );
};

export default TextInlineBlock;
