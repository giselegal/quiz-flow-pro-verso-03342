import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🏗️ PROVIDERS INDEX - FASE 4 CONSOLIDADA
 *
 * Exportações centralizadas dos providers após limpeza completa.
 *
 * ✅ CANÔNICO: SuperUnifiedProviderV4 (minimal + Zustand)
 * ✅ ALIASES: UnifiedAppProvider (aponta para V4)
 * ❌ REMOVIDOS: V2, V3, ConsolidatedProvider, FunnelMasterProvider
 */

// ✅ PROVIDER CANÔNICO - V4
export {
  UnifiedAppProvider,
  default as UnifiedAppProviderDefault,
} from './UnifiedAppProvider';

// Hooks placeholder (use context-specific hooks instead)
export const useUnifiedApp = () => {
  console.warn('⚠️ useUnifiedApp is deprecated. Use context-specific hooks instead.');
  return {};
};

export const useUnifiedAppSelector = () => {
  console.warn('⚠️ useUnifiedAppSelector is deprecated. Use Zustand selectors instead.');
  return {};
};

// 🎥 FEATURE: Live preview via WebSocket (usado em editor avançado)
export { default as LivePreviewProvider, useLivePreview } from './LivePreviewProvider';

// 🔧 INTERNOS: Runtime providers para editor (mantidos)
export { EditorRuntimeProviders } from '@/contexts';

// 🚨 FAIL-SAFE: Throw helper para detectar uso indevido de legados em runtime
export const assertNoLegacyProvidersRuntime = () => {
  if (process.env.NODE_ENV !== 'production') {
    const legacyDetected = (globalThis as any).__LEGACY_PROVIDER_USED__;
    if (legacyDetected) {
      appLogger.error('❌ Legacy provider foi utilizado após fase de limpeza:', { data: [legacyDetected] });
    }
  }
};
