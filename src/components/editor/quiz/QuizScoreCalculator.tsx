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
    const totalQuestions =
      template?.stages?.reduce((total: number, stage: any) => {
        return (
          total +
          (stage.blocks?.filter(
            (block: any) => block.type === 'quiz-question-block' && block.props?.correctAnswer
          ).length || 0)
        );
      }, 0) || 0;

    const totalSteps = template?.stages?.length || 0;
    const accuracyRate =
      totalQuestions > 0 ? (scoreBreakdown.correctAnswers / totalQuestions) * 100 : 0;
    const completionRate = totalSteps > 0 ? (scoreBreakdown.completedSteps / totalSteps) * 100 : 0;

    return {
      totalQuestions,
      totalSteps,
      accuracyRate: Math.round(accuracyRate * 10) / 10,
      completionRate: Math.round(completionRate * 10) / 10,
    };
  };

  const stats = getStatistics();

  // Não renderizar no modo produção
  if (mode === 'production') {
    return null;
  }

  return (
    <div className="quiz-score-calculator fixed top-4 left-4 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center">
            <span className="mr-2">🏆</span>
            Calculadora de Pontuação
          </h3>
          <div className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
            {score} pts
          </div>
        </div>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-3 rounded-lg text-center border border-green-200">
            <div className="text-lg font-bold text-green-600">{scoreBreakdown.correctAnswers}</div>
            <div className="text-xs text-green-700">Respostas Corretas</div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-center border border-blue-200">
            <div className="text-lg font-bold text-blue-600">{scoreBreakdown.completedSteps}</div>
            <div className="text-xs text-blue-700">Etapas Completas</div>
          </div>
        </div>

        {/* Barras de progresso */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Precisão das Respostas</span>
              <span>{stats.accuracyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.accuracyRate, 100)}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progresso Geral</span>
              <span>{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(stats.completionRate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Resumo de pontuação */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">📊 Resumo:</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Etapas concluídas:</span>
              <span className="font-medium">
                +{scoreBreakdown.completedSteps * (scoringRules.pointsPerCompletedStep || 5)} pts
              </span>
            </div>
            <div className="flex justify-between">
              <span>Respostas corretas:</span>
              <span className="font-medium">
                +{scoreBreakdown.correctAnswers * (scoringRules.pointsPerCorrectAnswer || 10)} pts
              </span>
            </div>
            {scoreBreakdown.bonusPoints > 0 && (
              <div className="flex justify-between">
                <span>Bônus especiais:</span>
                <span className="font-medium text-purple-600">
                  +{scoreBreakdown.bonusPoints} pts
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-1 mt-1 flex justify-between font-medium">
              <span>Total:</span>
              <span className="text-blue-600">{score} pts</span>
            </div>
          </div>
        </div>

        {/* Detalhamento da pontuação */}
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2 font-medium">
            📋 Detalhamento ({scoreBreakdown.details.length} itens)
          </summary>
          <div className="space-y-1 max-h-32 overflow-auto">
            {scoreBreakdown.details.map((detail, index) => (
              <div
                key={index}
                className={`flex justify-between p-2 rounded text-xs ${
                  detail.type === 'correct'
                    ? 'bg-green-50 border border-green-200'
                    : detail.type === 'bonus'
                      ? 'bg-purple-50 border border-purple-200'
                      : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <span className="flex-1 truncate mr-2" title={detail.description}>
                  {detail.description}
                </span>
                <span
                  className={`font-semibold ${
                    detail.type === 'correct'
                      ? 'text-green-700'
                      : detail.type === 'bonus'
                        ? 'text-purple-700'
                        : 'text-blue-700'
                  }`}
                >
                  +{detail.points}
                </span>
              </div>
            ))}
          </div>
        </details>

        {/* Bônus atual */}
        {scoreBreakdown.bonusPoints > 0 && (
          <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="text-xs text-purple-700 flex items-center">
              <span className="mr-1">🎉</span>
              <strong>Bônus Especiais:</strong> +{scoreBreakdown.bonusPoints} pontos
            </div>
          </div>
        )}

        {/* Debug mode */}
        {mode === 'editor' && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 font-medium">
              🔧 Debug da Pontuação
            </summary>
            <div className="mt-2 space-y-2">
              <div className="bg-gray-100 rounded p-2">
                <div className="text-xs font-medium mb-1">Estatísticas:</div>
                <pre className="text-xs overflow-auto max-h-16">
                  {JSON.stringify(stats, null, 2)}
                </pre>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <div className="text-xs font-medium mb-1">Regras de Pontuação:</div>
                <pre className="text-xs overflow-auto max-h-16">
                  {JSON.stringify(scoringRules, null, 2)}
                </pre>
              </div>
              <div className="bg-gray-100 rounded p-2">
                <div className="text-xs font-medium mb-1">Breakdown:</div>
                <pre className="text-xs overflow-auto max-h-16">
                  {JSON.stringify(scoreBreakdown, null, 2)}
                </pre>
              </div>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

export default QuizScoreCalculator;
