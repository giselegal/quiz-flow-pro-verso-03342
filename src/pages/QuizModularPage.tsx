import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { useStep01Validation } from '@/hooks/useStep01Validation';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { TemplateManager } from '@/utils/TemplateManager';
import React, { useEffect, useState } from 'react';
import { computeSelectionValidity } from '@/lib/quiz/selectionRules';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';

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

  // 🎯 ESTADO DO QUIZ - Validação e Respostas
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});
  const [userSelections, setUserSelections] = useState<Record<string, string[]>>({});
  // Scheduler otimizado (substitui setTimeout dispersos)
  const { schedule, debounce, cancelAll } = useOptimizedScheduler();

  // Hook para gerenciar o fluxo do quiz
  const {
    quizState,
    actions: { goToStep, nextStep, preloadTemplates, setStepValid },
  } = useQuizFlow({
    mode: 'production',
    initialStep: currentStep,
  });

  // Unificar validação do Step 1 via hook (habilita botão e marca etapa válida)
  useStep01Validation({
    buttonId: 'intro-cta-button',
    inputId: 'intro-name-input',
    onNameValid: isValid => {
      setStepValidation(prev => ({ ...prev, 1: isValid }));
      setStepValid?.(1, isValid);
    },
  });

  // Pré-carregar templates para suavizar transições
  useEffect(() => {
    preloadTemplates?.();
  }, [preloadTemplates]);

  // Carregar blocos da etapa atual (via TemplateManager para refletir atualizações do editor)
  useEffect(() => {
    const loadCurrentStepBlocks = async () => {
      try {
        setIsLoading(true);
        setError(null);

  // Carregando blocos da etapa (silencioso em produção)

        // Carregar blocos usando TemplateManager (integra JSON/Editor)
        const stepId = `step-${currentStep}`;
        const stepBlocks = await TemplateManager.loadStepBlocks(stepId);
        setBlocks(stepBlocks);

        // Validar se a etapa já está completa (idle com timeout)
        schedule(
          `validate:step-${currentStep}`,
          () => {
            const isValid = validateStep(stepBlocks);
            setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
            setStepValid?.(currentStep, isValid);
          },
          100,
          'idle'
        );
      } catch (err) {
  // Log de erro reduzido
  if (import.meta?.env?.DEV) console.error(`Erro ao carregar etapa ${currentStep}:`, err);
        setError(`Erro ao carregar etapa ${currentStep}`);
        setBlocks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentStepBlocks();
    // Escuta atualizações publicadas pelo editor
    const onTemplateUpdated = (ev: Event) => {
      const e = ev as CustomEvent<{ stepId?: string } | undefined>;
      const stepId = e?.detail?.stepId;
      const updatedStep =
        typeof stepId === 'string' ? parseInt(stepId.replace(/[^0-9]/g, ''), 10) : NaN;
      if (!Number.isNaN(updatedStep) && updatedStep === currentStep) {
        // Recarregar blocos da etapa corrente
        TemplateManager.reloadTemplate(`step-${currentStep}`)
          .then(setBlocks)
          .catch(() => {});
      }
    };
    window.addEventListener('quiz-template-updated', onTemplateUpdated as EventListener);
    return () => {
      window.removeEventListener('quiz-template-updated', onTemplateUpdated as EventListener);
    };
  }, [currentStep]);

  // Sincronizar step com hook do quiz
  useEffect(() => {
    if (quizState.currentStep !== currentStep) {
      setCurrentStep(quizState.currentStep);
    }
  }, [quizState.currentStep, currentStep]);

  // Expor etapa atual globalmente para blocos/efeitos que dependem disso
  useEffect(() => {
    (window as any).__quizCurrentStep = `step-${currentStep}`;
  }, [currentStep]);

  // Escutar eventos de navegação disparados pelos blocos (ex.: botão step 1, auto-advance)
  useEffect(() => {
    const parseStepNumber = (stepId: any): number | null => {
      if (typeof stepId === 'number') return stepId;
      if (typeof stepId !== 'string') return null;
      // Suporta formatos: 'step-2', 'step-02', '2'
      const digits = stepId.replace(/[^0-9]/g, '');
      const num = parseInt(digits || stepId, 10);
      return Number.isFinite(num) ? num : null;
    };

    const handleNavigate = (ev: Event) => {
      const e = ev as CustomEvent<{ stepId?: string | number; source?: string }>;
      const target = parseStepNumber(e.detail?.stepId);
      if (!target) return;
      if (target < 1 || target > 21) return;

      setCurrentStep(target);
      goToStep(target);
      if (import.meta?.env?.DEV) {
        // Navegação por evento (somente em ambiente de desenvolvimento)
        console.log('navigate-to-step:', e.detail?.stepId, '->', target, 'src:', e.detail?.source);
      }
    };

    window.addEventListener('navigate-to-step', handleNavigate as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigate as EventListener);

    // Sincronizar validação visual/funcional via eventos globais dos blocos
    const handleSelectionChange = (ev: Event) => {
      const e = ev as CustomEvent<{ selectionCount?: number; isValid?: boolean }>;
      const valid = !!e.detail?.isValid;
      setStepValidation(prev => ({ ...prev, [currentStep]: valid }));
      setStepValid?.(currentStep, valid);
    };

    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{ value?: string; valid?: boolean }>;
      const ok =
        typeof e.detail?.value === 'string' ? e.detail.value.trim().length > 0 : !!e.detail?.valid;
      setStepValidation(prev => ({ ...prev, [currentStep]: ok }));
      setStepValid?.(currentStep, ok);
    };

    window.addEventListener('quiz-selection-change', handleSelectionChange as EventListener);
    window.addEventListener('quiz-input-change', handleInputChange as EventListener);
    return () => {
      window.removeEventListener('navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-navigate-to-step', handleNavigate as EventListener);
      window.removeEventListener('quiz-selection-change', handleSelectionChange as EventListener);
      window.removeEventListener('quiz-input-change', handleInputChange as EventListener);
    };
  }, [goToStep]);

  // 🔄 HANDLERS DE NAVEGAÇÃO
  const handleNext = () => {
    if (currentStep < 21) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      nextStep();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      goToStep(prevStepNum);
    }
  };

  // (remoção de duplicidade: efeito acima já cuida do carregamento)
  // 🎯 FUNÇÕES DE VALIDAÇÃO E AVANÇO
  const validateStep = (currentBlocks: Block[]): boolean => {
    const questionBlocks = currentBlocks.filter(
      block => block.type === 'options-grid' || block.type === 'form-container'
    );

    if (questionBlocks.length === 0) return true; // Etapas sem perguntas são válidas

    return questionBlocks.every(block => {
      const questionId = block.properties?.questionId || block.id;
      const selections = userSelections[questionId] || [];

      if (block.type === 'form-container') {
        const answer = quizAnswers[block.content?.dataKey || 'default'];
        return block.content?.required ? !!answer && answer.trim().length > 0 : true;
      }

      // options-grid: usar regra centralizada considerando a fase da etapa
      const { isValid } = computeSelectionValidity(
        currentStep,
        selections.length,
        {
          requiredSelections: block.properties?.requiredSelections as number | undefined,
          minSelections: block.properties?.minSelections as number | undefined,
        }
      );
      return isValid;
    });
  };

  const handleQuestionResponse = (questionId: string, optionId: string, blockConfig?: any) => {
    setUserSelections(prev => {
      const current = prev[questionId] || [];
      const maxSelections = blockConfig?.maxSelections || 1;

      let newSelections;
      if (current.includes(optionId)) {
        // Remove seleção
        newSelections = current.filter(id => id !== optionId);
      } else {
        // Adiciona seleção
        if (maxSelections === 1) {
          newSelections = [optionId];
        } else {
          newSelections =
            current.length >= maxSelections
              ? [...current.slice(1), optionId]
              : [...current, optionId];
        }
      }

      const updated = { ...prev, [questionId]: newSelections };

      // Verificar se a etapa está completa
      // Debounce curto para validação
      debounce(`validate:step-${currentStep}`, () => {
        const isValid = validateStep(blocks);
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
        setStepValid?.(currentStep, isValid);

        // Auto avanço se configurado
        if (isValid && blockConfig?.autoAdvanceOnComplete) {
          const delay = blockConfig?.autoAdvanceDelay || 1500;
          schedule(`auto-advance:step-${currentStep}`, () => handleNext(), delay);
        }
      }, 120);

      return updated;
    });
  };

  const handleFormInput = (dataKey: string, value: string, blockConfig?: any) => {
    setQuizAnswers(prev => {
      const updated = { ...prev, [dataKey]: value };

      // Debounce curto para validação
      debounce(`validate:step-${currentStep}`, () => {
        const isValid = validateStep(blocks);
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
        setStepValid?.(currentStep, isValid);

        if (isValid && blockConfig?.autoAdvanceOnComplete) {
          const delay = blockConfig?.autoAdvanceDelay || 1500;
          schedule(`auto-advance:step-${currentStep}`, () => handleNext(), delay);
        }
      }, 120);

      return updated;
    });
  };

  // Cancela tarefas pendentes ao trocar de etapa (evita cross-step)
  useEffect(() => {
    cancelAll();
  }, [currentStep, cancelAll]);

  const progress = ((currentStep - 1) / 20) * 100;

  // Página de produção: sem DnD nem sidebars de edição

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      {/* CONTEÚDO CENTRAL PARA USUÁRIO FINAL */}
      <div className="flex min-h-screen">
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              {/* 🎯 CABEÇALHO PRINCIPAL DO QUIZ */}
              <div className="bg-white/90 backdrop-blur-sm border border-stone-200/50 shadow-sm rounded-lg mb-8 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-stone-800">Quiz Style Challenge</h2>
                    <div className="text-sm text-stone-600">Etapa {currentStep} de 21</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-48">
                      <Progress value={progress} className="h-2" />
                    </div>
                    <div className="text-sm font-medium text-stone-700">{progress}%</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                      disabled={currentStep === 1}
                    >
                      ← Anterior
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleNext}
                      disabled={currentStep === 21 || !stepValidation[currentStep]}
                      className={cn(
                        currentStep === 21 || !stepValidation[currentStep]
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355]'
                      )}
                    >
                      {currentStep === 21
                        ? 'Finalizado'
                        : !stepValidation[currentStep]
                          ? 'Complete a etapa'
                          : 'Próxima →'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 📋 HEADER DA ETAPA (limpo: sem textos promocionais fixos) */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-sm text-stone-500">Etapa {currentStep} de 21</div>
          <div className="w-32 bg-stone-200 rounded-full h-2">
                    <div
            className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-stone-600">{progress}%</div>
                </div>
              </div>

              {/* 🎨 ÁREA DE RENDERIZAÇÃO DOS BLOCOS */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
                {/* Estado de loading */}
        {isLoading && (
                  <div className="min-h-[500px] flex items-center justify-center">
                    <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4"></div>
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
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
                        <h3 className="text-lg font-medium text-stone-800 mb-2">
                          Etapa em construção
                        </h3>
                        <p className="text-stone-600">
                          Esta etapa ainda não possui conteúdo. Você pode continuar para a próxima
                          etapa ou arrastar componentes da barra lateral.
                        </p>
                      </div>
                    ) : (
                      blocks.map(block => (
                        <div
                          key={block.id}
                          className={cn(
                            'quiz-block',
            // Sem animações/transições fora do Canvas
                          )}
                        >
                          <UniversalBlockRenderer
                            block={{
                              ...block,
                              // Adicionar callbacks para interação
                              properties: {
                                ...block.properties,
                                onOptionSelect: (optionId: string) => {
                                  const questionId = block.properties?.questionId || block.id;
                                  handleQuestionResponse(questionId, optionId, block.properties);
                                },
                                onInputChange: (value: string) => {
                                  const dataKey = block.content?.dataKey || 'default';
                                  handleFormInput(dataKey, value, block.content);
                                },
                                selectedOptions:
                                  userSelections[block.properties?.questionId || block.id] || [],
                                inputValue: quizAnswers[block.content?.dataKey || 'default'] || '',
                                isValid: stepValidation[currentStep] || false,
                              },
                            }}
                            isSelected={false}
                            onClick={() => {}}
                          />
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
          'flex items-center gap-2 px-6 py-3 rounded-lg font-medium',
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
                  disabled={currentStep === 21 || !stepValidation[currentStep]}
                  className={cn(
          'flex items-center gap-2 px-6 py-3 rounded-lg font-medium',
                    currentStep === 21 || !stepValidation[currentStep]
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white hover:from-[#A08966] hover:to-[#7A6B4D] shadow-md hover:shadow-lg'
                  )}
                >
                  {currentStep === 21
                    ? 'Finalizado'
                    : !stepValidation[currentStep]
                      ? 'Complete a etapa →'
                      : 'Próxima →'}
                </button>
                {/* Utilitário opcional de recarga */}
                <button
                  onClick={() =>
                    TemplateManager.reloadTemplate(`step-${currentStep}`)
                      .then(setBlocks)
                      .catch(() => {})
                  }
                  className="ml-4 px-4 py-3 rounded-lg font-medium bg-white text-stone-700 hover:bg-stone-50 border border-stone-200 shadow-sm hover:shadow"
                  title="Recarregar blocos da etapa"
                >
                  🔄 Recarregar etapa
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
      </div>
    </div>
  );
};

export default QuizModularPage;
