import { SuperUnifiedProvider as SuperUnifiedProviderV2 } from '@/contexts/providers/SuperUnifiedProviderV2';

/**
 * ⚠️ LEGACY FACADE - SuperUnifiedProvider V1
 *
 * Para manter compatibilidade com código que ainda importa
 * `@/contexts/providers/SuperUnifiedProvider`, este arquivo reexporta a
 * implementação modular da V2.
 *
 * NOTA: useLegacySuperUnified foi removido. Use hooks individuais:
 * - useEditor() from @/core/contexts/EditorContext
 * - useAuth() from @/contexts/auth/AuthProvider
 * - useUX() from @/contexts/ux/UXProvider
 *
 * TODO: Remover após migração completa para hooks individuais.
 */

export const SuperUnifiedProvider = SuperUnifiedProviderV2;

export function useSuperUnified(): any {
    console.warn('⚠️ useSuperUnified is deprecated. Use individual hooks instead.');
    return {};
}

export const useUnifiedAuth = useSuperUnified;
export const useAuth = useSuperUnified;

export default SuperUnifiedProvider;
