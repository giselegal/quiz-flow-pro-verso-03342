/**
 * 🏗️ PROVIDERS INDEX - FASE 2 (ATUALIZADO P1)
 * 
 * Exportações centralizadas dos providers consolidados
 */

// 🎯 FASE P1: Unified App Provider (RECOMENDADO)
export { 
  UnifiedAppProvider,
  default as UnifiedAppProviderDefault
} from './UnifiedAppProvider';

// ⚠️ DEPRECATED: Consolidated Provider (usar UnifiedAppProvider)
export { 
  ConsolidatedProvider,
  default as ConsolidatedProviderDefault
} from './ConsolidatedProvider';

// Super Unified Provider
export {
  default as SuperUnifiedProvider,
  useSuperUnified
} from './SuperUnifiedProvider';

// Funnel Master Provider (consolidates 5+ providers)
export { 
  FunnelMasterProvider,
  useFunnelMaster,
  useFunnels,
  useUnifiedFunnel,
  useFunnelConfig,
  useQuizFlow,
  useQuiz21Steps
} from './FunnelMasterProvider';

// Optimized Provider Stack
export { default as OptimizedProviderStack } from './OptimizedProviderStack';

// Legacy Providers (mantidos para compatibilidade)
export { EditorRuntimeProviders } from '@/contexts';