import { UniversalBlockRenderer } from '@/components/editor/blocks/UniversalBlockRenderer';
import { Quiz21StepsNavigation } from '@/components/quiz/Quiz21StepsNavigation';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { loadStepBlocks } from '@/utils/quiz21StepsRenderer';
import React, { useEffect, useState } from 'react';

/**
 * 🎯 QUIZ MODULAR - VERSÃO PRODUÇÃO COM ETAPAS DO EDITOR
 *
 * Características:
 * - Usa as mesmas 21 etapas do editor
 * - Renderização idêntica via UniversalBlockRenderer
 * - Layout limpo focado no usuário final
 * - Navegação entre etapas fluida
 */
const QuizModularPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para gerenciar o fluxo do quiz
  const {
    state: quizState,
    actions: { goToStep, nextStep, previousStep },
  } = useQuizFlow({
    totalSteps: 21,
    initialStep: currentStep,
  });

  // Carregar blocos da etapa atual
  useEffect(() => {
    const loadCurrentStepBlocks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log(`🔄 Carregando blocos da etapa ${currentStep}...`);

        // Carregar blocos usando o mesmo sistema do editor
        const stepBlocks = await loadStepBlocks(`step-${currentStep}`);

        console.log(
          `✅ ${stepBlocks.length} blocos carregados para etapa ${currentStep}:`,
          stepBlocks
        );

        setBlocks(stepBlocks);
      } catch (err) {
        console.error(`❌ Erro ao carregar etapa ${currentStep}:`, err);
        setError(`Erro ao carregar etapa ${currentStep}`);
        setBlocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentStepBlocks();
  }, [currentStep]);

  // Sincronizar step com hook do quiz
  useEffect(() => {
    if (quizState.currentStep !== currentStep) {
      setCurrentStep(quizState.currentStep);
    }
  }, [quizState.currentStep, currentStep]);

  // Handlers de navegação
  const handleStepChange = (step: number) => {
    console.log(`📍 Navegando para etapa ${step}`);
    goToStep(step);
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep < 21) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      previousStep();
    }
  };

  const progress = Math.round((currentStep / 21) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      {/* 🎯 NAVEGAÇÃO DAS 21 ETAPAS */}
      <Quiz21StepsNavigation
        position="sticky"
        variant="full"
        showProgress={true}
        showControls={true}
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />

      {/* 🎨 CONTAINER PRINCIPAL */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 📋 HEADER DA ETAPA */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-sm text-stone-500">Etapa {currentStep} de 21</div>
              <div className="w-32 bg-stone-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-sm text-stone-600">{progress}%</div>
            </div>

            <h1 className="text-3xl font-bold text-stone-800 mb-4">
              Descubra seu Estilo Predominante
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Responda com sinceridade para descobrir seu estilo pessoal único e aprenda a criar
              looks que realmente refletem sua essência.
            </p>
          </div>

          {/* 🎨 ÁREA DE RENDERIZAÇÃO DOS BLOCOS */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
            {/* Estado de loading */}
            {isLoading && (
              <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-stone-600">Carregando etapa {currentStep}...</p>
                </div>
              </div>
            )}

            {/* Estado de erro */}
            {error && (
              <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {/* Renderização dos blocos */}
            {!isLoading && !error && (
              <div className="quiz-content p-8 space-y-6">
                {blocks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-stone-400 text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-medium text-stone-800 mb-2">Etapa em construção</h3>
                    <p className="text-stone-600">
                      Esta etapa ainda não possui conteúdo. Você pode continuar para a próxima
                      etapa.
                    </p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className={cn(
                        'quiz-block',
                        'transition-all duration-300',
                        index === 0 && 'animate-fade-in-up'
                      )}
                    >
                      <UniversalBlockRenderer block={block} isSelected={false} onClick={() => {}} />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 🎮 CONTROLES DE NAVEGAÇÃO */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                currentStep === 1
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-sm hover:shadow'
              )}
            >
              ← Anterior
            </button>

            <div className="text-center">
              <div className="text-sm text-stone-500 mb-1">Progresso</div>
              <div className="text-lg font-semibold text-stone-800">{currentStep} / 21</div>
            </div>

            <button
              onClick={handleNext}
              disabled={currentStep === 21}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
                currentStep === 21
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white hover:from-[#A08966] hover:to-[#7A6B4D] shadow-md hover:shadow-lg'
              )}
            >
              {currentStep === 21 ? 'Finalizado' : 'Próxima →'}
            </button>
          </div>

          {/* 📊 FOOTER COM ESTATÍSTICAS */}
          <div className="text-center mt-12 text-sm text-stone-500">
            <div className="flex justify-center items-center space-x-6">
              <div className="flex items-center gap-1">
                <span>🎯</span> Etapa: {currentStep}/21
              </div>
              <div className="flex items-center gap-1">
                <span>📊</span> Progresso: {progress}%
              </div>
              <div className="flex items-center gap-1">
                <span>🎨</span> Blocos: {blocks.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModularPage;
