// @ts-nocheck
import QuizQuestion from '@/components/funnel-blocks/QuizQuestion';
import React, { useState } from 'react';
import { QuizBlockProps } from './types';

/**
 * QuizMultipleChoiceBlock - Componente de escolha múltipla para quiz
 *
 * Utiliza o componente base QuizQuestion para renderizar uma pergunta de múltipla escolha
 * permitindo configurar tipo de seleção (única ou múltipla), validação e aparência.
 */
export interface QuizMultipleChoiceBlockProps extends QuizBlockProps {
  properties: {
    question: string;
    explanation?: string;
    options: string;
    optionType?: 'radio' | 'checkbox';
    requireSelection?: boolean;
    autoAdvance?: boolean;
    autoAdvanceDelay?: number;
    showFeedback?: boolean;
    feedbackDelay?: number;
    correctAnswers?: string;
    randomizeOptions?: boolean;
    useLetterOptions?: boolean;
    optionStyle?: 'default' | 'buttons' | 'cards' | 'minimal';
    showOptionImages?: boolean;
    alignment?: 'left' | 'center' | 'right';
    nextButtonText?: string;
  };
  deviceView?: 'mobile' | 'tablet' | 'desktop';
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

const QuizMultipleChoiceBlock: React.FC<QuizMultipleChoiceBlockProps> = ({
  properties,
  id,
  onPropertyChange,
  ...props
}) => {
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  // Extrair as opções do formato texto para array de objetos
  const parseOptions = (optionsText: string) => {
    return optionsText
      .split('\n')
      .filter(line => line.trim() !== '')
      .map((line, index) => ({
        id: `option-${index}`,
        text: line.trim(),
        value: `option-${index}`,
        imageUrl: '',
      }));
  };

  // Calcular as respostas corretas a partir da string de índices
  const parseCorrectAnswers = (answersStr: string) => {
    try {
      // Aceita formatos como "0,1,2" ou "0 1 2" ou "0;1;2"
      const indices = answersStr
        .split(/[,;\s]+/)
        .map(s => parseInt(s.trim()))
        .filter(n => !isNaN(n));

      return indices;
    } catch (error) {
      console.error('Error parsing correct answers:', error);
      return [0]; // Retorna a primeira opção como correta por padrão
    }
  };

  const options = parseOptions(properties?.options || '');
  const isMultipleSelection = properties?.optionType === 'checkbox';
  const correctAnswers = parseCorrectAnswers(properties?.correctAnswers || '0');

  // Callbacks para interações do usuário
  const handleAnswer = (selectedOptions: any[]) => {
    setSelectedOptions(selectedOptions);

    // Verificar se as respostas estão corretas
    const selectedIds = selectedOptions.map(opt => parseInt(opt.id.split('-')[1]));
    const correctCount = selectedIds.filter(id => correctAnswers.includes(id)).length;
    const allCorrect =
      correctCount === correctAnswers.length && selectedIds.length === correctAnswers.length;

    // Notificar o editor que uma seleção foi feita
    if (onPropertyChange) {
      onPropertyChange(
        'selectedOptions',
        selectedOptions.map(opt => opt.id)
      );
      onPropertyChange('correctAnswersSelected', allCorrect);
      onPropertyChange('partiallyCorrect', correctCount > 0 && !allCorrect);
    }
  };

  const handleNext = () => {
    // Notificar o editor que o usuário quer avançar
    if (onPropertyChange) {
      onPropertyChange('complete', true);
      onPropertyChange(
        'selectedOptions',
        selectedOptions.map(opt => opt.id)
      );
    }
  };

  // Converter as propriedades do painel para as props do QuizQuestion
  const optionStyleMap: Record<string, any> = {
    default: 'radio',
    buttons: 'button',
    cards: 'card',
    minimal: 'radio',
  };

  return (
    <div className="quiz-multiple-choice-block" data-block-id={id}>
      <QuizQuestion
        question={properties?.question || ''}
        description={properties?.explanation || ''}
        options={options}
        multipleSelection={isMultipleSelection}
        minSelections={1}
        maxSelections={isMultipleSelection ? options.length : 1}
        required={properties?.requireSelection !== false}
        alignment={properties?.alignment || 'center'}
        optionLayout="vertical"
        optionStyle={optionStyleMap[properties?.optionStyle || 'default']}
        showLetters={properties?.useLetterOptions === true}
        autoAdvance={properties?.autoAdvance === true}
        autoAdvanceDelay={properties?.autoAdvanceDelay || 1000}
        showNextButton={true}
        nextButtonText={properties?.nextButtonText || 'Avançar'}
        onAnswer={handleAnswer}
        onNext={handleNext}
        deviceView={props.deviceView || 'desktop'}
      />
    </div>
  );
};

export default QuizMultipleChoiceBlock;
