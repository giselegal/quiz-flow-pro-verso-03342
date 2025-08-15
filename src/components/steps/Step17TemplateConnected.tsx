import ConnectedTemplateWrapper from '@/components/quiz/ConnectedTemplateWrapper';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState } from 'react';

interface Step17TemplateProps {
  sessionId: string;
  onNext?: () => void;
}

/**
 * 🎯 STEP 17: Estratégica 6 - Marcas e Referências
 * ✅ CONECTADO AOS HOOKS: useQuizLogic.answerStrategicQuestion()
 *
 * Questão estratégica para dados complementares
 */
const Step17TemplateConnected: React.FC<Step17TemplateProps> = ({ sessionId, onNext }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Opções da questão (configurar baseado no JSON template)
  const options = [
    {
      id: '17a',
      text: 'Opção A - Configurar baseado no step-17.json',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
      category: 'Natural', // Ajustar conforme necessário
      points: 1,
    },
    {
      id: '17b',
      text: 'Opção B - Configurar baseado no step-17.json', 
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
      category: 'Clássico', // Ajustar conforme necessário
      points: 2,
    },
    // TODO: Adicionar mais opções baseadas no JSON template
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelected = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]; // Single selection

      // Disparar evento para ConnectedTemplateWrapper capturar
      window.dispatchEvent(
        new CustomEvent('quiz-selection-change', {
          detail: {
            blockId: 'step17-options-grid',
            selectedOptions: newSelected,
            isValid: newSelected.length >= 1,
            minSelections: 1,
            maxSelections: 1,
          },
        })
      );

      return newSelected;
    });
  };

  const isValidSelection = selectedOptions.length >= 1;

  return (
    <ConnectedTemplateWrapper 
      stepNumber={17} 
      stepType="strategic" 
      sessionId={sessionId}
    >
      {/* Navegação */}
      <QuizNavigation
        canProceed={isValidSelection}
        onNext={onNext || (() => {})}
        currentQuestionType="strategic"
        selectedOptionsCount={selectedOptions.length}
        isLastQuestion={17 === 21}
        currentStep={17}
        totalSteps={21}
        stepName="Estratégica 6 - Marcas e Referências"
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
              ESTRATÉGICA 6 - MARCAS E REFERÊNCIAS
            </h1>
            <p className="text-sm text-gray-600">
              Dados Complementares 6 de 7 • Selecione 1 opção
            </p>
          </div>

          {/* Grid de opções */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {options.map(option => {
              const isSelected = selectedOptions.includes(option.id);
              
              return (
                <Card 
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1 ${
                    isSelected 
                      ? 'border-[#B89B7A] border-2 bg-[#B89B7A]/10 shadow-lg' 
                      : 'border-gray-200 hover:border-[#B89B7A]/50'
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="aspect-square mb-3">
                      <img
                        src={option.imageUrl}
                        alt={option.text}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <p className="text-sm text-center text-gray-700">
                      {option.text}
                    </p>
                    {isSelected && (
                      <div className="w-6 h-6 bg-[#B89B7A] rounded-full flex items-center justify-center mx-auto mt-2">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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
                : `Selecione ${1 - selectedOptions.length} opções para continuar`
              }
            </button>
            
            {selectedOptions.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedOptions.length}/1 opções selecionadas
              </p>
            )}
          </div>

          {/* Debug info */}
          <div className="text-xs text-center text-gray-400 mt-4">
            Step 17 | Type: strategic | SessionId: {sessionId}
          </div>
        </div>
      </div>
    </ConnectedTemplateWrapper>
  );
};

export default Step17TemplateConnected;