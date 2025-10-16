/**
 * 🎯 QUIZ TRANSITION LOADER BLOCK - Componente Modular
 * Loader animado para transições entre steps
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizTransitionLoaderBlockProps extends BlockComponentProps {
  properties?: {
    text?: string;
    subtext?: string;
    showSpinner?: boolean;
    spinnerSize?: number;
    fontSize?: string | number;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    marginTop?: number;
    marginBottom?: number;
    paddingTop?: number;
    paddingBottom?: number;
    minHeight?: number;
  };
}

export const QuizTransitionLoaderBlock: React.FC<QuizTransitionLoaderBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    text = 'Processando suas respostas...',
    subtext = 'Isso levará apenas alguns segundos',
    showSpinner = true,
    spinnerSize = 48,
    fontSize = '20px',
    textAlign = 'center',
    color = 'hsl(var(--foreground))',
    backgroundColor = 'transparent',
    marginTop = 0,
    marginBottom = 0,
    paddingTop = 48,
    paddingBottom = 48,
    minHeight = 300,
  } = properties;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    backgroundColor,
    minHeight: `${minHeight}px`,
  };

  const textStyle: React.CSSProperties = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    textAlign,
    color,
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center transition-all',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      {showSpinner && (
        <Loader2
          className="animate-spin mb-6"
          size={spinnerSize}
          style={{ color }}
        />
      )}
      <div style={textStyle} className="font-semibold mb-2 transition-all">
        {text}
      </div>
      {subtext && (
        <div
          className="text-sm opacity-70 transition-all"
          style={{ textAlign, color }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};

export default QuizTransitionLoaderBlock;
