/**
 * 🏗️ PROVIDERS INDEX - FASE 2 CONSOLIDADA
 * 
 * Exportações centralizadas dos providers.
 * 
 * ✅ RECOMENDADO: UnifiedAppProvider (use este!)
 * ⚠️ DEPRECATED: ConsolidatedProvider, FunnelMasterProvider
 * 🔧 INTERNO: SuperUnifiedProvider (usado por UnifiedAppProvider)
 */

// ✅ PROVIDER CANÔNICO - USE ESTE!
export { 
  UnifiedAppProvider,
  default as UnifiedAppProviderDefault,
} from './UnifiedAppProvider';

// ⚠️ DEPRECATED: Use UnifiedAppProvider
/** @deprecated Use UnifiedAppProvider instead */
export { 
  ConsolidatedProvider,
  default as ConsolidatedProviderDefault,
} from './ConsolidatedProvider';

// 🔧 INTERNO: Usado internamente por UnifiedAppProvider
// Não use diretamente, a menos que saiba o que está fazendo
export {
  default as SuperUnifiedProvider,
  useSuperUnified,
} from './SuperUnifiedProvider';

// ⚠️ DEPRECATED: Use hooks do UnifiedAppProvider
/** @deprecated Use UnifiedAppProvider with UnifiedCRUD context instead */
export { 
  FunnelMasterProvider,
  useFunnelMaster,
  useFunnels,
  useUnifiedFunnel,
  useFunnelConfig,
  useQuizFlow,
  useQuiz21Steps,
} from './FunnelMasterProvider';

// 🔧 INTERNO: Stack otimizado (legado)
export { default as OptimizedProviderStack } from './OptimizedProviderStack';

// 🔧 INTERNO: Runtime providers para editor
export { EditorRuntimeProviders } from '@/contexts';