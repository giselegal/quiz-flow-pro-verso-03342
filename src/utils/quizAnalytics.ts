import { z } from 'zod';
import { trackEvent } from './analytics';
export type QuizAnalyticsEventType = 'step_view' | 'result_compute' | 'offer_view' | 'cta_click';

interface BaseEvt { type: QuizAnalyticsEventType; ts: string; sessionId: string; userId?: string; }
export type QuizAnalyticsEvent =
    | (BaseEvt & { type: 'step_view'; stepId: string; stepType: string; position: number })
    | (BaseEvt & { type: 'result_compute'; primary?: string; secondary?: string[]; answersCount: number })
    | (BaseEvt & { type: 'offer_view'; offerKey?: string; hasImage?: boolean })
    | (BaseEvt & { type: 'cta_click'; offerKey?: string; url?: string });

const STORAGE_KEY = 'quizAnalyticsEvents';
let ANALYTICS_NAMESPACE: string | null = null;

export function setQuizAnalyticsNamespace(ns: string | null) {
    ANALYTICS_NAMESPACE = ns ? ns.replace(/[:\s]+$/, '').trim() : null;
}

// ================= ZOD SCHEMAS =================
const baseSchema = z.object({
    ts: z.string().optional(),
    sessionId: z.string().optional(),
    userId: z.string().optional(),
    type: z.enum(['step_view', 'result_compute', 'offer_view', 'cta_click'])
});

const stepViewSchema = baseSchema.extend({
    type: z.literal('step_view'),
    stepId: z.string(),
    stepType: z.string(),
    position: z.number().int().nonnegative()
});
const resultComputeSchema = baseSchema.extend({
    type: z.literal('result_compute'),
    primary: z.string().optional(),
    secondary: z.array(z.string()).optional(),
    answersCount: z.number().int().nonnegative()
});
const offerViewSchema = baseSchema.extend({
    type: z.literal('offer_view'),
    offerKey: z.string().optional(),
    hasImage: z.boolean().optional()
});
const ctaClickSchema = baseSchema.extend({
    type: z.literal('cta_click'),
    offerKey: z.string().optional(),
    url: z.string().url().optional()
});

const anyEventSchema = z.discriminatedUnion('type', [stepViewSchema, resultComputeSchema, offerViewSchema, ctaClickSchema]);

function uuid() { try { return crypto.randomUUID(); } catch { return 'sess-' + Math.random().toString(36).slice(2); } }

let sessionId = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('quizSessionId')) || '';
if (!sessionId && typeof sessionStorage !== 'undefined') {
    sessionId = uuid();
    try { sessionStorage.setItem('quizSessionId', sessionId); } catch { }
}

function load(): QuizAnalyticsEvent[] {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return []; const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch { return []; }
}
function save(evts: QuizAnalyticsEvent[]) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(evts.slice(-500))); } catch { } }

// Tornar emit mais permissivo para evitar ruído de tipagem caso campos não estritamente mapeados evoluam.
function resolveUserId(): string | undefined {
    try {
        // Prioridade: localStorage userProfile.userId > localStorage.userId > sessionStorage.userId
        const profileRaw = localStorage.getItem('userProfile');
        if (profileRaw) {
            const p = JSON.parse(profileRaw);
            if (p && typeof p === 'object') {
                if (p.userId) return String(p.userId);
                if (p.id) return String(p.id);
                if (p.uid) return String(p.uid);
            }
        }
        const direct = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        if (direct) return direct;
    } catch { }
    return undefined;
}

export function emitQuizEvent(evt: any) {
    const draftBase = { ...evt };
    if (ANALYTICS_NAMESPACE && typeof draftBase.type === 'string') {
        draftBase.type = `${ANALYTICS_NAMESPACE}:${draftBase.type}`;
    }
    const draft = { ...draftBase, ts: new Date().toISOString(), sessionId, userId: resolveUserId() };
    const parsed = anyEventSchema.safeParse(draft);
    if (!parsed.success) {
        if (typeof console !== 'undefined') console.warn('[QuizAnalytics] Evento inválido descartado', parsed.error.flatten());
        return;
    }
    const full = parsed.data as QuizAnalyticsEvent;
    const all = load(); all.push(full); save(all);
    // Bridge p/ analytics principal (GA4) - nomes simplificados
    // Se namespaced, separar tipo original para GA4 (mantém painéis existentes)
    const rawType = (full.type.includes(':') ? full.type.split(':').slice(-1)[0] : full.type) as QuizAnalyticsEventType;
    try {
        switch (rawType) {
            case 'step_view':
                trackEvent('quiz_step_view', { step_id: (full as any).stepId, step_type: (full as any).stepType, position: (full as any).position });
                break;
            case 'result_compute':
                trackEvent('quiz_result_compute', { primary: (full as any).primary, secondary: (full as any).secondary, answers: (full as any).answersCount });
                break;
            case 'offer_view':
                trackEvent('quiz_offer_view', { offer_key: (full as any).offerKey, has_image: (full as any).hasImage });
                break;
            case 'cta_click':
                trackEvent('quiz_cta_click', { offer_key: (full as any).offerKey, url: (full as any).url });
                break;
        }
    } catch { }
    if (typeof console !== 'undefined') console.log('[QuizAnalytics]', full.type, full);
}
export function getQuizEvents() { return load(); }
export function clearQuizEvents() { try { localStorage.removeItem(STORAGE_KEY); } catch { } }

// ============== MÉTRICAS DERIVADAS / FILTROS =================
export interface QuizMetrics {
    totalSteps: number;
    totalResultComputes: number;
    totalOffers: number;
    totalCtaClicks: number;
    distinctSessions: number;
    distinctUsers: number;
    avgAnswersPerResult: number;
    conversionRateOfferPerResult: number; // offer_view / result_compute
    ctaClickThroughPerOffer: number; // cta_click / offer_view
}

export interface MetricsFilter { sessionId?: string; fromTs?: string; toTs?: string; }

export function getQuizMetrics(filter: MetricsFilter = {}): QuizMetrics {
    const evts = getQuizEvents().filter(e => {
        if (filter.sessionId && e.sessionId !== filter.sessionId) return false;
        if (filter.fromTs && e.ts < filter.fromTs) return false;
        if (filter.toTs && e.ts > filter.toTs) return false;
        return true;
    });
    const steps = evts.filter(e => e.type === 'step_view');
    const results = evts.filter(e => e.type === 'result_compute') as any[];
    const offers = evts.filter(e => e.type === 'offer_view');
    const ctas = evts.filter(e => e.type === 'cta_click');
    const sessions = new Set(evts.map(e => e.sessionId));
    const users = new Set(evts.map(e => (e as any).userId).filter(Boolean));
    const avgAnswers = results.length ? (results.reduce((a, r) => a + (r.answersCount || 0), 0) / results.length) : 0;
    const conversion = results.length ? offers.length / results.length : 0;
    const ctaRate = offers.length ? ctas.length / offers.length : 0;
    return {
        totalSteps: steps.length,
        totalResultComputes: results.length,
        totalOffers: offers.length,
        totalCtaClicks: ctas.length,
        distinctSessions: sessions.size,
        distinctUsers: users.size,
        avgAnswersPerResult: Number(avgAnswers.toFixed(2)),
        conversionRateOfferPerResult: Number(conversion.toFixed(3)),
        ctaClickThroughPerOffer: Number(ctaRate.toFixed(3))
    };
}

// ============== FLUSH ENDPOINT (BATCH) =================
export interface FlushOptions { endpoint: string; batchSize?: number; onSuccessRemove?: boolean; }

export async function flushQuizEvents(opts: FlushOptions) {
    const { endpoint, batchSize = 100, onSuccessRemove = true } = opts;
    const all = getQuizEvents();
    if (!all.length) return { flushed: 0 };
    let flushed = 0;
    for (let i = 0; i < all.length; i += batchSize) {
        const slice = all.slice(i, i + batchSize);
        try {
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events: slice })
            });
            flushed += slice.length;
        } catch (err) {
            console.warn('[QuizAnalytics] Falha ao enviar batch', err);
            break; // parar no primeiro erro
        }
    }
    if (onSuccessRemove && flushed) {
        // remover os que foram enviados (assumindo ordem cronológica)
        const remaining = all.slice(flushed);
        save(remaining as any);
    }
    return { flushed };
}

// ===== Retry / Backoff Flush Avançado =====
export interface RetryFlushOptions extends FlushOptions {
    maxRetries?: number;            // total de tentativas por batch
    backoffBaseMs?: number;         // base do backoff exponencial
    signal?: AbortSignal;           // permite abortar externamente
    onProgress?: (info: {
        batchIndex: number;
        batchTotal: number;
        attempt: number;
        success: boolean;
        error?: any;
        flushedSoFar: number;
    }) => void;
}

export async function flushQuizEventsWithRetry(opts: RetryFlushOptions) {
    const { endpoint, batchSize = 100, onSuccessRemove = true, maxRetries = 3, backoffBaseMs = 500, signal, onProgress } = opts;
    const all = getQuizEvents();
    if (!all.length) return { flushed: 0, batches: 0 };
    let flushed = 0;
    const batchTotal = Math.ceil(all.length / batchSize);
    for (let batchIndex = 0; batchIndex < batchTotal; batchIndex++) {
        const start = batchIndex * batchSize;
        const slice = all.slice(start, start + batchSize);
        let attempt = 0; let sent = false; let lastErr: any;
        while (attempt < maxRetries && !sent) {
            if (signal?.aborted) throw new Error('Abortado pelo sinal externo');
            attempt++;
            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ events: slice, batch: batchIndex, totalBatches: batchTotal, attempt })
                });
                if (!res.ok) throw new Error('Status ' + res.status);
                flushed += slice.length;
                sent = true;
                onProgress?.({ batchIndex, batchTotal, attempt, success: true, flushedSoFar: flushed });
            } catch (error) {
                lastErr = error;
                onProgress?.({ batchIndex, batchTotal, attempt, success: false, error, flushedSoFar: flushed });
                if (attempt < maxRetries) {
                    const delay = backoffBaseMs * Math.pow(2, attempt - 1);
                    await new Promise(r => setTimeout(r, delay));
                }
            }
        }
        if (!sent) {
            console.warn('[QuizAnalytics] Batch falhou após retries', { batchIndex, lastErr });
            break; // interrompe cadeia
        }
    }
    if (onSuccessRemove && flushed) {
        const remaining = all.slice(flushed);
        save(remaining as any);
    }
    return { flushed, batches: Math.ceil(flushed / batchSize) };
}

export default { emitQuizEvent, getQuizEvents, clearQuizEvents };
