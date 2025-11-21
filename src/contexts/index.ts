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
export { EditorStateProvider, useEditorState } from './editor/EditorStateProvider';
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
export { SuperUnifiedProvider, useUnifiedContext } from './providers/SuperUnifiedProviderV2';

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
 * @deprecated Use SuperUnifiedProvider (V2) com hooks individuais
 * Compat hook disponível via import direto: import { useSuperUnified } from '@/hooks/useSuperUnified'
 * 
 * NOTA: Não re-exportamos aqui para evitar dependências circulares
 */

// 🆕 FASE 3: PureBuilder compatibility
// NOTA: Import direto recomendado: import { usePureBuilder } from '@/hooks/usePureBuilderCompat'

// ✏️ EDITOR
export { EditorProvider, useEditor } from './editor/EditorContext';
export { EditorContext } from './editor/EditorContext';
// ❌ REMOVIDO: MigrationEditorProvider (use EditorProvider diretamente)
// Compat: reexporta useEditor como useUnifiedEditor para manter chamadas existentes funcionando
export { useEditor as useUnifiedEditor } from './editor/EditorContext';
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
  total: 23, // 19 originais + 4 adicionais (LivePreview, Performance, Security, UI)
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
