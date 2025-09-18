import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { AnimatedWrapper } from '@/components/ui/animated-wrapper';
import { DeviceView, StyleProps, QuestionOption } from './types';

interface StrategicQuestionProps extends StyleProps {
  /** Pergunta estratégica */
  question: string;
  /** Número da questão estratégica */
  questionNumber?: number;
  /** Total de questões estratégicas */
  totalStrategicQuestions?: number;
  /** Opções de resposta */
  options: QuestionOption[];
  /** Seleção obrigatória (sempre única para estratégicas) */
  required?: boolean;
  /** Configuração de animações */
  animationConfig?: {
    disabled?: boolean;
    duration?: number;
    staggerDelay?: number;
  };
  /** Configuração de viewport */
  deviceView?: DeviceView;
  /** Callback para resposta */
  onAnswer: (answer: QuestionOption) => void;
  /** Callback para navegação */
  onNext?: () => void;
  onPrevious?: () => void;
  /** Mostrar navegação */
  showNavigation?: boolean;
}

/**
 * StrategicQuestion - Componente para questões estratégicas do funil
 * Questões mais profundas e reflexivas com design especial
 */
export const StrategicQuestion: React.FC<StrategicQuestionProps> = ({
  question,
  questionNumber,
  totalStrategicQuestions = 6,
  options,
  required = true,
  animationConfig = {},
  deviceView = 'desktop',
  onAnswer,
  onNext,
  onPrevious,
  showNavigation = true,
  className,
  style,
  customStyles,
}) => {
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(null);
  const { disabled: animationsDisabled, duration = 400, staggerDelay = 100 } = animationConfig;
  const isLowPerformance = deviceView === 'mobile';

  const handleOptionSelect = (option: QuestionOption) => {
    setSelectedOption(option);
    onAnswer(option);
  };

  const canProceed = !required || selectedOption !== null;

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-[#fffbf7] to-[#f9f4ef] ${className || ''}`}
      style={style}
    >
      {customStyles && <style dangerouslySetInnerHTML={{ __html: customStyles }} />}

      <div className="max-w-3xl mx-auto w-full">
        <AnimatedWrapper
          animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
          show={true}
          duration={duration}
        >
          <Card className="p-6 md:p-8 bg-white shadow-lg border border-[#B89B7A]/20">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Progress indicator */}
              {questionNumber && (
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Heart className="w-5 h-5 text-[#B89B7A]" />
                    <span className="text-sm text-[#8B7355] font-medium">
                      Questão Estratégica {questionNumber} de {totalStrategicQuestions}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full max-w-md mx-auto bg-[#F3E8E6] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(questionNumber / totalStrategicQuestions) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Question */}
              <h1 className="text-xl md:text-2xl font-playfair text-[#432818] leading-relaxed mb-2">
                {question}
              </h1>

              {/* Strategic note */}
              <p className="text-sm text-[#8B7355] italic">
                Responda com sinceridade para obter o melhor resultado
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-8">
              {options.map((option, index) => (
                <AnimatedWrapper
                  key={option.id}
                  animation={animationsDisabled || isLowPerformance ? 'none' : 'fade'}
                  show={true}
                  duration={duration}
                  delay={staggerDelay * index}
                >
                  <Card
                    className={`p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-md ${
                      selectedOption?.id === option.id
                        ? 'border-[#B89B7A] bg-gradient-to-r from-[#f9f4ef] to-white shadow-md'
                        : 'border-gray-200 hover:border-[#B89B7A]/50'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Selection indicator */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                          selectedOption?.id === option.id
                            ? 'border-[#B89B7A] bg-[#B89B7A]'
                            : 'border-gray-300'
                        }`}
                      >
                        {selectedOption?.id === option.id && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>

                      {/* Option text */}
                      <div className="flex-1">
                        <p
                          className={`text-[#432818] leading-relaxed ${
                            selectedOption?.id === option.id ? 'font-medium' : ''
                          }`}
                        >
                          {option.text}
                        </p>
                      </div>
                    </div>
                  </Card>
                </AnimatedWrapper>
              ))}
            </div>

            {/* Navigation */}
            {showNavigation && (
              <div className="flex justify-between items-center pt-6 border-t border-[#B89B7A]/20">
                {onPrevious ? (
                  <Button
                    variant="outline"
                    onClick={onPrevious}
                    className="border-[#B89B7A] text-[#432818] hover:bg-[#f9f4ef]"
                  >
                    Anterior
                  </Button>
                ) : (
                  <div></div>
                )}

                {onNext && (
                  <Button
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                      canProceed
                        ? 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] text-white hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      Próxima
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                )}
              </div>
            )}

            {/* Help text */}
            {required && !selectedOption && (
              <div className="text-center mt-4">
                <p className="text-xs text-[#8B7355]">Selecione uma opção para continuar</p>
              </div>
            )}
          </Card>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default StrategicQuestion;
