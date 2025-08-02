import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Users, Award, Target, Zap, Heart } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, isValidBlock, logBlockDebug } from '@/utils/blockUtils';

/**
 * StatInlineBlock - Componente modular inline horizontal
 * Estatística compacta com ícone e valor
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const StatInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  className = ''
}) => {
  // 🛡️ Validação e logging de debug
  if (!isValidBlock(block)) {
    console.error('❌ StatInlineBlock: Bloco inválido recebido', block);
    return <div className="p-2 bg-red-100 text-red-600 text-xs rounded">Erro: Bloco inválido</div>;
  }

  logBlockDebug('StatInlineBlock', block);

  // 🛡️ Extração segura das propriedades
  const properties = safeGetBlockProperties(block);

  const {
    value = '95%',
    label = 'Satisfação',
    icon = 'trending-up',
    valueColor = '#B89B7A',
    labelColor = '#5D4A3A',
    backgroundColor = 'white',
    size = 'medium',
    animated = true
  } = properties;

  // Ícones disponíveis
  const iconMap = {
    'trending-up': TrendingUp,
    'users': Users,
    'award': Award,
    'target': Target,
    'zap': Zap,
    'heart': Heart
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap] || TrendingUp;

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: 'p-3 sm:p-4 w-full sm:w-32 md:w-36',
    medium: 'p-4 sm:p-6 w-full sm:w-40 md:w-44 lg:w-48',
    large: 'p-6 sm:p-8 w-full sm:w-48 md:w-52 lg:w-56'
  };

  const iconSizes = {
    small: 'w-4 h-4 sm:w-5 sm:h-5',
    medium: 'w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7',
    large: 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8'
  };

  const valueSizes = {
    small: 'text-lg sm:text-xl md:text-2xl',
    medium: 'text-xl sm:text-2xl md:text-3xl',
    large: 'text-2xl sm:text-3xl md:text-4xl'
  };

  const labelSizes = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg'
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e quebra linha automaticamente
        'flex-shrink-0 flex-grow-0',
        // Responsivo modular
        sizeClasses[size as keyof typeof sizeClasses],
        // Visual modular
        'bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200',
        'shadow-sm hover:shadow-md transition-all duration-200',
        // Estados do editor
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer hover:scale-[1.02]',
        // Animação opcional
        animated && 'hover:bg-gray-50/50',
        className
      )}
      style={{ backgroundColor: backgroundColor === 'white' ? undefined : backgroundColor }}
      onClick={onClick}
    >
      {/* Layout vertical compacto */}
      <div className="flex flex-col items-center text-center space-y-1 sm:space-y-2">
        {/* Ícone */}
        <div className="flex items-center justify-center p-2 rounded-full bg-gray-100">
          <IconComponent 
            className={cn(
              iconSizes[size as keyof typeof iconSizes],
              'text-gray-600'
            )} 
          />
        </div>

        {/* Valor */}
        <div 
          className={cn(
            'font-bold leading-none',
            valueSizes[size as keyof typeof valueSizes]
          )}
          style={{ color: valueColor }}
        >
          {value}
        </div>

        {/* Label */}
        <div 
          className={cn(
            'font-medium leading-tight',
            labelSizes[size as keyof typeof labelSizes]
          )}
          style={{ color: labelColor }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default StatInlineBlock;
