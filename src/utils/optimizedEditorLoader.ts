/**
 * 🚀 CARREGADOR OTIMIZADO DO EDITOR
 * =================================
 * 
 * Carrega o sistema de 21 etapas otimizado aproveitando
 * toda a infraestrutura existente de hooks e componentes.
 */

import { OPTIMIZED_FUNNEL_CONFIG } from '@/config/optimized21StepsFunnel';
import { useUnifiedProperties, getInlineComponentProperties } from '@/hooks/useUnifiedProperties';
import { useEditor } from '@/hooks/useEditor';
import { useQuiz } from '@/hooks/useQuiz';
import { useHistory } from '@/hooks/useHistory';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';

export interface OptimizedEditorState {
  currentStep: number;
  totalSteps: number;
  steps: any[];
  responses: Record<string, any>;
  calculatedStyle?: any;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
}

/**
 * 🎯 Hook principal do editor otimizado
 */
export const useOptimizedEditor = (initialConfig?: any) => {
  // Aproveitar hooks existentes
  const unifiedProps = useUnifiedProperties();
  const editor = useEditor(initialConfig);
  const quiz = useQuiz();
  const history = useHistory();
  const autoSave = useAutoSave();
  const shortcuts = useKeyboardShortcuts();
  const performance = usePerformanceOptimization();
  
  // Estado específico do editor otimizado
  const [editorState, setEditorState] = useState<OptimizedEditorState>({
    currentStep: 1,
    totalSteps: 21,
    steps: OPTIMIZED_FUNNEL_CONFIG?.steps || [],
    responses: {},
    isLoading: false,
    hasUnsavedChanges: false
  });
  
  // 🎯 Carregar etapa específica
  const loadStep = useCallback((stepNumber: number) => {
    const step = editorState.steps.find(s => s.order === stepNumber);
    if (step) {
      console.log(`🎯 Carregando etapa ${stepNumber}: ${step.name}`);
      
      // Preparar propriedades dos blocos usando sistema unificado
      const enhancedBlocks = step.blocks?.map(block => ({
        ...block,
        properties: getInlineComponentProperties(block.type, block.properties)
      })) || [];
      
      return {
        ...step,
        blocks: enhancedBlocks
      };
    }
    return null;
  }, [editorState.steps]);
  
  // 🎯 Navegar entre etapas
  const navigateToStep = useCallback((stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= editorState.totalSteps) {
      setEditorState(prev => ({
        ...prev,
        currentStep: stepNumber
      }));
      
      // Salvar automaticamente
      if (autoSave?.save) {
        autoSave.save({ currentStep: stepNumber, responses: editorState.responses });
      }
    }
  }, [editorState.responses, autoSave]);
  
  // 🎯 Atualizar resposta
  const updateResponse = useCallback((stepId: string, response: any) => {
    setEditorState(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [stepId]: response
      },
      hasUnsavedChanges: true
    }));
    
    // Trigger autosave
    if (autoSave?.triggerSave) {
      autoSave.triggerSave();
    }
  }, [autoSave]);
  
  // 🎯 Calcular resultado
  const calculateResult = useCallback(() => {
    if (quiz?.calculateResults) {
      const result = quiz.calculateResults(editorState.responses);
      setEditorState(prev => ({
        ...prev,
        calculatedStyle: result
      }));
      return result;
    }
    return null;
  }, [editorState.responses, quiz]);
  
  // 🎯 Configurar atalhos de teclado
  useEffect(() => {
    if (shortcuts?.register) {
      shortcuts.register([
        {
          key: 'ArrowLeft',
          action: () => navigateToStep(Math.max(1, editorState.currentStep - 1)),
          description: 'Etapa anterior'
        },
        {
          key: 'ArrowRight', 
          action: () => navigateToStep(Math.min(editorState.totalSteps, editorState.currentStep + 1)),
          description: 'Próxima etapa'
        },
        {
          key: 'ctrl+s',
          action: () => autoSave?.save(editorState),
          description: 'Salvar'
        }
      ]);
    }
  }, [shortcuts, navigateToStep, editorState, autoSave]);
  
  // 🎯 Otimizações de performance
  useEffect(() => {
    if (performance?.optimizeForComponent) {
      performance.optimizeForComponent('optimized-editor', {
        steps: editorState.totalSteps,
        currentStep: editorState.currentStep
      });
    }
  }, [performance, editorState.currentStep, editorState.totalSteps]);
  
  return {
    // Estado
    ...editorState,
    
    // Ações
    loadStep,
    navigateToStep,
    updateResponse,
    calculateResult,
    
    // Hooks integrados
    unifiedProps,
    editor,
    quiz,
    history,
    autoSave,
    shortcuts,
    performance,
    
    // Dados da configuração
    config: OPTIMIZED_FUNNEL_CONFIG,
    
    // Utilitários
    getCurrentStep: () => loadStep(editorState.currentStep),
    getProgress: () => Math.round((editorState.currentStep / editorState.totalSteps) * 100),
    canGoNext: () => editorState.currentStep < editorState.totalSteps,
    canGoPrev: () => editorState.currentStep > 1,
    
    // Estado de salvamento
    isSaving: autoSave?.isSaving || false,
    lastSaved: autoSave?.lastSaved,
    
    // Performance
    isOptimized: performance?.isOptimized || false
  };
};

/**
 * 🎯 Provider do editor otimizado
 */
export const OptimizedEditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const optimizedEditor = useOptimizedEditor();
  
  return (
    <OptimizedEditorContext.Provider value={optimizedEditor}>
      {children}
    </OptimizedEditorContext.Provider>
  );
};

/**
 * 🎯 Context do editor otimizado
 */
export const OptimizedEditorContext = React.createContext<ReturnType<typeof useOptimizedEditor> | null>(null);

/**
 * 🎯 Hook para usar o context
 */
export const useOptimizedEditorContext = () => {
  const context = useContext(OptimizedEditorContext);
  if (!context) {
    throw new Error('useOptimizedEditorContext deve ser usado dentro de OptimizedEditorProvider');
  }
  return context;
};

export default useOptimizedEditor;