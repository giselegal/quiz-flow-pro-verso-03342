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

  // ✅ NOVO: Sistema de Quiz e Pontuação (com coleta de nome Etapa 1)
  quizState: {
    userAnswers: Record<string, string>;
    userName: string;
    currentScore: ReturnType<typeof calculateQuizScore> | null;
    setAnswer: (questionId: string, answer: string) => void;
    setUserNameFromInput: (name: string) => void;
    calculateCurrentScore: () => void;
    resetQuiz: () => void;
    isQuizCompleted: boolean;
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

  // 📊 PERFORMANCE MONITORING
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 EditorProvider: Iniciando análise de performance...');
      performanceAnalyzer.startMonitoring();
    }
  }, []);

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
  // 🏗️ ESTADO PRINCIPAL CENTRALIZADO - FIXO PARA 21 ETAPAS
  // ═══════════════════════════════════════════════
  const [stages, setStages] = useState<FunnelStage[]>(() => {
    console.log('🚀 EditorProvider: Inicializando diretamente 21 etapas');

    // ✅ DEFINIÇÃO DIRETA DAS 21 ETAPAS (EVITAR PROBLEMAS DE IMPORT)
    const directStages: FunnelStage[] = [];

    for (let i = 1; i <= 21; i++) {
      const stepId = `step-${String(i).padStart(2, '0')}`;
      let name = '';
      let type: 'intro' | 'question' | 'transition' | 'processing' | 'result' | 'lead' | 'offer' =
        'question';
      let description = '';

      // Definir nomes e tipos das etapas
      if (i === 1) {
        name = 'Introdução';
        type = 'intro';
        description = 'Página inicial do quiz';
      } else if (i >= 2 && i <= 14) {
        name = `Q${i - 1} - Pergunta ${i - 1}`;
        type = 'question';
        description = `Pergunta ${i - 1} do quiz`;
      } else if (i === 15) {
        name = 'Nome';
        type = 'lead';
        description = 'Coleta de nome do usuário';
      } else if (i === 16) {
        name = 'Processamento';
        type = 'processing';
        description = 'Calculando resultado...';
      } else if (i === 17) {
        name = 'Resultado';
        type = 'result';
        description = 'Exibição do resultado';
      } else if (i >= 18 && i <= 20) {
        name = `Transição ${i - 17}`;
        type = 'transition';
        description = `Transição para oferta ${i - 17}`;
      } else if (i === 21) {
        name = 'Oferta Final';
        type = 'offer';
        description = 'Página de oferta e conversão';
      }

      directStages.push({
        id: stepId,
        name,
        order: i,
        type,
        description,
        isActive: i === 1,
        metadata: {
          blocksCount: 0,
          lastModified: new Date(),
          isCustom: false,
          templateBlocks: [],
        },
      });
    }

    console.log('✅ EditorProvider: 21 etapas criadas diretamente:', directStages.length);
    console.log('✅ EditorProvider: Primeira etapa:', directStages[0]);
    console.log('✅ EditorProvider: Última etapa:', directStages[directStages.length - 1]);
    console.log(
      '✅ EditorProvider: Lista das etapas:',
      directStages.map(s => `${s.order}: ${s.name}`)
    );
    return directStages;
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

  // ✅ EFEITO PARA CARREGAR TEMPLATES JSON ASSÍNCRONO
  useEffect(() => {
    const loadInitialTemplates = async () => {
      console.log('🔄 EditorProvider: Iniciando carregamento de templates JSON...');

      // Carregar templates para as primeiras 3 etapas imediatamente
      for (let i = 1; i <= 3; i++) {
        const stageId = `step-${String(i).padStart(2, '0')}`;

        try {
          console.log(`🔄 Carregando template JSON para ${stageId}...`);
          const loadedBlocks = await TemplateManager.loadStepBlocks(stageId);

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
              [stageId]: withHeader,
            }));
            console.log(`✅ Template ${stageId} carregado: ${withHeader.length} blocos`);
            console.log(`📦 Tipos de blocos: ${withHeader.map(b => b.type).join(', ')}`);
          } else {
            console.warn(`⚠️ Nenhum bloco encontrado para ${stageId}, inserindo Header padrão`);
            setStageBlocks(prev => ({
              ...prev,
              [stageId]: [headerBlock],
            }));
          }
        } catch (error) {
          console.error(`❌ Erro ao carregar ${stageId}:`, error);
        }
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

  // ✅ FUNÇÃO PARA CARREGAR BLOCOS DE TEMPLATE JSON (SISTEMA HÍBRIDO)
  const loadStageTemplate = useCallback(
    async (stageId: string) => {
      const stage = stages.find(s => s.id === stageId);
      if (!stage) return;

      const stepNumber = parseInt(stageId.replace('step-', ''));

      console.log(`🎨 EditorContext: Carregando template para etapa ${stepNumber}`);
      dispatch({ type: 'SET_STATE', payload: 'loading' });

      try {
        // Carregar blocos do template JSON e aplicar no estado
        const loadedBlocks = await TemplateManager.loadStepBlocks(stageId);

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
        const template = await templateManager.loadTemplateByStep(step);
        if (template) {
          await templateManager.applyTemplate(template);
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

    // ✅ NOVO: Quiz State (com coleta de nome da Etapa 1)
    quizState: {
      userAnswers,
      userName,
      currentScore,
      setAnswer,
      setUserNameFromInput,
      calculateCurrentScore,
      resetQuiz,
      isQuizCompleted,
    },
  };

  console.log('🎯 EditorContext: Providing context value com', stages.length, 'etapas');

  return <EditorContext.Provider value={contextValue}>{children}</EditorContext.Provider>;
};
