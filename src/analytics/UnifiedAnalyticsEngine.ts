import { getSupabase } from '@/supabase/config';
import {
    AnswerDistribution,
    DeviceBreakdownCounts,
    FunnelSummary,
    InvalidateScope,
    RealtimeSnapshot,
    StepDropoff,
    StyleSlice,
    TimeRange,
    UnifiedAnalyticsEngine
} from './types';

interface CacheEntry<T> { value: T; expires: number; }

const TTL_DEFAULT = 30_000; // 30s
const TTL_REALTIME = 10_000; // 10s

function rangeCutoff(range: TimeRange): Date {
    const now = new Date();
    switch (range) {
        case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }
}

class Engine implements UnifiedAnalyticsEngine {
    private cache = new Map<string, CacheEntry<any>>();

    private key(parts: (string | number | undefined | null)[]) { return parts.filter(Boolean).join('::'); }
    private set<T>(k: string, v: T, ttl = TTL_DEFAULT) { this.cache.set(k, { value: v, expires: Date.now() + ttl }); }
    private get<T>(k: string): T | null {
        const e = this.cache.get(k);
        if (!e) return null;
        if (Date.now() > e.expires) { this.cache.delete(k); return null; }
        return e.value as T;
    }

    invalidate(scope: InvalidateScope, funnelId?: string): void {
        if (scope === 'all') { this.cache.clear(); return; }
        const prefixes: string[] = [];
        if (scope === 'realtime') prefixes.push('rt');
        if (scope === 'funnel') prefixes.push('funnel');
        if (scope === 'style') prefixes.push('style');
        if (scope === 'step') prefixes.push('stepdrop');
        if (scope === 'device') prefixes.push('device');
        for (const k of Array.from(this.cache.keys())) {
            if (prefixes.some(p => k.startsWith(p + '::')) && (!funnelId || k.includes(`::${funnelId}::`))) {
                this.cache.delete(k);
            }
        }
    }

    async warmCache(funnelId: string): Promise<void> {
        await Promise.all([
            this.getFunnelSummary(funnelId),
            this.getStepDropoff(funnelId),
            this.getStyleDistribution(funnelId),
            this.getDeviceBreakdown(funnelId)
        ]);
    }

    async getFunnelSummary(funnelId: string, range: TimeRange = '7d'): Promise<FunnelSummary> {
        const key = this.key(['funnel', funnelId, range]);
        const cached = this.get<FunnelSummary>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = rangeCutoff(range).toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('session_id, event_type, occurred_at, payload')
            .eq('funnel_id', funnelId)
            .gte('occurred_at', cutoff);
        if (error) throw error;
        const sessions = new Map<string, { start: string; end?: string; completed: boolean }>();
        let completions = 0;
        let totalCompletionDuration = 0;
        for (const row of data || []) {
            if (!sessions.has(row.session_id)) sessions.set(row.session_id, { start: row.occurred_at, completed: false });
            const s = sessions.get(row.session_id)!;
            if (row.event_type === 'quiz_completed' || row.event_type === 'conversion') {
                if (!s.completed) {
                    s.completed = true; s.end = row.occurred_at; completions++;
                    const dur = new Date(s.end).getTime() - new Date(s.start).getTime();
                    if (dur > 0) totalCompletionDuration += dur;
                }
            }
        }
        const totalSessions = sessions.size;
        const avgTime = completions > 0 ? Math.round(totalCompletionDuration / completions / 1000) : 0;
        const summary: FunnelSummary = {
            funnelId,
            totalSessions,
            activeSessions: Array.from(sessions.values()).filter(s => !s.completed).length,
            completedSessions: completions,
            conversionRate: totalSessions > 0 ? (completions / totalSessions) * 100 : 0,
            avgTimeToCompleteSec: avgTime,
            startedAt: data && data.length ? data.reduce((min, r) => r.occurred_at < min ? r.occurred_at : min, data[0].occurred_at) : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.set(key, summary);
        return summary;
    }

    async getRealtimeSnapshot(funnelId: string): Promise<RealtimeSnapshot> {
        const key = this.key(['rt', funnelId]);
        const cached = this.get<RealtimeSnapshot>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('session_id, event_type, occurred_at, step_id, payload')
            .eq('funnel_id', funnelId)
            .gte('occurred_at', cutoff);
        if (error) throw error;
        const activeUsers = new Set<string>();
        let completions = 0;
        let lastStepTime: Record<string, number> = {};
        let stepDurations: number[] = [];
        for (const row of data || []) {
            activeUsers.add(row.session_id);
            if (row.event_type === 'quiz_completed' || row.event_type === 'conversion') completions++;
            if (row.event_type === 'step_viewed' && row.step_id) {
                lastStepTime[`${row.session_id}`] = new Date(row.occurred_at).getTime();
            }
            if (row.event_type === 'question_answered' && row.step_id) {
                const keyS = `${row.session_id}`;
                if (lastStepTime[keyS]) {
                    const d = new Date(row.occurred_at).getTime() - lastStepTime[keyS];
                    if (d > 0) stepDurations.push(d);
                }
            }
        }
        const avgStepTimeSec = stepDurations.length ? Math.round(stepDurations.reduce((a, b) => a + b, 0) / stepDurations.length / 1000) : undefined;
        const snapshot: RealtimeSnapshot = {
            funnelId,
            activeUsers: activeUsers.size,
            recentEvents: data?.length || 0,
            recentCompletions: completions,
            avgStepTimeSec,
            generatedAt: new Date().toISOString()
        };
        this.set(key, snapshot, TTL_REALTIME);
        return snapshot;
    }

    async getStepDropoff(funnelId: string, range: TimeRange = '7d'): Promise<StepDropoff[]> {
        const key = this.key(['stepdrop', funnelId, range]);
        const cached = this.get<StepDropoff[]>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = rangeCutoff(range).toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('session_id, step_id, event_type, occurred_at')
            .eq('funnel_id', funnelId)
            .gte('occurred_at', cutoff)
            .not('step_id', 'is', null);
        if (error) throw error;
        const perStep: Record<string, { entrances: Set<string>; exits: Set<string>; times: number[] }> = {};
        const lastStepSeen: Record<string, { step: string; time: number }> = {};
        for (const row of data || []) {
            if (!row.step_id) continue;
            perStep[row.step_id] = perStep[row.step_id] || { entrances: new Set(), exits: new Set(), times: [] };
            if (row.event_type === 'step_viewed') {
                perStep[row.step_id].entrances.add(row.session_id);
                lastStepSeen[row.session_id] = { step: row.step_id, time: new Date(row.occurred_at).getTime() };
            }
            if (row.event_type === 'question_answered') {
                const ls = lastStepSeen[row.session_id];
                if (ls && ls.step === row.step_id) {
                    const d = new Date(row.occurred_at).getTime() - ls.time;
                    if (d > 0) perStep[row.step_id].times.push(d);
                }
            }
            if (row.event_type === 'quiz_completed' || row.event_type === 'conversion') {
                // Mark exit for last step visited
                const ls2 = lastStepSeen[row.session_id];
                if (ls2) perStep[ls2.step].exits.add(row.session_id);
            }
        }
        const result: StepDropoff[] = Object.entries(perStep).map(([step, v]) => {
            const entrances = v.entrances.size;
            const exits = v.exits.size; // simplistic: last step before completion
            const dropoffRate = entrances > 0 ? ((entrances - exits) / entrances) * 100 : 0;
            const avgTimeSec = v.times.length ? Math.round(v.times.reduce((a, b) => a + b, 0) / v.times.length / 1000) : undefined;
            return { stepId: step, entrances, exits, dropoffRate, avgTimeSec };
        }).sort((a, b) => a.stepId.localeCompare(b.stepId));
        this.set(key, result);
        return result;
    }

    async getStyleDistribution(funnelId: string, range: TimeRange = '7d'): Promise<StyleSlice[]> {
        const key = this.key(['style', funnelId, range]);
        const cached = this.get<StyleSlice[]>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = rangeCutoff(range).toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('payload, event_type')
            .eq('funnel_id', funnelId)
            .gte('occurred_at', cutoff)
            .in('event_type', ['quiz_completed', 'conversion']);
        if (error) throw error;
        const counts: Record<string, number> = {};
        for (const row of data || []) {
            const style = (row.payload && (row.payload.style || row.payload.styleCategory || row.payload.style_result)) || 'desconhecido';
            counts[style] = (counts[style] || 0) + 1;
        }
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const slices: StyleSlice[] = Object.entries(counts).map(([style, count]) => ({ style, count, percentage: (count / total) * 100 }));
        this.set(key, slices);
        return slices;
    }

    async getDeviceBreakdown(funnelId: string, range: TimeRange = '7d'): Promise<DeviceBreakdownCounts> {
        const key = this.key(['device', funnelId, range]);
        const cached = this.get<DeviceBreakdownCounts>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = rangeCutoff(range).toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('device')
            .eq('funnel_id', funnelId)
            .gte('occurred_at', cutoff)
            .not('device', 'is', null);
        if (error) throw error;
        const counts: DeviceBreakdownCounts = { desktop: 0, mobile: 0, tablet: 0 };
        for (const row of data || []) {
            const type = row.device?.type as keyof DeviceBreakdownCounts | undefined;
            if (type && counts[type] != null) counts[type]++;
        }
        this.set(key, counts);
        return counts;
    }

    async getAnswerDistribution(funnelId: string, questionStepId: string, range: TimeRange = '7d') {
        const key = this.key(['answer', funnelId, questionStepId, range]);
        const cached = this.get<any>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = rangeCutoff(range).toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('payload, step_id, event_type')
            .eq('funnel_id', funnelId)
            .eq('step_id', questionStepId)
            .gte('occurred_at', cutoff)
            .eq('event_type', 'question_answered');
        if (error) throw error;
        const counts: Record<string, number> = {};
        for (const row of data || []) {
            const ans = row.payload?.answer || 'desconhecido';
            counts[ans] = (counts[ans] || 0) + 1;
        }
        const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
        const distribution = {
            stepId: questionStepId,
            total,
            options: Object.entries(counts).map(([value, count]) => ({ value, count, percentage: (count / total) * 100 }))
        };
        this.set(key, distribution);
        return distribution;
    }

    async getSessionPathSamples(funnelId: string, limit = 20): Promise<string[][]> {
        const key = this.key(['paths', funnelId, limit]);
        const cached = this.get<string[][]>(key);
        if (cached) return cached;
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase não configurado');
        const cutoff = rangeCutoff('7d').toISOString();
        const { data, error } = await supabase
            .from('unified_events')
            .select('session_id, step_id, event_type, occurred_at')
            .eq('funnel_id', funnelId)
            .gte('occurred_at', cutoff)
            .order('occurred_at', { ascending: true });
        if (error) throw error;
        const paths: Record<string, string[]> = {};
        for (const row of data || []) {
            if (!paths[row.session_id]) paths[row.session_id] = [];
            if (row.event_type === 'step_viewed' && row.step_id) paths[row.session_id].push(row.step_id);
        }
        const result = Object.values(paths).slice(0, limit);
        this.set(key, result, 60_000);
        return result;
    }
}

export const unifiedAnalyticsEngine: UnifiedAnalyticsEngine = new Engine();
export default unifiedAnalyticsEngine;
