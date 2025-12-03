/**
 * 🎯 STORES INDEX - Central Exports
 * 
 * Exportações centralizadas de todas as stores Zustand
 * 
 * ARQUITETURA CONSOLIDADA:
 * - editorStore: Estado do editor (blocos, steps, seleção)
 * - quizStore: Estado do quiz em execução (respostas, progresso)
 * - uiStore: Estado de UI (painéis, modais, notificações)
 */

// Editor Store
export {
  useEditorStore,
  useCurrentStep,
  useCurrentStepBlocks,
  useSelectedBlock,
  useEditorMode,
  useEditorDirtyState,
} from './editorStore';

export type { EditorStep } from './editorStore';

// Quiz Store
export {
  useQuizStore,
  useQuizProgress,
  useCurrentStepAnswer,
  useQuizSession,
  useQuizNavigation,
} from './quizStore';

export type { QuizAnswer, QuizSession } from './quizStore';

// UI Store
export {
  useUIStore,
  usePanels,
  useNotifications,
  useActiveModals,
  useViewport,
} from './uiStore';

export type { Notification, NotificationType, Modal } from './uiStore';

// Re-export unified hooks
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
