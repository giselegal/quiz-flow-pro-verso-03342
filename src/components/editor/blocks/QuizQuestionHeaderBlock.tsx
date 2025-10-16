/**
 * 🎯 QUIZ QUESTION HEADER BLOCK - Componente Modular
 * Cabeçalho de pergunta isolado e 100% editável
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizQuestionHeaderBlockProps extends BlockComponentProps {
  properties?: {
    questionNumber?: number;
    totalQuestions?: number;
    questionText?: string;
    showProgress?: boolean;
    fontSize?: string | number;
    fontWeight?: string | number;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
    marginTop?: number;
    marginBottom?: number;
    paddingTop?: number;
    paddingBottom?: number;
    borderRadius?: number;
  };
}

export const QuizQuestionHeaderBlock: React.FC<QuizQuestionHeaderBlockProps> = ({
  properties = {},
  isSelected,
  onClick,
  className,
}) => {
  const {
    questionNumber = 1,
    totalQuestions = 21,
    questionText = 'Sua pergunta aqui',
    showProgress = true,
    fontSize = '24px',
    fontWeight = '600',
    textAlign = 'center',
    color = 'hsl(var(--foreground))',
    backgroundColor = 'transparent',
    marginTop = 0,
    marginBottom = 24,
    paddingTop = 16,
    paddingBottom = 16,
    borderRadius = 0,
  } = properties;

  const containerStyle: React.CSSProperties = {
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
  };

  const textStyle: React.CSSProperties = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight: typeof fontWeight === 'number' ? fontWeight : fontWeight,
    textAlign,
    color,
  };

  return (
    <div
      className={cn(
        'transition-all',
        isSelected && 'ring-2 ring-primary rounded',
        className
      )}
      style={containerStyle}
      onClick={onClick}
    >
      {showProgress && (
        <div className="text-sm text-muted-foreground text-center mb-2">
          Pergunta {questionNumber} de {totalQuestions}
        </div>
      )}
      <h2 style={textStyle} className="transition-all">
        {questionText}
      </h2>
    </div>
  );
};

export default QuizQuestionHeaderBlock;
