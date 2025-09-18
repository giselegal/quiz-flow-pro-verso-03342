/**
 * 🏗️ PROVIDERS INDEX
 * 
 * Exportações centralizadas dos providers
 */

// Clean Architecture Provider
export {
  CleanArchitectureProvider,
  useCleanArchitecture,
  useFeatureFlags,
  useServices
} from './CleanArchitectureProvider';

// Legacy Providers (mantidos para compatibilidade)
export { EditorRuntimeProviders } from '@/context/EditorRuntimeProviders';
export type { EditorRuntimeProvidersProps } from '@/context/EditorRuntimeProviders';

/**
 * 🎯 PROVIDER UNIFICADO - HÍBRIDO
 * 
 * Combina Clean Architecture com Legacy para migração gradual
 */
export { default as HybridProviderStack } from './HybridProviderStack';