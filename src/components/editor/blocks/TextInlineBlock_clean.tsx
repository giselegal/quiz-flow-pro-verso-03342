// @ts-nocheck
import React, { useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * TextInlineBlock - Componente modular inline horizontal
 * Texto responsivo e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 * Utiliza funcionalidades modernas do ES7+: destructuring, optional chaining, nullish coalescing
 */

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const TextInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = '',
}) => {
  // ES7+ Destructuring com default values e optional chaining
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
    gridColumns = 'auto', // 'auto', 'half', 'full'
    spacing = 'normal',
  } = block?.properties ?? {};

  // ES7+ Object property shorthand e computed property names
  const fontSizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    medium: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  } as const;

  // ES7+ Object spread com type assertion
  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  } as const;

  // ES7+ Template literals implícitos nas keys
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  } as const;

  // ES7+ Arrow functions e object shorthand
  const gridClasses = {
    auto: 'w-full md:w-[calc(50%-0.5rem)]', // Máximo 2 colunas em MD+
    half: 'w-full md:w-[calc(50%-0.5rem)]', // Força 2 colunas
    full: 'w-full', // Largura total
  } as const;

  const spacingClasses = {
    tight: 'p-2',
    normal: 'p-4',
    loose: 'p-6',
  } as const;

  // ES7+ useMemo para otimização de performance
  const personalizedContent = useMemo(() => {
    // ES7+ Optional chaining e nullish coalescing
    if (useUsername && usernamePattern) {
      return content?.replace?.(usernamePattern, 'Usuário') ?? content;
    }
    return content;
  }, [content, useUsername, usernamePattern]);

  // ES7+ useCallback para otimização de re-renders
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <div
      className={cn(
        // CANVAS GRID SYSTEM: Compatível com flex-wrap do canvas
        'flex-shrink-0 flex-grow-0',
        // ES7+ Computed property access com nullish coalescing
        gridClasses[gridColumns as keyof typeof gridClasses] ?? gridClasses.auto,

        // VISUAL STYLING: Modular e independente
        'rounded-lg transition-all duration-200',

        // EDITOR STATES: Seleção e interação - ES7+ logical AND
        isSelected && 'ring-2 ring-[#B89B7A] ring-offset-2',
        'cursor-pointer',

        // SPACING - ES7+ Computed property com fallback
        spacingClasses[spacing as keyof typeof spacingClasses] ?? spacingClasses.normal,

        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      style={{ backgroundColor }}
      onClick={handleClick}
      // ES7+ Object spread para data attributes
      {...(block?.id && { 'data-block-id': block.id })}
      {...(block?.type && { 'data-block-type': block.type })}
    >
      <div
        className={cn(
          // ES7+ Computed properties com fallbacks
          fontSizeClasses[fontSize as keyof typeof fontSizeClasses] ?? fontSizeClasses.medium,
          fontWeightClasses[fontWeight as keyof typeof fontWeightClasses] ??
            fontWeightClasses.normal,
          textAlignClasses[textAlign as keyof typeof textAlignClasses] ?? textAlignClasses.left,

          // Responsividade e quebra de texto
          'leading-relaxed break-words whitespace-pre-wrap'
        )}
        style={{ color }}
        // ES7+ Conditional data attributes
        {...(maxWidth !== 'auto' && { style: { ...{ color }, maxWidth } })}
      >
        {personalizedContent}
      </div>
    </div>
  );
};

// ES7+ Export com default + named exports para flexibilidade
export default TextInlineBlock;

// ES7+ Type exports para reutilização
export type { BlockComponentProps };

// ES7+ Const assertion para readonly arrays/objects
export const TEXT_SIZES = ['xs', 'sm', 'medium', 'lg', 'xl', '2xl', '3xl'] as const;
export const TEXT_WEIGHTS = ['light', 'normal', 'medium', 'semibold', 'bold'] as const;
export const TEXT_ALIGNS = ['left', 'center', 'right', 'justify'] as const;

// ES7+ Template literal types (para uso futuro)
export type TemplatePattern = `{${string}}`;

// ES7+ Utility function com advanced features
export const createTextBlock = (
  content: string,
  options: Partial<{
    fontSize: (typeof TEXT_SIZES)[number];
    fontWeight: (typeof TEXT_WEIGHTS)[number];
    textAlign: (typeof TEXT_ALIGNS)[number];
  }> = {}
) => ({
  id: crypto.randomUUID?.() ?? Math.random().toString(36),
  type: 'text-inline',
  properties: {
    content,
    ...options,
  },
});
