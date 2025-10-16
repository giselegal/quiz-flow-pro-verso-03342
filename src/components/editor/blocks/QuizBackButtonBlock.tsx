/**
 * 🎯 QUIZ BACK BUTTON BLOCK - Componente Modular
 * Botão "Voltar" isolado e 100% editável
 */

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';
import { Button } from '@/components/ui/button';

interface QuizBackButtonBlockProps extends BlockComponentProps {
  properties?: {
    text?: string;
    showIcon?: boolean;
    variant?: 'default' | 'outline' | 'ghost' | 'link';
    size?: 'sm' | 'md' | 'lg';
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    disabled?: boolean;
  };
  onBack?: () => void;
}

export const QuizBackButtonBlock: React.FC<QuizBackButtonBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  onBack,
  className,
}) => {
  const {
    text = 'Voltar',
    showIcon = true,
    variant = 'ghost',
    size = 'md',
    marginTop = 0,
    marginBottom = 16,
    marginLeft = 0,
    marginRight = 0,
    paddingTop = 8,
    paddingBottom = 8,
    paddingLeft = 16,
    paddingRight = 16,
    backgroundColor,
    textColor,
    borderRadius = 8,
    disabled = false,
  } = properties;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    marginLeft: `${marginLeft}px`,
    marginRight: `${marginRight}px`,
  };

  const buttonStyle: React.CSSProperties = {
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    paddingLeft: `${paddingLeft}px`,
    paddingRight: `${paddingRight}px`,
    borderRadius: `${borderRadius}px`,
    ...(backgroundColor && { backgroundColor }),
    ...(textColor && { color: textColor }),
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onBack) {
      onBack();
    }
  };

  return (
    <div
      className={cn(
        'inline-block transition-all',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      <Button
        variant={variant as any}
        size={size as any}
        disabled={disabled}
        onClick={handleClick}
        style={buttonStyle}
        className="transition-all"
      >
        {showIcon && <ArrowLeft className="mr-2 h-4 w-4" />}
        {text}
      </Button>
    </div>
  );
};

export default QuizBackButtonBlock;
