/**
 * 🏗️ PROVIDERS INDEX - FASE 2
 * 
 * Exportações centralizadas dos providers consolidados
 */

// FASE 2: Consolidated Provider (único provider necessário)
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