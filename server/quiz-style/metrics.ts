// Simples coletor em memória para métricas do adapter legacy
// Mantido leve; pode evoluir para Prometheus / OpenTelemetry depois.

export interface AdapterMetricsSnapshot {
    conversions: number;          // total de chamadas toTemplateDraft
    deltasApplied: number;        // total de applyDraftDelta
    lastConversionMs?: number;    // duração da última conversão
    lastDeltaMs?: number;         // duração do último delta
    totalConversionTimeMs: number;
    totalDeltaTimeMs: number;
    activeEditSessions: number;   // heurística (inicia no toTemplateDraft, decrement manual futuro)
    lastUpdated: string;
    fallbackCount?: number;       // número de vezes que fallback foi acionado
    lastFallbackAt?: string;      // timestamp da última vez
}

const state: AdapterMetricsSnapshot = {
    conversions: 0,
    deltasApplied: 0,
    lastConversionMs: undefined,
    lastDeltaMs: undefined,
    totalConversionTimeMs: 0,
    totalDeltaTimeMs: 0,
    activeEditSessions: 0,
    lastUpdated: new Date().toISOString(),
    fallbackCount: 0,
    lastFallbackAt: undefined
};

export function recordConversion(durationMs: number) {
    state.conversions += 1;
    state.lastConversionMs = durationMs;
    state.totalConversionTimeMs += durationMs;
    state.activeEditSessions = Math.max(0, state.activeEditSessions + 1);
    state.lastUpdated = new Date().toISOString();
}

export function recordDelta(durationMs: number) {
    state.deltasApplied += 1;
    state.lastDeltaMs = durationMs;
    state.totalDeltaTimeMs += durationMs;
    state.lastUpdated = new Date().toISOString();
}

export function getAdapterMetrics(): AdapterMetricsSnapshot {
    return { ...state };
}

export function recordFallback() {
    state.fallbackCount = (state.fallbackCount || 0) + 1;
    state.lastFallbackAt = new Date().toISOString();
    state.lastUpdated = state.lastFallbackAt;
}

// Export util para eventual reset em testes
export function __resetAdapterMetrics() {
    state.conversions = 0;
    state.deltasApplied = 0;
    state.lastConversionMs = undefined;
    state.lastDeltaMs = undefined;
    state.totalConversionTimeMs = 0;
    state.totalDeltaTimeMs = 0;
    state.activeEditSessions = 0;
    state.lastUpdated = new Date().toISOString();
    state.fallbackCount = 0;
    state.lastFallbackAt = undefined;
}
