import { SuperUnifiedProvider as SuperUnifiedProviderV2 } from '@/contexts/providers/SuperUnifiedProviderV2';
import { useLegacySuperUnified } from '@/hooks/useLegacySuperUnified';
import type { LegacySuperUnifiedContext } from '@/hooks/useLegacySuperUnified';

/**
 * ⚠️ LEGACY FACADE - SuperUnifiedProvider V1
 *
 * Para manter compatibilidade com código que ainda importa
 * `@/contexts/providers/SuperUnifiedProvider`, este arquivo reexporta a
 * implementação modular da V2 e expõe os hooks legados apontando para
 * `useLegacySuperUnified` (que agrega os providers V2).
 *
 * TODO: Remover após migração completa para hooks individuais.
 */

export const SuperUnifiedProvider = SuperUnifiedProviderV2;
export type SuperUnifiedContextType = LegacySuperUnifiedContext;

export function useSuperUnified(): LegacySuperUnifiedContext {
    return useLegacySuperUnified();
}

export const useUnifiedAuth = useSuperUnified;
export const useAuth = useSuperUnified;

export default SuperUnifiedProvider;
