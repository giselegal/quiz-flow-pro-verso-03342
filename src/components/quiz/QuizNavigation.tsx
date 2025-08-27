// @ts-nocheck
/**
 * 🚀 QUIZ NAVIGATION - Navegação Premium para as 21 Etapas em Produção
 *
 * Sistema de navegação avançado baseado no header do editor,
 * adaptado para a experiência do usuário final durante o quiz.
 */

import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Save,
  Sparkles,
  User,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

interface QuizNavigationProps {
  canProceed: boolean;
  onNext: () => void;
  onPrevious?: () => void;
  currentQuestionType: 'normal' | 'strategic' | 'final';
  selectedOptionsCount: number;
  isLastQuestion?: boolean;
  // Novas props para navegação premium
  currentStep?: number;
  totalSteps?: number;
  stepName?: string;
  onSave?: () => void;
  showUserInfo?: boolean;
  userName?: string;
  sessionId?: string;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  canProceed,
  onNext,
  onPrevious,
  currentQuestionType,
  selectedOptionsCount,
  isLastQuestion = false,
  // Props premium
  currentStep = 1,
  totalSteps = 21,
  stepName = 'Descobrindo seu estilo',
  onSave,
  showUserInfo = false,
  userName,
  sessionId,
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

  // 🚀 FUNÇÕES PREMIUM PARA NAVEGAÇÃO AVANÇADA
  const progressPercentage = (currentStep / totalSteps) * 100;

  const getStepCategory = (step: number) => {
    if (step === 1) return 'Introdução';
    if (step >= 2 && step <= 14) return 'Descoberta';
    if (step === 15) return 'Processamento';
    if (step >= 16 && step <= 19) return 'Resultado';
    if (step === 20) return 'Captura';
    if (step === 21) return 'Oferta';
    return 'Quiz';
  };

  const getCategoryColor = (step: number) => {
    if (step === 1) return 'bg-[#B89B7A]'; // Introdução - cor principal da marca
    if (step >= 2 && step <= 14) return 'bg-[#8B6F47]'; // Descoberta - tom médio da paleta
    if (step === 15) return 'bg-[#A67C52]'; // Processamento - variação da marca
    if (step >= 16 && step <= 19) return 'bg-[#7A5A3A]'; // Resultado - tom escuro da paleta
    if (step === 20) return 'bg-[#432818]'; // Captura - cor secundária da marca
    if (step === 21) return 'bg-[#D4C4A8]'; // Oferta - tom claro da paleta
    return 'bg-[#B89B7A]'; // Padrão - cor principal da marca
  };

  const nextButtonText = 'Avançar';

  return (
    <>
      {/* 🚀 NAVEGAÇÃO PREMIUM - Header Superior */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b shadow-sm">
        {/* Header Principal */}
        <div className="border-b bg-gradient-to-r from-[#FAF9F7] to-white">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo e Info do Quiz */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#B89B7A] rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-[#432818]">
                      Quiz de Descoberta de Estilo
                    </h1>
                    <div className="flex items-center space-x-2 text-sm text-[#6B4F43]">
                      <span>Gisele Galvão</span>
                      <span>•</span>
                      <span>8 Estilos Únicos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info do Usuário */}
              {showUserInfo && userName && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {userName}
                  </Badge>
                  {sessionId && (
                    <Badge variant="outline" className="text-xs">
                      {sessionId.slice(0, 8)}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navegação e Progresso */}
        <Card className="border-0 rounded-none">
          <CardContent className="py-4">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-4">
                {/* Navegação Anterior */}
                <div className="flex items-center gap-2">
                  {onPrevious && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onPrevious}
                      className="gap-2"
                      aria-label="Voltar para a etapa anterior"
                      type="button"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                  )}
                </div>

                {/* Informações da Etapa */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 ${getCategoryColor(currentStep)} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {currentStep}
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getStepCategory(currentStep)}
                        </Badge>
                        <span className="text-sm font-medium text-gray-700">{stepName}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Etapa {currentStep} de {totalSteps}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  {onSave && (
                    <Button variant="outline" size="sm" onClick={onSave} className="gap-2">
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  )}

                  <Button
                    size="sm"
                    onClick={onNext}
                    disabled={!canProceed}
                    className={`gap-2 transition-all duration-300 ${
                      canProceed
                        ? 'bg-[#B89B7A] hover:bg-[#A68A6E] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } ${showActivationEffect ? 'scale-105 shadow-lg' : ''}`}
                    aria-label={
                      currentStep === totalSteps ? 'Finalizar quiz' : 'Ir para a próxima etapa'
                    }
                    type="button"
                    onKeyDown={e => {
                      if (!canProceed) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onNext();
                      }
                    }}
                  >
                    {currentStep === totalSteps ? 'Finalizar' : 'Próxima'}
                    {isLastQuestion ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progresso do Quiz</span>
                  <span className="text-sm font-medium text-[#B89B7A]">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-2 bg-gray-200"
                  aria-label="Progresso do Quiz"
                />
              </div>

              {/* Helper Text */}
              {!canProceed && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-[#8F7A6A] flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {getHelperText()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default QuizNavigation;
