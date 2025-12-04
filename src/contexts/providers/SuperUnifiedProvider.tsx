import { SuperUnifiedProviderV4 } from '@/contexts/providers/SuperUnifiedProviderV4';

/**
 * ⚠️ LEGACY FACADE - SuperUnifiedProvider
 *
 * Para manter compatibilidade com código que ainda importa
 * `@/contexts/providers/SuperUnifiedProvider`, este arquivo reexporta a
 * implementação V4 (minimal + Zustand).
 *
 * NOTA: useLegacySuperUnified foi removido. Use hooks individuais:
 * - useEditor() from @/core/contexts/EditorContext
 * - useAuth() from @/contexts/auth/AuthProvider
 * - useUX() from @/contexts/ux/UXProvider
 *
 * TODO: Remover após migração completa para hooks individuais.
 */

export const SuperUnifiedProvider = SuperUnifiedProviderV4;

export function useSuperUnified(): any {
    console.warn('⚠️ useSuperUnified is deprecated. Use individual hooks instead.');
    return {};
}

export const useUnifiedAuth = useSuperUnified;
export const useAuth = useSuperUnified;
export const useUnifiedContext = useSuperUnified;

export default SuperUnifiedProvider;
