// @ts-nocheck
import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, Edit3 } from 'lucide-react';

interface ProgressInlineBlockProps {
  label?: string;
  percentage?: number;
  color?: string;
  showPercentage?: boolean;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
}

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

const ProgressInlineBlock: React.FC<ProgressInlineBlockProps> = ({
  label = 'Progresso do Quiz',
  percentage = 65,
  color = '#B89B7A',
  showPercentage = true,
  onClick,
  className,
  onPropertyChange,
  disabled = false,
}) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer',
        'w-full',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={!disabled ? onClick : undefined}
    >
      {/* Progress Icon */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <TrendingUp className="w-4 h-4" style={{ color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span
            style={{ color: '#6B4F43' }}
            onClick={e => {
              e.stopPropagation();
              if (onPropertyChange && !disabled) {
                const newLabel = prompt('Novo rótulo:', label);
                if (newLabel !== null) onPropertyChange('label', newLabel);
              }
            }}
          >
            {label}
          </span>
          {showPercentage && (
            <span
              className="text-sm font-bold ml-2"
              style={{ color }}
              onClick={e => {
                e.stopPropagation();
                if (onPropertyChange && !disabled) {
                  const newPercentage = prompt('Nova porcentagem (0-100):', percentage.toString());
                  if (newPercentage !== null && !isNaN(Number(newPercentage))) {
                    onPropertyChange(
                      'percentage',
                      Math.max(0, Math.min(100, Number(newPercentage)))
                    );
                  }
                }
              }}
            >
              {percentage}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div style={{ backgroundColor: '#E5DDD5' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.max(0, Math.min(100, percentage))}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};

export default ProgressInlineBlock;
