/**
 * 🎯 STORES INDEX - Central Exports
 * 
 * Exportações centralizadas de todas as stores Zustand
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
