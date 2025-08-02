
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, isValidBlock, logBlockDebug } from '@/utils/blockUtils';

/**
 * ProgressInlineBlock - Componente modular inline horizontal
 * Barra de progresso compacta e responsiva
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const ProgressInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  // 🛡️ Validação e logging de debug
  if (!isValidBlock(block)) {
    console.error('❌ ProgressInlineBlock: Bloco inválido recebido', block);
    return <div className="p-2 bg-red-100 text-red-600 text-xs rounded">Erro: Bloco inválido</div>;
  }

  logBlockDebug('ProgressInlineBlock', block);

  // 🛡️ Extração segura das propriedades
  const properties = safeGetBlockProperties(block);

  const {
    value = 75,
    max = 100,
    label = 'Progresso',
    showPercentage = true,
    showLabel = true,
    size = 'medium',
    color = '#B89B7A',
    backgroundColor = '#f3f4f6',
    animated = true,
    variant = 'horizontal' // horizontal, vertical, circular
  } = properties;

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: {
      container: 'w-full sm:w-32 md:w-40',
      height: 'h-1.5 sm:h-2',
      text: 'text-xs',
      spacing: 'space-y-1'
    },
    medium: {
      container: 'w-full sm:w-40 md:w-48 lg:w-56',
      height: 'h-2 sm:h-2.5 md:h-3',
      text: 'text-xs sm:text-sm',
      spacing: 'space-y-1 sm:space-y-2'
    },
    large: {
      container: 'w-full sm:w-48 md:w-56 lg:w-64',
      height: 'h-3 sm:h-3.5 md:h-4',
      text: 'text-sm sm:text-base',
      spacing: 'space-y-2'
    }
  };

  const sizeConfig = sizeClasses[size as keyof typeof sizeClasses];

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0',
        // Container responsivo
        sizeConfig.container,
        // Layout interno
        'flex flex-col',
        sizeConfig.spacing,
        // Estados do editor
        isSelected && 'ring-2 ring-blue-500 ring-offset-2 rounded-md p-2',
        'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Header com label e porcentagem */}
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center">
          {showLabel && (
            <span className={cn(
              'font-medium text-gray-700',
              sizeConfig.text
            )}>
              {label}
            </span>
          )}
          {showPercentage && (
            <span className={cn(
              'font-bold',
              sizeConfig.text
            )} style={{ color }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Barra de progresso */}
      <div className="relative">
        {/* Background da barra */}
        <div 
          className={cn(
            'w-full rounded-full overflow-hidden',
            sizeConfig.height
          )}
          style={{ backgroundColor }}
        >
          {/* Progress fill */}
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              animated && 'animate-pulse'
            )}
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>

        {/* Gradient overlay para visual premium */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full opacity-20',
            'bg-gradient-to-r from-transparent via-white to-transparent',
            sizeConfig.height
          )}
        />
      </div>

      {/* Valor absoluto (opcional) */}
      {value !== percentage && (
        <div className="flex justify-center">
          <span className={cn(
            'text-gray-500',
            sizeConfig.text
          )}>
            {value} de {max}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressInlineBlock;
