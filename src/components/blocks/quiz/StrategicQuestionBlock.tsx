// @ts-nocheck
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * StrategicQuestionBlock - Componente para questões estratégicas (Etapas 13-18)
 *
 * Props editáveis via editor visual:
 * - question: string - Pergunta estratégica
 * - description: string - Descrição adicional
 * - options: string[] - Opções de resposta
 * - singleSelection: boolean - Seleção única (padrão para estratégicas)
 * - category: string - Categoria da questão
 * - placeholder: string - Placeholder para resposta livre
 * - allowFreeText: boolean - Permitir resposta livre
 * - onAnswer: function - Callback de resposta
 *
 * @example
 * <StrategicQuestionBlock
 *   blockId="strategic-1"
 *   question="Como você gostaria de se sentir ao se vestir?"
 *   options={[
 *     'Confiante e poderosa',
 *     'Feminina e delicada',
 *     'Confortável e prática'
 *   ]}
 *   category="motivation"
 *   onAnswer={(answer) => console.log('Resposta:', answer)}
 * />
 */

export interface StrategicQuestionBlockProps {
  // Identificação
  blockId: string;
  className?: string;
  style?: React.CSSProperties;

  // Conteúdo editável
  question: string;
  description?: string;
  options?: string[];
  category?: string;
  placeholder?: string;

  // Configurações
  singleSelection?: boolean;
  allowFreeText?: boolean;
  required?: boolean;

  // Visual
  backgroundColor?: string;
  textColor?: string;
  optionStyle?: 'cards' | 'buttons' | 'list';
  alignment?: 'left' | 'center' | 'right';

  // Funcionalidade
  onAnswer?: (answer: string | string[]) => void;
  selectedAnswer?: string | string[];
  disabled?: boolean;
  onClick?: () => void;
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

const StrategicQuestionBlock: React.FC<StrategicQuestionBlockProps> = ({
  blockId = 'strategic-question-block',
  className = '',
  style = {},

  question = 'Como você gostaria de se sentir ao se vestir?',
  description,
  options = [
    'Confiante e poderosa',
    'Feminina e delicada',
    'Confortável e prática',
    'Elegante e sofisticada',
  ],
  category = 'motivation',
  placeholder = 'Digite sua resposta...',

  singleSelection = true,
  allowFreeText = false,
  required = true,

  backgroundColor = '#ffffff',
  textColor = '#432818',
  optionStyle = 'cards',
  alignment = 'center',

  onAnswer,
  selectedAnswer = '',
  disabled = false,
  onClick,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>(selectedAnswer);
  const [freeTextAnswer, setFreeTextAnswer] = useState('');
  const [showFreeText, setShowFreeText] = useState(false);

  const handleOptionSelect = (option: string) => {
    if (disabled) return;

    let newAnswer: string | string[];

    if (singleSelection) {
      newAnswer = option;
      setCurrentAnswer(option);
    } else {
      const currentArray = Array.isArray(currentAnswer) ? currentAnswer : [];
      if (currentArray.includes(option)) {
        newAnswer = currentArray.filter(a => a !== option);
      } else {
        newAnswer = [...currentArray, option];
      }
      setCurrentAnswer(newAnswer);
    }

    if (onAnswer) {
      onAnswer(newAnswer);
    }
  };

  const handleFreeTextSubmit = () => {
    if (freeTextAnswer.trim()) {
      const answer = freeTextAnswer.trim();
      setCurrentAnswer(answer);
      if (onAnswer) {
        onAnswer(answer);
      }
    }
  };

  const isSelected = (option: string) => {
    if (singleSelection) {
      return currentAnswer === option;
    }
    return Array.isArray(currentAnswer) && currentAnswer.includes(option);
  };

  const getOptionClasses = (option: string) => {
    const baseClasses = 'w-full p-4 rounded-lg transition-all duration-200 border-2 cursor-pointer';

    if (optionStyle === 'cards') {
      return `${baseClasses} ${
        isSelected(option)
          ? 'bg-[#B89B7A] text-white border-[#B89B7A] shadow-lg'
          : 'bg-white text-gray-700 border-gray-300 hover:border-[#B89B7A] hover:shadow-md'
      }`;
    }

    if (optionStyle === 'buttons') {
      return `${baseClasses} ${
        isSelected(option)
          ? 'bg-[#B89B7A] text-white border-[#B89B7A]'
          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
      }`;
    }

    // list style
    return `${baseClasses} ${
      isSelected(option)
        ? 'bg-[#B89B7A]/10 border-[#B89B7A]/40 text-[#432818]'
        : 'bg-white border-gray-200 hover:bg-gray-50'
    }`;
  };

  return (
    <div
      className={`strategic-question-block py-12 px-6 ${className}`}
      data-block-id={blockId}
      style={{
        backgroundColor,
        color: textColor,
        textAlign: alignment,
        ...style,
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Categoria */}
        {category && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#B89B7A]/20 text-[#432818] text-sm font-medium rounded-full">
              Questão Estratégica: {category}
            </span>
          </div>
        )}

        {/* Pergunta */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-6"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: textColor,
          }}
        >
          {question}
        </h2>

        {/* Descrição */}
        {description && <p style={{ color: '#6B4F43' }}>{description}</p>}

        {/* Opções */}
        <div className="space-y-4 mb-8">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              disabled={disabled}
              className={getOptionClasses(option)}
            >
              <div className="flex items-center justify-between">
                <span className="text-left font-medium">{option}</span>
                {isSelected(option) && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#B89B7A] rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Resposta livre */}
        {allowFreeText && (
          <div className="border-t pt-6">
            {!showFreeText ? (
              <Button
                onClick={() => setShowFreeText(true)}
                variant="outline"
                className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
              >
                Ou escreva sua própria resposta
              </Button>
            ) : (
              <div className="space-y-4">
                <div
                  style={{ borderColor: '#E5DDD5' }}
                  onClick={onClick}
                  title="Configure a área de texto no Painel de Propriedades"
                >
                  {freeTextAnswer || placeholder || 'Área de texto configurável'}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleFreeTextSubmit}
                    disabled={!freeTextAnswer.trim() || disabled}
                    className="bg-[#B89B7A] hover:bg-[#a68a6d] text-white"
                  >
                    Confirmar Resposta
                  </Button>
                  <Button onClick={() => setShowFreeText(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informação adicional */}
        <div style={{ color: '#8B7355' }}>
          <p>💭 Esta pergunta nos ajuda a personalizar ainda mais seu resultado</p>
        </div>
      </div>
    </div>
  );
};

export default StrategicQuestionBlock;
