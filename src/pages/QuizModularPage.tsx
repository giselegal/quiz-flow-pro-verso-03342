import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
// Removed header UI components for a cleaner production page
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { useJsonTemplate } from '@/hooks/useJsonTemplate';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import React, { useEffect, useMemo, useState } from 'react';

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
  const [autoAdvanceTimeouts, setAutoAdvanceTimeouts] = useState<Record<number, NodeJS.Timeout>>(
    {}
  );

  // Hook para gerenciar o fluxo do quiz
  const {
    quizState,
    actions: { goToStep, nextStep, preloadTemplates, setStepValid },
  } = useQuizFlow({
    mode: 'production',
    initialStep: currentStep,
  });

  // Pré-carregar templates para suavizar transições
  useEffect(() => {
    preloadTemplates?.();
  }, [preloadTemplates]);

  // (Carregamento movido para useJsonTemplate)
  const {
    blocks: templateBlocks,
    loading: templateLoading,
    error: templateError,
  } = useJsonTemplate(`step-${currentStep}`, { preload: true });

  // Sincronizar blocos/estado com o hook de template
  useEffect(() => {
    setIsLoading(templateLoading);
    setError(templateError ? `Erro ao carregar etapa ${currentStep}` : null);
    setBlocks(templateBlocks || []);

    if (!templateLoading && !templateError) {
      const isValid = validateStep(templateBlocks || []);
      setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
      setStepValid?.(currentStep, isValid);
    }
  }, [templateBlocks, templateLoading, templateError, currentStep]);

  // Removido: o próprio hook useJsonTemplate já recarrega ao mudar o stepId inicial
  // (evita chamadas duplas de loadStep que causavam piscadas)

  // Sincronizar step com hook do quiz
  useEffect(() => {
    if (quizState.currentStep !== currentStep) {
      setCurrentStep(quizState.currentStep);
    }
  }, [quizState.currentStep, currentStep]);

  // Escutar eventos de navegação e validação disparados pelos blocos
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
      console.log(
        '➡️ Navegação por evento:',
        e.detail?.stepId,
        '->',
        target,
        'origem:',
        e.detail?.source
      );
    };

    window.addEventListener('navigate-to-step', handleNavigate as EventListener);
    window.addEventListener('quiz-navigate-to-step', handleNavigate as EventListener);

    // Sincronizar validação visual/funcional via eventos globais dos blocos
    const handleSelectionChange = (ev: Event) => {
      const e = ev as CustomEvent<{ selectionCount?: number; isValid?: boolean; valid?: boolean }>;
      const count = e.detail?.selectionCount ?? 0;
      // Regras globais: etapas 2–11 exigem 3 seleções; 13–18 exigem 1; demais
      const isScoringPhase = currentStep >= 2 && currentStep <= 11;
      const isStrategicPhase = currentStep >= 13 && currentStep <= 18;
      const required = isScoringPhase ? 3 : isStrategicPhase ? 1 : 1;

      const eventSaysValid =
        typeof e.detail?.valid === 'boolean'
          ? e.detail.valid
          : typeof e.detail?.isValid === 'boolean'
            ? e.detail.isValid
            : undefined;

      const computedValid = count >= required;
      const finalValid =
        eventSaysValid === undefined ? computedValid : eventSaysValid && computedValid;

      setStepValidation(prev => ({ ...prev, [currentStep]: finalValid }));
      setStepValid?.(currentStep, finalValid);

      // Auto-avanço nas etapas 2–11 ao atingir requisito
      if (isScoringPhase && computedValid) {
        const delay = 600;
        const timeoutId = setTimeout(() => {
          handleNext();
        }, delay);
        setAutoAdvanceTimeouts(prev => ({ ...prev, [currentStep]: timeoutId }) as any);
      }
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
  }, [goToStep, currentStep, setStepValid]);

  // Expor etapa atual globalmente para compatibilidade com blocos que leem window.__quizCurrentStep
  useEffect(() => {
    (window as any).__quizCurrentStep = currentStep;
  }, [currentStep]);

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
      const minSelections =
        block.properties?.minSelections || block.properties?.requiredSelections || 1;

      if (block.type === 'form-container') {
        const answer = quizAnswers[block.content?.dataKey || 'default'];
        return block.content?.required ? !!answer && answer.trim().length > 0 : true;
      }

      return selections.length >= minSelections;
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
      setTimeout(() => {
        const isValid = validateStep(blocks);
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
        setStepValid?.(currentStep, isValid);

        // Auto avanço se configurado
        if (isValid && blockConfig?.autoAdvanceOnComplete) {
          const delay = blockConfig?.autoAdvanceDelay || 1500;
          const timeoutId = setTimeout(() => {
            handleNext();
          }, delay);

          setAutoAdvanceTimeouts(prev => ({
            ...prev,
            [currentStep]: timeoutId,
          }));
        }
      }, 100);

      return updated;
    });
  };

  const handleFormInput = (dataKey: string, value: string, blockConfig?: any) => {
    setQuizAnswers(prev => {
      const updated = { ...prev, [dataKey]: value };

      setTimeout(() => {
        const isValid = validateStep(blocks);
        setStepValidation(prev => ({ ...prev, [currentStep]: isValid }));
        setStepValid?.(currentStep, isValid);

        // Auto avanço se configurado
        if (isValid && blockConfig?.autoAdvanceOnComplete) {
          const delay = blockConfig?.autoAdvanceDelay || 1500;
          const timeoutId = setTimeout(() => {
            handleNext();
          }, delay);

          setAutoAdvanceTimeouts(prev => ({
            ...prev,
            [currentStep]: timeoutId,
          }));
        }
      }, 100);

      return updated;
    });
  };

  // Limpar timeouts ao trocar de etapa
  useEffect(() => {
    return () => {
      Object.values(autoAdvanceTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [currentStep]);

  // Progress bar removida; cálculo de progresso não é mais necessário

  // Debounce opcional para exibição de loading (reduz flicker em trocas rápidas)
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;
    if (isLoading) {
      t = setTimeout(() => setShowLoading(true), 120);
    } else {
      setShowLoading(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [isLoading]);

  // Página final: remover DnD/sidebars e usar HTML estático otimizado na Etapa 1
  const renderStaticStep1 = true;
  const step1Config = useMemo(
    () => ({
      logoUrl:
        'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      title: 'Quiz de Estilo Pessoal',
      subtitle: '',
      ctaText: 'Quero Descobrir meu Estilo Agora!',
      requiredMessage: 'Digite seu nome para continuar',
    }),
    []
  );

  const StaticStep1: React.FC = () => {
    const [name, setName] = useState('');
    const isValid = name.trim().length > 0;

    useEffect(() => {
      // Emitir eventos esperados e sincronizar validação superior
      const detail = { value: name, valid: isValid } as any;
      window.dispatchEvent(new CustomEvent('quiz-input-change', { detail }));
      window.dispatchEvent(
        new CustomEvent('step01-button-state-change', {
          detail: { buttonId: 'intro-cta-button', enabled: isValid, disabled: !isValid },
        })
      );
      setStepValidation(prev => ({ ...prev, 1: isValid }));
      setStepValid?.(1, isValid);
      setQuizAnswers(prev => ({ ...prev, userName: name }));
    }, [name]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid) return;
      const detail = { stepId: 'step-2', source: 'static-step1' } as any;
      window.dispatchEvent(new CustomEvent('navigate-to-step', { detail }));
      window.dispatchEvent(new CustomEvent('quiz-navigate-to-step', { detail }));
      handleNext();
    };

    return (
      <section aria-labelledby="quiz-title" className="p-6">
        <header className="text-center mb-6">
          <img
            src={step1Config.logoUrl}
            alt="Logo"
            width={96}
            height={96}
            className="mx-auto mb-3"
            loading="eager"
            decoding="async"
          />
          <h1 id="quiz-title" className="text-2xl md:text-3xl font-semibold text-stone-800">
            {step1Config.title}
          </h1>
          {step1Config.subtitle && <p className="text-stone-600 mt-1">{step1Config.subtitle}</p>}
        </header>

        <form className="max-w-md mx-auto" onSubmit={handleSubmit} noValidate>
          <label htmlFor="user-name" className="block text-sm font-medium text-stone-700 mb-1">
            Seu nome
          </label>
          <input
            id="user-name"
            name="userName"
            type="text"
            autoComplete="given-name"
            placeholder="Digite seu primeiro nome"
            className="w-full border-2 border-[#B89B7A] rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#B89B7A]/40"
            value={name}
            onChange={e => setName(e.target.value)}
            aria-invalid={!isValid}
            aria-describedby={!isValid ? 'name-help' : undefined}
          />
          {!isValid && (
            <p id="name-help" className="text-sm text-stone-500 mt-2">
              {step1Config.requiredMessage}
            </p>
          )}

          <button
            id="intro-cta-button"
            type="submit"
            disabled={!isValid}
            className={cn(
              'mt-4 w-full px-4 py-3 rounded-md font-medium transition-colors',
              isValid
                ? 'bg-gradient-to-r from-[#B89B7A] to-[#8B7355] text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            )}
          >
            {step1Config.ctaText}
          </button>

          <noscript>
            <p className="text-xs text-stone-500 mt-2">Ative o JavaScript para continuar o quiz.</p>
          </noscript>
        </form>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalhos removidos para interface mais limpa na versão de produção */}

          {/* 🎨 ÁREA DE RENDERIZAÇÃO DOS BLOCOS */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-stone-200/40 border border-stone-200/30 ring-1 ring-stone-100/20 overflow-hidden">
            {currentStep === 1 && renderStaticStep1 ? (
              <StaticStep1 />
            ) : showLoading ? (
              <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-[#B89B7A] border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-stone-600">Carregando etapa {currentStep}...</p>
                </div>
              </div>
            ) : error ? (
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
            ) : (
              <div className="quiz-content p-8 space-y-6">
                {blocks.length === 0 ? (
                  // Etapa sem conteúdo: nenhum texto exibido para manter a interface limpa
                  <div className="py-12" aria-hidden="true" />
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
                      <UniversalBlockRenderer
                        block={{
                          ...block,
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
              disabled={currentStep === 21 || !stepValidation[currentStep]}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
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
          </div>

          {/* Footer de estatísticas removido para interface mais clean */}
        </div>
      </div>
    </div>
  );
};

export default QuizModularPage;
