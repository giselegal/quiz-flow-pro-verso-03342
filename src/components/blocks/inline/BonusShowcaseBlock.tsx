// @ts-nocheck
import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

/**
 * BonusShowcaseBlock - Componente para showcase de bônus e ofertas especiais
 * Usado principalmente em etapas de resultado e oferta final
 */
const BonusShowcaseBlock: React.FC<BlockComponentProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  className = '',
}) => {
  const {
    title = '🎁 Bônus Exclusivos',
    subtitle = 'Oferta especial por tempo limitado',
    items = [
      { title: 'E-book Guia de Estilo', value: 'R$ 197' },
      { title: 'Consultoria de 30min', value: 'R$ 297' },
      { title: 'Kit de Templates', value: 'R$ 97' },
    ],
    totalValue = 'R$ 591',
    backgroundColor = '#FFF7ED',
    accentColor = '#EA580C',
    textColor = '#1F2937',
    spacing = 'medium',
    alignment = 'center',
  } = block?.properties || {};

  const spacingClasses = {
    small: 'p-4 space-y-3',
    medium: 'p-6 space-y-4', 
    large: 'p-8 space-y-6',
  };

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div
      className={cn(
        'rounded-lg border shadow-sm transition-all',
        spacingClasses[spacing] || spacingClasses.medium,
        alignmentClasses[alignment] || alignmentClasses.center,
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50',
        className
      )}
      style={{ 
        backgroundColor,
        borderColor: accentColor + '20',
        color: textColor,
      }}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 
            className="text-xl font-bold"
            style={{ color: accentColor }}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm opacity-80">
              {subtitle}
            </p>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-2">
          {items.map((item, index) => (
            <div 
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-200/50 last:border-b-0"
            >
              <span className="text-sm font-medium">{item.title}</span>
              <span 
                className="text-sm font-bold"
                style={{ color: accentColor }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Total Value */}
        {totalValue && (
          <div 
            className="pt-3 border-t text-lg font-bold"
            style={{ 
              borderColor: accentColor + '30',
              color: accentColor,
            }}
          >
            Total: {totalValue}
          </div>
        )}
      </div>
    </div>
  );
};

export default BonusShowcaseBlock;
