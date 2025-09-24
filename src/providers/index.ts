/**
 * 🏗️ PROVIDERS INDEX
 * 
 * Exportações centralizadas dos providers
 */

// Clean Architecture Provider
export { default as CleanArchitectureProvider } from './CleanArchitectureProvider';

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
export { EditorRuntimeProviders } from '@/context/EditorRuntimeProviders';
export type { EditorRuntimeProvidersProps } from '@/context/EditorRuntimeProviders';

/**
 * 🎯 PROVIDER UNIFICADO - HÍBRIDO
 * 
 * Combina Clean Architecture com Legacy para migração gradual
 */
export { default as HybridProviderStack } from './HybridProviderStack';