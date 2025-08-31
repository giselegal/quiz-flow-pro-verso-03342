import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StepNavigationConfig {
  // Configurações de Seleção
  requiredSelections: number;
  maxSelections: number;
  multipleSelection: boolean;

  // Configurações de Navegação
  autoAdvanceOnComplete: boolean;
  autoAdvanceDelay: number;
  enableButtonOnlyWhenValid: boolean;
  showValidationFeedback: boolean;

  // Flags de fluxo/resultados
  /** Quando true nesta etapa, dispara o cálculo de resultado centralizado */
  calculateResult?: boolean;
  /** Quando true, tenta persistir o resultado no Supabase (se online e houver sessão UUID) */
  persistResultToSupabase?: boolean;

  // Configurações de UI
  showSelectionCount: boolean;
  showProgressMessage: boolean;
  validationMessage: string;
  progressMessage: string;
  nextButtonText: string;

  // Configurações de Estilo
  selectionStyle: 'border' | 'background' | 'shadow';
  selectedColor: string;
  hoverColor: string;
  // Tema/fundo da etapa
  backgroundFrom?: string;
  backgroundVia?: string;
  backgroundTo?: string;
}

interface StepNavigationStore {
  // Estado das configurações por etapa
  stepConfigs: Record<string, StepNavigationConfig>;

  // Ações
  updateStepConfig: (stepId: string, config: Partial<StepNavigationConfig>) => void;
  getStepConfig: (stepId: string) => StepNavigationConfig;
  resetStepConfig: (stepId: string) => void;
  resetAllConfigs: () => void;

  // Configurações globais
  globalDefaults: StepNavigationConfig;
  updateGlobalDefaults: (defaults: Partial<StepNavigationConfig>) => void;

  // Import/Export
  exportConfigs: () => string;
  importConfigs: (configsJson: string) => void;
}

/**
 * 🏪 STORE PARA CONFIGURAÇÕES DE NAVEGAÇÃO DAS ETAPAS
 *
 * Persiste configurações NoCode para cada etapa:
 * - Requisitos de seleção
 * - Auto-advance e delays
 * - Mensagens e validações
 * - Estilos visuais
 */

// Configuração padrão para uma etapa
const getDefaultStepConfig = (stepId: string): StepNavigationConfig => {
  const stepNumber = parseInt(stepId.replace('step-', ''), 10);

  // Configurações específicas por tipo de etapa
  if (stepNumber === 1) {
    // Lead Collection - Nome obrigatório
    return {
      requiredSelections: 1,
      maxSelections: 1,
      multipleSelection: false,
      autoAdvanceOnComplete: true,
      autoAdvanceDelay: 1000,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true,
      showSelectionCount: false,
      showProgressMessage: false,
      validationMessage: 'Digite seu nome para continuar',
      progressMessage: '',
      nextButtonText: 'Começar Quiz',
      selectionStyle: 'border',
      selectedColor: '#3B82F6',
      hoverColor: '#EBF5FF',
      backgroundFrom: '#FAF9F7',
      backgroundVia: '#F5F2E9',
      backgroundTo: '#EEEBE1',
    };
  } else if (stepNumber >= 2 && stepNumber <= 11) {
    // Questões Pontuadas - 3 seleções obrigatórias
    return {
      requiredSelections: 3,
      maxSelections: 3,
      multipleSelection: true,
      autoAdvanceOnComplete: true,
      autoAdvanceDelay: 1500,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true,
      showSelectionCount: true,
      showProgressMessage: true,
      validationMessage: 'Selecione 3 opções para continuar',
      progressMessage: 'Você selecionou {count} de {required} opções',
      nextButtonText: 'Avançar',
      selectionStyle: 'border',
      selectedColor: '#3B82F6',
      hoverColor: '#EBF5FF',
      backgroundFrom: '#FAF9F7',
      backgroundVia: '#F5F2E9',
      backgroundTo: '#EEEBE1',
    };
  } else if (stepNumber >= 13 && stepNumber <= 18) {
    // Questões Estratégicas - 1 seleção obrigatória
    return {
      requiredSelections: 1,
      maxSelections: 1,
      multipleSelection: false,
      autoAdvanceOnComplete: true,
      autoAdvanceDelay: 1200,
      enableButtonOnlyWhenValid: true,
      showValidationFeedback: true,
      showSelectionCount: false,
      showProgressMessage: false,
      validationMessage: 'Selecione uma opção para continuar',
      progressMessage: '',
      nextButtonText: 'Continuar',
      selectionStyle: 'border',
      selectedColor: '#10B981',
      hoverColor: '#ECFDF5',
      backgroundFrom: '#FAF9F7',
      backgroundVia: '#F5F2E9',
      backgroundTo: '#EEEBE1',
    };
  } else {
    // Outras etapas (transições, resultado, oferta)
    return {
      requiredSelections: 0,
      maxSelections: 0,
      multipleSelection: false,
      autoAdvanceOnComplete: false,
      autoAdvanceDelay: 0,
      enableButtonOnlyWhenValid: false,
      showValidationFeedback: false,
      // Etapa 19 é a transição de processamento → calcular resultados aqui por padrão
      calculateResult: stepNumber === 19,
      // Persistência no Supabase pode ser ligada conforme necessidade
      persistResultToSupabase: stepNumber === 19,
      showSelectionCount: false,
      showProgressMessage: false,
      validationMessage: '',
      progressMessage: '',
      nextButtonText: stepNumber === 21 ? 'Quero essa Oferta!' : 'Continuar',
      selectionStyle: 'border',
      selectedColor: '#3B82F6',
      hoverColor: '#EBF5FF',
      backgroundFrom: '#FAF9F7',
      backgroundVia: '#F5F2E9',
      backgroundTo: '#EEEBE1',
    };
  }
};

// Configuração global padrão
const DEFAULT_GLOBAL_CONFIG: StepNavigationConfig = {
  requiredSelections: 1,
  maxSelections: 1,
  multipleSelection: false,
  autoAdvanceOnComplete: true,
  autoAdvanceDelay: 1500,
  enableButtonOnlyWhenValid: true,
  showValidationFeedback: true,
  showSelectionCount: true,
  showProgressMessage: true,
  validationMessage: 'Selecione para continuar',
  progressMessage: 'Você selecionou {count} de {required} opções',
  nextButtonText: 'Avançar',
  selectionStyle: 'border',
  selectedColor: '#3B82F6',
  hoverColor: '#EBF5FF',
  backgroundFrom: '#FAF9F7',
  backgroundVia: '#F5F2E9',
  backgroundTo: '#EEEBE1',
};

export const useStepNavigationStore = create<StepNavigationStore>()(
  persist(
    (set, get) => ({
      stepConfigs: {},
      globalDefaults: DEFAULT_GLOBAL_CONFIG,

      updateStepConfig: (stepId: string, config: Partial<StepNavigationConfig>) => {
        set(state => ({
          stepConfigs: {
            ...state.stepConfigs,
            [stepId]: {
              ...getDefaultStepConfig(stepId),
              ...state.stepConfigs[stepId],
              ...config,
            },
          },
        }));
      },

      getStepConfig: (stepId: string) => {
        const state = get();
        return state.stepConfigs[stepId] || getDefaultStepConfig(stepId);
      },

      resetStepConfig: (stepId: string) => {
        set(state => {
          const { [stepId]: removed, ...rest } = state.stepConfigs;
          return { stepConfigs: rest };
        });
      },

      resetAllConfigs: () => {
        set({ stepConfigs: {} });
      },

      updateGlobalDefaults: (defaults: Partial<StepNavigationConfig>) => {
        set(state => ({
          globalDefaults: { ...state.globalDefaults, ...defaults },
        }));
      },

      exportConfigs: () => {
        const state = get();
        return JSON.stringify(
          {
            stepConfigs: state.stepConfigs,
            globalDefaults: state.globalDefaults,
            exportDate: new Date().toISOString(),
            version: '1.0.0',
          },
          null,
          2
        );
      },

      importConfigs: (configsJson: string) => {
        try {
          const data = JSON.parse(configsJson);
          if (data.stepConfigs && data.globalDefaults) {
            set({
              stepConfigs: data.stepConfigs,
              globalDefaults: data.globalDefaults,
            });
          }
        } catch (error) {
          console.error('Erro ao importar configurações:', error);
        }
      },
    }),
    {
      name: 'step-navigation-configs',
      version: 1,
    }
  )
);

/**
 * 🎯 HOOK CUSTOMIZADO PARA CONFIGURAÇÃO DE ETAPA ESPECÍFICA
 */
export const useStepNavigationConfig = (stepId: string) => {
  const store = useStepNavigationStore();

  return {
    config: store.getStepConfig(stepId),
    updateConfig: (config: Partial<StepNavigationConfig>) => store.updateStepConfig(stepId, config),
    resetConfig: () => store.resetStepConfig(stepId),
    defaultConfig: getDefaultStepConfig(stepId),
  };
};

/**
 * 🌍 HOOK PARA CONFIGURAÇÕES GLOBAIS
 */
export const useGlobalNavigationConfig = () => {
  const store = useStepNavigationStore();

  return {
    globalDefaults: store.globalDefaults,
    updateGlobalDefaults: store.updateGlobalDefaults,
    exportConfigs: store.exportConfigs,
    importConfigs: store.importConfigs,
    resetAllConfigs: store.resetAllConfigs,
  };
};

/**
 * 📊 HOOK PARA ESTATÍSTICAS E ANÁLISE
 */
export const useNavigationConfigStats = () => {
  const store = useStepNavigationStore();

  const getStats = () => {
    const configs = store.stepConfigs;
    const totalSteps = Object.keys(configs).length;

    const autoAdvanceSteps = Object.values(configs).filter(
      config => config.autoAdvanceOnComplete
    ).length;

    const multipleSelectionSteps = Object.values(configs).filter(
      config => config.multipleSelection
    ).length;

    const avgDelay =
      Object.values(configs)
        .filter(config => config.autoAdvanceOnComplete)
        .reduce((sum, config) => sum + config.autoAdvanceDelay, 0) / autoAdvanceSteps || 0;

    return {
      totalSteps,
      autoAdvanceSteps,
      multipleSelectionSteps,
      avgAutoAdvanceDelay: Math.round(avgDelay),
      customizedSteps: totalSteps,
      defaultSteps: 21 - totalSteps,
    };
  };

  return { getStats };
};

export default useStepNavigationStore;
