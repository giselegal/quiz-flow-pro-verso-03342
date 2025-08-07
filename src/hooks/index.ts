/**
 * 🔗 ÍNDICE DE HOOKS OTIMIZADO
 * ============================
 * 
 * Exportação centralizada de todos os hooks do sistema.
 * Organizado por categoria para melhor manutenibilidade.
 */

// ====================================================================
// 🧩 HOOKS DE QUIZ (Core)
// ====================================================================
export { useQuiz } from './useQuiz';
export { useQuizLogic } from './useQuizLogic';
export { useQuizBuilder } from './useQuizBuilder';
export { useQuizResults } from './useQuizResults';
export { useQuizConfig } from './useQuizConfig';
export { useQuizTracking } from './useQuizTracking';

// ====================================================================
// ✏️ HOOKS DE EDITOR
// ====================================================================
export { useEditor } from './useEditor';
export { useUnifiedProperties } from './useUnifiedProperties';
export { useInlineEdit } from './useInlineEdit';
export { useBlockForm } from './useBlockForm';
export { usePropertyHistory } from './usePropertyHistory';
export { useLiveEditor } from './useLiveEditor';

// ====================================================================
// 📱 HOOKS DE RESPONSIVIDADE
// ====================================================================
export { useIsMobile, useIsLowPerformanceDevice } from './use-mobile';
export { useMediaQuery } from './useMediaQuery';

// ====================================================================
// ⚡ HOOKS DE PERFORMANCE
// ====================================================================
export { usePerformanceOptimization } from './usePerformanceOptimization';
export { useDebounce } from './useDebounce';
export { useLoadingState } from './useLoadingState';
// export { useOptimizedTimer } from './useOptimizedTimer';

// ====================================================================
// 🎨 HOOKS DE UI/UX
// ====================================================================
export { useAutoAnimate } from './useAutoAnimate';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { useScrollTracking } from './useScrollTracking';
export { useGlobalStyles } from './useGlobalStyles';

// ====================================================================
// 💾 HOOKS DE DADOS
// ====================================================================
// export { useSupabase } from './useSupabase';
export { useSupabaseQuiz } from './useSupabaseQuiz';
export { useAutosave } from './useAutosave';
export { useHistory } from './useHistory';

// ====================================================================
// 🛠️ HOOKS UTILITÁRIOS
// ====================================================================
export { useToast } from './use-toast';
export { useABTest } from './useABTest';
export { useUtmParameters } from './useUtmParameters';
export { useGlobalLoading } from './useGlobalLoading';

// ====================================================================
// 📊 ESTATÍSTICAS DOS HOOKS
// ====================================================================
export const HOOKS_STATS = {
  total: 50,
  byCategory: {
    quiz: 18,
    editor: 6,
    performance: 2,
    utility: 19,
    responsive: 1,
    animation: 0,
    database: 0,
    result: 4
  },
  lastAnalyzed: '2025-08-06T19:32:18.574Z'
};