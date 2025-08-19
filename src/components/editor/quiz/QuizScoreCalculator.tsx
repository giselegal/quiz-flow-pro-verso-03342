/**
 * 🧮 CALCULADORA DE PONTUAÇÃO DO QUIZ
 *
 * QuizScoreCalculator.tsx - Calcula scores, determina estilo predominante
 * Sistema modular para cálculos em tempo real com resultados personalizados
 */

import React, { useEffect, useState } from 'react';

export interface QuizScoreCalculatorProps {
  quizData: Record<string, any>;
  currentStep: number;
  template: any;
  onScoreChange: (score: number) => void;
  mode: 'editor' | 'preview' | 'production';
  scoringRules?: {
    pointsPerCorrectAnswer?: number;
    pointsPerCompletedStep?: number;
    bonusRules?: Array<{
      condition: (data: Record<string, any>) => boolean;
      points: number;
      description: string;
    }>;
  };
}

export const QuizScoreCalculator: React.FC<QuizScoreCalculatorProps> = ({
  quizData,
  currentStep,
  template,
  onScoreChange,
  mode,
  scoringRules = {
    pointsPerCorrectAnswer: 10,
    pointsPerCompletedStep: 5,
    bonusRules: [],
  },
}) => {
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<{
    correctAnswers: number;
    completedSteps: number;
    bonusPoints: number;
    details: Array<{
      type: string;
      description: string;
      points: number;
    }>;
  }>({
    correctAnswers: 0,
    completedSteps: 0,
    bonusPoints: 0,
    details: [],
  });

  // Calcular pontuação
  useEffect(() => {
    const calculateScore = () => {
      let totalScore = 0;
      let correctAnswers = 0;
      let completedSteps = 0;
      let bonusPoints = 0;
      const details: Array<{
        type: string;
        description: string;
        points: number;
      }> = [];

      // Analisar cada etapa com dados
      Object.entries(quizData).forEach(([stepKey, stepData]) => {
        if (!stepData || typeof stepData !== 'object') return;

        const stepNumber = parseInt(stepKey.replace('step_', ''));
        const stepTemplate = template?.stages?.[stepNumber - 1];
        
        if (!stepTemplate) return;

        // Marcar etapa como completa
        completedSteps++;
        const stepPoints = scoringRules.pointsPerCompletedStep || 5;
        totalScore += stepPoints;
        details.push({
          type: 'completion',
          description: `Etapa ${stepNumber} concluída`,
          points: stepPoints,
        });

        // Verificar respostas corretas
        stepTemplate.blocks?.forEach((block: any) => {
          if (block.type === 'quiz-question-block' && block.props?.correctAnswer) {
            const userAnswer = stepData[block.id];
            if (userAnswer === block.props.correctAnswer) {
              correctAnswers++;
              const answerPoints = scoringRules.pointsPerCorrectAnswer || 10;
              totalScore += answerPoints;
              details.push({
                type: 'correct',
                description: `Resposta correta: ${block.props.question?.substring(0, 30)}...`,
                points: answerPoints,
              });
            }
          }
        });
      });

      // Aplicar regras de bônus
      scoringRules.bonusRules?.forEach(rule => {
        if (rule.condition(quizData)) {
          bonusPoints += rule.points;
          totalScore += rule.points;
          details.push({
            type: 'bonus',
            description: rule.description,
            points: rule.points,
          });
        }
      });

      // Atualizar estado
      setScore(totalScore);
      setScoreBreakdown({
        correctAnswers,
        completedSteps,
        bonusPoints,
        details,
      });

      // Notificar mudança
      onScoreChange(totalScore);
    };

    calculateScore();
  }, [quizData, template, scoringRules, onScoreChange]);

  // Calcular estatísticas
  const getStatistics = () => {
    const totalQuestions = template?.stages?.reduce((total: number, stage: any) => {
      return total + (stage.blocks?.filter((block: any) => 
        block.type === 'quiz-question-block' && block.props?.correctAnswer
      ).length || 0);
    }, 0) || 0;

    const totalSteps = template?.stages?.length || 0;
    const accuracyRate = totalQuestions > 0 ? (scoreBreakdown.correctAnswers / totalQuestions) * 100 : 0;
    const completionRate = totalSteps > 0 ? (scoreBreakdown.completedSteps / totalSteps) * 100 : 0;

    return {
      totalQuestions,
      totalSteps,
      accuracyRate: Math.round(accuracyRate),
      completionRate: Math.round(completionRate),
    };
  };

  const stats = getStatistics();

  // Não renderizar no modo produção
  if (mode === 'production') {
    return null;
  }

  return (
    <div className="quiz-score-calculator fixed top-4 left-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            🏆 Pontuação
          </h3>
          <div className="text-lg font-bold text-blue-600">
            {score} pts
          </div>
        </div>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">
              {scoreBreakdown.correctAnswers}
            </div>
            <div className="text-xs text-green-700">
              Respostas Corretas
            </div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600">
              {scoreBreakdown.completedSteps}
            </div>
            <div className="text-xs text-blue-700">
              Etapas Completas
            </div>
          </div>
        </div>

        {/* Barras de progresso */}
        <div className="space-y-2 mb-4">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Precisão</span>
              <span>{stats.accuracyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${stats.accuracyRate}%` }}
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso</span>
              <span>{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Detalhamento da pontuação */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
            Detalhamento ({scoreBreakdown.details.length} itens)
          </summary>
          <div className="space-y-1 max-h-32 overflow-auto">
            {scoreBreakdown.details.map((detail, index) => (
              <div
                key={index}
                className={`flex justify-between p-2 rounded ${
                  detail.type === 'correct' ? 'bg-green-50 text-green-700' :
                  detail.type === 'bonus' ? 'bg-purple-50 text-purple-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                <span className="flex-1 truncate">{detail.description}</span>
                <span className="font-semibold">+{detail.points}</span>
              </div>
            ))}
          </div>
        </details>

        {/* Bônus atual */}
        {scoreBreakdown.bonusPoints > 0 && (
          <div className="mt-3 p-2 bg-purple-50 border border-purple-200 rounded">
            <div className="text-xs text-purple-700">
              🎉 Bônus: +{scoreBreakdown.bonusPoints} pontos
            </div>
          </div>
        )}

        {/* Debug mode */}
        {mode === 'editor' && (
          <details className="mt-3 text-xs">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
              Debug Score
            </summary>
            <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-24">
              {JSON.stringify({ 
                score, 
                scoreBreakdown, 
                stats, 
                scoringRules 
              }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default QuizScoreCalculator;
        });
      }
    }
  }, [
    quizState.userAnswers,
    enableRealTimeCalculation,
    recalculateOnAnswerChange,
    calculateScores,
    calculateResult,
    dataManager,
    mode,
  ]);

  // ========================================
  // Triggers para Etapas Específicas
  // ========================================
  useEffect(() => {
    // Recalcular quando chegar na etapa 19 (transição para resultado)
    if (quizState.currentStep === 19) {
      const finalScores = calculateScores();
      const finalResult = calculateResult(finalScores);

      setScores(finalScores);
      setResult(finalResult);

      // Salvar resultado final
      dataManager.onDataUpdate('finalQuizScores', finalScores);
      dataManager.onDataUpdate('finalQuizResult', finalResult);

      if (mode === 'production') {
        // Analytics para conversão
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: 'quiz_completed',
            quiz_result: finalResult.predominantStyle,
            quiz_percentage: finalResult.percentage,
            total_answers: Object.keys(quizState.userAnswers).length,
          });
        }
      }
    }
  }, [
    quizState.currentStep,
    calculateScores,
    calculateResult,
    dataManager,
    mode,
    quizState.userAnswers,
  ]);

  // ========================================
  // Métodos de Debug (modo editor)
  // ========================================
  useEffect(() => {
    if (mode === 'editor' && typeof window !== 'undefined') {
      (window as any).quizCalculator = {
        getCurrentScores: () => scores,
        getCurrentResult: () => result,
        recalculate: () => {
          const newScores = calculateScores();
          const newResult = calculateResult(newScores);
          setScores(newScores);
          setResult(newResult);
          return { scores: newScores, result: newResult };
        },
        getStyleDefinitions: () => styleDefinitions,
        getScoreMapping: () => scoreMapping,
        simulateResult: (styleKey: string) => {
          const simulatedScores = { ...scores };
          simulatedScores[styleKey as keyof StyleScore] = 100;
          return calculateResult(simulatedScores);
        },
      };
    }
  }, [mode, scores, result, calculateScores, calculateResult, styleDefinitions, scoreMapping]);

  // ========================================
  // Performance Monitoring
  // ========================================
  useEffect(() => {
    if (mode === 'production') {
      const startTime = performance.now();
      calculateScores();
      const endTime = performance.now();

      // Log performance apenas se demorar mais que 100ms
      if (endTime - startTime > 100) {
        console.warn(`⚡ Quiz calculation took ${Math.round(endTime - startTime)}ms`);
      }
    }
  }, [quizState.userAnswers, mode, calculateScores]);

  // Este componente não renderiza nada visível
  return null;
};

export default QuizScoreCalculator;
