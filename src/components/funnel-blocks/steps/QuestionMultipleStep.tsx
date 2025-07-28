import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { FunnelStepProps } from '@/types/funnel';
import { Button } from '@/components/ui/button';
import QuizOption from '../shared/QuizOption';
import FunnelProgressBar from '../shared/FunnelProgressBar';

/**
 * QuestionMultipleStep - Etapa 4-14: Perguntas de múltipla escolha
 * 
 * Este componente reutilizável representa uma pergunta de quiz
 * com opções de múltipla escolha, suportando imagens e categorização.
 */
export const QuestionMultipleStep: React.FC<FunnelStepProps> = ({
  id,
  className = '',
  isEditable = false,
  onNext,
  onPrevious,
  stepNumber,
  totalSteps,
  data = {},
  onEdit
}) => {
  const {
    question = 'Qual opção mais combina com você?',
    imageUrl,
    options = [
      { id: '1', text: 'Opção 1', value: 'op1' },
      { id: '2', text: 'Opção 2', value: 'op2' },
      { id: '3', text: 'Opção 3', value: 'op3' },
    ],
    multiSelect = false,
    maxSelections = 1,
    buttonText = 'Próxima pergunta',
    prevButtonText = 'Voltar',
    backgroundColor = 'bg-white',
    showProgress = true
  } = data;
  
  // Estado para seleções
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Função para selecionar opções
  const handleSelect = (optionId: string) => {
    if (isEditable) return;
    
    setSelectedOptions(prev => {
      if (multiSelect) {
        // Caso seja seleção múltipla
        if (prev.includes(optionId)) {
          // Remover se já selecionado
          return prev.filter(id => id !== optionId);
        } else {
          // Adicionar se não exceder limite
          if (prev.length < maxSelections) {
            return [...prev, optionId];
          }
          return prev;
        }
      } else {
        // Caso seja seleção única
        return [optionId];
      }
    });
  };
  
  // Verificar se pode avançar
  const canContinue = selectedOptions.length > 0;
  
  // Função para avançar
  const handleNext = () => {
    if (!isEditable && canContinue && onNext) {
      onNext();
      // Reset seleções para próxima pergunta
      setSelectedOptions([]);
    }
  };

  return (
    <div 
      className={cn(
        "relative rounded-xl shadow-md p-6",
        backgroundColor,
        className
      )}
      onClick={isEditable ? onEdit : undefined}
      data-funnel-step-id={id}
    >
      {showProgress && (
        <FunnelProgressBar 
          currentStep={stepNumber} 
          totalSteps={totalSteps} 
          className="mb-6"
        />
      )}
      
      <div className="max-w-3xl mx-auto">
        {/* Questão principal */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {question}
          </h2>
          
          {/* Imagem opcional */}
          {imageUrl && (
            <div className="mt-4 flex justify-center">
              <img 
                src={imageUrl} 
                alt="" 
                className="max-h-64 object-contain rounded-lg"
              />
            </div>
          )}
        </div>
        
        {/* Opções de resposta */}
        <div className="grid gap-3 mb-8">
          {options.map((option) => (
            <QuizOption
              key={option.id}
              option={option}
              isSelected={selectedOptions.includes(option.id)}
              onSelect={() => handleSelect(option.id)}
              multiSelect={multiSelect}
              disabled={isEditable}
            />
          ))}
        </div>
        
        {/* Navegação */}
        <div className="flex justify-between mt-8">
          {onPrevious && (
            <Button 
              variant="outline"
              onClick={isEditable ? undefined : onPrevious}
              disabled={isEditable}
            >
              {prevButtonText}
            </Button>
          )}
          
          <div className={cn(
            "flex-1",
            onPrevious ? "ml-4" : ""
          )}>
            <Button
              onClick={handleNext}
              disabled={!canContinue || isEditable}
              className="w-full"
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Indicador de edição */}
      {isEditable && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Editar
        </div>
      )}
    </div>
  );
};

export default QuestionMultipleStep;
