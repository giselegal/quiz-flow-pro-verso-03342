import ConnectedTemplateWrapper from '@/components/quiz/ConnectedTemplateWrapper';
import QuizNavigation from '@/components/quiz/QuizNavigation';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

interface Step02TemplateProps {
  sessionId: string;
  onNext?: () => void;
}

/**
 * 🎯 STEP 02: QUESTÃO 1 - TIPO DE ROUPA FAVORITA
 * ✅ CONECTADO AOS HOOKS: useQuizLogic.answerQuestion()
 *
 * Primeira questão do quiz que coleta preferências de estilo
 * - Grade de opções com imagens
 * - Integração automática com cálculo de pontuação
 * - Conectado ao useQuizLogic via ConnectedTemplateWrapper
 */
const Step02TemplateConnected: React.FC<Step02TemplateProps> = ({ sessionId, onNext }) => {
  // Opções da questão 1 (q1)
  const options = [
    {
      id: '1a',
      text: 'Conforto, leveza e praticidade no vestir',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
      category: 'Natural',
      points: 1,
    },
    {
      id: '1b', 
      text: 'Discrição, caimento clássico e sobriedade',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
      category: 'Clássico',
      points: 2,
    },
    {
      id: '1c',
      text: 'Praticidade com um toque de estilo atual',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
      category: 'Contemporâneo',
      points: 2,
    },
    {
      id: '1d',
      text: 'Elegância refinada, moderna e sem exageros',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
      category: 'Elegante',
      points: 3,
    },
    {
      id: '1e',
      text: 'Delicadeza em tecidos suaves e fluidos',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
      category: 'Romântico',
      points: 2,
    },
    {
      id: '1f',
      text: 'Sensualidade com destaque para o corpo',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
      category: 'Sexy',
      points: 3,
    },
    {
      id: '1g',
      text: 'Impacto visual com peças estruturadas e assimétricas',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
      category: 'Dramático',
      points: 3,
    },
    {
      id: '1h',
      text: 'Mix criativo com formas ousadas e originais',
      imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
      category: 'Criativo',
      points: 4,
    },
  ];

  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptions(prev => {
      const newSelected = prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId].slice(0, 3); // Máximo 3 seleções

      // Disparar evento para ConnectedTemplateWrapper capturar
      window.dispatchEvent(
        new CustomEvent('quiz-selection-change', {
          detail: {
            blockId: 'step02-options-grid',
            selectedOptions: newSelected,
            isValid: newSelected.length >= 3,
            minSelections: 3,
            maxSelections: 3,
          },
        })
      );

      return newSelected;
    });
  };

  const isValidSelection = selectedOptions.length >= 3;

  return (
    <ConnectedTemplateWrapper 
      stepNumber={2} 
      stepType="question" 
      sessionId={sessionId}
    >
      {/* Navegação */}
      <QuizNavigation
        canProceed={isValidSelection}
        onNext={onNext || (() => {})}
        currentQuestionType="normal"
        selectedOptionsCount={selectedOptions.length}
        isLastQuestion={false}
        currentStep={2}
        totalSteps={21}
        stepName="Questão 1 - Tipo de Roupa Favorita"
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
              QUAL O SEU TIPO DE ROUPA FAVORITA?
            </h1>
            <p className="text-sm text-gray-600">
              Questão 1 de 10 • Selecione 3 opções que mais combinam com você
            </p>
          </div>

          {/* Grid de opções */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                : `Selecione ${3 - selectedOptions.length} opções para continuar`
              }
            </button>
            
            {selectedOptions.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {selectedOptions.length}/3 opções selecionadas
              </p>
            )}
          </div>
        </div>
      </div>
    </ConnectedTemplateWrapper>
  );
};

export default Step02TemplateConnected;