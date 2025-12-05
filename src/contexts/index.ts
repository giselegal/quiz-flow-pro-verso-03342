/**
 * 🔄 Contexts Centralizados - Barrel Exports
 * Estrutura organizada por feature/domínio
 * 
 * Migração: Sprint 1 - Out/2025
 * Estrutura: /src/contexts/{feature}/
 */

// 🔐 AUTH
export { AdminAuthProvider, useAdminAuth } from './auth/AdminAuthContext';

/**
 * @deprecated Use { AuthProvider, useAuth } from './auth/AuthProvider' (modular V2)
 * Este é o provider legado. Será removido após migração completa para V2.
 */
export { AuthProvider as AuthProviderLegacy, useAuth as useAuthLegacy } from './auth/AuthContext';

// 🚀 SUPER UNIFIED V2 (REFATORADO - FASE 2.1 COMPLETA)
// Core Providers
export { AuthProvider, useAuth } from './auth/AuthProvider';
export { ThemeProvider, useTheme } from './theme/ThemeProvider';
// EditorStateProvider movido para seção EDITOR abaixo (linha 60+)
export { FunnelDataProvider, useFunnelData } from './funnel/FunnelDataProvider';

// Extended Providers (Fase 2.1 - Wave 2)
export { NavigationProvider, useNavigation } from './navigation/NavigationProvider';
export { QuizStateProvider, useQuizState } from './quiz/QuizStateProvider';
export { ResultProvider, useResult } from './result/ResultProvider';
export { StorageProvider, useStorage } from './storage/StorageProvider';
export { SyncProvider, useSync } from './sync/SyncProvider';
export { ValidationProvider, useValidation, validators } from './validation/ValidationProvider';
export { CollaborationProvider, useCollaboration } from './collaboration/CollaborationProvider';
export { VersioningProvider, useVersioning } from './versioning/VersioningProvider';

// Composed Provider
export { SuperUnifiedProvider, useUnifiedContext } from './providers/SuperUnifiedProvider';
// Provider minimalista (Fase 4 simplificação) - uso recomendado para rotas sem recursos avançados
export { SimpleAppProvider, useSimpleApp } from './providers/SimpleAppProvider';

/**
 * 🚀 SUPER UNIFIED V1 (LEGACY - EM USO ATIVO)
 * 
 * ⚠️ ATENÇÃO: Esta é a versão MONOLÍTICA (1959 linhas)
 * Status: 20+ arquivos ainda dependem desta versão
 * 
 * Para novos componentes, use SuperUnifiedProvider (V2) com hooks individuais:
 * - useAuth() ao invés de useUnifiedAuth()
 * - useTheme(), useEditorState(), useFunnelData(), etc.
 * 
 * Roadmap: Será deprecado após migração completa para V2
 * Ver: CHECKLIST_RESOLUCAO_DUPLICACOES.md
 * 
 * @deprecated Use useEditorContext() para API consolidada
 * 
 * NOTA: Hook antigo useSuperUnified foi removido - migre para useEditorContext
 */

// 🆕 FASE 3: PureBuilder compatibility

// ✏️ EDITOR
// ⚠️ CONSOLIDAÇÃO FASE 1.2: Todos os EditorContexts agora apontam para @/core/contexts/EditorContext
// Use apenas EditorStateProvider/useEditor de @/core/contexts/EditorContext
export { 
  EditorStateProvider,
  EditorStateProvider as EditorProvider,
  useEditorState,
  useEditor,
  type EditorState as CoreEditorState,
  type EditorContextValue,
  type ValidationError,
} from '@/core/contexts/EditorContext';

// Aliases de compatibilidade para imports legados
export { useEditor as useUnifiedEditor } from '@/core/contexts/EditorContext';

// Legacy context - re-exporta do canônico
export { EditorContext } from './editor/EditorContext';
export { EditorQuizProvider, useEditorQuiz } from './editor/EditorQuizContext';
export { EditorRuntimeProviders } from './editor/EditorRuntimeProviders';

// 🎯 FUNNEL
export { FunnelsProvider, useFunnels } from './funnel/FunnelsContext';
export { UnifiedFunnelProvider, useUnifiedFunnel } from './funnel/UnifiedFunnelContext';

// 🎯 EDITOR FUNNEL CONTEXT - Propagação global de funnelId
export {
  EditorFunnelProvider,
  useEditorFunnel,
  useEditorFunnelSafe,
  useFunnelId,
  withFunnelId,
} from './EditorFunnelContext';

// 🎯 UNIFIED EDITOR CONTEXT - Re-exporta do canônico com aliases de compatibilidade
export {
  EditorStateProvider as UnifiedEditorProvider,
  useEditor as useEditorContext,
  useEditorState as useUnifiedEditorState,
  // EditorContextValue já exportado acima
} from '@/core/contexts/EditorContext';

// Hooks auxiliares de compatibilidade
export {
  useEditorContextSafe,
  useEditorActions,
  useEditorFunnelId,
  useEditorCurrentStep,
  useSelectedBlock,
  useCurrentStepBlocks,
  useBlockSelection,
  useStepNavigation,
  useEditorHistory,
  type EditorMode,
  type ViewportSize,
  type EditorState_Legacy as EditorState,
  type EditorActions_Legacy as EditorActions,
} from './EditorContext';

// 🎨 QUIZ
export { QuizProvider, useQuiz, useQuizContext } from './quiz/QuizContext';
export { QuizFlowProvider, useQuizFlow } from './quiz/QuizFlowProvider';

// 🎭 UI
/**
 * @deprecated Use { ThemeProvider, useTheme } from './theme/ThemeProvider' (modular V2)
 * Este é o provider legado. Será removido após migração completa para V2.
 */
export { ThemeProvider as ThemeProviderLegacy, useThemeContext } from './ui/ThemeContext';
export { PreviewProvider, usePreview } from './ui/PreviewContext';
export { ScrollSyncProvider, useScrollSync } from './ui/ScrollSyncContext';

// 💾 DATA
export { default as UnifiedCRUDProvider, useUnifiedCRUD, useUnifiedCRUDOptional } from './data/UnifiedCRUDProvider';
export { UserDataProvider, useUserData } from './data/UserDataContext';
export { StepsProvider, useSteps } from './data/StepsContext';

// ✅ VALIDATION (LEGACY)
/**
 * @deprecated Use { ValidationProvider, useValidation } from './validation/ValidationProvider' (modular V2)
 * Este é o provider legado. Será removido após migração completa para V2.
 */
export { ValidationProvider as ValidationProviderLegacy, useValidationContext } from './validation/ValidationContext';

// ⚙️ CONFIG
export { UnifiedConfigProvider, useUnifiedConfig } from './config/UnifiedConfigContext';

// 🔧 PROVIDERS ADICIONAIS (não documentados em FASE 2.1)
export { LivePreviewProvider, useLivePreview } from './providers/LivePreviewProvider';
export { PerformanceProvider, usePerformance } from './providers/PerformanceProvider';
export { SecurityProvider, useSecurity } from './providers/SecurityProvider';
export { UIProvider, useUI } from './providers/UIProvider';

/**
 * Estatísticas dos contextos (atualizado)
 */
export const CONTEXTS_STATS = {
  total: 24, // 23 originais + 1 UnifiedEditorContext
  byCategory: {
    auth: 2,
    editor: 4, // +1 UnifiedEditorContext
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
