// Exportações dos contextos
export { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
export { AuthProvider, useAuth } from './AuthContext';
export { EditorProvider, useEditor } from './EditorContext';
export { EditorQuizProvider, useEditorQuiz } from './EditorQuizContext';
export { FunnelsProvider, useFunnels } from './FunnelsContext';
export { QuizProvider, useQuiz, useQuizContext } from './QuizContext';
export { ScrollSyncProvider, useScrollSync } from './ScrollSyncContext';
export { StepsProvider, useSteps } from './StepsContext';

// Estatísticas dos contextos
export const CONTEXTS_STATS = {
  total: 8,
  byCategory: {
    auth: 2,
    editor: 2,
    quiz: 1,
    ui: 1,
    flow: 2,
  },
  lastAnalyzed: new Date().toISOString(),
};
