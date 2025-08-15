import { calculateQuizScore } from '@/data/correctQuizQuestions';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { useTemplateManager } from '../hooks/useTemplateManager';
import { useEditorPersistence } from '../hooks/editor/useEditorPersistence';
import type { Block } from '../types/editor';
import { EditorBlock, FunnelStage } from '../types/editor';
import { TemplateManager } from '../utils/TemplateManager';
import { performanceAnalyzer } from '../utils/performanceAnalyzer';
import { useFunnelComponents } from '../hooks/useFunnelComponents';
import { getFunnelIdFromEnvOrStorage, parseStepNumberFromStageId } from '../utils/funnelIdentity';

// ✅ IMPORTAR SISTEMA DE MAPEAMENTO REAL DAS ETAPAS
import { getAllSteps, getStepTemplate } from '../config/stepTemplatesMapping';

// ✅ IMPORTAR HOOKS DE QUIZ PARA INTEGRAÇÃO
import { useQuizLogic } from '../hooks/useQuizLogic';
import { useSupabaseQuiz } from '../hooks/useSupabaseQuiz';
import { useQuizCRUD } from '../hooks/useQuizCRUD';
import caktoquizQuestions from '../data/caktoquizQuestions';

interface EditorState {
  state: 'ready' | 'loading' | 'error';
}

const initialState: EditorState = {
  state: 'ready',
};

type EditorAction =
  | { type: 'SET_STATE'; payload: 'ready' | 'loading' | 'error' }
  | { type: 'RESET' };

const reducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, state: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

// ✅ INTERFACE UNIFICADA DO CONTEXTO
interface EditorContextType {
  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO CENTRALIZADO (ÚNICA FONTE DE VERDADE)
  // ═══════════════════════════════════════════════
  stages: FunnelStage[]; // ✅ ETAPAS INTEGRADAS NO EDITOR
  activeStageId: string; // ✅ ETAPA ATIVA ATUAL
  selectedBlockId: string | null; // ✅ BLOCO SELECIONADO
  editorState: EditorState; // ✅ ESTADO DO EDITOR

  // ✅ NOVO: Sistema de persistência Supabase
  funnelId: string; // ✅ ID DO FUNIL ATUAL
  isSupabaseEnabled: boolean; // ✅ PERSISTÊNCIA HABILITADA

  // ═══════════════════════════════════════════════
  // 🔧 ACTIONS ORGANIZADAS POR CATEGORIA
  // ═══════════════════════════════════════════════
  stageActions: {
    setActiveStage: (stageId: string) => void;
    addStage: (stage?: Partial<FunnelStage>) => string;
    removeStage: (stageId: string) => void;
    updateStage: (stageId: string, updates: Partial<FunnelStage>) => void;
  };

  blockActions: {
    addBlock: (type: string, stageId?: string) => Promise<string>;
    addBlockAtPosition: (type: string, position: number, stageId?: string) => Promise<string>;
    duplicateBlock: (blockId: string, stageId?: string) => string;
    deleteBlock: (blockId: string) => Promise<void>;
    updateBlock: (blockId: string, updates: Partial<EditorBlock>) => Promise<void>;
    reorderBlocks: (blockIds: string[], stageId?: string) => Promise<void>;
    setSelectedBlockId: (blockId: string | null) => void;
    getBlocksForStage: (stageId: string) => EditorBlock[];
  };

  templateActions: {
    loadTemplate: (templateId: string) => Promise<void>;
    loadTemplateByStep: (step: number) => Promise<void>;
    applyCurrentTemplate: () => Promise<void>;
    isLoadingTemplate: boolean;
  };

  persistenceActions: {
    saveFunnel: () => Promise<{ success: boolean; error?: string }>;
    isSaving: boolean;
  };

  uiState: {
    isPreviewing: boolean;
    setIsPreviewing: (value: boolean) => void;
    viewportSize: 'sm' | 'md' | 'lg' | 'xl';
    setViewportSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  };

  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES (OTIMIZADOS)
  // ═══════════════════════════════════════════════
  computed: {
    currentBlocks: EditorBlock[];
    selectedBlock: EditorBlock | undefined;
    totalBlocks: number;
    stageCount: number;
  };

  // ═══════════════════════════════════════════════
  // 🔌 SISTEMA DE COMPONENTES REUTILIZÁVEIS
  // ═══════════════════════════════════════════════
  databaseMode: {
    isEnabled: boolean;
    quizId: string;
    setDatabaseMode: (enabled: boolean) => void;
    setQuizId: (quizId: string) => void;
    migrateToDatabase: () => Promise<boolean>;
    getStats: () => Promise<any>;
  };

  // ✅ ATUALIZADO: Sistema de Quiz Integrado com Hooks
  quizState: {
    // Estado do quiz
    userName: string;
    userAnswers: Record<string, string>;
    isQuizCompleted: boolean;
    currentScore: ReturnType<typeof calculateQuizScore> | null;
    quizResult: any; // Resultado do useQuizLogic
    
    // Ações básicas
    setUserNameFromInput: (name: string) => void;
    setAnswer: (questionId: string, answer: string) => void;
    resetQuiz: () => void;
    calculateCurrentScore: () => void;
    
    // ✅ NOVOS: Métodos dos hooks integrados
    answerQuestion: (questionId: string, optionId: string) => void;
    answerStrategicQuestion: (questionId: string, optionId: string, category: string, strategicType: string) => void;
    completeQuiz: () => void;
    
    // Estado avançado dos hooks
    currentQuestionIndex: number;
    totalQuestions: number;
    answers: any[];
    strategicAnswers: any[];
  };
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🔥 EditorProvider: INICIANDO PROVIDER!');
  console.log('🔥 EditorProvider: Ambiente atual:', {
    isDev: import.meta.env.DEV,
    mode: import.meta.env.MODE,
    supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
    supabaseEnabled: import.meta.env.VITE_EDITOR_SUPABASE_ENABLED,
  });

  // Estado principal do editor
  const [state, dispatch] = useReducer(reducer, initialState);

  // ✅ NOVO: Sistema de persistência Supabase
  const funnelId = getFunnelIdFromEnvOrStorage() || 'default-funnel';
  console.log('🔍 EditorProvider: FunnelId inicializado:', funnelId);

  const [activeStageId, setActiveStageId] = useState<string>('step-01');
  const currentStepNumber = parseStepNumberFromStageId(activeStageId);

  // Configuração de persistência
  const isSupabaseEnabled = import.meta.env.VITE_EDITOR_SUPABASE_ENABLED === 'true';

  // Hook para gerenciar componentes no Supabase
  const {
    components: supabaseComponents,
    isLoading: isLoadingSupabase,
    addComponent: addSupabaseComponent,
    updateComponent: updateSupabaseComponent,
    deleteComponent: deleteSupabaseComponent,
    reorderComponents: reorderSupabaseComponents,
    // refreshComponents: refreshSupabaseComponents, // TODO: Usar quando necessário
  } = useFunnelComponents({
    funnelId,
    stepNumber: currentStepNumber,
    enabled: isSupabaseEnabled,
  });

  console.log('📊 Supabase Integration:', {
    enabled: isSupabaseEnabled,
    funnelId,
    stepNumber: currentStepNumber,
    componentsCount: supabaseComponents.length,
    isLoading: isLoadingSupabase,
  });

  // 📊 PERFORMANCE MONITORING OTIMIZADO
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Usar requestIdleCallback para não impactar inicialização
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          console.log('🚀 EditorProvider: Análise de performance (baixa prioridade)');
          performanceAnalyzer.startMonitoring();
        });
      }
    }
  }, []);

  // ✅ INTEGRAÇÃO DOS HOOKS DE QUIZ
  console.log('🎯 EditorProvider: Integrando hooks de quiz...');
  
  // Hook principal de lógica do quiz
  const quizLogic = useQuizLogic();
  
  // Hook de integração com Supabase (inicializar com questões)
  const supabaseQuiz = useSupabaseQuiz(caktoquizQuestions);
  
  // Hook de CRUD operations
  const quizCRUD = useQuizCRUD();

  console.log('🔗 Quiz Hooks Status:', {
    quizLogicReady: !!quizLogic,
    userName: quizLogic.userName,
    answersCount: quizLogic.answers.length,
    strategicAnswersCount: quizLogic.strategicAnswers.length,
    isCompleted: quizLogic.quizCompleted,
    hasResult: !!quizLogic.quizResult,
    supabaseReady: !!supabaseQuiz,
    supabaseStarted: supabaseQuiz.isStarted,
    crudReady: !!quizCRUD,
  });

  // ✅ INTEGRAÇÃO: Event Listeners para conectar templates aos hooks
  useEffect(() => {
    console.log('🎯 EditorProvider: Configurando event listeners para quiz...');

    const handleQuizFormComplete = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { formData } = customEvent.detail || {};
      
      if (formData?.name) {
        console.log('👤 EditorContext: Capturando nome do usuário via event:', formData.name);
        quizLogic.setUserNameFromInput(formData.name);
      }
    };

    const handleQuizSelectionChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { selectedOptions, questionId } = customEvent.detail || {};
      
      if (selectedOptions && questionId) {
        console.log('📊 EditorContext: Capturando seleções via event:', { questionId, selectedOptions });
        selectedOptions.forEach((optionId: string) => {
          quizLogic.answerQuestion(questionId, optionId);
        });
      }
    };

    // Registrar listeners
    window.addEventListener('quiz-form-complete', handleQuizFormComplete);
    window.addEventListener('quiz-selection-change', handleQuizSelectionChange);

    return () => {
      window.removeEventListener('quiz-form-complete', handleQuizFormComplete);
      window.removeEventListener('quiz-selection-change', handleQuizSelectionChange);
    };
  }, [quizLogic]);

  // ✅ INTEGRAÇÃO COM TEMPLATE MANAGER
  const templateManager = useTemplateManager({
    onAddBlock: async (blockData: Block) => {
      const stageId = activeStageId;
      const blockId = await addBlock(blockData.type, stageId);
      if (blockId) {
        await updateBlock(blockId, {
          content: blockData.content,
          order: blockData.order,
        });
      }
    },
    onUpdateBlock: async (blockId: string, updates: Partial<Block>) => {
      await updateBlock(blockId, updates);
    },
  });

  // ✅ INTEGRAÇÃO COM SISTEMA DE PERSISTÊNCIA
  const { saveFunnel: saveFunnelToPersistence, isSaving: isPersistenceSaving } =
    useEditorPersistence();

  // ═══════════════════════════════════════════════
  // 🔌 INICIALIZAR ADAPTER DO BANCO DE DADOS
  // ═══════════════════════════════════════════════
  // Database adapter removed - using direct state management only
  const adapter = {
    setDatabaseMode: (_enabled: boolean) => {},
    setQuizId: (_quizId: string) => {},
    migrateLocalToDatabase: () => Promise.resolve(false),
    getQuizStats: () => Promise.resolve({ error: 'Database adapter not available' }),
  };

  // Estado do modo banco
  const [databaseModeEnabled, setDatabaseModeEnabled] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState('quiz-demo-id');

  // ═══════════════════════════════════════════════
  // 🏗️ ESTADO PRINCIPAL CENTRALIZADO - USANDO DADOS REAIS DO MAPEAMENTO
  // ═══════════════════════════════════════════════
  const [stages, setStages] = useState<FunnelStage[]>(() => {
    console.log('🚀 EditorProvider: Inicializando etapas com dados REAIS do stepTemplatesMapping');

    // ✅ USAR DADOS REAIS DO SISTEMA DE MAPEAMENTO
    const realStepTemplates = getAllSteps();
    console.log('📋 Templates reais carregados:', realStepTemplates.length);

    const realStages: FunnelStage[] = realStepTemplates.map((stepTemplate) => {
      const stepNumber = stepTemplate.stepNumber;
      const stepId = `step-${String(stepNumber).padStart(2, '0')}`;
      
      // Determinar tipo da etapa baseado no conteúdo real
      let type: 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer' = 'question';
      
      if (stepNumber === 1) {
        type = 'intro'; // Introdução
      } else if (stepNumber === 2) {
        type = 'lead'; // Nome (captura de lead)
      } else if (stepNumber >= 3 && stepNumber <= 13) {
        type = 'question'; // Perguntas principais do quiz
      } else if (stepNumber === 14) {
        type = 'question'; // Última pergunta estratégica
      } else if (stepNumber === 15) {
        type = 'transition'; // Transição
      } else if (stepNumber === 16) {
        type = 'processing'; // Processamento
      } else if (stepNumber >= 17 && stepNumber <= 19) {
        type = 'result'; // Resultados
      } else if (stepNumber === 20) {
        type = 'offer'; // Oferta/Conversão
      } else if (stepNumber === 21) {
        type = 'offer'; // Thank you page
      }

      return {
        id: stepId,
        name: stepTemplate.name, // ✅ NOME REAL DO TEMPLATE
        order: stepNumber,
        type,
        description: stepTemplate.description, // ✅ DESCRIÇÃO REAL DO TEMPLATE
        isActive: stepNumber === 1,
        metadata: {
          blocksCount: 0,
          lastModified: new Date(),
          isCustom: false,
          templateBlocks: [],
        },
      };
    });

    console.log('✅ EditorProvider: Etapas REAIS sincronizadas:', realStages.length);
    console.log('✅ EditorProvider: Primeira etapa REAL:', realStages[0]);
    console.log('✅ EditorProvider: Segunda etapa REAL (Nome):', realStages[1]);
    console.log('✅ EditorProvider: Terceira etapa REAL (Roupa Favorita):', realStages[2]);
    console.log('✅ EditorProvider: Última etapa REAL:', realStages[realStages.length - 1]);
    console.log(
      '✅ EditorProvider: Lista das etapas REAIS:',
      realStages.map(s => `${s.order}: ${s.name}`)
    );
    return realStages;
  });

  const [stageBlocks, setStageBlocks] = useState<Record<string, EditorBlock[]>>(() => {
    // ✅ INICIALIZAR BLOCOS VAZIOS - CARREGAR TEMPLATES JSON ASSÍNCRONO
    const initialBlocks: Record<string, EditorBlock[]> = {};

    // Inicializar todas as etapas com arrays vazios
    for (let i = 1; i <= 21; i++) {
      const stageId = `step-${String(i).padStart(2, '0')}`;
      initialBlocks[stageId] = [];
    }

    console.log('✅ EditorProvider: Inicialização com arrays vazios para carregamento assíncrono');
    return initialBlocks;
  });

  // ✅ SISTEMA HÍBRIDO: CARREGAMENTO COM TSX TEMPLATES CONECTADOS
  useEffect(() => {
    console.log('🔄 EditorProvider: Iniciando useEffect para carregamento de templates');
    
    const loadInitialTemplates = async () => {
      console.log('🔄 EditorProvider: Função loadInitialTemplates executada');
      console.log('🔄 EditorProvider: Carregando templates híbridos TSX/JSON convertidos');

      // Usar requestIdleCallback para não bloquear UI
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(async () => {
          try {
            // Import do conversor de templates
            const { convertTemplateConfigsToBlocks } = await import('../utils/templateBlockConverter');
            
            // Carregar primeira etapa usando sistema híbrido
            const stageId = 'step-01';
            const stepNumber = 1;
            console.log(`🔄 Carregando template híbrido: ${stageId}`);
            
            // ✅ USAR SISTEMA HÍBRIDO: TSX TEMPLATES CONECTADOS + CONVERSÃO
            const templateConfigs = getStepTemplate(stepNumber);
            console.log(`🔍 DEBUG getStepTemplate(${stepNumber}):`, {
              result: templateConfigs,
              type: typeof templateConfigs,
              isArray: Array.isArray(templateConfigs),
              length: templateConfigs?.length,
            });
            
            if (templateConfigs && templateConfigs.length > 0) {
              // ✅ CONVERTER: Configurações TSX → Blocos JSON Editáveis
              const editableBlocks = convertTemplateConfigsToBlocks(templateConfigs, stageId);
              console.log(`🔄 Convertidos ${templateConfigs.length} configs → ${editableBlocks.length} blocos editáveis`);
              
              setStageBlocks(prev => ({
                ...prev,
                [stageId]: editableBlocks,
              }));
              console.log(`✅ Template híbrido ${stageId} carregado: ${editableBlocks.length} blocos`);
            } else {
              console.warn(`⚠️ Template híbrido ${stageId}: Nenhum bloco retornado`);
            }

            // Carregar outras etapas com delay progressivo usando sistema híbrido
            setTimeout(() => {
              for (let i = 2; i <= 5; i++) {
                const nextStageId = `step-${String(i).padStart(2, '0')}`;
                setTimeout(async () => {
                  try {
                    // ✅ USAR SISTEMA HÍBRIDO PARA TODAS AS ETAPAS + CONVERSÃO
                    const { convertTemplateConfigsToBlocks } = await import('../utils/templateBlockConverter');
                    const templateConfigs = getStepTemplate(i);
                    
                    if (templateConfigs && templateConfigs.length > 0) {
                      // ✅ CONVERTER: Configurações TSX → Blocos JSON Editáveis
                      const editableBlocks = convertTemplateConfigsToBlocks(templateConfigs, nextStageId);
                      
                      setStageBlocks(prev => ({
                        ...prev,
                        [nextStageId]: editableBlocks,
                      }));
                      console.log(`✅ Template híbrido ${nextStageId} carregado: ${editableBlocks.length} blocos`);
                    }
                  } catch (error) {
                    console.warn(`⚠️ Erro ao carregar template híbrido ${nextStageId}:`, error);
                  }
                }, i * 100); // Delay de 100ms entre etapas
              }
            }, 1000); // Aguardar 1s antes de carregar demais
            
          } catch (error) {
            console.error('❌ Erro no carregamento híbrido:', error);
          }
        });
      } else {
        // Fallback para browsers sem requestIdleCallback
        setTimeout(() => {
          loadInitialTemplates();
        }, 100);
      }
    };

    loadInitialTemplates();
  }, []); // Executar apenas uma vez na inicialização

  // ✅ SISTEMA LEGACY REMOVIDO - APENAS CLEAN_21_STEPS CONFIG USADO

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // ✅ FUNÇÃO PARA SALVAR O ESTADO ATUAL DO EDITOR
  const saveFunnel = useCallback(async () => {
    try {
      console.log('💾 [EditorContext] Iniciando salvamento do funil...');

      // Converter o estado atual do editor para o formato de persistência
      const funnelData = {
        id: funnelId,
        name: `Quiz Funil - ${new Date().toLocaleDateString()}`,
        description: 'Funil criado com Editor Visual',
        isPublished: false,
        version: 1,
        settings: {
          theme: 'default',
          primaryColor: '#B89B7A',
          secondaryColor: '#432818',
        },
        pages: stages.map((stage, index) => ({
          id: stage.id,
          pageType: stage.type,
          pageOrder: index,
          title: stage.name,
          blocks: stageBlocks[stage.id] || [],
          metadata: stage.metadata || {},
        })),
      };

      console.log('📊 [EditorContext] Dados a serem salvos:', {
        funnelId,
        stagesCount: stages.length,
        pagesCount: funnelData.pages.length,
        totalBlocks: Object.values(stageBlocks).reduce((acc, blocks) => acc + blocks.length, 0),
      });

      const result = await saveFunnelToPersistence(funnelData);

      if (result.success) {
        console.log('✅ [EditorContext] Funil salvo com sucesso!');
      } else {
        console.error('❌ [EditorContext] Falha no salvamento:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ [EditorContext] Erro inesperado ao salvar:', error);
      return { success: false, error: 'Erro inesperado' };
    }
  }, [funnelId, stages, stageBlocks, saveFunnelToPersistence]);

  // ✅ PRÉ-CARREGAMENTO DE TEMPLATES JSON
  useEffect(() => {
    console.log('🚀 EditorProvider: Iniciando pré-carregamento de templates JSON');
    TemplateManager.preloadCommonTemplates()
      .then(() => {
        console.log('✅ Templates JSON pré-carregados com sucesso');
      })
      .catch(error => {
        console.warn('⚠️ Erro no pré-carregamento de templates JSON:', error);
      });
  }, []);

  // ═══════════════════════════════════════════════
  // 🎨 UI STATE
  // ═══════════════════════════════════════════════
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewportSize, setViewportSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // ═══════════════════════════════════════════════
  // 🎯 QUIZ STATE (INTEGRADO COM ETAPA 1 - NOME)
  // ═══════════════════════════════════════════════
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [userName, setUserName] = useState<string>('');
  const [currentScore, setCurrentScore] = useState<ReturnType<typeof calculateQuizScore> | null>(
    null
  );
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // ✅ FUNÇÃO ESPECÍFICA PARA COLETA DE NOME (ETAPA 1)
  const setUserNameFromInput = useCallback((name: string) => {
    const cleanName = name.trim();
    setUserName(cleanName);

    // Também salvar como resposta do quiz para compatibilidade
    setUserAnswers(prev => ({
      ...prev,
      'user-name': cleanName,
      'step-01-name': cleanName,
    }));

    // Persistir no localStorage
    if (cleanName && typeof window !== 'undefined') {
      localStorage.setItem('quizUserName', cleanName);
    }

    console.log('👤 EditorContext: Nome coletado na Etapa 1:', {
      name: cleanName,
      timestamp: new Date().toISOString(),
    });
  }, []);

  const setAnswer = useCallback((questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const calculateCurrentScore = useCallback(() => {
    try {
      const score = calculateQuizScore(userAnswers);
      setCurrentScore(score);
    } catch (error) {
      console.error('Erro ao calcular score:', error);
      setCurrentScore(null);
    }
  }, [userAnswers]);

  const resetQuiz = useCallback(() => {
    setUserAnswers({});
    setUserName('');
    setCurrentScore(null);
    setIsQuizCompleted(false);

    // Limpar localStorage também
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quizUserName');
    }

    console.log('🔄 EditorContext: Quiz resetado, incluindo nome de usuário');
  }, []);

  // ✅ DEBUG LOGGING
  console.log('📊 EditorProvider: Estado atual:', {
    stagesCount: stages.length,
    activeStageId,
    blocksKeys: Object.keys(stageBlocks).length,
  });

  // ═══════════════════════════════════════════════
  // 🔍 VALIDAÇÃO E UTILITÁRIOS
  // ═══════════════════════════════════════════════
  const validateStageId = useCallback(
    (stageId: string): boolean => {
      const isValid = stages.some(stage => stage.id === stageId);
      console.log(`🔍 EditorContext: Validando stage ${stageId}:`, isValid);
      return isValid;
    },
    [stages]
  );

  const getStageById = useCallback(
    (stageId: string): FunnelStage | undefined => {
      return stages.find(stage => stage.id === stageId);
    },
    [stages]
  );

  // ═══════════════════════════════════════════════
  // 🎯 STAGE ACTIONS (GERENCIAMENTO DE ETAPAS)
  // ═══════════════════════════════════════════════

  // ✅ SISTEMA HÍBRIDO: CARREGAR BLOCOS DE TEMPLATE TSX CONECTADO
  const loadStageTemplate = useCallback(
    async (stageId: string) => {
      const stage = stages.find(s => s.id === stageId);
      if (!stage) return;

      const stepNumber = parseInt(stageId.replace('step-', ''));

      console.log(`🎨 EditorContext: Carregando template híbrido para etapa ${stepNumber}`);
      dispatch({ type: 'SET_STATE', payload: 'loading' });

      try {
        // ✅ SISTEMA HÍBRIDO: USAR TSX TEMPLATES CONECTADOS
        const userData = {
          userName: quizLogic.userName,
          styleCategory: quizLogic.quizResult?.primaryStyle || 'Elegante',
          sessionId: funnelId,
        };
        
        const loadedBlocks = getStepTemplate(stepNumber, userData);

        // ✅ Garantir Header padrão no topo para todas as etapas
        const hasHeader = (loadedBlocks || []).some(
          b => b.type === 'quiz-intro-header' || b.type === 'header'
        );

        const headerBlock: EditorBlock = {
          id: `${stageId}-block-quiz-intro-header-1`,
          type: 'quiz-intro-header' as any,
          content: {
            title: 'Título do Header',
            subtitle: 'Subtítulo opcional',
            type: 'hero',
            alignment: 'center',
          } as any,
          order: 1,
          properties: {
            title: 'Título do Header',
            subtitle: 'Subtítulo opcional',
            type: 'hero',
            alignment: 'center',
          },
        };

        const adjustedLoaded: EditorBlock[] = (loadedBlocks || []).map((b, idx) => ({
          ...b,
          order: hasHeader ? (b.order ?? idx + 1) : idx + 2,
        }));

        const withHeader: EditorBlock[] = hasHeader
          ? adjustedLoaded
          : [headerBlock, ...adjustedLoaded];

        if (withHeader && withHeader.length > 0) {
          setStageBlocks(prev => ({
            ...prev,
            [stageId]: withHeader, // ✅ Usar blocos com Header garantido
          }));

          console.log(
            `✅ Template ${stageId} carregado dinamicamente: ${withHeader.length} blocos`
          );
          console.log(`📦 Tipos de blocos: ${withHeader.map(b => b.type).join(', ')}`);

          // Atualizar metadados da etapa
          setStages(prev =>
            prev.map(s =>
              s.id === stageId
                ? {
                    ...s,
                    metadata: {
                      ...s.metadata,
                      blocksCount: withHeader.length,
                      lastModified: new Date(),
                    },
                  }
                : s
            )
          );
        } else {
          // Fallback: inserir somente header
          setStageBlocks(prev => ({
            ...prev,
            [stageId]: [headerBlock],
          }));
        }

        console.log(`✅ EditorContext: Template carregado para etapa ${stepNumber}`);
        dispatch({ type: 'SET_STATE', payload: 'ready' });
      } catch (error) {
        console.error(
          `❌ EditorContext: Erro ao carregar template para etapa ${stepNumber}:`,
          error
        );
        dispatch({ type: 'SET_STATE', payload: 'error' });
      }
    },
    [stages, dispatch]
  );

  const setActiveStage = useCallback(
    (stageId: string) => {
      console.log('🔄 EditorContext: Mudando etapa ativa para:', stageId);

      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Etapa inválida:', stageId);
        return;
      }

      setActiveStageId(stageId);
      setSelectedBlockId(null);

      // ✅ CARREGAR TEMPLATE SE A ETAPA ESTIVER VAZIA
      const currentBlocks = stageBlocks[stageId] || [];
      console.log(`🔍 EditorContext: Etapa ${stageId} tem ${currentBlocks.length} blocos`);

      if (currentBlocks.length === 0) {
        console.log(`🎨 EditorContext: Etapa ${stageId} vazia, carregando template JSON...`);
        // Executar carregamento assíncrono do template JSON
        loadStageTemplate(stageId).catch(error => {
          console.error(`❌ Erro ao carregar template para ${stageId}:`, error);
        });
      } else {
        console.log(
          `📋 EditorContext: Etapa ${stageId} já tem blocos:`,
          currentBlocks.map(b => b.type)
        );
      }

      console.log('✅ EditorContext: Etapa ativa alterada para:', stageId);
    },
    [validateStageId, stageBlocks, loadStageTemplate]
  );

  const addStage = useCallback(
    (stageData?: Partial<FunnelStage>): string => {
      const newStageId = `step-${String(stages.length + 1).padStart(2, '0')}`;
      const newStage: FunnelStage = {
        id: newStageId,
        name: stageData?.name || `Nova Etapa ${stages.length + 1}`,
        order: stages.length + 1,
        type: stageData?.type || 'question',
        description: stageData?.description || 'Nova etapa personalizada',
        isActive: false,
        metadata: {
          blocksCount: 0,
          lastModified: new Date(),
          isCustom: true,
        },
      };

      setStages(prev => [...prev, newStage]);
      setStageBlocks(prev => ({ ...prev, [newStageId]: [] }));

      console.log('➕ EditorContext: Nova etapa adicionada:', newStageId);
      return newStageId;
    },
    [stages.length]
  );

  const removeStage = useCallback(
    (stageId: string) => {
      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Tentativa de remover etapa inválida:', stageId);
        return;
      }

      setStages(prev => prev.filter(stage => stage.id !== stageId));
      setStageBlocks(prev => {
        const updated = { ...prev };
        delete updated[stageId];
        return updated;
      });

      if (activeStageId === stageId) {
        const remainingStages = stages.filter(stage => stage.id !== stageId);
        if (remainingStages.length > 0) {
          setActiveStageId(remainingStages[0].id);
        }
      }

      console.log('🗑️ EditorContext: Etapa removida:', stageId);
    },
    [validateStageId, activeStageId, stages]
  );

  const updateStage = useCallback(
    (stageId: string, updates: Partial<FunnelStage>) => {
      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Tentativa de atualizar etapa inválida:', stageId);
        return;
      }

      setStages(prev =>
        prev.map(stage =>
          stage.id === stageId
            ? {
                ...stage,
                ...updates,
                metadata: { ...stage.metadata, lastModified: new Date() },
              }
            : stage
        )
      );

      console.log('📝 EditorContext: Etapa atualizada:', stageId, updates);
    },
    [validateStageId]
  );

  // 🧩 BLOCK ACTIONS (GERENCIAMENTO DE BLOCOS)
  // ═══════════════════════════════════════════════
  // ✅ ENHANCED: addBlock com integração Supabase
  const addBlock = useCallback(
    async (type: string, targetStageId?: string): Promise<string> => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:', stageId);
        return '';
      }

      // ID Semântico para o bloco
      const currentStageBlocks = stageBlocks[stageId] || [];
      const blockOrder = currentStageBlocks.length + 1;
      const blockId = `${stageId}-block-${type}-${blockOrder}`;

      const newBlock: EditorBlock = {
        id: blockId,
        type: type as any,
        content: { text: `Novo ${type}`, title: `Título do ${type}` },
        order: blockOrder,
        properties: {},
      };

      // ✅ INTEGRAÇÃO SUPABASE: Persistir se habilitado
      if (isSupabaseEnabled && stageId === activeStageId) {
        try {
          console.log('🔄 Persistindo bloco no Supabase...');
          // const instanceKey = `${type}-${blockOrder}-${Date.now()}`; // TODO: Usar se necessário
          const supabaseComponent = await addSupabaseComponent(type, blockOrder - 1);

          if (supabaseComponent) {
            console.log('✅ Bloco persistido no Supabase:', supabaseComponent.id);
            // Atualizar ID local para usar o ID do Supabase
            newBlock.id = supabaseComponent.id;
          }
        } catch (error) {
          console.error('❌ Erro ao persistir no Supabase:', error);
          // Continuar com estado local em caso de erro
        }
      }

      // Atualizar estado local
      setStageBlocks(prev => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), newBlock],
      }));

      updateStage(stageId, {
        metadata: {
          ...getStageById(stageId)?.metadata,
          blocksCount: currentStageBlocks.length + 1,
        },
      });

      console.log(
        `➕ EditorContext: Bloco adicionado ${isSupabaseEnabled ? '(Supabase)' : '(Local)'}:`,
        newBlock.id,
        'tipo:',
        type,
        'etapa:',
        stageId
      );
      return newBlock.id;
    },
    [
      activeStageId,
      validateStageId,
      stageBlocks,
      updateStage,
      getStageById,
      isSupabaseEnabled,
      addSupabaseComponent,
    ]
  );

  const addBlockAtPosition = useCallback(
    async (type: string, position: number, targetStageId?: string): Promise<string> => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Tentativa de adicionar bloco em etapa inválida:', stageId);
        return '';
      }

      // ID Semântico com posição
      const blockId = `${stageId}-block-${type}-pos-${position + 1}`;
      const currentStageBlocks = stageBlocks[stageId] || [];

      const newBlock: EditorBlock = {
        id: blockId,
        type: type as any,
        content: { text: `Novo ${type}`, title: `Título do ${type}` },
        order: position + 1, // order baseado na posição
        properties: {},
      };

      // ✅ INTEGRAÇÃO SUPABASE: Persistir se habilitado
      if (isSupabaseEnabled && stageId === activeStageId) {
        try {
          console.log('🔄 Persistindo bloco na posição no Supabase...');
          const supabaseComponent = await addSupabaseComponent(type, position);

          if (supabaseComponent) {
            console.log('✅ Bloco na posição persistido no Supabase:', supabaseComponent.id);
            newBlock.id = supabaseComponent.id;
          }
        } catch (error) {
          console.error('❌ Erro ao persistir bloco na posição no Supabase:', error);
          // Continuar com estado local
        }
      }

      // Inserir o bloco na posição específica
      const updatedBlocks = [...currentStageBlocks];
      updatedBlocks.splice(position, 0, newBlock);

      // Reordenar os outros blocos
      const reorderedBlocks = updatedBlocks.map((block, index) => ({
        ...block,
        order: index + 1,
      }));

      setStageBlocks(prev => ({
        ...prev,
        [stageId]: reorderedBlocks,
      }));

      updateStage(stageId, {
        metadata: {
          ...getStageById(stageId)?.metadata,
          blocksCount: reorderedBlocks.length,
        },
      });

      console.log(
        `➕ EditorContext: Bloco adicionado na posição ${isSupabaseEnabled ? '(Supabase)' : '(Local)'}:`,
        position,
        'blockId:',
        newBlock.id,
        'tipo:',
        type,
        'etapa:',
        stageId
      );
      return newBlock.id;
    },
    [
      activeStageId,
      validateStageId,
      stageBlocks,
      updateStage,
      getStageById,
      isSupabaseEnabled,
      addSupabaseComponent,
    ]
  );

  // 🎯 SISTEMA 1: FUNÇÃO DE DUPLICAÇÃO SEMÂNTICA
  const duplicateBlock = useCallback(
    (blockId: string, targetStageId?: string): string => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Tentativa de duplicar bloco em etapa inválida:', stageId);
        return '';
      }

      const currentStageBlocks = stageBlocks[stageId] || [];
      const blockToDuplicate = currentStageBlocks.find(b => b.id === blockId);

      if (!blockToDuplicate) {
        console.warn('⚠️ EditorContext: Bloco para duplicar não encontrado:', blockId);
        return '';
      }

      // Gerar ID semântico para duplicação
      const duplicateNumber =
        currentStageBlocks.filter(b => b.type === blockToDuplicate.type).length + 1;

      const duplicatedBlockId = `${stageId}-block-${blockToDuplicate.type}-copy-${duplicateNumber}`;

      const duplicatedBlock: EditorBlock = {
        ...JSON.parse(JSON.stringify(blockToDuplicate)), // Deep clone
        id: duplicatedBlockId,
        order: currentStageBlocks.length + 1,
      };

      setStageBlocks(prev => ({
        ...prev,
        [stageId]: [...(prev[stageId] || []), duplicatedBlock],
      }));

      updateStage(stageId, {
        metadata: {
          ...getStageById(stageId)?.metadata,
          blocksCount: currentStageBlocks.length + 1,
        },
      });

      console.log(
        '🔄 EditorContext: Bloco duplicado (Sistema Semântico):',
        duplicatedBlockId,
        'original:',
        blockId
      );
      return duplicatedBlockId;
    },
    [activeStageId, validateStageId, stageBlocks, updateStage, getStageById]
  );

  // ✅ ENHANCED: reorderBlocks com integração Supabase
  const reorderBlocks = useCallback(
    async (blockIds: string[], targetStageId?: string) => {
      const stageId = targetStageId || activeStageId;

      if (!validateStageId(stageId)) {
        console.warn('⚠️ EditorContext: Tentativa de reordenar blocos em etapa inválida:', stageId);
        return;
      }

      const currentStageBlocks = stageBlocks[stageId] || [];

      // ✅ VALIDAÇÃO RIGOROSA: Verificar conjunto exato de IDs
      if (blockIds.length !== currentStageBlocks.length) {
        console.warn(
          '⚠️ EditorContext: Reordenação inválida - quantidade:',
          blockIds.length,
          'vs',
          currentStageBlocks.length
        );
        return;
      }

      const currentIds = new Set(currentStageBlocks.map(b => b.id));
      const newIds = new Set(blockIds);

      if (currentIds.size !== newIds.size) {
        console.warn('⚠️ EditorContext: Reordenação inválida - IDs duplicados');
        return;
      }

      for (const id of blockIds) {
        if (!currentIds.has(id)) {
          console.warn('⚠️ EditorContext: Reordenação inválida - ID desconhecido:', id);
          return;
        }
      }

      // ✅ INTEGRAÇÃO SUPABASE: Reordenar se habilitado
      if (isSupabaseEnabled && stageId === activeStageId) {
        try {
          console.log('🔄 Reordenando blocos no Supabase...');
          await reorderSupabaseComponents(blockIds);
          console.log('✅ Blocos reordenados no Supabase');
        } catch (error) {
          console.error('❌ Erro ao reordenar no Supabase:', error);
          // Continuar com reordenação local
        }
      }

      // Reordenar blocos baseado na ordem dos IDs
      const reorderedBlocks = blockIds
        .map((blockId, index) => {
          const block = currentStageBlocks.find(b => b.id === blockId);
          if (!block) {
            console.warn('⚠️ EditorContext: Bloco não encontrado:', blockId);
            return null;
          }
          return {
            ...block,
            order: index + 1,
          };
        })
        .filter(Boolean) as EditorBlock[];

      setStageBlocks(prev => ({
        ...prev,
        [stageId]: reorderedBlocks,
      }));

      console.log(
        `🔄 EditorContext: Blocos reordenados ${isSupabaseEnabled ? '(Supabase)' : '(Local)'} na etapa:`,
        stageId,
        'nova ordem:',
        blockIds
      );
    },
    [activeStageId, validateStageId, stageBlocks, isSupabaseEnabled, reorderSupabaseComponents]
  );

  // ✅ ENHANCED: deleteBlock com integração Supabase
  const deleteBlock = useCallback(
    async (blockId: string) => {
      // ✅ INTEGRAÇÃO SUPABASE: Remover se habilitado
      if (isSupabaseEnabled) {
        try {
          // Verificar se é um bloco da etapa ativa
          const currentStageBlocks = stageBlocks[activeStageId] || [];
          const isActiveStageBlock = currentStageBlocks.some(b => b.id === blockId);

          if (isActiveStageBlock) {
            console.log('🔄 Removendo bloco do Supabase...');
            await deleteSupabaseComponent(blockId);
            console.log('✅ Bloco removido do Supabase');
          }
        } catch (error) {
          console.error('❌ Erro ao remover do Supabase:', error);
          // Continuar com remoção local
        }
      }

      let deletedFromStage = '';

      setStageBlocks(prev => {
        const updated = { ...prev };

        for (const stageId in updated) {
          const blocks = updated[stageId];
          const blockIndex = blocks.findIndex(block => block.id === blockId);

          if (blockIndex !== -1) {
            updated[stageId] = blocks.filter(block => block.id !== blockId);
            deletedFromStage = stageId;
            break;
          }
        }

        return updated;
      });

      if (deletedFromStage) {
        const stage = getStageById(deletedFromStage);
        if (stage) {
          updateStage(deletedFromStage, {
            metadata: {
              ...stage.metadata,
              blocksCount: Math.max(0, (stage.metadata?.blocksCount || 1) - 1),
            },
          });
        }
      }

      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
      }

      console.log(
        `🗑️ EditorContext: Bloco removido ${isSupabaseEnabled ? '(Supabase)' : '(Local)'}:`,
        blockId,
        'da etapa:',
        deletedFromStage
      );
    },
    [
      selectedBlockId,
      getStageById,
      updateStage,
      isSupabaseEnabled,
      deleteSupabaseComponent,
      stageBlocks,
      activeStageId,
    ]
  );

  // ✅ ENHANCED: updateBlock com integração Supabase
  const updateBlock = useCallback(
    async (blockId: string, updates: Partial<EditorBlock>) => {
      console.log('🔧 EditorContext updateBlock chamado:', { blockId, updates });

      // ✅ INTEGRAÇÃO SUPABASE: Persistir se habilitado
      if (isSupabaseEnabled) {
        try {
          // Verificar se é um bloco da etapa ativa (Supabase só gerencia etapa ativa)
          const currentStageBlocks = stageBlocks[activeStageId] || [];
          const isActiveStageBlock = currentStageBlocks.some(b => b.id === blockId);

          if (isActiveStageBlock && updates.properties) {
            console.log('🔄 Atualizando bloco no Supabase...');
            await updateSupabaseComponent(blockId, { properties: updates.properties });
            console.log('✅ Bloco atualizado no Supabase');
          }
        } catch (error) {
          console.error('❌ Erro ao atualizar no Supabase:', error);
          // Continuar com atualização local
        }
      }

      // Atualizar estado local
      setStageBlocks(prev => {
        const updated = { ...prev };

        for (const stageId in updated) {
          const blocks = updated[stageId];
          const blockIndex = blocks.findIndex(block => block.id === blockId);

          if (blockIndex !== -1) {
            updated[stageId] = blocks.map(block => {
              if (block.id === blockId) {
                console.log('🔧 Bloco encontrado, estado atual:', block);

                // Criar uma nova cópia do bloco
                const updatedBlock = { ...block };

                // Processar cada propriedade de atualização separadamente
                Object.entries(updates).forEach(([key, value]) => {
                  console.log(`🔧 Processando update: ${key} =`, value);

                  if (key === 'properties') {
                    // ✅ CORREÇÃO CRÍTICA: Para properties, fazer merge completo
                    updatedBlock.properties = {
                      ...block.properties,
                      ...(value as Record<string, any>),
                    };
                    console.log('🔧 Properties merged:', updatedBlock.properties);

                    // ✅ TAMBÉM SINCRONIZAR COM CONTENT para compatibilidade
                    updatedBlock.content = {
                      ...block.content,
                      ...(value as Record<string, any>),
                    };
                    console.log('🔧 Content também sincronizado:', updatedBlock.content);
                  } else if (key === 'content') {
                    // Para content, fazer um merge profundo preservando imutabilidade
                    updatedBlock.content = {
                      ...block.content,
                      ...(value as Record<string, any>),
                    };
                    console.log('🔧 Content atualizado:', updatedBlock.content);
                  } else {
                    // ✅ CORREÇÃO: Para campos individuais, atualizar tanto properties quanto content
                    if (block.content && typeof value !== 'object') {
                      updatedBlock.content = {
                        ...block.content,
                        [key]: value,
                      };
                      console.log('🔧 Content direto atualizado:', updatedBlock.content);
                    }

                    if (block.properties) {
                      updatedBlock.properties = {
                        ...block.properties,
                        [key]: value,
                      };
                      console.log('🔧 Properties direto atualizada:', updatedBlock.properties);
                    } else {
                      // Para outras propriedades, atualização direta com casting seguro
                      (updatedBlock as any)[key] = value;
                      console.log(`🔧 Propriedade direta ${key} atualizada:`, value);
                    }
                  }
                });

                console.log('🔧 Bloco final atualizado:', updatedBlock);
                return updatedBlock;
              }
              return block;
            });
            break;
          }
        }

        return updated;
      });

      console.log(
        `📝 EditorContext: Bloco atualizado ${isSupabaseEnabled ? '(Supabase)' : '(Local)'}:`,
        blockId,
        updates
      );
    },
    [isSupabaseEnabled, updateSupabaseComponent, stageBlocks, activeStageId]
  );

  const getBlocksForStage = useCallback(
    (stageId: string): EditorBlock[] => {
      const blocks = stageBlocks[stageId] || [];
      console.log(`📦 EditorContext: Obtendo blocos para etapa ${stageId}:`, blocks.length);
      return blocks;
    },
    [stageBlocks]
  );

  // ═══════════════════════════════════════════════
  // 📊 COMPUTED VALUES (PERFORMANCE OTIMIZADA)
  // ═══════════════════════════════════════════════
  const currentBlocks = getBlocksForStage(activeStageId);
  const selectedBlock = selectedBlockId
    ? currentBlocks.find(block => block.id === selectedBlockId)
    : undefined;

  const totalBlocks = Object.values(stageBlocks).reduce(
    (total, blocks) => total + blocks.length,
    0
  );
  const stageCount = stages.length;

  // ═══════════════════════════════════════════════
  // 🔌 FUNÇÕES DO MODO BANCO DE DADOS
  // ═══════════════════════════════════════════════

  const setDatabaseMode = useCallback(
    (enabled: boolean) => {
      console.log(`🔧 EditorContext: Modo banco ${enabled ? 'ativado' : 'desativado'}`);
      setDatabaseModeEnabled(enabled);
      adapter.setDatabaseMode(enabled);
    },
    [adapter]
  );

  const setQuizId = useCallback(
    (quizId: string) => {
      console.log(`🔧 EditorContext: Quiz ID alterado para: ${quizId}`);
      setCurrentQuizId(quizId);
      adapter.setQuizId(quizId);
    },
    [adapter]
  );

  const migrateToDatabase = useCallback(async (): Promise<boolean> => {
    console.log('🚀 EditorContext: Iniciando migração para banco...');
    try {
      const success = await adapter.migrateLocalToDatabase();
      if (success) {
        setDatabaseModeEnabled(true);
        adapter.setDatabaseMode(true);
        console.log('✅ EditorContext: Migração concluída, modo banco ativado');
      }
      return success;
    } catch (error) {
      console.error('❌ EditorContext: Erro na migração:', error);
      return false;
    }
  }, [adapter]);

  const getStats = useCallback(async () => {
    try {
      return await adapter.getQuizStats();
    } catch (error) {
      console.error('❌ EditorContext: Erro ao obter estatísticas:', error);
      return { error: String(error) };
    }
  }, [adapter]);

  // Debug logging para computed values
  console.log('📊 EditorContext: Computed values:', {
    activeStageId,
    currentBlocks: currentBlocks.length,
    selectedBlock: selectedBlock?.id || 'none',
    totalBlocks,
    stageCount,
    databaseMode: databaseModeEnabled,
    quizId: currentQuizId,
  });

  // ✅ INICIALIZAÇÃO AUTOMÁTICA - CARREGAR TEMPLATE DA ETAPA ATIVA
  useEffect(() => {
    console.log('🚀 EditorContext: useEffect de inicialização executado');
    console.log('📋 EditorContext: activeStageId:', activeStageId);
    console.log('📋 EditorContext: currentBlocks.length:', currentBlocks.length);

    // Só carregar se a etapa ativa não tiver blocos (evitar sobrescrever blocos já carregados)
    if (activeStageId && currentBlocks.length === 0) {
      console.log(`🎨 EditorContext: Carregando template automaticamente para ${activeStageId}`);
      loadStageTemplate(activeStageId);
    } else if (currentBlocks.length > 0) {
      console.log(
        `📋 EditorContext: Etapa ${activeStageId} já tem ${currentBlocks.length} blocos carregados - mantendo dados`
      );
    } else {
      console.log(`📋 EditorContext: Etapa ${activeStageId} inválida ou sem dados para carregar`);
    }
  }, [activeStageId]); // ✅ Remover currentBlocks.length das dependências para evitar loops

  // ═══════════════════════════════════════════════
  // 🎯 CONTEXT VALUE (INTERFACE COMPLETA)
  // ═══════════════════════════════════════════════
  const contextValue: EditorContextType = {
    stages,
    activeStageId,
    selectedBlockId,
    editorState: state,

    // ✅ NOVO: Sistema de persistência Supabase
    funnelId,
    isSupabaseEnabled,

    stageActions: {
      setActiveStage,
      addStage,
      removeStage,
      updateStage,
    },

    blockActions: {
      addBlock,
      addBlockAtPosition,
      duplicateBlock,
      deleteBlock,
      updateBlock,
      reorderBlocks,
      setSelectedBlockId,
      getBlocksForStage,
    },

    templateActions: {
      loadTemplate: async templateId => {
        const template = await templateManager.loadTemplate(templateId);
        if (template) {
          await templateManager.applyTemplate(template);
        }
      },
      loadTemplateByStep: async step => {
        const stepId = `step-${String(step).padStart(2, '0')}`;
        console.log(`🔄 templateActions: Carregando Step ${step} via sistema híbrido`);
        
        try {
          const userData = {
            userName: quizLogic.userName,
            styleCategory: quizLogic.quizResult?.primaryStyle || 'Elegante',
            sessionId: funnelId,
          };
          
          const blocks = getStepTemplate(step, userData);
          
          if (blocks && blocks.length > 0) {
            setStageBlocks(prev => ({
              ...prev,
              [stepId]: blocks,
            }));
            setActiveStageId(stepId);
            console.log(`✅ templateActions: Step ${step} carregado com ${blocks.length} blocos`);
          }
        } catch (error) {
          console.error(`❌ templateActions: Erro ao carregar Step ${step}:`, error);
        }
      },
      applyCurrentTemplate: async () => {
        await templateManager.applyCurrentTemplate();
      },
      isLoadingTemplate: templateManager.isLoading,
    },

    persistenceActions: {
      saveFunnel,
      isSaving: isPersistenceSaving,
    },

    uiState: {
      isPreviewing,
      setIsPreviewing,
      viewportSize,
      setViewportSize,
    },

    computed: {
      currentBlocks,
      selectedBlock,
      totalBlocks,
      stageCount,
    },

    databaseMode: {
      isEnabled: databaseModeEnabled,
      quizId: currentQuizId,
      setDatabaseMode,
      setQuizId,
      migrateToDatabase,
      getStats,
    },

    // ✅ ATUALIZADO: Quiz State Integrado com Hooks
    quizState: {
      // Estado básico (compatibilidade)
      userAnswers,
      userName: quizLogic.userName || userName, // Priorizar hook
      currentScore,
      isQuizCompleted: quizLogic.quizCompleted || isQuizCompleted,
      quizResult: quizLogic.quizResult,
      
      // Ações básicas (compatibilidade + hooks)
      setAnswer,
      setUserNameFromInput: (name: string) => {
        setUserNameFromInput(name); // Local state para compatibilidade
        quizLogic.setUserNameFromInput(name); // Hook integrado
      },
      calculateCurrentScore,
      resetQuiz: () => {
        resetQuiz(); // Local reset
        quizLogic.restartQuiz(); // Hook reset
      },
      
      // ✅ NOVOS: Métodos dos hooks integrados
      answerQuestion: quizLogic.answerQuestion,
      answerStrategicQuestion: quizLogic.answerStrategicQuestion,
      completeQuiz: quizLogic.completeQuiz,
      
      // Estado avançado dos hooks
      currentQuestionIndex: quizLogic.currentQuestionIndex,
      totalQuestions: quizLogic.totalQuestions,
      answers: quizLogic.answers,
      strategicAnswers: quizLogic.strategicAnswers,
    },
  };

  console.log('🎯 EditorContext: Providing context value com', stages.length, 'etapas');

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};
