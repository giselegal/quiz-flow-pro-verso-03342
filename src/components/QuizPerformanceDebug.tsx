/**
 * 🧪 COMPONENTE DE DEBUG PARA PERFORMANCE DO QUIZ
 * 
 * Monitora e exibe métricas de performance em tempo real
 * para o sistema de 21 etapas
 */

import { useEffect } from 'react';
import { useQuiz21Performance } from '@/hooks/useTemplatePerformance';

interface QuizPerformanceDebugProps {
  showMetrics?: boolean;
  currentStep?: number;
}

export function QuizPerformanceDebug({ 
  showMetrics = true, 
  currentStep = 1 
}: QuizPerformanceDebugProps) {
  const {
    metrics,
    isLoading,
    cacheSize,
    getQuizMetrics,
    navigateToStep
  } = useQuiz21Performance();

  const quizMetrics = getQuizMetrics();

  useEffect(() => {
    if (currentStep !== metrics.loadedSteps) {
      navigateToStep(currentStep);
    }
  }, [currentStep, navigateToStep, metrics.loadedSteps]);

  if (!showMetrics) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm z-50">
      <h3 className="font-bold text-sm mb-2 text-gray-800">🚀 Quiz Performance</h3>
      
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-600">Etapa Atual:</span>
          <span className="font-semibold">{quizMetrics.currentStep}/21</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Progresso:</span>
          <span className="font-semibold">{quizMetrics.completionPercentage.toFixed(1)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Cache Size:</span>
          <span className="font-semibold">{cacheSize} templates</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Cache Efficiency:</span>
          <span className="font-semibold text-green-600">
            {quizMetrics.cacheEfficiency.toFixed(1)}%
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Load Time:</span>
          <span className="font-semibold">
            {quizMetrics.avgLoadTime.toFixed(0)}ms
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-semibold ${isLoading ? 'text-orange-600' : 'text-green-600'}`}>
            {isLoading ? 'Loading...' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-200">
        <h4 className="text-xs font-semibold text-gray-700 mb-1">Recommendations:</h4>
        <div className="space-y-1 text-xs">
          {quizMetrics.recommendations.cacheOptimal ? (
            <div className="text-green-600">✅ Cache otimizado</div>
          ) : (
            <div className="text-orange-600">⚠️ Cache pode melhorar</div>
          )}
          
          {quizMetrics.recommendations.shouldPreload ? (
            <div className="text-blue-600">📦 Preloading ativo</div>
          ) : (
            <div className="text-gray-600">📦 Preload completo</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPerformanceDebug;