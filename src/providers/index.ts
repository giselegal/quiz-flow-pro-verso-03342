import { appLogger } from '@/lib/utils/appLogger';
/**
 * 🏗️ PROVIDERS INDEX - FASE 3 LIMPEZA
 *
 * Exportações centralizadas dos providers APÓS remoção dos legados.
 *
 * ✅ CANÔNICO ÚNICO: UnifiedAppProvider (use este!)
 * 🔧 INTERNOS: SuperUnifiedProvider (camadas base)
 * ❌ REMOVIDOS: ConsolidatedProvider, FunnelMasterProvider, OptimizedProviderStack
 *
 * MIGRAÇÃO:
 * - Substitua qualquer import antigo por: import { UnifiedAppProvider } from '@/providers/UnifiedAppProvider';
 * - Hooks antigos (useFunnels, useQuiz21Steps, etc) agora vivem em contextos unificados (useUnifiedCRUD / selectors específicos)
 */

// ✅ PROVIDER CANÔNICO - ÚNICO QUE DEVE SER USADO EXTERNAMENTE
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