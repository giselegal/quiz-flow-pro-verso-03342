import { useQuiz21Steps } from '@/components/quiz/Quiz21StepsProvider';
import React from 'react';

/**
 * 🎯 CANVAS SIMPLES PARA TESTE DAS 21 ETAPAS
 * Componente básico que apenas mostra as informações das etapas
 */
export const SimpleCanvas: React.FC = () => {
  const quizContext = useQuiz21Steps();

  const {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    goToStep,
    progress,
  } = quizContext;

  console.log('🎯 SimpleCanvas - Estado atual:', {
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    progress,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER COM INFO DAS ETAPAS */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">🎯 Teste das 21 Etapas</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">{currentStep}</div>
              <div className="text-sm text-gray-600">Etapa Atual</div>
            </div>

            <div className="bg-green-50 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">{totalSteps}</div>
              <div className="text-sm text-gray-600">Total de Etapas</div>
            </div>

            <div className="bg-purple-50 p-3 rounded">
              <div className="text-2xl font-bold text-purple-600">{progress}%</div>
              <div className="text-sm text-gray-600">Progresso</div>
            </div>

            <div className="bg-orange-50 p-3 rounded">
              <div className="text-2xl font-bold text-orange-600">{canGoNext ? '✅' : '❌'}</div>
              <div className="text-sm text-gray-600">Pode Avançar</div>
            </div>
          </div>
        </div>

        {/* NAVEGAÇÃO */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Navegação</h2>

          <div className="flex gap-4 mb-4">
            <button
              onClick={goToPrevious}
              disabled={!canGoPrevious}
              className={`px-4 py-2 rounded ${
                canGoPrevious
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ← Anterior
            </button>

            <button
              onClick={goToNext}
              disabled={!canGoNext}
              className={`px-4 py-2 rounded ${
                canGoNext
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Próxima →
            </button>
          </div>

          {/* NAVEGAÇÃO DIRETA */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;

              return (
                <button
                  key={stepNum}
                  onClick={() => goToStep(stepNum)}
                  className={`w-8 h-8 rounded text-sm font-medium ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {stepNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* STATUS DEBUG */}
        <div className="bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm">
          <div className="mb-2">🔍 Debug Info:</div>
          <div>Current Step: {currentStep}</div>
          <div>Total Steps: {totalSteps}</div>
          <div>Can Go Next: {String(canGoNext)}</div>
          <div>Can Go Previous: {String(canGoPrevious)}</div>
          <div>Progress: {progress}%</div>
        </div>
      </div>
    </div>
  );
};
