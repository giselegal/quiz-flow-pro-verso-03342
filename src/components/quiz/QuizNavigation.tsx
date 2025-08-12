// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Check, AlertTriangle } from 'lucide-react';

interface QuizNavigationProps {
  canProceed: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  currentQuestionType: 'normal' | 'strategic';
  selectedOptionsCount: number;
  isLastQuestion?: boolean;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  canProceed,
  onNext,
  onPrevious,
  currentQuestionType,
  selectedOptionsCount,
  isLastQuestion = false,
}) => {
  const [showActivationEffect, setShowActivationEffect] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  const shouldAutoAdvance = useCallback((): boolean => {
    if (!canProceed) {
      return false;
    }
    // Auto-avanço só para questões normais, não estratégicas
    const normalCondition = currentQuestionType === 'normal' && selectedOptionsCount === 3;
    return normalCondition;
  }, [canProceed, currentQuestionType, selectedOptionsCount]);

  useEffect(() => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (canProceed) {
      // Efeito de ativação se puder prosseguir (normal ou estratégico)
      setShowActivationEffect(true);
      const visualTimer = setTimeout(() => {
        setShowActivationEffect(false);
      }, 2000); // Duração do efeito visual

      // Auto-avanço apenas para questões normais
      if (currentQuestionType === 'normal' && shouldAutoAdvance()) {
        console.log('Configurando avanço automático em 45ms');
        const newTimer = setTimeout(() => {
          console.log('Executando avanço automático agora');
          onNext();
        }, 45); // Tempo para auto-avanço
        setAutoAdvanceTimer(newTimer);
      }

      return () => {
        clearTimeout(visualTimer);
        if (autoAdvanceTimer) {
          clearTimeout(autoAdvanceTimer);
        }
      };
    } else {
      // Se não puder prosseguir
      setShowActivationEffect(false);
    }
  }, [canProceed, onNext, shouldAutoAdvance, currentQuestionType]);

  const getHelperText = useCallback((): string => {
    if (!canProceed) {
      return currentQuestionType === 'strategic'
        ? 'Selecione 1 opção para continuar'
        : 'Selecione 3 opções para continuar';
    }
    return '';
  }, [canProceed, currentQuestionType]);

  const nextButtonText = 'Avançar';

  return (
    <div className="mt-6 w-full px-4 md:px-0">
      <div className="flex flex-col items-center w-full">
        {/* O helper text para questões estratégicas agora é exibido */}
        {!canProceed && <p className="text-sm text-[#8F7A6A] mb-3">{getHelperText()}</p>}

        <div className="flex justify-center items-center w-full gap-3">
          {onPrevious && (
            <Button
              variant="outline"
              onClick={onPrevious}
              className="text-[#8F7A6A] border-[#8F7A6A] hover:bg-[#F3E8E6]/50 hover:text-[#A38A69] py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:ring-opacity-50"
            >
              Voltar
            </Button>
          )}

          {/* Botão Avançar/Ver Resultado agora é exibido para todos os tipos de questão */}
          <Button
            onClick={onNext}
            disabled={!canProceed}
            variant="outline"
            className={`text-lg px-6 py-3 flex items-center transition-all duration-300 ease-in-out rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#b29670]
              ${
                canProceed
                  ? `bg-[#b29670] text-white hover:bg-[#a0845c] border-[#b29670] ${
                      showActivationEffect ? 'scale-105 shadow-lg' : '' // Aplicar efeito se showActivationEffect for true
                    }`
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
              }`}
            aria-label={nextButtonText}
            aria-disabled={!canProceed}
          >
            {nextButtonText}
            {isLastQuestion ? (
              <Check className="ml-2 h-5 w-5" />
            ) : (
              <ChevronRight className="ml-2 h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizNavigation;
