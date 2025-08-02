
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Star, Award, Shield, Zap, Heart } from 'lucide-react';
import type { BlockComponentProps } from '@/types/blocks';
import { safeGetBlockProperties, isValidBlock, logBlockDebug } from '@/utils/blockUtils';

/**
 * BadgeInlineBlock - Componente modular inline horizontal
 * Badge/etiqueta compacta com ícone e texto
 * MODULAR | REUTILIZÁVEL | RESPONSIVO | INDEPENDENTE
 */
const BadgeInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = ''
}) => {
  // 🛡️ Validação e logging de debug
  if (!isValidBlock(block)) {
    console.error('❌ BadgeInlineBlock: Bloco inválido recebido', block);
    return <div className="p-2 bg-red-100 text-red-600 text-xs rounded">Erro: Bloco inválido</div>;
  }

  logBlockDebug('BadgeInlineBlock', block);

  // 🛡️ Extração segura das propriedades
  const properties = safeGetBlockProperties(block);
  
  const {
    text = 'Certificado',
    icon = 'check',
    variant = 'default', // default, success, warning, error, info
    size = 'medium',
    showIcon = true,
    animated = true,
    isEditable = true
  } = properties;

  // Ícones disponíveis
  const iconMap = {
    'check': Check,
    'star': Star,
    'award': Award,
    'shield': Shield,
    'zap': Zap,
    'heart': Heart
  };

  const IconComponent = iconMap[icon as keyof typeof iconMap] || Check;

  // Variantes de cor
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  // Tamanhos modulares responsivos
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    medium: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div
      className={cn(
        // INLINE HORIZONTAL: Flexível e auto-sizing
        'inline-flex items-center space-x-1 sm:space-x-1.5',
        'flex-shrink-0 flex-grow-0',
        // Visual modular
        'rounded-full border font-medium',
        'transition-all duration-200',
        // Tamanho responsivo
        sizeClasses[size as keyof typeof sizeClasses],
        // Variante de cor
        variantClasses[variant as keyof typeof variantClasses],
        // Estados do editor
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
        'cursor-pointer',
        // Animação opcional
        animated && 'hover:scale-105 hover:shadow-sm',
        className
      )}
      onClick={onClick}
    >
      {/* Ícone opcional */}
      {showIcon && (
        <IconComponent 
          className={cn(
            iconSizes[size as keyof typeof iconSizes],
            'flex-shrink-0'
          )} 
        />
      )}

      {/* Texto */}
      <span className="whitespace-nowrap">
        {text}
      </span>
    </div>
  );
};

export default BadgeInlineBlock;
