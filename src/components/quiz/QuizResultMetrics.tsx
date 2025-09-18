/**
 * 📊 MÉTRICAS E MONITORAMENTO DO QUIZ
 * 
 * Rastreia success/failure rate do cálculo e performance
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';
import { StorageService } from '@/services/core/StorageService';
import { unifiedQuizStorage } from '@/services/core/UnifiedQuizStorage';

interface QuizMetrics {
  calculationAttempts: number;
  successfulCalculations: number;
  failedCalculations: number;
  averageCalculationTime: number;
  lastCalculationTime: number;
  dataQuality: {
    selectionsCount: number;
    averageSelectionsPerQuestion: number;
    completionRate: number;
  };
}

export const QuizResultMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<QuizMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadMetrics();

    const handleResultUpdate = () => {
      recordSuccessfulCalculation();
      loadMetrics();
    };

    const handleCalculationStart = () => {
      recordCalculationAttempt();
    };

    window.addEventListener('quiz-result-updated', handleResultUpdate);
    window.addEventListener('quiz-calculation-started', handleCalculationStart);

    return () => {
      window.removeEventListener('quiz-result-updated', handleResultUpdate);
      window.removeEventListener('quiz-calculation-started', handleCalculationStart);
    };
  }, []);

  const loadMetrics = () => {
    try {
      const stored = localStorage.getItem('quiz-metrics');
      if (stored) {
        setMetrics(JSON.parse(stored));
      } else {
        initializeMetrics();
      }
    } catch {
      initializeMetrics();
    }
  };

  const initializeMetrics = () => {
    const initialMetrics: QuizMetrics = {
      calculationAttempts: 0,
      successfulCalculations: 0,
      failedCalculations: 0,
      averageCalculationTime: 0,
      lastCalculationTime: 0,
      dataQuality: {
        selectionsCount: 0,
        averageSelectionsPerQuestion: 0,
        completionRate: 0
      }
    };
    setMetrics(initialMetrics);
    localStorage.setItem('quiz-metrics', JSON.stringify(initialMetrics));
  };

  const recordCalculationAttempt = () => {
    const current = metrics || initializeMetricsSync();
    const updated = {
      ...current,
      calculationAttempts: current.calculationAttempts + 1,
      lastCalculationTime: Date.now()
    };
    setMetrics(updated);
    localStorage.setItem('quiz-metrics', JSON.stringify(updated));

    // Emitir evento customizado para tracking
    window.dispatchEvent(new CustomEvent('quiz-calculation-started', {
      detail: { timestamp: Date.now() }
    }));
  };

  const recordSuccessfulCalculation = () => {
    const current = metrics || initializeMetricsSync();
    const calculationTime = Date.now() - current.lastCalculationTime;

    const updated = {
      ...current,
      successfulCalculations: current.successfulCalculations + 1,
      averageCalculationTime: (current.averageCalculationTime + calculationTime) / 2,
      dataQuality: calculateDataQuality()
    };
    setMetrics(updated);
    localStorage.setItem('quiz-metrics', JSON.stringify(updated));
  };

  // Expor função para uso em outros componentes
  useEffect(() => {
    const recordFailedCalculation = (error: string) => {
      const current = metrics || initializeMetricsSync();
      const updated = {
        ...current,
        failedCalculations: current.failedCalculations + 1
      };
      setMetrics(updated);
      localStorage.setItem('quiz-metrics', JSON.stringify(updated));

      // Log para debugging
      console.error('❌ [Metrics] Cálculo falhou:', error);
    };

    (window as any).__quizMetrics = {
      recordFailedCalculation,
      recordCalculationAttempt,
      loadMetrics
    };
  }, [metrics]);

  const initializeMetricsSync = (): QuizMetrics => {
    const initial: QuizMetrics = {
      calculationAttempts: 0,
      successfulCalculations: 0,
      failedCalculations: 0,
      averageCalculationTime: 0,
      lastCalculationTime: 0,
      dataQuality: {
        selectionsCount: 0,
        averageSelectionsPerQuestion: 0,
        completionRate: 0
      }
    };
    return initial;
  };

  const calculateDataQuality = () => {
    try {
      const stats = unifiedQuizStorage.getDataStats();
      const userSelections = StorageService.safeGetJSON('userSelections') || {};
      const totalQuestions = Math.max(stats.selectionsCount, Object.keys(userSelections).length);
      const expectedQuestions = 10; // Quiz tem 10 perguntas pontuadas
      return {
        selectionsCount: totalQuestions,
        averageSelectionsPerQuestion: stats.selectionsCount / Math.max(1, expectedQuestions),
        completionRate: (totalQuestions / expectedQuestions) * 100
      };
    } catch {
      return {
        selectionsCount: 0,
        averageSelectionsPerQuestion: 0,
        completionRate: 0
      };
    }
  };

  const getSuccessRate = () => {
    if (!metrics || metrics.calculationAttempts === 0) return 0;
    return (metrics.successfulCalculations / metrics.calculationAttempts) * 100;
  };

  const resetMetrics = () => {
    localStorage.removeItem('quiz-metrics');
    initializeMetrics();
  };

  const exportMetrics = () => {
    if (!metrics) return;

    const data = {
      ...metrics,
      timestamp: new Date().toISOString(),
      successRate: getSuccessRate()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-metrics-${Date.now()}.json`;
    a.click();
  };

  if (!isVisible || !metrics) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 bg-blue-50 hover:bg-blue-100 border border-blue-200"
      >
        <BarChart3 className="w-4 h-4 mr-1" />
        Métricas
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-40">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Métricas do Quiz
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(false)}
          className="h-6 w-6 p-0"
        >
          ✕
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Success Rate */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-green-500" />
            Taxa de Sucesso:
          </span>
          <span className={`font-medium ${getSuccessRate() > 80 ? 'text-green-600' : getSuccessRate() > 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {getSuccessRate().toFixed(1)}%
          </span>
        </div>

        {/* Calculation Stats */}
        <div className="flex items-center justify-between">
          <span>Tentativas:</span>
          <span>{metrics.calculationAttempts}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Sucessos:</span>
          <span className="text-green-600">{metrics.successfulCalculations}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Falhas:</span>
          <span className="text-red-600">{metrics.failedCalculations}</span>
        </div>

        {/* Performance */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-500" />
            Tempo Médio:
          </span>
          <span>{metrics.averageCalculationTime.toFixed(0)}ms</span>
        </div>

        {/* Data Quality */}
        <div className="border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-purple-500" />
              Completude:
            </span>
            <span className={`font-medium ${metrics.dataQuality.completionRate > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
              {metrics.dataQuality.completionRate.toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Seleções:</span>
            <span>{metrics.dataQuality.selectionsCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-2 flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={exportMetrics}
            className="flex-1 h-7 text-xs"
          >
            Exportar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetMetrics}
            className="flex-1 h-7 text-xs"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultMetrics;