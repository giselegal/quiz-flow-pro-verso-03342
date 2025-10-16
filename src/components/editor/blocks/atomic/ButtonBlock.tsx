/**
 * 🎨 BUTTON BLOCK - Atomic Component
 * 
 * Botões CTA com variantes e animações
 */

import { memo } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonBlockProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  disabled?: boolean;
  animate?: 'none' | 'pulse' | 'bounce';
  onClick?: () => void;
  className?: string;
  mode?: 'edit' | 'preview';
}

export const ButtonBlock = memo(({
  text = 'Button',
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  bgColor = '#B89B7A',
  hoverBgColor = '#A1835D',
  textColor = '#ffffff',
  disabled = false,
  animate = 'none',
  onClick,
  className = '',
  mode = 'preview'
}: ButtonBlockProps) => {
  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-4 px-6 text-base',
    lg: 'py-5 px-8 text-lg'
  }[size];

  const animateClasses = {
    none: '',
    pulse: 'animate-pulse',
    bounce: 'animate-bounce'
  }[animate];

  return (
    <button
      onClick={onClick}
      disabled={disabled || mode === 'edit'}
      className={cn(
        'font-bold rounded-xl transition-all duration-200',
        'hover:scale-[1.02] active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        fullWidth && 'w-full',
        sizeClasses,
        animateClasses,
        className
      )}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ...(hoverBgColor && {
          '--hover-bg': hoverBgColor
        } as any)
      }}
    >
      {text}
    </button>
  );
});

ButtonBlock.displayName = 'ButtonBlock';
