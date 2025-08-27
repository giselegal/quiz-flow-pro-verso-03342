import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ValidationResult } from '@/types/validation';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { memo } from 'react';

interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  onNext: () => void;
  onPrevious: () => void;
  validation?: ValidationResult | null;
}

/**
 * 🎯 NAVEGAÇÃO DO QUIZ INTERATIVO
 *
 * Componente de navegação com:
 * - Progress bar visual
 * - Botões de navegação
 * - Feedback de validação
 * - Indicadores visuais
 */
export const QuizNavigation: React.FC<QuizNavigationProps> = memo(
  ({ currentStep, totalSteps, canProceed, onNext, onPrevious, validation }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;
    const isFirstStep = currentStep <= 1;
    const isLastStep = currentStep >= totalSteps;

    return (
      <div className="quiz-navigation bg-white border-t border-gray-200 p-6 sticky bottom-0">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% concluído
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" aria-label="Progresso do Quiz" />
        </div>

        {/* Validation Feedback */}
        {validation && (
          <div className="mb-4">
            {validation.success ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Pronto para avançar!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Responda antes de continuar</span>
                {validation.errors && validation.errors.length > 0 && (
                  <div className="text-xs">
                    {validation.errors.map((error, index) => (
                      <div key={index}>{error.message}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            type="button"
            onClick={onPrevious}
            disabled={isFirstStep}
            className="flex items-center gap-2"
            type="button"
            aria-label="Voltar para a etapa anterior"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-3">
            {/* Step Indicators */}
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: Math.min(totalSteps, 7) }, (_, i) => {
                const stepNum = i + 1;
                const isActive = stepNum === currentStep;
                const isCompleted = stepNum < currentStep;

                return (
                  <div
                    key={stepNum}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : stepNum}
                  </div>
                );
              })}

              {totalSteps > 7 && (
                <>
                  <span className="text-gray-400 px-2">...</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                      currentStep === totalSteps
                        ? 'bg-blue-600 text-white'
                        : currentStep > totalSteps
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > totalSteps ? '✓' : totalSteps}
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={onNext}
            onKeyDown={e => {
              if (!canProceed) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNext();
              }
            }}
            disabled={!canProceed}
            className={`flex items-center gap-2 ${
              canProceed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            }`}
            type="button"
            aria-label={isLastStep ? 'Finalizar quiz' : 'Ir para a próxima etapa'}
            onKeyDown={e => {
              if (!canProceed) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNext();
              }
            }}
          >
            {isLastStep ? (
              <>
                Finalizar
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>

        {/* Quick Stats */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>
                Step: {currentStep}/{totalSteps}
              </span>
              <span>Valid: {canProceed ? '✅' : '❌'}</span>
              <span>Progress: {Math.round(progressPercentage)}%</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

QuizNavigation.displayName = 'QuizNavigation';
