/**
 * 🔄 Contexts Centralizados - Barrel Exports
 * Estrutura organizada por feature/domínio
 * 
 * Migração: Sprint 1 - Out/2025
 * Estrutura: /src/contexts/{feature}/
 */

// 🔐 AUTH
export { AdminAuthProvider, useAdminAuth } from './auth/AdminAuthContext';
export { AuthProvider, useAuth as useAuthLegacy } from './auth/AuthContext';

// 🚀 SUPER UNIFIED (Auth consolidado)
export { useAuth, useUnifiedAuth, useSuperUnified } from '@/providers/SuperUnifiedProvider';

// 🆕 FASE 3: PureBuilder compatibility
export { usePureBuilder } from '@/hooks/usePureBuilderCompat';

// ✏️ EDITOR
export { EditorProvider, useEditor } from './editor/EditorContext';
export { EditorContext } from './editor/EditorContext';
export { MigrationEditorProvider, useUnifiedEditor } from '../components/editor/EditorProviderMigrationAdapter';
// EditorDndContext.tsx está vazio - removido
export { EditorQuizProvider, useEditorQuiz } from './editor/EditorQuizContext';
export { EditorRuntimeProviders } from './editor/EditorRuntimeProviders';

// 🎯 FUNNEL
export { FunnelsProvider, useFunnels } from './funnel/FunnelsContext';
export { UnifiedFunnelProvider, useUnifiedFunnel } from './funnel/UnifiedFunnelContext';

// 🎨 QUIZ
export { QuizProvider, useQuiz, useQuizContext } from './quiz/QuizContext';
export { QuizFlowProvider, useQuizFlow } from './quiz/QuizFlowProvider';

// 🎭 UI
export { ThemeProvider, useThemeContext } from './ui/ThemeContext';
export { PreviewProvider, usePreview } from './ui/PreviewContext';
export { ScrollSyncProvider, useScrollSync } from './ui/ScrollSyncContext';

// 💾 DATA
export { default as UnifiedCRUDProvider, useUnifiedCRUD, useUnifiedCRUDOptional } from './data/UnifiedCRUDProvider';
export { UserDataProvider, useUserData } from './data/UserDataContext';
export { StepsProvider, useSteps } from './data/StepsContext';

// ✅ VALIDATION
export { ValidationProvider, useValidationContext } from './validation/ValidationContext';

// ⚙️ CONFIG
export { UnifiedConfigProvider, useUnifiedConfig } from './config/UnifiedConfigContext';

/**
 * Estatísticas dos contextos (atualizado)
 */
export const CONTEXTS_STATS = {
  total: 19, // EditorDndContext removido (arquivo vazio)
  byCategory: {
    auth: 2,
    editor: 3, // EditorDndContext removido
    funnel: 2,
    quiz: 2,
    ui: 3,
    data: 3,
    validation: 1,
    config: 1,
  },
  structure: 'organized',
  migrationDate: '2025-10-10',
  lastAnalyzed: new Date().toISOString(),
};

/**
 * Para uso com path alias:
 * import { useAuth, UnifiedCRUDProvider } from '@/contexts';
 */
