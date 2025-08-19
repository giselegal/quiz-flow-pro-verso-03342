/**
 * 🧭 NAVEGAÇÃO DAS ETAPAS DO QUIZ
 * 
 * QuizStepsNavigation.tsx - Sistema de navegação seguindo o padrão do QuizNavigationBlock
 * Interface limpa e profissional para navegação entre as 21 etapas
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import React, { useMemo } from 'react';

interface QuizStepsConfig {
  mode: 'editor' | 'preview' | 'production';
  quizState: {
    currentStep: number;
    totalSteps: number;
    sessionData: Record<string, any>;
    stepValidation: Record<number, boolean>;
  };
  navigation: {
    onNext: () => void;
    onPrevious: () => void;
    onStepJump: (step: number) => void;
    canGoNext: boolean;
    canGoBack: boolean;
  };
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

interface QuizStepsNavigationProps {
  config: QuizStepsConfig;
  className?: string;
  variant?: 'full' | 'minimal' | 'stepper';
}

export const QuizStepsNavigation: React.FC<QuizStepsNavigationProps> = ({
  config,
  className,
  variant = 'full',
}) => {
  const { quizState, navigation, theme, mode } = config;

  // ========================================
  // Cálculos de Progresso
  // ========================================
  const progressData = useMemo(() => {
    const percentage = (quizState.currentStep / quizState.totalSteps) * 100;
    const completedSteps = Object.keys(quizState.stepValidation).filter(
      step => quizState.stepValidation[parseInt(step)]
    ).length;

    return {
      percentage: Math.round(percentage),
      completedSteps,
      remainingSteps: quizState.totalSteps - quizState.currentStep,
    };
  }, [quizState.currentStep, quizState.totalSteps, quizState.stepValidation]);

  // ========================================
  // Informações da Etapa Atual
  // ========================================
  const stepInfo = useMemo(() => {
    const stepType = getStepType(quizState.currentStep);
    const stepTitle = getStepTitle(quizState.currentStep);

    return {
      type: stepType,
      title: stepTitle,
      description: getStepDescription(quizState.currentStep),
      isTransition: [12, 19].includes(quizState.currentStep),
      isResult: [20, 21].includes(quizState.currentStep),
    };
  }, [quizState.currentStep]);

  // ========================================
  // Handlers
  // ========================================
  const handleRestart = () => {
    navigation.onStepJump(1);
  };

  // ========================================
  // Renderização Condicional por Variante
  // ========================================
  if (variant === 'minimal') {
    return (
      <div
        className={cn('quiz-steps-minimal flex items-center justify-between p-4', className)}
      >
        <div className="flex items-center gap-2">
          <Badge variant="outline" style={{ borderColor: theme.primaryColor }}>
            {quizState.currentStep}/{quizState.totalSteps}
          </Badge>
          <span className="text-sm text-gray-600">{stepInfo.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {navigation.canGoBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigation.onPrevious}
              disabled={!navigation.canGoBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <Button
            size="sm"
            onClick={navigation.onNext}
            disabled={!navigation.canGoNext}
            style={{ backgroundColor: theme.primaryColor }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'stepper') {
    return (
      <div className={cn('quiz-steps-stepper p-4', className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: theme.textColor }}>
            {stepInfo.title}
          </h3>

          <Badge style={{ backgroundColor: theme.primaryColor, color: 'white' }}>
            Etapa {quizState.currentStep}
          </Badge>
        </div>

        <Progress
          value={progressData.percentage}
          className="mb-4"
          style={
            {
              '--progress-foreground': theme.primaryColor,
            } as React.CSSProperties
          }
        />

        <div className="text-xs text-gray-500 text-center">
          {progressData.completedSteps} de {quizState.totalSteps} etapas concluídas
        </div>
      </div>
    );
  }

  // ========================================
  // Variante Completa (Default)
  // ========================================
  return (
    <div
      className={cn(
        'quiz-steps-full bg-white border-b shadow-sm',
        mode === 'editor' && 'bg-gray-50',
        className
      )}
    >
      <div className="container mx-auto px-4 py-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          {/* Informações da Etapa */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant={stepInfo.isResult ? 'default' : 'outline'}
                style={{
                  backgroundColor: stepInfo.isResult ? theme.primaryColor : 'transparent',
                  borderColor: theme.primaryColor,
                  color: stepInfo.isResult ? 'white' : theme.primaryColor,
                }}
              >
                {stepInfo.type}
              </Badge>

              <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                {stepInfo.title}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {mode !== 'production' && (
              <Button variant="ghost" size="sm" onClick={handleRestart} className="text-gray-600">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            )}
          </div>
        </div>

        {/* Progress Row */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span style={{ color: theme.textColor }}>
              Etapa {quizState.currentStep} de {quizState.totalSteps}
            </span>
            <span className="text-gray-500">{progressData.percentage}% concluído</span>
          </div>

          <Progress
            value={progressData.percentage}
            className="h-2"
            style={
              {
                '--progress-foreground': theme.primaryColor,
              } as React.CSSProperties
            }
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-3">
          <Button
            variant="outline"
            onClick={navigation.onPrevious}
            disabled={!navigation.canGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            {stepInfo.description && (
              <span className="text-xs text-gray-500 max-w-md text-center">
                {stepInfo.description}
              </span>
            )}
          </div>

          <Button
            onClick={navigation.onNext}
            disabled={!navigation.canGoNext}
            style={{ backgroundColor: navigation.canGoNext ? theme.primaryColor : undefined }}
            className="flex items-center gap-2"
          >
            {stepInfo.isResult ? 'Finalizar' : 'Próximo'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ========================================
// Funções Helper - Exatamente como no QuizNavigationBlock
// ========================================
function getStepType(step: number): string {
  if (step === 1) return 'Início';
  if (step >= 2 && step <= 11) return 'Questões';
  if (step === 12) return 'Transição';
  if (step >= 13 && step <= 18) return 'Estratégicas';
  if (step === 19) return 'Análise';
  if (step === 20) return 'Resultado';
  if (step === 21) return 'Oferta';
  return 'Desconhecido';
}

function getStepTitle(step: number): string {
  const titles: Record<number, string> = {
    1: 'Bem-vinda',
    2: 'Roupa Favorita',
    3: 'Personalidade',
    4: 'Visual',
    5: 'Detalhes',
    6: 'Estampas',
    7: 'Casaco',
    8: 'Calça',
    9: 'Sapatos',
    10: 'Acessórios',
    11: 'Tecidos',
    12: 'Preparando...',
    13: 'Autoavaliação',
    14: 'Desafios',
    15: 'Frequência',
    16: 'Investimento',
    17: 'Preço',
    18: 'Objetivos',
    19: 'Calculando...',
    20: 'Seu Estilo',
    21: 'Oferta Especial',
  };
  return titles[step] || `Etapa ${step}`;
}

function getStepDescription(step: number): string {
  if (step === 1) return 'Vamos começar coletando algumas informações básicas';
  if (step >= 2 && step <= 11) return 'Responda com honestidade para um resultado preciso';
  if (step === 12) return 'Agora vamos fazer algumas perguntas estratégicas';
  if (step >= 13 && step <= 18) return 'Estas perguntas nos ajudam a personalizar sua experiência';
  if (step === 19) return 'Estamos processando suas respostas...';
  if (step === 20) return 'Seu resultado personalizado está pronto!';
  if (step === 21) return 'Uma oferta especial para transformar seu estilo';
  return '';
}

export default QuizStepsNavigation;
