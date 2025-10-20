/**
 * Loader para steps normalizados (public/templates/normalized/step-XX.json)
 *
 * IMPORTANTE:
 * - Este loader deve ser usado APENAS em modo de diagnóstico.
 * - Ative via flag de ambiente VITE_RUNTIME_DEBUG_NORMALIZED=1 OU query ?normalizedDebug=1
 * - O runtime de produção não deve depender de JSON normalizado.
 */

import type { UnifiedStep } from '@/types/normalizedTemplate';

const stepCache: Record<string, UnifiedStep | null> = {};

export async function loadNormalizedStep(stepId: string): Promise<UnifiedStep | null> {
    // Safety guard: se a flag não estiver ativa, retorna null sem fetch.
    try {
        const gate = (import.meta as any)?.env?.VITE_RUNTIME_DEBUG_NORMALIZED;
        if (!(gate === '1' || gate === 'true')) {
            return null;
        }
    } catch {
        // ignore environments sem import.meta
    }
    if (stepCache[stepId] !== undefined) return stepCache[stepId];
    try {
        const res = await fetch(`/templates/normalized/${stepId}.json`, { cache: 'no-store' });
        if (!res.ok) {
            stepCache[stepId] = null;
            return null;
        }
        const data = await res.json();
        // Validação mínima
        if (!data?.id || !Array.isArray(data.blocks)) {
            console.warn('[normalizedLoader] JSON inválido para', stepId);
            stepCache[stepId] = null;
            return null;
        }
        stepCache[stepId] = data;
        return data;
    } catch (e) {
        console.warn('[normalizedLoader] Falha ao carregar', stepId, e);
        stepCache[stepId] = null;
        return null;
    }
}

export function clearNormalizedCache() {
    Object.keys(stepCache).forEach(k => delete stepCache[k]);
}
