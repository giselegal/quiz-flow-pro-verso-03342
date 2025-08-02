
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { InlineEditText } from './InlineEditText';
import type { BlockComponentProps } from '@/types/blocks';

interface StrategicQuestionBlockProps extends BlockComponentProps {
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

const StrategicQuestionBlock: React.FC<StrategicQuestionBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className
}) => {
  const {
    question = 'Como você se vê hoje?',
    options = [
      { id: '1', text: 'Alguém que já tem um estilo bem definido', value: 'defined', category: 'confiante' },
      { id: '2', text: 'Alguém em busca do seu estilo pessoal', value: 'searching', category: 'explorando' },
      { id: '3', text: 'Alguém que quer renovar completamente', value: 'renovating', category: 'transformação' }
    ],
    progressLabel = 'Questão Estratégica',
    progressValue = 80,
    backgroundColor = '#ffffff',
    textColor = '#432818'
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  const handleOptionChange = (optionIndex: number, field: string, value: any) => {
    const updatedOptions = options.map((option: any, index: number) => 
      index === optionIndex ? { ...option, [field]: value } : option
    );
    handlePropertyChange('options', updatedOptions);
  };

  return (
    <div
      className={cn(
        'relative w-full min-h-[400px] p-8 rounded-lg border-2 border-dashed',
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className
      )}
      onClick={onClick}
      style={{ backgroundColor, color: textColor }}
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <InlineEditText
            value={progressLabel}
            onSave={(value: string) => handlePropertyChange('progressLabel', value)}
            placeholder="Label do progresso"
            className="text-sm font-medium opacity-70"
            disabled={disabled}
            as="span"
          />
          <InlineEditText
            value={`${progressValue}%`}
            onSave={(value: string) => {
              const numValue = parseInt(value.replace('%', ''));
              if (!isNaN(numValue)) {
                handlePropertyChange('progressValue', numValue);
              }
            }}
            placeholder="0%"
            className="text-sm font-medium opacity-70"
            disabled={disabled}
            as="span"
          />
        </div>
        <Progress value={progressValue} className="h-2" />
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <Badge variant="outline" className="mb-4">
          Questão Estratégica
        </Badge>
        <InlineEditText
          value={question}
          onSave={(value: string) => handlePropertyChange('question', value)}
          placeholder="Digite a questão estratégica..."
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{ color: textColor }}
          disabled={disabled}
          as="h2"
          multiline={true}
        />
      </div>

      {/* Options */}
      <div className="grid gap-4 max-w-2xl mx-auto">
        {options.map((option: any, index: number) => (
          <div
            key={option.id || index}
            className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer text-center"
          >
            <InlineEditText
              value={option.text}
              onSave={(value: string) => handleOptionChange(index, 'text', value)}
              placeholder="Texto da opção"
              className="text-lg font-medium"
              style={{ color: textColor }}
              disabled={disabled}
              as="p"
              multiline={true}
            />
            {option.category && (
              <div className="mt-2">
                <InlineEditText
                  value={option.category}
                  onSave={(value: string) => handleOptionChange(index, 'category', value)}
                  placeholder="Categoria"
                  className="text-xs"
                  disabled={disabled}
                  as="span"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="text-center mt-8">
        <Button
          size="lg"
          className="px-8 py-3 bg-primary hover:bg-primary/90"
          disabled={disabled}
        >
          Continuar
        </Button>
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          Questão Estratégica
        </div>
      )}
    </div>
  );
};

export default StrategicQuestionBlock;
