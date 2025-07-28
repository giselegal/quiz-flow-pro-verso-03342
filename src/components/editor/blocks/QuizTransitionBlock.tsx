import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface QuizTransitionBlockProps {
  block: {
    id: string;
    type: string;
    properties: {
      title?: string;
      description?: string;
      buttonText?: string;
      icon?: string;
      backgroundColor?: string;
      textColor?: string;
    };
  };
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const QuizTransitionBlock: React.FC<QuizTransitionBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  disabled = false,
  className
}) => {
  const {
    title = 'Transição',
    description = 'Vamos continuar para a próxima etapa',
    buttonText = 'Continuar',
    icon = '🎯',
    backgroundColor = '#ffffff',
    textColor = '#432818'
  } = block.properties;

  return (
    <div
      className={cn(
        'relative w-full min-h-[350px] p-8 rounded-lg border-2 border-dashed',
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className
      )}
      onClick={onClick}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <Badge variant="outline" className="mb-4">
          Transição
        </Badge>

        {/* Icon */}
        <div className="text-6xl mb-6">
          {icon}
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: textColor }}>
          {title}
        </h2>

        {/* Description */}
        <p className="text-lg mb-8 opacity-80" style={{ color: textColor }}>
          {description}
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          className="px-8 py-3 bg-primary hover:bg-primary/90"
          disabled={disabled}
        >
          {buttonText}
        </Button>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">
          Transição
        </div>
      )}
    </div>
  );
};

export default QuizTransitionBlock;