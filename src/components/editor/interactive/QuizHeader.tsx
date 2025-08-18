import React, { memo } from 'react';
import { User, Trophy, Target } from 'lucide-react';

interface QuizHeaderProps {
  userName: string;
  currentStep: number;
  totalSteps: number;
  scores?: Record<string, number>;
}

/**
 * 🎯 HEADER DO QUIZ INTERATIVO
 * 
 * Exibe informações do usuário e progresso:
 * - Nome do usuário
 * - Etapa atual
 * - Pontuação (modo debug)
 * - Branding
 */
export const QuizHeader: React.FC<QuizHeaderProps> = memo(({
  userName,
  currentStep,
  totalSteps,
  scores = {}
}) => {
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const topCategory = Object.entries(scores).reduce(
    (top, [category, score]) => score > top.score ? { category, score } : top,
    { category: '', score: 0 }
  );

  return (
    <div className="quiz-header bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Principal */}
        <div className="flex items-center justify-between mb-4">
          {/* Logo/Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Quiz de Estilo</h1>
              <p className="text-sm text-gray-600">Descubra seu estilo pessoal</p>
            </div>
          </div>

          {/* Info do Usuário */}
          <div className="flex items-center gap-4">
            {userName && (
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">
                  Olá, {userName}!
                </span>
              </div>
            )}
            
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-800">
                Etapa {currentStep}
              </div>
              <div className="text-xs text-gray-600">
                de {totalSteps}
              </div>
            </div>
          </div>
        </div>

        {/* Informações de Progresso */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              <span className="text-sm text-gray-700">
                Progresso: {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>

            {totalScore > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-gray-700">
                  Pontos: {totalScore}
                </span>
              </div>
            )}
          </div>

          {/* Status da Etapa */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {getStepCategory(currentStep)}
            </div>
          </div>
        </div>

        {/* Debug Info - Pontuação por Categoria */}
        {process.env.NODE_ENV === 'development' && Object.keys(scores).length > 0 && (
          <div className="mt-4 p-3 bg-white/50 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">
              🔍 Debug - Pontuação por Categoria:
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(scores).map(([category, score]) => (
                <div 
                  key={category}
                  className={`text-xs p-2 rounded ${
                    category === topCategory.category 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="font-medium capitalize">{category}</div>
                  <div>{score} pts</div>
                </div>
              ))}
            </div>
            {topCategory.category && (
              <div className="mt-2 text-xs text-gray-600">
                <strong>Categoria líder:</strong> {topCategory.category} ({topCategory.score} pts)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// Helper para categorizar etapas
function getStepCategory(step: number): string {
  if (step === 1) return 'Introdução';
  if (step >= 2 && step <= 12) return 'Questões de Estilo';
  if (step >= 13 && step <= 18) return 'Questões Estratégicas';
  if (step >= 19 && step <= 20) return 'Resultado';
  if (step === 21) return 'Oferta';
  return 'Quiz';
}

QuizHeader.displayName = 'QuizHeader';
