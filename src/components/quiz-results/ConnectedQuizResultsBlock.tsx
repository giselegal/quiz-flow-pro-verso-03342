import React, { useEffect, useState } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';

interface QuizResultsProps {
  showSecondaryStyles?: boolean;
  showOffer?: boolean;
}

/**
 * BLOCO DE RESULTADO CONECTADO COM LÓGICA DE CÁLCULO
 * ✅ Integra com useQuizLogic para cálculo automático
 * ✅ Mostra resultado personalizado com nome do usuário
 * ✅ Exibe breakdown de pontuação por categoria
 */
export const ConnectedQuizResultsBlock: React.FC<QuizResultsProps> = ({
  showSecondaryStyles = true,
  showOffer = true,
}) => {
  const { quizResult, userName, completeQuiz, answers } = useQuizLogic();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-calcular resultado se há respostas
    if (answers.length >= 10) {
      completeQuiz();
    }
    setIsLoading(false);
  }, [answers, completeQuiz]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4">Calculando seu resultado...</p>
      </div>
    );
  }

  if (!quizResult) {
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Resultado não disponível</h3>
        <p className="text-gray-600">Complete o quiz para ver seus resultados</p>
      </div>
    );
  }

  const { primaryStyle, secondaryStyles, userData } = quizResult;
  const displayName = userData?.name || userName || 'Usuário';

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg p-8">
      {/* Header Personalizado */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">🎉 Parabéns, {displayName}!</h1>
        <p className="text-lg text-gray-700">
          Seu resultado personalizado baseado em suas respostas
        </p>
      </div>

      {/* Resultado Principal */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Seu Estilo Predominante: {primaryStyle.category}
        </h2>
        <div className="flex items-center justify-between mb-4">
          <div className="text-4xl font-bold text-blue-600">{primaryStyle.percentage}%</div>
          <div className="text-sm text-gray-600">
            {primaryStyle.points} pontos de {quizResult.totalQuestions * 3}
          </div>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${primaryStyle.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Estilos Secundários */}
      {showSecondaryStyles && secondaryStyles.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Outros Estilos Identificados:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {secondaryStyles.map((style, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border">
                <h4 className="font-medium text-gray-900 mb-2">{style.category}</h4>
                <div className="text-lg font-bold text-gray-700">{style.percentage}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gray-400 h-2 rounded-full"
                    style={{ width: `${style.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breakdown de Pontuação */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-3">Como Calculamos:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Baseado em {quizResult.totalQuestions} perguntas principais</li>
          <li>• Cada resposta foi pontuada de acordo com categorias de estilo</li>
          <li>• Resultado personalizado com seu nome: {displayName}</li>
          <li>• Cálculo em tempo real durante o quiz</li>
        </ul>
      </div>

      {/* Call-to-Action para Oferta */}
      {showOffer && (
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Quer descobrir mais sobre seu estilo?</h3>
            <p className="mb-4">Temos uma oferta especial baseada no seu resultado</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Ver Oferta Personalizada
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectedQuizResultsBlock;
