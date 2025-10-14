/**
 * Loader para steps normalizados (public/templates/normalized/step-XX.json)
 * Usa fetch somente em runtime browser. Em ambiente de build/SSR pode ser adaptado.
 */

import type { UnifiedStep } from '@/types/normalizedTemplate';

const stepCache: Record<string, UnifiedStep | null> = {};

export async function loadNormalizedStep(stepId: string): Promise<UnifiedStep | null> {
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
