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

// ❌ REMOVIDO: ConsolidatedProvider (substituído por UnifiedAppProvider)
// Mantido export vazio para evitar erro imediato em algum import residual durante migração incremental.
// Após confirmar zero imports via grep/CI, remover linhas abaixo.
// export { ConsolidatedProvider, default as ConsolidatedProviderDefault } from './ConsolidatedProvider';

// 🔧 INTERNO: Usado internamente por UnifiedAppProvider (exposto apenas para testes e extensão avançada)
export { default as SuperUnifiedProvider, useSuperUnified } from './SuperUnifiedProvider';

// ❌ REMOVIDO: FunnelMasterProvider e hooks associados
// Hooks substituídos por API CRUD unificada (useUnifiedCRUD / selectors específicos)
// export { FunnelMasterProvider, useFunnelMaster, useFunnels, useUnifiedFunnel, useFunnelConfig, useQuizFlow, useQuiz21Steps } from './FunnelMasterProvider';

// ❌ REMOVIDO: OptimizedProviderStack (função absorvida em UnifiedAppProvider)
// export { default as OptimizedProviderStack } from './OptimizedProviderStack';

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
      console.error('❌ Legacy provider foi utilizado após fase de limpeza:', legacyDetected);
    }
  }
};