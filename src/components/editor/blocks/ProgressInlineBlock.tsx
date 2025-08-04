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
            className="text-sm font-medium text-gray-700 truncate"
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
                    onPropertyChange('percentage', Math.max(0, Math.min(100, Number(newPercentage))));
                  }
                }
              }}
            >
              {percentage}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
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
