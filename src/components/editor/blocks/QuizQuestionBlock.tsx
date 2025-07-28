
import React from 'react';
import { BlockComponentProps } from '@/types/blocks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface QuizQuestionBlockProps extends BlockComponentProps {
  question: string;
  options: Array<{
    id: string;
    text: string;
    value: string;
    imageUrl?: string;
  }>;
  allowMultiple?: boolean;
  showImages?: boolean;
  maxSelections?: number;
  required?: boolean;
  showProgress?: boolean;
  showBackButton?: boolean;
}

const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  block,
  question = 'Sua pergunta aqui',
  options = [],
  allowMultiple = false,
  showImages = false,
  maxSelections = 1,
  required = true,
  showProgress = true,
  showBackButton = true,
  isSelected,
  onClick,
  onPropertyChange
}) => {
  const handleOptionSelect = (optionId: string) => {
    console.log('Option selected:', optionId);
    // Handle option selection logic
  };

  return (
    <Card 
      className={`w-full ${isSelected ? 'ring-2 ring-primary' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle>{question}</CardTitle>
        {allowMultiple && (
          <Badge variant="secondary">
            Múltipla escolha {maxSelections > 1 ? `(máx: ${maxSelections})` : ''}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className="w-full justify-start text-left h-auto p-4"
              onClick={() => handleOptionSelect(option.id)}
            >
              <div className="flex items-center gap-3">
                {showImages && option.imageUrl && (
                  <img 
                    src={option.imageUrl} 
                    alt={option.text}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <span>{option.text}</span>
              </div>
            </Button>
          ))}
        </div>
        
        {showProgress && (
          <div className="mt-4 text-sm text-muted-foreground">
            Progresso: 5/10 questões
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          {showBackButton && (
            <Button variant="outline">
              Voltar
            </Button>
          )}
          <Button>
            Próxima
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestionBlock;
