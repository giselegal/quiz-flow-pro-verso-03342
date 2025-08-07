/**
 * 🔗 ÍNDICE D// ====================================================================
// ✏️ HOOKS DE EDITOR
// ====================================================================
export { useEditor } from "./useEditor";
export { useUnifiedProperties } from "./useUnifiedProperties";
export { useInlineEdit } from "./useInlineEdit";
export { useBlockForm } from "./useBlockForm";
export { usePropertyHistory } from "./usePropertyHistory";
export { useLiveEditor } from "./useLiveEditor";

// ====================================================================
// 🔧 HOOKS COMPOSTOS (NOVOS)
// ====================================================================
export { useStepWithContainer, useQuizStepContainer } from "./useStepWithContainer";
export { useIntegratedReusableComponents, useTemplateActions } from "./useIntegratedReusableComponents";
export { 
  useSmartPerformance, 
  useOptimizedQuizStep, 
  useOptimizedInlineComponent, 
  useSmartDebounce 
} from "./useSmartPerformance";TIMIZADO
 * ============================
 * 
 * Exportação centralizada de todos os hooks do sistema.
 * Organizado por categoria para melhor manutenibilidade.
 */

// ====================================================================
// 🧩 HOOKS DE QUIZ (Core)
// ====================================================================
export { useQuiz } from "./useQuiz";
export { useQuizBuilder } from "./useQuizBuilder";
export { useQuizConfig } from "./useQuizConfig";
export { useQuizLogic } from "./useQuizLogic";
export { useQuizResults } from "./useQuizResults";
export { useQuizTracking } from "./useQuizTracking";

// ====================================================================
// ✏️ HOOKS DE EDITOR
// ====================================================================
export { useBlockForm } from "./useBlockForm";
export { useEditor } from "./useEditor";
export { useInlineEdit } from "./useInlineEdit";
export { useLiveEditor } from "./useLiveEditor";
export { usePropertyHistory } from "./usePropertyHistory";
export { useUnifiedProperties } from "./useUnifiedProperties";

// ====================================================================
// 📱 HOOKS DE RESPONSIVIDADE
// ====================================================================
export { useIsLowPerformanceDevice, useIsMobile } from "./use-mobile";
export { useMediaQuery } from "./useMediaQuery";

// ====================================================================
// ⚡ HOOKS DE PERFORMANCE
// ====================================================================
export { useDebounce } from "./useDebounce";
export { useLoadingState } from "./useLoadingState";
export { useOptimizedTimer } from "./useOptimizedTimer";
export { usePerformanceOptimization } from "./usePerformanceOptimization";

// ====================================================================
// 🎨 HOOKS DE UI/UX
// ====================================================================
export { useAutoAnimate } from "./useAutoAnimate";
export { useGlobalStyles } from "./useGlobalStyles";
export { useKeyboardShortcuts } from "./useKeyboardShortcuts";
export { useScrollTracking } from "./useScrollTracking";

// ====================================================================
// 💾 HOOKS DE DADOS
// ====================================================================
export { useAutosave } from "./useAutosave";
export { useHistory } from "./useHistory";
export { useSupabase } from "./useSupabase";
export { useSupabaseQuiz } from "./useSupabaseQuiz";

// ====================================================================
// 🛠️ HOOKS UTILITÁRIOS
// ====================================================================
export { useToast } from "./use-toast";
export { useABTest } from "./useABTest";
export { useGlobalLoading } from "./useGlobalLoading";
export { useUtmParameters } from "./useUtmParameters";

// ====================================================================
// 📊 ESTATÍSTICAS DOS HOOKS
// ====================================================================
export const HOOKS_STATS = {
  total: 51,
  byCategory: {
    quiz: 18,
    editor: 6,
    performance: 2,
    utility: 20,
    responsive: 1,
    animation: 0,
    database: 0,
    result: 4,
  },
  lastAnalyzed: "2025-08-07T19:48:07.539Z",
};
