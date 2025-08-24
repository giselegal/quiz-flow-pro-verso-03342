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
      introImageUrl:
        'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
      ctaText: 'Quero Descobrir meu Estilo Agora!',
      requiredMessage: 'Digite seu nome para continuar',
      legal: {
        text: 'Suas informações são seguras. Ao continuar, você concorda com nossa Política de Privacidade e Termos.',
        privacyText: 'Política de Privacidade',
        termsText: 'Termos de Uso',
        privacyLinkUrl: '/privacy',
        termsLinkUrl: '/terms',
      },
      footerText: '2025 - Gisele Galvão - Todos os direitos reservados',
    }),
    []
  );

  const StaticStep1: React.FC = () => {
    const [name, setName] = useState('');
    const isValid = name.trim().length > 0;

    // Derivar conteúdos da etapa 1 a partir dos blocos carregados, para refletir edições do editor
    const derived = useMemo(() => {
      const find = (t: string) => blocks.find(b => b.type === t);
      const findById = (id: string) => blocks.find(b => b.id === id);
      const header = find('quiz-intro-header');
      const titleTextBlock = findById('step1-title') || blocks.find(b => b.type === 'text');
      const imageBlock = find('image');
      const formContainer = find('form-container');
      const legal = find('legal-notice');
      const footer = findById('step1-footer');

      const children = (formContainer?.properties as any)?.children || [];
      const inputChild = children.find((c: any) => c.type === 'form-input');
      const buttonChild = children.find((c: any) => c.type === 'button-inline');

      return {
        logoUrl: (header?.properties as any)?.logoUrl || step1Config.logoUrl,
        titleHtml: (titleTextBlock as any)?.content?.text as string | undefined,
        introImageUrl: (imageBlock?.properties as any)?.src || step1Config.introImageUrl,
        labelText: (inputChild?.properties as any)?.label || 'NOME',
        placeholder:
          (inputChild?.properties as any)?.placeholder || 'Digite seu primeiro nome aqui...',
        buttonText: (buttonChild?.properties as any)?.text || step1Config.ctaText,
        requiredMessage:
          (formContainer as any)?.content?.validationMessage || step1Config.requiredMessage,
        legal: {
          text: (legal?.properties as any)?.copyrightText || step1Config.legal.text,
          privacyText: (legal?.properties as any)?.privacyText || step1Config.legal.privacyText,
          termsText: (legal?.properties as any)?.termsText || step1Config.legal.termsText,
          privacyLinkUrl:
            (legal?.properties as any)?.privacyLinkUrl || step1Config.legal.privacyLinkUrl,
          termsLinkUrl: (legal?.properties as any)?.termsLinkUrl || step1Config.legal.termsLinkUrl,
        },
        footerText: (footer as any)?.content?.text || step1Config.footerText,
      };
    }, [blocks, step1Config]);

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
        {/* Header do quiz-intro-header */}
        <div className="max-w-2xl mx-auto bg-[#F8F9FA] text-center p-6 rounded-lg shadow-sm mb-4">
          <img
            src={derived.logoUrl}
            alt="Logo Gisele Galvão"
            width={96}
            height={96}
            className="mx-auto mb-3"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Título estilizado (text block) */}
        <div className="max-w-2xl mx-auto text-center mb-2">
          {derived.titleHtml ? (
            <h1
              id="quiz-title"
              className="text-3xl md:text-4xl font-bold leading-tight"
              style={{ color: '#432818' }}
              dangerouslySetInnerHTML={{ __html: derived.titleHtml }}
            />
          ) : (
            <h1
              id="quiz-title"
              className="text-3xl md:text-4xl font-bold leading-tight"
              style={{ color: '#432818' }}
            >
              Quiz de Estilo Pessoal
            </h1>
          )}
        </div>

        {/* Imagem de introdução */}
        <div className="max-w-2xl mx-auto flex justify-center mb-3">
          <img
            src={derived.introImageUrl}
            alt=""
            className="object-cover rounded-xl"
            loading="lazy"
            decoding="async"
            style={{ maxWidth: '300px', height: 'auto' }}
          />
        </div>

        {/* Barra decorativa */}
        <div className="max-w-2xl mx-auto flex justify-center mb-6">
          <div
            aria-hidden="true"
            style={{
              width: 'min(640px, 100%)',
              height: 4,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #B89B7A 0%, #D4C2A8 50%, #B89B7A 100%)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
            }}
          />
        </div>

        {/* Formulário (form-container + form-input + button-inline) */}
        <form
          className="max-w-2xl mx-auto"
          onSubmit={handleSubmit}
          noValidate
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg p-4 pointer-events-auto">
            <label
              htmlFor="user-name"
              className="block text-sm font-medium mb-1"
              style={{ color: '#432818' }}
            >
              {derived.labelText || 'NOME'}
            </label>
            <input
              id="user-name"
              name="userName"
              type="text"
              autoComplete="given-name"
              autoFocus
              placeholder={derived.placeholder}
              className="w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #B89B7A',
                color: '#432818',
                borderRadius: 8,
                fontSize: 16,
              }}
              value={name}
              onChange={e => setName(e.target.value)}
              aria-invalid={!isValid}
              aria-describedby={!isValid ? 'name-help' : undefined}
              required
            />
            {!isValid && (
              <p id="name-help" className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
                {derived.requiredMessage}
              </p>
            )}

            <button
              id="intro-cta-button"
              type="submit"
              disabled={!isValid}
              className={cn('mt-4 w-full px-4 py-3 rounded-md font-medium transition-opacity')}
              style={{
                backgroundColor: isValid ? '#B89B7A' : '#E7E5E4',
                color: isValid ? '#FFFFFF' : '#A8A29E',
                border: '1px solid #B89B7A',
                borderRadius: 8,
              }}
            >
              {derived.buttonText}
            </button>
          </div>

          <noscript>
            <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
              Ative o JavaScript para continuar o quiz.
            </p>
          </noscript>
        </form>

        {/* Aviso legal */}
        <div className="max-w-2xl mx-auto text-center mt-6" style={{ color: '#9CA3AF' }}>
          <p className="text-xs">
            {derived.legal.text}{' '}
            <a
              href={derived.legal.privacyLinkUrl}
              className="underline"
              style={{ color: '#B89B7A' }}
            >
              {derived.legal.privacyText}
            </a>{' '}
            e{' '}
            <a href={derived.legal.termsLinkUrl} className="underline" style={{ color: '#B89B7A' }}>
              {derived.legal.termsText}
            </a>
            .
          </p>
          <p className="text-xs mt-2">{derived.footerText}</p>
        </div>
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
