// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Edit3 } from 'lucide-react';

interface LoaderInlineBlockProps {
  title?: string;
  percentage?: number;
  description?: string;
  animated?: boolean;
  color?: string;
  onClick?: () => void;
  className?: string;
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
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

const LoaderInlineBlock: React.FC<LoaderInlineBlockProps> = ({
  title = 'Carregando...',
  percentage = 60,
  description = 'Analisando seu estilo pessoal...',
  animated = true,
  color = '#B89B7A',
  onClick,
  className,
  onPropertyChange,
  disabled = false,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setCurrentProgress(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setCurrentProgress(percentage);
    }
  }, [percentage, animated]);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group/canvas-item inline-block w-full',
        'min-h-[1.25rem] relative border-2 border-dashed rounded-md p-4',
        'hover:border-2 hover:border-[#B89B7A] transition-all cursor-pointer',
        isHovered ? 'border-[#B89B7A]' : 'border-gray-300',
        disabled && 'opacity-75 cursor-not-allowed',
        className,
        // Margens universais com controles deslizantes
        getMarginClass(marginTop, 'top'),
        getMarginClass(marginBottom, 'bottom'),
        getMarginClass(marginLeft, 'left'),
        getMarginClass(marginRight, 'right')
      )}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid w-full items-center gap-1.5">
        {/* Header */}
        <div className="w-full flex justify-between flex-row">
          <div className="font-bold text-[#432818]">{title}</div>
          <div className="font-normal text-[#8F7A6A]">{percentage}%</div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-zinc-300">
          <div
            className="h-full w-full flex-1 transition-all duration-1000 ease-out rounded-full"
            style={{
              backgroundColor: color,
              transform: `translateX(-${100 - currentProgress}%)`,
            }}
          />
        </div>

        {/* Description */}
        <div className="text-[#8F7A6A] font-normal mt-2 text-center text-sm">{description}</div>
      </div>

      {/* Edit indicator */}
      {!disabled && (
        <div className="absolute top-2 right-2 opacity-0 group-hover/canvas-item:opacity-100 transition-opacity">
          <Edit3 className="w-4 h-4 text-[#B89B7A]" />
        </div>
      )}
    </div>
  );
};

export default LoaderInlineBlock;
