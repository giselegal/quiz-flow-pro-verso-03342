/**
 * 🧭 BLOCO DE NAVEGAÇÃO DO QUIZ
 *
 * QuizNavigationBlock.tsx - Componente modular e reutilizável para navegação
 * Gerencia progressão, validação e controles de navegação
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Home, RotateCcw } from 'lucide-react';
import React, { useMemo } from 'react';

export interface QuizNavigationBlockProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onGoToStep: (step: number) => void;
  mode: 'editor' | 'preview' | 'production';
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  validationResults?: Record<string, boolean>;
  className?: string;
}

export const QuizNavigationBlock: React.FC<QuizNavigationBlockProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onGoToStep,
  mode,
  theme = { primaryColor: '#B89B7A', secondaryColor: '#8B7355' },
  validationResults = {},
  className = '',
}) => {
  // Calcular progresso
  const progress = (currentStep / totalSteps) * 100;

  // Gerar lista de etapas para navegação direta
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1);

  // Verificar status de cada etapa
  const getStepStatus = (step: number) => {
    if (step === currentStep) return 'current';
    if (step < currentStep) return 'completed';
    return 'pending';
  };

  // Obter ícone da etapa
  const getStepIcon = (step: number) => {
    const status = getStepStatus(step);
    const hasValidation = validationResults[`step_${step}`];
    
    if (status === 'completed') {
      return hasValidation === false ? '❌' : '✅';
    }
    if (status === 'current') {
      return '👉';
    }
    return step.toString();
  };

  // Classes CSS para os botões
  const buttonBaseClass = `
    px-4 py-2 rounded-lg font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const primaryButtonClass = `
    ${buttonBaseClass}
    text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5
  `;

  const secondaryButtonClass = `
    ${buttonBaseClass}
    bg-gray-100 text-gray-700 hover:bg-gray-200
    border border-gray-300
  `;

  return (
    <div className={`quiz-navigation-block bg-white border-b border-gray-200 p-4 ${className}`}>
      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progresso: {currentStep} de {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% concluído
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: theme.primaryColor,
            }}
          />
        </div>
      </div>

      {/* Navegação principal */}
      <div className="flex items-center justify-between mb-4">
        {/* Botão Anterior */}
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`
            ${canGoPrevious ? secondaryButtonClass : 'px-4 py-2 text-gray-400 cursor-not-allowed'}
          `}
        >
          ← Anterior
        </button>

        {/* Informação da etapa atual */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            Etapa {currentStep}
          </div>
          {mode === 'editor' && (
            <div className="text-xs text-gray-500">
              Modo: {mode}
            </div>
          )}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`
            ${canGoNext ? primaryButtonClass : 'px-4 py-2 text-gray-400 cursor-not-allowed'}
          `}
          style={{
            backgroundColor: canGoNext ? theme.primaryColor : undefined,
          }}
        >
          Próximo →
        </button>
      </div>

      {/* Navegação por etapas (apenas no modo editor) */}
      {mode === 'editor' && (
        <div className="border-t border-gray-100 pt-4">
          <div className="text-xs text-gray-600 mb-2">Navegação direta:</div>
          <div className="flex flex-wrap gap-1">
            {stepNumbers.map(step => {
              const status = getStepStatus(step);
              const isAccessible = step <= currentStep || mode === 'editor';
              
              return (
                <button
                  key={step}
                  onClick={() => isAccessible && onGoToStep(step)}
                  disabled={!isAccessible}
                  className={`
                    w-8 h-8 text-xs rounded-full transition-all duration-200
                    ${status === 'current' 
                      ? 'text-white shadow-md' 
                      : status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }
                    ${!isAccessible ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                  style={{
                    backgroundColor: status === 'current' ? theme.primaryColor : undefined,
                  }}
                  title={`Etapa ${step} - ${status}`}
                >
                  {getStepIcon(step)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Informações de validação (apenas quando há erros) */}
      {Object.values(validationResults).some(result => result === false) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-700">
            ⚠️ Algumas etapas possuem erros de validação. Verifique os campos destacados.
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizNavigationBlock;
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

            {quizState.sessionData.userName && (
              <Badge variant="secondary">Olá, {quizState.sessionData.userName}</Badge>
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

        {/* Debug Info */}
        {showDebugInfo && mode === 'editor' && (
          <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <strong>Validação:</strong> {navigation.canGoNext ? '✅' : '❌'}
              </div>
              <div>
                <strong>Tipo:</strong> {stepInfo.type}
              </div>
              <div>
                <strong>Completadas:</strong> {progressData.completedSteps}
              </div>
              <div>
                <strong>Restantes:</strong> {progressData.remainingSteps}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ========================================
// Funções Helper
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

export default QuizNavigationBlock;
