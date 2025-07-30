import React, { useMemo } from 'react';
import { cn } from '../../../../lib/utils';
import type { BlockComponentProps } from '../../../../types/blocks';

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
  const {
    content = 'Texto editável com formatação elegante.',
    fontSize = 'medium',
    fontWeight = 'normal',
    fontFamily = 'inherit',
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

  // Verificar se o conteúdo contém HTML
  const isHtmlContent = useMemo(() => {
    const hasHtml = processedContent?.includes('<') && processedContent?.includes('>');
    console.log('🔍 TextInlineBlock (inline) Debug:', {
      content: processedContent,
      hasHtml,
      blockId: block?.id
    });
    return hasHtml;
  }, [processedContent, block?.id]);

  // Tamanhos de fonte responsivos
  const fontSizeClasses = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base md:text-lg',
    large: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    xlarge: 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl',
    // Suporte direto para classes Tailwind
    'text-xs': 'text-xs',
    'text-sm': 'text-sm',
    'text-base': 'text-base',
    'text-lg': 'text-lg',
    'text-xl': 'text-xl',
    'text-2xl': 'text-2xl',
    'text-3xl': 'text-3xl',
    'text-4xl': 'text-4xl',
    'text-5xl': 'text-5xl',
    'text-6xl': 'text-6xl'
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
        style={{ 
          color,
          ...(fontFamily !== 'inherit' && { fontFamily })
        }}
      >
        {isHtmlContent ? (
          <span dangerouslySetInnerHTML={{ __html: processedContent }} />
        ) : (
          processedContent
        )}
      </p>
    </div>
  );
};

export default TextInlineBlock;
