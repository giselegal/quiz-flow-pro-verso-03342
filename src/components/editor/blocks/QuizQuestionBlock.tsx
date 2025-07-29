
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EditableContent } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface QuizQuestionBlockProps {
  content?: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: Partial<EditableContent>) => void;
  onSelect?: () => void;
  className?: string;
}

export const QuizQuestionBlock: React.FC<QuizQuestionBlockProps> = ({
  content = {},
  isSelected = false,
  isEditing = false,
  onUpdate,
  onSelect,
  className
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const question = content?.question || 'Qual é sua pergunta?';
  const options = content?.options || [
    { id: '1', text: 'Opção 1', imageUrl: '' },
    { id: '2', text: 'Opção 2', imageUrl: '' },
    { id: '3', text: 'Opção 3', imageUrl: '' }
  ];

  const handleOptionSelect = (optionId: string) => {
    if (!isPreviewMode) return;
    
    if (content?.multipleSelection) {
      setSelectedOptions(prev => 
        prev.includes(optionId) 
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const progressPercent = content?.progressPercent || 0;
  const showImages = content?.showImages || false;
  const optionLayout = content?.optionLayout || 'vertical';

  return (
    <div
      className={cn(
        "relative p-6 rounded-lg transition-all duration-200",
        isSelected && "ring-2 ring-blue-400 ring-offset-2",
        "hover:bg-gray-50 cursor-pointer bg-white",
        className
      )}
      onClick={onSelect}
      style={{
        backgroundColor: content?.style?.backgroundColor,
        padding: content?.style?.padding,
        margin: content?.style?.margin
      }}
    >
      {/* Header com Logo e Progresso */}
      <div className="flex items-center justify-between mb-6">
        {content?.logoUrl && (
          <img 
            src={content.logoUrl} 
            alt="Logo" 
            className="h-8 w-auto"
          />
        )}
        
        {progressPercent > 0 && (
          <div className="flex-1 ml-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 mt-1">
              {progressPercent}% concluído
            </span>
          </div>
        )}
      </div>

      {/* Pergunta */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {question}
        </h2>
        
        {content?.multipleSelection && (
          <p className="text-sm text-gray-600">
            Selecione uma ou mais opções
          </p>
        )}
      </div>

      {/* Opções */}
      <div className={cn(
        "space-y-3",
        optionLayout === 'horizontal' && "flex flex-wrap gap-3",
        optionLayout === 'grid' && "grid grid-cols-2 gap-3"
      )}>
        {options.map((option: any) => (
          <div
            key={option.id}
            className={cn(
              "border-2 rounded-lg p-4 cursor-pointer transition-all duration-200",
              "hover:border-blue-300 hover:bg-blue-50",
              selectedOptions.includes(option.id) && isPreviewMode
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            )}
            onClick={() => handleOptionSelect(option.id)}
          >
            {showImages && option.imageUrl && (
              <img 
                src={option.imageUrl} 
                alt={option.text}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">
                {option.text}
              </span>
              
              {selectedOptions.includes(option.id) && isPreviewMode && (
                <Check className="h-5 w-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between mt-6">
        {content?.showBackButton && (
          <Button variant="outline">
            Voltar
          </Button>
        )}
        
        <Button 
          className="ml-auto"
          disabled={selectedOptions.length === 0 && isPreviewMode}
        >
          Próxima
        </Button>
      </div>

      {/* Controles de Preview */}
      {isSelected && (
        <div className="absolute -top-8 right-0 flex gap-2">
          <Button
            size="sm"
            variant={isPreviewMode ? "default" : "outline"}
            onClick={(e) => {
              e.stopPropagation();
              setIsPreviewMode(!isPreviewMode);
            }}
          >
            {isPreviewMode ? 'Sair do Preview' : 'Preview'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizQuestionBlock;
