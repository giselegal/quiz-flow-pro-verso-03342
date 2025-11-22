import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🏗️ PROVIDERS INDEX - FASE 2.1 + FASE 3 LIMPEZA
 *
 * Exportações centralizadas dos providers APÓS remoção dos legados.
 *
 * ✅ NOVO (FASE 2.1): ComposedProviders - Arquitetura flat para reduzir re-renders
 * ✅ CANÔNICO: UnifiedAppProvider (use este para apps existentes!)
 * 🔧 INTERNOS: SuperUnifiedProvider (camadas base - 12 nested providers)
 * ❌ REMOVIDOS: ConsolidatedProvider, FunnelMasterProvider, OptimizedProviderStack
 *
 * MIGRAÇÃO:
 * - NOVO: Use ComposedProviders para novos componentes (melhor performance)
 * - LEGADO: UnifiedAppProvider mantido para compatibilidade
 * - Hooks antigos (useFunnels, useQuiz21Steps, etc) agora vivem em contextos unificados
 */

// 🎯 FASE 2.1 - NOVA ARQUITETURA FLAT (RECOMENDADO PARA NOVOS COMPONENTES)
export {
  ComposedProviders,
  FEATURE_GROUPS,
  useComposedContext,
  useComposedAuth,
  useComposedTheme,
  useComposedEditor,
  useComposedFunnel,
  useComposedNavigation,
  useComposedQuiz,
  useComposedResult,
  useComposedSync,
  useComposedValidation,
  useComposedCollaboration,
  useComposedVersioning,
} from './ComposedProviders';

// ✅ PROVIDER CANÔNICO - MANTIDO PARA COMPATIBILIDADE
export {
  UnifiedAppProvider,
  default as UnifiedAppProviderDefault,
} from './UnifiedAppProvider';

// 🔧 INTERNO: Usado internamente por UnifiedAppProvider (exposto apenas para testes e extensão avançada)
export { SuperUnifiedProvider } from './SuperUnifiedProviderV2';
export { useSuperUnified, useUnifiedAuth } from '@/hooks/useSuperUnified';

// 🎥 FEATURE: Live preview via WebSocket (usado em editor avançado)
export { default as LivePreviewProvider, useLivePreview } from './LivePreviewProvider';

// 🔧 INTERNOS: Runtime providers para editor (mantidos)
export { EditorRuntimeProviders } from '@/contexts';

// ✅ REEXPORT CANÔNICO DE HOOK PRINCIPAL
export { useUnifiedApp, useUnifiedAppSelector } from './UnifiedAppProvider';

// 🚨 FAIL-SAFE: Throw helper para detectar uso indevido de legados em runtime (opcional futuramente)
export const assertNoLegacyProvidersRuntime = () => {
  if (process.env.NODE_ENV !== 'production') {
    const legacyDetected = (globalThis as any).__LEGACY_PROVIDER_USED__;
    if (legacyDetected) {
      // eslint-disable-next-line no-console
      appLogger.error('❌ Legacy provider foi utilizado após fase de limpeza:', { data: [legacyDetected] });
    }
  }
};