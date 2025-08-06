import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface ButtonInlineProperties {
  text: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  width?: 'auto' | 'full' | 'fit';
  alignment?: 'left' | 'center' | 'right';
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  onClick?: () => void;
}

const ButtonInlineBlock: React.FC<BlockComponentProps> = ({
  block,
  properties,
  isSelected,
  onClick,
  onPropertyChange,
}) => {
  const {
    text = 'Clique aqui',
    variant = 'primary',
    size = 'md',
    backgroundColor,
    textColor,
    borderColor,
    borderRadius = 'md',
    width = 'auto',
    alignment = 'center',
    disabled = false,
    loading = false,
    href,
  } = (properties || {}) as ButtonInlineProperties;

  const handlePropertyUpdate = (key: string, value: any) => {
    onPropertyChange?.(key, value);
  };

  const getVariantClasses = () => {
    const variantMap = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 border-gray-200',
      outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
      ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
      destructive: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
    };
    return variantMap[variant] || variantMap.primary;
  };

  const getSizeClasses = () => {
    const sizeMap = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    };
    return sizeMap[size] || sizeMap.md;
  };

  const getRadiusClass = () => {
    const radiusMap = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    };
    return radiusMap[borderRadius] || radiusMap.md;
  };

  const getWidthClass = () => {
    const widthMap = {
      auto: 'w-auto',
      full: 'w-full',
      fit: 'w-fit',
    };
    return widthMap[width] || widthMap.auto;
  };

  const getAlignmentClass = () => {
    const alignMap = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
    };
    return alignMap[alignment] || alignMap.center;
  };

  const buttonStyles = {
    backgroundColor: backgroundColor || undefined,
    color: textColor || undefined,
    borderColor: borderColor || undefined,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSelected) {
      onClick?.();
    } else if (href) {
      window.open(href, '_blank');
    }
  };

  const buttonContent = (
    <button
      type="button"
      className={cn(
        'button-inline-block font-medium transition-all duration-200 border outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50',
        getSizeClasses(),
        getRadiusClass(),
        getWidthClass(),
        !backgroundColor && !textColor && !borderColor && getVariantClasses(),
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        isSelected && 'ring-2 ring-blue-500 ring-opacity-50'
      )}
      style={buttonStyles}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Carregando...
        </span>
      ) : (
        <span
          contentEditable={isSelected}
          suppressContentEditableWarning
          onBlur={(e) => handlePropertyUpdate('text', e.target.textContent || '')}
        >
          {text}
        </span>
      )}
    </button>
  );

  return (
    <div className={cn('flex', getAlignmentClass())}>
      {buttonContent}
    </div>
  );
};

export default ButtonInlineBlock;
