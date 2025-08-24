import UniversalBlockRenderer from '@/components/editor/blocks/UniversalBlockRenderer';
import EnhancedComponentsSidebar from '@/components/editor/EnhancedComponentsSidebar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useQuizFlow } from '@/hooks/core/useQuizFlow';
import { useJsonTemplate } from '@/hooks/useJsonTemplate';
import { cn } from '@/lib/utils';
import { Block, BlockType } from '@/types/editor';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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
  const { blocks: templateBlocks, loading: templateLoading, error: templateError, loadStep } =
    useJsonTemplate(`step-${currentStep}`, { preload: true });

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

  // Recarregar quando currentStep mudar
  useEffect(() => {
    loadStep(`step-${currentStep}`);
  }, [currentStep, loadStep]);

  // Sincronizar step com hook do quiz
  useEffect(() => {
    if (quizState.currentStep !== currentStep) {
      setCurrentStep(quizState.currentStep);
    }
  }, [quizState.currentStep, currentStep]);

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
      const e = ev as CustomEvent<{ selectionCount?: number; isValid?: boolean }>; 
      const valid = !!e.detail?.isValid;
      setStepValidation(prev => ({ ...prev, [currentStep]: valid }));
      setStepValid?.(currentStep, valid);
    };

    const handleInputChange = (ev: Event) => {
      const e = ev as CustomEvent<{ value?: string; valid?: boolean }>; 
      const ok = typeof e.detail?.value === 'string' ? e.detail.value.trim().length > 0 : !!e.detail?.valid;
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

  const progress = ((currentStep - 1) / 20) * 100;

  // Configuração do DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Handler para drag and drop de componentes
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeData = active.data.current;

    // Se arrastar um componente para o canvas
    if (activeData?.type === 'sidebar-component') {
      const componentType = activeData.blockType as BlockType;

      console.log('🧩 Adicionando componente:', componentType);

      // Criar novo bloco
      const newBlock: Block = {
        id: `${componentType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: componentType,
        content: getDefaultContentForType(componentType),
        properties: getDefaultPropertiesForType(componentType),
        order: blocks.length,
      };

      setBlocks(prev => [...prev, newBlock]);
    }
  };

  // Função para obter conteúdo padrão por tipo
  const getDefaultContentForType = (type: string) => {
    const defaults: Record<string, any> = {
      'text-inline': { text: 'Novo texto adicionado' },
      'heading-inline': { text: 'Novo Título', level: 'h2' },
      'button-inline': { text: 'Novo Botão', variant: 'primary' },
      'image-display-inline': { src: '', alt: 'Nova imagem' },
      'quiz-intro-header': {
        title: 'Novo Título do Quiz',
        subtitle: 'Novo Subtítulo',
        description: 'Nova descrição do quiz',
      },
      'form-input': {
        title: 'Novo Campo',
        placeholder: 'Digite aqui...',
        fieldType: 'text',
        required: false,
      },
      'quiz-question': {
        question: 'Nova pergunta?',
        options: ['Nova Opção 1', 'Nova Opção 2'],
      },
    };
    return defaults[type] || {};
  };

  // Função para obter propriedades padrão por tipo
  const getDefaultPropertiesForType = (type: string) => {
    const defaults: Record<string, any> = {
      'text-inline': { fontSize: 16, color: '#333333' },
      'heading-inline': { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
      'button-inline': { backgroundColor: '#B89B7A', color: '#ffffff', padding: 12 },
      'image-display-inline': { width: 'auto', height: 'auto' },
    };
    return defaults[type] || {};
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-[#FAF9F7] via-[#F5F2E9] to-[#EEEBE1]">
        {/* ️ LAYOUT COM 3 COLUNAS */}
        <div className="flex h-screen">
          {/* 📋 COLUNA ESQUERDA - ETAPAS (já existe na navegação superior, mas podemos adicionar detalhes) */}
          <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-stone-200/50 shadow-sm">
            <div className="h-full flex flex-col">
              {/* Header das Etapas */}
              <div className="p-4 border-b border-stone-200/50 bg-stone-50/50">
                <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-[#B89B7A] to-[#8B7355] rounded-md flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{currentStep}</span>
                  </div>
                  Etapa Atual
                </h3>
                <p className="text-xs text-stone-500 mt-1">{currentStep} de 21 etapas</p>
              </div>

              {/* Conteúdo da etapa atual */}
              <div className="flex-1 p-4 space-y-4">
                <div className="bg-gradient-to-r from-[#B89B7A]/10 to-[#8B7355]/10 rounded-lg p-4">
                  <h4 className="font-medium text-stone-800 mb-2">Progresso</h4>
                  <div className="w-full bg-stone-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-sm text-stone-600">{progress}% concluído</div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-stone-800">Informações da Etapa</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-600">Etapa:</span>
                      <span className="font-medium">{currentStep}/21</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Blocos:</span>
                      <span className="font-medium">{blocks.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600">Status:</span>
                      <span className="font-medium text-green-600">
                        {blocks.length > 0 ? 'Carregada' : 'Vazia'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🧩 COLUNA CENTRO-ESQUERDA - COMPONENTES */}
          <aside className="w-80 bg-white/95 backdrop-blur-sm border-r border-stone-200/50 shadow-sm">
            <div className="h-full flex flex-col">
              {/* Header dos Componentes */}
              <div className="p-4 border-b border-stone-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                    <span className="text-white text-xs">🧩</span>
                  </div>
                  Componentes
                </h3>
                <p className="text-xs text-stone-500 mt-1">Arraste para adicionar ao quiz</p>
              </div>
              {/* Sidebar Unificada */}
              <div className="flex-1 overflow-hidden">
                <EnhancedComponentsSidebar />
              </div>
            </div>
          </aside>

          {/* 🎨 ÁREA PRINCIPAL - CENTRO-DIREITA */}
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
                          'transition-all',
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
                        className="bg-gradient-to-r from-[#B89B7A] to-[#8B7355] h-2 rounded-full transition-all duration-500"
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
                        <h3 className="text-lg font-semibold text-red-800 mb-2">
                          Erro ao carregar
                        </h3>
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
                          <h3 className="text-lg font-medium text-stone-800 mb-2">
                            Etapa em construção
                          </h3>
                          <p className="text-stone-600">
                            Esta etapa ainda não possui conteúdo. Você pode continuar para a próxima
                            etapa ou arrastar componentes da barra lateral.
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
                                  inputValue:
                                    quizAnswers[block.content?.dataKey || 'default'] || '',
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
    </DndContext>
  );
};

export default QuizModularPage;
