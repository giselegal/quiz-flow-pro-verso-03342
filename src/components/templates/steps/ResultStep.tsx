import React from 'react';

interface ResultStepProps {
  testType: 'A' | 'B';
  stepNumber: number;
  onContinue?: () => void;
  quizAnswers: Array<{ questionId: string; optionId: string; points: number }>;
  strategicAnswers: Array<{ questionId: string; optionId: string; category?: string }>;
  userName?: string;
}

/**
 * 🎯 STEPS 20-21: PÁGINAS DE RESULTADO
 * Componente para renderizar páginas de resultado e conversão
 */
export const ResultStep: React.FC<ResultStepProps> = ({
  testType,
  stepNumber,
  onContinue,
  quizAnswers,
  strategicAnswers,
  userName
}) => {
  const progressPercentage = 100; // Always 100% on result pages

  // Calculate style result (simplified for now)
  const getStyleResult = () => {
    // This would normally use the quiz calculation logic
    const styleCategories = ['Natural', 'Clássico', 'Contemporâneo', 'Elegante', 'Romântico', 'Sexy', 'Dramático', 'Criativo'];
    const randomStyle = styleCategories[Math.floor(Math.random() * styleCategories.length)];
    return {
      primary: randomStyle,
      percentage: Math.floor(Math.random() * 30) + 70, // 70-100%
      description: `Seu estilo ${randomStyle} reflete sua personalidade autêntica.`
    };
  };

  const result = getStyleResult();

  return (
    <div className="min-h-screen bg-[#FAF9F7] flex flex-col">
      {/* Header with Logo */}
      <div className="w-full py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
            alt="Logo Gisele Galvão"
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Progress Bar (Complete) */}
      <div className="w-full px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#B89B7A] h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Celebration */}
          <div className="text-6xl mb-6">🎉</div>

          {/* Personal Greeting */}
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-[#432818]">
              {userName ? `Parabéns, ${userName}!` : 'Parabéns!'}
            </h1>
            <p className="text-2xl text-gray-700">
              Seu quiz foi concluído com sucesso
            </p>
          </div>

          {/* Result Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-2xl mx-auto">
            <div className="space-y-6">
              
              {/* Style Badge */}
              <div className="inline-block px-6 py-3 bg-[#B89B7A] text-white text-2xl font-bold rounded-full">
                Estilo {result.primary}
              </div>

              {/* Percentage */}
              <div className="text-4xl font-bold text-[#432818]">
                {result.percentage}% de afinidade
              </div>

              {/* Description */}
              <p className="text-lg text-gray-700 leading-relaxed">
                {result.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#B89B7A]">
                    {quizAnswers.length}
                  </div>
                  <p className="text-sm text-gray-600">Respostas do Quiz</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#B89B7A]">
                    {strategicAnswers.length}
                  </div>
                  <p className="text-sm text-gray-600">Respostas Estratégicas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Type Indicator */}
          <div className="bg-white/70 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-sm text-gray-600">
              Resultado - Teste {testType}
              {testType === 'A' && ' (Resultado Personalizado)'}
              {testType === 'B' && ' (Oferta Direta)'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {testType === 'A' && (
              <>
                <button className="w-full max-w-md mx-auto block px-8 py-4 bg-[#B89B7A] text-white text-xl font-semibold rounded-lg hover:bg-[#432818] transition-all duration-200 shadow-lg">
                  📊 Ver Análise Completa
                </button>
                <button className="w-full max-w-md mx-auto block px-8 py-4 bg-white text-[#B89B7A] text-lg font-semibold rounded-lg border-2 border-[#B89B7A] hover:bg-[#B89B7A] hover:text-white transition-all duration-200">
                  📧 Receber Guia por Email
                </button>
              </>
            )}

            {testType === 'B' && (
              <>
                <button className="w-full max-w-md mx-auto block px-8 py-4 bg-[#B89B7A] text-white text-xl font-semibold rounded-lg hover:bg-[#432818] transition-all duration-200 shadow-lg">
                  🎯 Oferta Especial - R$ 97
                </button>
                <p className="text-sm text-gray-600">
                  Guia completo de estilo personalizado
                </p>
              </>
            )}

            {/* Continue/Finish Button */}
            {onContinue && (
              <button
                onClick={onContinue}
                className="px-6 py-3 text-[#B89B7A] border border-[#B89B7A] rounded-lg hover:bg-[#B89B7A] hover:text-white transition-all duration-200"
              >
                {stepNumber === 21 ? 'Finalizar' : 'Próximo →'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white/90 p-3 rounded-lg text-xs text-gray-600 border max-w-xs">
          <div><strong>Result Step Debug</strong></div>
          <div>Step: {stepNumber}</div>
          <div>Test Type: {testType}</div>
          <div>User: {userName || 'unknown'}</div>
          <div>Quiz Answers: {quizAnswers.length}</div>
          <div>Strategic: {strategicAnswers.length}</div>
          <div>Style: {result.primary} ({result.percentage}%)</div>
        </div>
      )}
    </div>
  );
};