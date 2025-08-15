import ConnectedTemplateWrapper from '@/components/quiz/ConnectedTemplateWrapper';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';

interface Step19TemplateProps {
  sessionId: string;
  onNext?: () => void;
}

/**
 * 🎯 STEP 19: Preparando seu Resultado...
 * ✅ CONECTADO AOS HOOKS: useQuizLogic.completeQuiz()
 *
 * Etapa de resultado que exibe cálculos finais
 */
const Step19TemplateConnected: React.FC<Step19TemplateProps> = ({ sessionId, onNext }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  

  // Resultado automático - sem seleção necessária
  const isValidSelection = true;

  return (
    <ConnectedTemplateWrapper 
      stepNumber={19} 
      stepType="result" 
      sessionId={sessionId}
    >
      {/* Navegação */}
      <QuizNavigation
        canProceed={isValidSelection}
        onNext={onNext || (() => {})}
        currentQuestionType="normal"
        selectedOptionsCount={0}
        isLastQuestion={19 === 21}
        currentStep={19}
        totalSteps={21}
        stepName="Preparando seu Resultado..."
        showUserInfo={true}
        sessionId={sessionId}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-white to-[#B89B7A]/10 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <img
                src="https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp"
                alt="Gisele Galvão Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#432818] mb-2">
              PREPARANDO SEU RESULTADO...
            </h1>
            <p className="text-sm text-gray-600">
              Processando seu resultado... 
            </p>
          </div>

          {/* Resultado em processamento */}
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B89B7A] mb-4"></div>
            <p className="text-gray-600">Analisando suas respostas...</p>
          </div>

          {/* Botão de continuar */}
          <div className="text-center">
            <button
              onClick={onNext}
              disabled={!isValidSelection}
              className={`px-8 py-3 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                isValidSelection
                  ? 'bg-gradient-to-r from-[#B89B7A] to-[#aa6b5d] hover:scale-105 shadow-lg'
                  : 'bg-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isValidSelection 
                ? 'Próxima Questão →' 
                : `Processando...`
              }
            </button>
            
            
          </div>

          {/* Debug info */}
          <div className="text-xs text-center text-gray-400 mt-4">
            Step 19 | Type: result | SessionId: {sessionId}
          </div>
        </div>
      </div>
    </ConnectedTemplateWrapper>
  );
};

export default Step19TemplateConnected;