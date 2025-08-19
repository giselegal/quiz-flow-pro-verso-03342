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
    const stepRequirements = getStepRequirements(quizState.currentStep);
    const stepCategory = getStepCategory(quizState.currentStep);

    return {
      type: stepType,
      title: stepTitle,
      description: getStepDescription(quizState.currentStep),
      requirements: stepRequirements,
      category: stepCategory,
      isTransition: [12, 19].includes(quizState.currentStep),
      isResult: [20, 21].includes(quizState.currentStep),
      isStrategic: quizState.currentStep >= 13 && quizState.currentStep <= 18,
      isMainQuiz: quizState.currentStep >= 2 && quizState.currentStep <= 11,
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
      <div className={cn('quiz-steps-minimal flex items-center justify-between p-4', className)}>
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

              <Badge
                variant="secondary"
                className="text-xs"
              >
                {stepInfo.category}
              </Badge>

              <span className="text-sm font-medium" style={{ color: theme.textColor }}>
                {stepInfo.title}
              </span>
            </div>
          </div>

          {/* Actions & Requirements */}
          <div className="flex items-center gap-2">
            {/* Informações de Requisitos */}
            {stepInfo.requirements.selections > 1 && (
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {stepInfo.requirements.selections} seleções
              </div>
            )}

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

          {/* Descrição da Etapa */}
          {stepInfo.description && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {stepInfo.description}
            </div>
          )}

          <Progress
            value={progressData.percentage}
            className="h-2"
            style={
              {
                '--progress-foreground': theme.primaryColor,
              } as React.CSSProperties
            }
          />

          {/* Indicadores Adicionais */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {stepInfo.isMainQuiz 
                ? `Questão ${quizState.currentStep - 1} de 10`
                : stepInfo.isStrategic 
                ? `Estratégica ${quizState.currentStep - 12} de 6`
                : stepInfo.category
              }
            </span>
            <span>
              {progressData.completedSteps} etapas concluídas
            </span>
          </div>
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
            {/* Tipo de Requisito */}
            {stepInfo.requirements.type !== 'unknown' && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {stepInfo.requirements.type === 'multiple-choice' ? 'Múltipla escolha' :
                 stepInfo.requirements.type === 'single-choice' ? 'Escolha única' :
                 stepInfo.requirements.type === 'text-input' ? 'Campo de texto' :
                 stepInfo.requirements.type === 'transition' ? 'Transição' :
                 stepInfo.requirements.type === 'result-offer' ? 'Resultado' :
                 stepInfo.requirements.type}
              </span>
            )}
          </div>

          <Button
            onClick={navigation.onNext}
            disabled={!navigation.canGoNext}
            style={{ backgroundColor: navigation.canGoNext ? theme.primaryColor : undefined }}
            className="flex items-center gap-2"
          >
            {stepInfo.isResult ? 'Finalizar' : stepInfo.isTransition ? 'Continuar' : 'Próximo'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ========================================
// Funções Helper - Baseadas no quiz21StepsComplete.ts
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
  // Títulos baseados no QUIZ_STYLE_21_STEPS_TEMPLATE
  const titles: Record<number, string> = {
    1: 'Descubra seu Estilo',
    2: 'Questão 1 - Roupa Favorita', 
    3: 'Questão 2 - Personalidade',
    4: 'Questão 3 - Visual',
    5: 'Questão 4 - Detalhes',
    6: 'Questão 5 - Estampas',
    7: 'Questão 6 - Casaco',
    8: 'Questão 7 - Calça',
    9: 'Questão 8 - Sapatos',
    10: 'Questão 9 - Acessórios',
    11: 'Questão 10 - Tecidos',
    12: 'Preparando análise...',
    13: 'Estratégica 1 - Autoavaliação',
    14: 'Estratégica 2 - Desafios',
    15: 'Estratégica 3 - Frequência',
    16: 'Estratégica 4 - Investimento',
    17: 'Estratégica 5 - Preço',
    18: 'Estratégica 6 - Objetivos',
    19: 'Calculando resultado...',
    20: 'Seu Estilo Predominante',
    21: 'Oferta Personalizada',
  };
  return titles[step] || `Etapa ${step}`;
}

function getStepDescription(step: number): string {
  // Descrições baseadas no template completo
  const descriptions: Record<number, string> = {
    1: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com você',
    2: 'QUAL O SEU TIPO DE ROUPA FAVORITA? (Selecione 3 opções)',
    3: 'RESUMA A SUA PERSONALIDADE: (Selecione 3 opções)',
    4: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA? (Selecione 3 opções)',
    5: 'QUAIS DETALHES VOCÊ GOSTA? (Selecione 3 opções)',
    6: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA? (Selecione 3 opções)',
    7: 'QUAL CASACO É SEU FAVORITO? (Selecione 3 opções)',
    8: 'QUAL SUA CALÇA FAVORITA? (Selecione 3 opções)',
    9: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA? (Selecione 3 opções)',
    10: 'QUE TIPO DE ACESSÓRIOS VOCÊ GOSTA? (Selecione 3 opções)',
    11: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES... (Selecione 3 opções)',
    12: 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa',
    13: 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
    14: 'O que mais te desafia na hora de se vestir?',
    15: 'Com que frequência você se pega pensando: "Com que roupa eu vou?"',
    16: 'Pense no quanto você já gastou com roupas que não usa...',
    17: 'Se esse conteúdo completo custasse R$ 97,00 — você consideraria um bom investimento?',
    18: 'Qual desses resultados você mais gostaria de alcançar?',
    19: 'Estamos calculando seu estilo predominante e preparando recomendações exclusivas',
    20: 'Com base nas suas respostas, identificamos seu estilo predominante',
    21: 'Libere todo o potencial do seu estilo pessoal com nossa oferta especial',
  };
  return descriptions[step] || '';
}

// ========================================
// Informações adicionais do template
// ========================================
function getStepRequirements(step: number): { selections: number; type: string } {
  // Baseado nas propriedades do template
  if (step === 1) return { selections: 1, type: 'text-input' };
  if (step >= 2 && step <= 11) return { selections: 3, type: 'multiple-choice' };
  if (step === 12 || step === 19) return { selections: 1, type: 'transition' };
  if (step >= 13 && step <= 18) return { selections: 1, type: 'single-choice' };
  if (step === 20 || step === 21) return { selections: 1, type: 'result-offer' };
  return { selections: 1, type: 'unknown' };
}

function getStepCategory(step: number): string {
  if (step === 1) return 'Introdução';
  if (step >= 2 && step <= 11) return 'Quiz Principal';
  if (step === 12) return 'Transição';
  if (step >= 13 && step <= 18) return 'Análise Estratégica';
  if (step === 19) return 'Processamento';
  if (step === 20) return 'Resultado';
  if (step === 21) return 'Conversão';
  return 'Indefinido';
}

export default QuizStepsNavigation;
