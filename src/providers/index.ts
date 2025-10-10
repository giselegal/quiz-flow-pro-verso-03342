/**
 * 🏗️ PROVIDERS INDEX
 * 
 * Exportações centralizadas dos providers
 */

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
export type { EditorRuntimeProvidersProps } from '@/contexts';