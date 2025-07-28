import React from 'react';
import { cn } from '@/lib/utils';
import { Type, Edit3 } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * HeadingInlineBlock - Componente modular inline horizontal
 * Título/cabeçalho responsivo e configurável
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const HeadingInlineBlock: React.FC<BlockComponentProps> = ({
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
    content = 'Título Principal',
    level = 'h2', // h1, h2, h3, h4, h5, h6
    textAlign = 'left',
    color = '#1f2937',
    backgroundColor = 'transparent',
    fontWeight = 'bold',
    maxWidth = 'full',
    responsive = true
  } = block.properties;

  // Tamanhos responsivos por nível
  const levelClasses = {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl',
    h3: 'text-lg sm:text-xl md:text-2xl lg:text-3xl',
    h4: 'text-base sm:text-lg md:text-xl lg:text-2xl',
    h5: 'text-sm sm:text-base md:text-lg lg:text-xl',
    h6: 'text-xs sm:text-sm md:text-base lg:text-lg'
  };

  // Alinhamentos
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Pesos de fonte
  const fontWeightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold'
  };

  // Larguras máximas
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  const HeadingTag = level as keyof JSX.IntrinsicElements;

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0 relative group w-full',
        // Container editável
        'p-2 sm:p-3 rounded-lg border border-transparent',
        'hover:border-gray-200 hover:bg-gray-50/30 transition-all duration-200',
        'cursor-pointer',
        isSelected && 'border-blue-500 bg-blue-50/30',
        className
      )}
      onClick={onClick}
    >
      <HeadingTag
        className={cn(
          // Tamanho responsivo
          levelClasses[level as keyof typeof levelClasses],
          // Alinhamento
          textAlignClasses[textAlign as keyof typeof textAlignClasses],
          // Peso da fonte
          fontWeightClasses[fontWeight as keyof typeof fontWeightClasses],
          // Largura máxima
          maxWidthClasses[maxWidth as keyof typeof maxWidthClasses],
          // Visual
          'leading-tight tracking-tight transition-colors duration-200'
        )}
        style={{
          color,
          backgroundColor: backgroundColor === 'transparent' ? undefined : backgroundColor
        }}
      >
        {content || 'Título Principal'}
      </HeadingTag>

      {/* Indicador de seleção */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1">
          <Edit3 className="w-3 h-3" />
        </div>
      )}

      {/* Empty state */}
      {!content && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-lg text-gray-500">
          <Type className="w-6 h-6 mr-2" />
          <span className="text-sm">Clique para selecionar e editar no painel</span>
        </div>
      )}
    </div>
  );
};

export default HeadingInlineBlock;