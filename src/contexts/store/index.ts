/**
 * 🎯 STORES INDEX - Central Exports
 * 
 * Exportações centralizadas de todas as Zustand stores.
 * 
 * ARQUITETURA CONSOLIDADA (V4):
 * - authStore: Autenticação e sessão
 * - editorStore: Estado do editor (blocos, steps, seleção)
 * - quizStore: Estado do quiz em execução (respostas, progresso)
 * - funnelStore: Gerenciamento de funis
 * - uiStore: Estado de UI (painéis, modais, notificações)
 * - themeStore: Dark/Light mode
 */

// ============================================================================
// AUTH STORE
// ============================================================================

export {
  useAuthStore,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  useAuthActions,
} from './authStore';

export type { User } from './authStore';

// ============================================================================
// EDITOR STORE
// ============================================================================

export {
  useEditorStore,
  useCurrentStep,
  useCurrentStepBlocks,
  useSelectedBlock,
  useEditorMode,
  useEditorDirtyState,
} from './editorStore';

export type { EditorStep } from './editorStore';

// ============================================================================
// QUIZ STORE
// ============================================================================

export {
  useQuizStore,
  useQuizProgress,
  useCurrentStepAnswer,
  useQuizSession,
  useQuizNavigation,
} from './quizStore';

export type { QuizAnswer, QuizSession } from './quizStore';

// ============================================================================
// FUNNEL STORE
// ============================================================================

export {
  useFunnelStore,
  useFunnelList,
  useCurrentFunnel,
  useFunnelLoading,
  useFilteredFunnels,
  useFunnelActions,
} from './funnelStore';

export type { Funnel, FunnelStep, FunnelConfig } from './funnelStore';

// ============================================================================
// UI STORE
// ============================================================================

export {
  useUIStore,
  usePanels,
  useNotifications,
  useActiveModals,
  useViewport,
} from './uiStore';

export type { Notification, NotificationType, Modal } from './uiStore';

// ============================================================================
// THEME STORE
// ============================================================================

export {
  useThemeStore,
  useTheme,
  useResolvedTheme,
  useIsDarkMode,
  useThemeActions,
} from './themeStore';

export type { Theme } from './themeStore';

// ============================================================================
// LEGACY COMPATIBILITY - Re-export unified hooks
// ============================================================================

export {
  useEditor,
  useQuiz,
  useUI,
  useEditorSelector,
  useQuizSelector,
  useUISelector,
  usePreviewState,
  useToast,
} from '@/hooks/useUnifiedStore';
