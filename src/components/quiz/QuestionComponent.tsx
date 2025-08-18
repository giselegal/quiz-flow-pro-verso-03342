// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

interface QuestionProps {
  question: {
    id: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    isStrategic?: boolean;
  };
  onNext: () => void;
  onSelect: (optionIds: string[]) => void;
}

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const QuestionComponent: React.FC<QuestionProps> = ({ question, onNext, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const requiredSelections = question.isStrategic ? 1 : 3;

  // Reset selections when question changes
  useEffect(() => {
    setSelectedOptions([]);
  }, [question.id]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      // If the option is already selected, remove it
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      }

      // If already reached the limit of selections, show message and don't add
      if (prev.length >= requiredSelections) {
        toast({
          title: 'Limite de seleções atingido',
          description: `Você só pode selecionar ${requiredSelections} ${requiredSelections === 1 ? 'opção' : 'opções'}`,
          variant: 'destructive',
        });
        return prev;
      }

      // Add the new selection
      const newSelections = [...prev, optionId];

      // Call onSelect to propagate the change up
      onSelect(newSelections);

      // If completed the required selections, show success message
      if (newSelections.length === requiredSelections) {
        toast({
          title: 'Seleções completas!',
          description: 'Agora você pode avançar para a próxima questão',
        });
      }

      return newSelections;
    });
  };

  const handleNext = () => {
    if (selectedOptions.length !== requiredSelections) {
      toast({
        title: 'Seleção incompleta',
        description: `Por favor, selecione ${requiredSelections} ${requiredSelections === 1 ? 'opção' : 'opções'} antes de avançar`,
        variant: 'destructive',
      });
      return;
    }

    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-[#432818]">{question.text}</h2>

      <div className="space-y-3">
        {question.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleOptionSelect(option.id)}
            disabled={
              selectedOptions.length >= requiredSelections && !selectedOptions.includes(option.id)
            }
            className={`w-full p-4 text-left rounded-lg border transition-all ${
              selectedOptions.includes(option.id)
                ? 'border-[#B89B7A] bg-[#FAF9F7] text-[#432818]'
                : selectedOptions.length >= requiredSelections
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-200 hover:border-[#B89B7A] text-[#8F7A6A]'
            }`}
          >
            {option.text}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-[#8F7A6A]">
          <p>
            Selecionadas: {selectedOptions.length} de {requiredSelections}
          </p>
          <p className="text-xs mt-1">
            {requiredSelections - selectedOptions.length > 0
              ? `Faltam ${requiredSelections - selectedOptions.length} ${requiredSelections - selectedOptions.length === 1 ? 'opção' : 'opções'}`
              : 'Todas as opções necessárias foram selecionadas'}
          </p>
        </div>

        <Button
          onClick={handleNext}
          disabled={selectedOptions.length !== requiredSelections}
          className={`px-6 py-2 ${
            selectedOptions.length === requiredSelections
              ? 'bg-[#B89B7A] hover:bg-[#A38A69] text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Avançar
        </Button>
      </div>
    </div>
  );
};

export default QuestionComponent;
