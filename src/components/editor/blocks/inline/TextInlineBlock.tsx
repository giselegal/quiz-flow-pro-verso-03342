
import React, { useMemo, useCallback } from 'react';
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
  className = ''
}) => {

  // Destructuring com default values e optional chaining
  const {
    content = 'Texto exemplo',
    fontSize = 'medium',
    fontWeight = 'normal',
    textAlign = 'left',
    color = '#374151',
    backgroundColor = 'transparent',
    maxWidth = 'auto',
    useUsername = false,
    usernamePattern = '{userName}',
    // Propriedades do grid system
    gridColumns = 'auto',
    spacing = 'normal'
  } = block?.properties ?? {};

  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    medium: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  } as const;

  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  } as const;

  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  } as const;

  const gridClasses = {
    auto: 'w-full md:w-[calc(50%-0.5rem)]',
    half: 'w-full md:w-[calc(50%-0.5rem)]',
    full: 'w-full'
  } as const;

  const spacingClasses = {
    tight: 'p-2',
    normal: 'p-4',
    loose: 'p-6'
  } as const;

  // Personalização de conteúdo
  const personalizedContent = useMemo(() => {
    if (useUsername && usernamePattern) {
      return content?.replace?.(usernamePattern, 'Usuário') ?? content;
    }
    return content;
  }, [content, useUsername, usernamePattern]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={cn(
        'flex-shrink-0 flex-grow-0',
        gridClasses[gridColumns as keyof typeof gridClasses] ?? gridClasses.auto,
        'rounded-lg transition-all duration-200',
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer',
        spacingClasses[spacing as keyof typeof spacingClasses] ?? spacingClasses.normal,
        className
      )}
      style={{ backgroundColor }}
      onClick={handleClick}
      {...(block?.id && { 'data-block-id': block.id })}
      {...(block?.type && { 'data-block-type': block.type })}
    >
      <div
        className={cn(
          fontSizeClasses[fontSize as keyof typeof fontSizeClasses] ?? fontSizeClasses.medium,
          fontWeightClasses[fontWeight as keyof typeof fontWeightClasses] ?? fontWeightClasses.normal,
          textAlignClasses[textAlign as keyof typeof textAlignClasses] ?? textAlignClasses.left,
          'leading-relaxed break-words whitespace-pre-wrap'
        )}
        style={{ color }}
        {...(maxWidth !== 'auto' && { style: { ...{ color }, maxWidth } })}
      >
        {personalizedContent}
      </div>
    </div>
  );
};

export default TextInlineBlock;
