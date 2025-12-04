import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🏗️ PROVIDERS INDEX - FASE 4 CONSOLIDADA
 *
 * Exportações centralizadas dos providers após consolidação.
 *
 * ✅ CANÔNICO: SuperUnifiedProviderV4 (minimal + Zustand)
 * ✅ ALIASES: UnifiedAppProvider, SuperUnifiedProvider (apontam para V4)
 * ✅ FLAT: ComposedProviders para novos componentes
 *
 * MIGRAÇÃO COMPLETA:
 * - V2 e V3 foram REMOVIDOS
 * - Use SuperUnifiedProviderV4 ou aliases
 */

// 🎯 FASE 2.1 - ARQUITETURA FLAT (RECOMENDADO PARA NOVOS COMPONENTES)
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

// ✅ PROVIDER CANÔNICO - V4 (minimal + Zustand)
export {
  UnifiedAppProvider,
  default as UnifiedAppProviderDefault,
} from './UnifiedAppProvider';

// ✅ ALIAS: SuperUnifiedProvider aponta para V4
export { SuperUnifiedProvider } from './SuperUnifiedProvider';

// 🚀 FASE 4: Provider minimalista com Zustand (CANÔNICO)
export { SuperUnifiedProviderV4, default as SuperUnifiedProviderV4Default } from './SuperUnifiedProviderV4';

// 🎥 FEATURE: Live preview via WebSocket (usado em editor avançado)
export { default as LivePreviewProvider, useLivePreview } from './LivePreviewProvider';

// 🔧 INTERNOS: Runtime providers para editor (mantidos)
export { EditorRuntimeProviders } from '@/contexts';

// ✅ REEXPORT CANÔNICO DE HOOK PRINCIPAL
export { useUnifiedApp, useUnifiedAppSelector } from './UnifiedAppProvider';

// 🚨 FAIL-SAFE: Throw helper para detectar uso indevido de legados em runtime
export const assertNoLegacyProvidersRuntime = () => {
  if (process.env.NODE_ENV !== 'production') {
    const legacyDetected = (globalThis as any).__LEGACY_PROVIDER_USED__;
    if (legacyDetected) {
      appLogger.error('❌ Legacy provider foi utilizado após fase de limpeza:', { data: [legacyDetected] });
    }
  }
};
