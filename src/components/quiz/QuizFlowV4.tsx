/**
 * 🎯 QUIZ FLOW V4
 * 
 * Componente principal do quiz usando estrutura v4
 * - Carrega quiz21-v4.json
 * - Valida com Zod
 * - Usa Logic Engine para navegação
 * - Renderiza blocks dinamicamente
 * 
 * FASE 4: Integração E2E
 */

import React, { useEffect } from 'react';
import { useQuizV4 } from '@/contexts/quiz/QuizV4Provider';
import { StepRendererV4 } from './BlockRendererV4';
import { appLogger } from '@/lib/utils/appLogger';

// ============================================================================
// LOADING STATE
// ============================================================================

function QuizLoadingState() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4" />
                <p className="text-lg text-gray-700">Carregando quiz...</p>
                <p className="text-sm text-gray-500 mt-2">Validando estrutura v4</p>
            </div>
        </div>
    );
}

// ============================================================================
// ERROR STATE
// ============================================================================

interface QuizErrorStateProps {
    error: Error;
    onRetry?: () => void;
}

function QuizErrorState({ error, onRetry }: QuizErrorStateProps) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                    <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    Erro ao carregar quiz
                </h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                    {error.message}
                </p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// PROGRESS BAR
// ============================================================================

function QuizProgressBar() {
    const { state } = useQuizV4();
    const { progress } = state;

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                        Etapa {progress.currentStepOrder} de {progress.totalSteps}
                    </span>
                    <span className="text-sm font-medium text-indigo-600">
                        {progress.completionPercentage}%
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-300 ease-out"
                        style={{ width: `${progress.completionPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// NAVIGATION CONTROLS
// ============================================================================

function QuizNavigationControls() {
    const {
        canGoBack,
        canGoNext,
        goToPreviousStep,
        goToNextStep,
    } = useQuizV4();

    const isBackEnabled = canGoBack();
    const isNextEnabled = canGoNext();

    return (
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={goToPreviousStep}
                        disabled={!isBackEnabled}
                        className={`
              px-6 py-2 rounded-lg font-medium transition-all
              ${isBackEnabled
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        ← Voltar
                    </button>

                    <button
                        onClick={goToNextStep}
                        disabled={!isNextEnabled}
                        className={`
              px-6 py-2 rounded-lg font-medium transition-all
              ${isNextEnabled
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }
            `}
                    >
                        Próximo →
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// QUIZ CONTENT
// ============================================================================

function QuizContent() {
    const { state, startQuiz } = useQuizV4();
    const { currentStep, isStarted } = state;

    // Auto-start quiz on first render
    useEffect(() => {
        if (!isStarted && currentStep) {
            startQuiz();
            appLogger.info('🚀 Quiz v4 iniciado automaticamente');
        }
    }, [isStarted, currentStep, startQuiz]);

    if (!currentStep) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Nenhum step disponível</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <QuizProgressBar />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <StepRendererV4
                    stepId={currentStep.id}
                    blocks={currentStep.blocks}
                    isEditable={false}
                />
            </main>

            <QuizNavigationControls />
        </div>
    );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export interface QuizFlowV4Props {
    templatePath?: string;
    onComplete?: (state: any) => void;
}

export function QuizFlowV4({ templatePath, onComplete }: QuizFlowV4Props) {
    const { state } = useQuizV4();
    const { isLoading, error } = state;

    // Show loading state
    if (isLoading) {
        return <QuizLoadingState />;
    }

    // Show error state
    if (error) {
        return <QuizErrorState error={error} />;
    }

    // Show quiz content
    return <QuizContent />;
}

// Display name
QuizFlowV4.displayName = 'QuizFlowV4';

// ============================================================================
// EXPORTS
// ============================================================================

export {
    QuizLoadingState,
    QuizErrorState,
    QuizProgressBar,
    QuizNavigationControls,
    QuizContent,
};
