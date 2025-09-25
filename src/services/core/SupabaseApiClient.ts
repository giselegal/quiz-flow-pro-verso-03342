/**
 * 🗄️ SUPABASE API CLIENT CENTRALIZADO
 * 
 * Camada de infraestrutura que centraliza todas as operações Supabase,
 * eliminando imports diretos espalhados pelo sistema
 * 
 * ✅ Single Point of Access para Supabase
 * ✅ Cache inteligente e otimizado
 * ✅ Error handling padronizado
 * ✅ Rate limiting automático
 * ✅ Logging e monitoring centralizado
 * ✅ TypeScript completo
 */

import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

type QuizSession = Database['public']['Tables']['quiz_sessions']['Row'];
type QuizResult = Database['public']['Tables']['quiz_results']['Row'];
type QuizStepResponse = Database['public']['Tables']['quiz_step_responses']['Row'];
type Funnel = Database['public']['Tables']['funnels']['Row'];
type Template = Database['public']['Tables']['templates']['Row'];

export interface SupabaseQueryOptions {
    cache?: boolean;
    timeout?: number;
    retries?: number;
}

export interface SupabaseApiResponse<T> {
    data: T | null;
    error: any;
    count?: number;
    status: 'success' | 'error' | 'loading';
}

// ============================================================================
// SUPABASE API CLIENT
// ============================================================================

class SupabaseApiClient {
    private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
    private requestCount = 0;
    private lastRequest = 0;

    // ============================================================================
    // CACHE MANAGEMENT
    // ============================================================================

    private getCacheKey(operation: string, params: any): string {
        return `${operation}_${JSON.stringify(params)}`;
    }

    private getFromCache<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            console.log(`📊 Cache hit: ${key}`);
            return cached.data;
        }
        return null;
    }

    private setCache(key: string, data: any, ttl = 300000): void { // 5 min default
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    private clearCache(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        const keys = Array.from(this.cache.keys());
        keys.forEach(key => {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        });
    }

    // ============================================================================
    // RATE LIMITING
    // ============================================================================

    private async rateLimit(): Promise<void> {
        this.requestCount++;
        const now = Date.now();

        // Rate limiting: max 10 requests per second
        if (this.requestCount > 10 && (now - this.lastRequest) < 1000) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.lastRequest = now;

        // Reset counter every second
        if (now - this.lastRequest > 1000) {
            this.requestCount = 0;
        }
    }

    // ============================================================================
    // QUIZ OPERATIONS
    // ============================================================================

    async getQuizSessions(options?: SupabaseQueryOptions & {
        dateRange?: { from: Date; to: Date };
        status?: string;
        limit?: number;
    }): Promise<SupabaseApiResponse<QuizSession[]>> {
        const cacheKey = this.getCacheKey('quiz_sessions', options);

        if (options?.cache !== false) {
            const cached = this.getFromCache<QuizSession[]>(cacheKey);
            if (cached) {
                return { data: cached, error: null, status: 'success' };
            }
        }

        await this.rateLimit();

        try {
            let query = supabase
                .from('quiz_sessions')
                .select('*')
                .order('created_at', { ascending: false });

            if (options?.dateRange) {
                query = query
                    .gte('created_at', options.dateRange.from.toISOString())
                    .lte('created_at', options.dateRange.to.toISOString());
            }

            if (options?.status) {
                query = query.eq('status', options.status);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            const { data, error, count } = await query;

            if (error) {
                console.error('❌ Supabase Query Error (sessions):', error);
                return { data: null, error, status: 'error' };
            }

            // Cache successful results
            if (options?.cache !== false) {
                this.setCache(cacheKey, data, 300000); // 5 minutes
            }

            console.log(`✅ Quiz sessions retrieved: ${data?.length || 0} records`);
            return { data, error: null, count, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error getting quiz sessions:', error);
            return { data: null, error, status: 'error' };
        }
    }

    async getQuizResults(options?: SupabaseQueryOptions & {
        dateRange?: { from: Date; to: Date };
        sessionId?: string;
        limit?: number;
    }): Promise<SupabaseApiResponse<QuizResult[]>> {
        const cacheKey = this.getCacheKey('quiz_results', options);

        if (options?.cache !== false) {
            const cached = this.getFromCache<QuizResult[]>(cacheKey);
            if (cached) {
                return { data: cached, error: null, status: 'success' };
            }
        }

        await this.rateLimit();

        try {
            let query = supabase
                .from('quiz_results')
                .select('*')
                .order('created_at', { ascending: false });

            if (options?.dateRange) {
                query = query
                    .gte('created_at', options.dateRange.from.toISOString())
                    .lte('created_at', options.dateRange.to.toISOString());
            }

            if (options?.sessionId) {
                query = query.eq('session_id', options.sessionId);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            const { data, error, count } = await query;

            if (error) {
                console.error('❌ Supabase Query Error (results):', error);
                return { data: null, error, status: 'error' };
            }

            // Cache successful results
            if (options?.cache !== false) {
                this.setCache(cacheKey, data, 300000); // 5 minutes
            }

            console.log(`✅ Quiz results retrieved: ${data?.length || 0} records`);
            return { data, error: null, count, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error getting quiz results:', error);
            return { data: null, error, status: 'error' };
        }
    }

    async getQuizStepResponses(sessionId: string, options?: SupabaseQueryOptions): Promise<SupabaseApiResponse<QuizStepResponse[]>> {
        const cacheKey = this.getCacheKey('quiz_step_responses', { sessionId, ...options });

        if (options?.cache !== false) {
            const cached = this.getFromCache<QuizStepResponse[]>(cacheKey);
            if (cached) {
                return { data: cached, error: null, status: 'success' };
            }
        }

        await this.rateLimit();

        try {
            const { data, error } = await supabase
                .from('quiz_step_responses')
                .select('*')
                .eq('session_id', sessionId)
                .order('step_number', { ascending: true });

            if (error) {
                console.error('❌ Supabase Query Error (step responses):', error);
                return { data: null, error, status: 'error' };
            }

            // Cache successful results
            if (options?.cache !== false) {
                this.setCache(cacheKey, data, 600000); // 10 minutes (more stable data)
            }

            console.log(`✅ Step responses retrieved: ${data?.length || 0} records for session ${sessionId}`);
            return { data, error: null, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error getting step responses:', error);
            return { data: null, error, status: 'error' };
        }
    }

    // ============================================================================
    // FUNNEL OPERATIONS
    // ============================================================================

    async getFunnels(options?: SupabaseQueryOptions & {
        status?: string;
        limit?: number;
    }): Promise<SupabaseApiResponse<Funnel[]>> {
        const cacheKey = this.getCacheKey('funnels', options);

        if (options?.cache !== false) {
            const cached = this.getFromCache<Funnel[]>(cacheKey);
            if (cached) {
                return { data: cached, error: null, status: 'success' };
            }
        }

        await this.rateLimit();

        try {
            let query = supabase
                .from('funnels')
                .select('*')
                .order('created_at', { ascending: false });

            if (options?.status) {
                query = query.eq('status', options.status);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            const { data, error, count } = await query;

            if (error) {
                console.error('❌ Supabase Query Error (funnels):', error);
                return { data: null, error, status: 'error' };
            }

            // Cache successful results
            if (options?.cache !== false) {
                this.setCache(cacheKey, data, 600000); // 10 minutes
            }

            console.log(`✅ Funnels retrieved: ${data?.length || 0} records`);
            return { data, error: null, count, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error getting funnels:', error);
            return { data: null, error, status: 'error' };
        }
    }

    async getFunnelById(id: string, options?: SupabaseQueryOptions): Promise<SupabaseApiResponse<Funnel>> {
        const cacheKey = this.getCacheKey('funnel_by_id', { id, ...options });

        if (options?.cache !== false) {
            const cached = this.getFromCache<Funnel>(cacheKey);
            if (cached) {
                return { data: cached, error: null, status: 'success' };
            }
        }

        await this.rateLimit();

        try {
            const { data, error } = await supabase
                .from('funnels')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('❌ Supabase Query Error (funnel by id):', error);
                return { data: null, error, status: 'error' };
            }

            // Cache successful results
            if (options?.cache !== false) {
                this.setCache(cacheKey, data, 1800000); // 30 minutes (stable data)
            }

            console.log(`✅ Funnel retrieved: ${id}`);
            return { data, error: null, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error getting funnel by id:', error);
            return { data: null, error, status: 'error' };
        }
    }

    // ============================================================================
    // TEMPLATE OPERATIONS
    // ============================================================================

    async getTemplates(options?: SupabaseQueryOptions & {
        category?: string;
        limit?: number;
    }): Promise<SupabaseApiResponse<Template[]>> {
        const cacheKey = this.getCacheKey('templates', options);

        if (options?.cache !== false) {
            const cached = this.getFromCache<Template[]>(cacheKey);
            if (cached) {
                return { data: cached, error: null, status: 'success' };
            }
        }

        await this.rateLimit();

        try {
            let query = supabase
                .from('templates')
                .select('*')
                .order('created_at', { ascending: false });

            if (options?.category) {
                query = query.eq('category', options.category);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            const { data, error, count } = await query;

            if (error) {
                console.error('❌ Supabase Query Error (templates):', error);
                return { data: null, error, status: 'error' };
            }

            // Cache successful results
            if (options?.cache !== false) {
                this.setCache(cacheKey, data, 1800000); // 30 minutes (stable data)
            }

            console.log(`✅ Templates retrieved: ${data?.length || 0} records`);
            return { data, error: null, count, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error getting templates:', error);
            return { data: null, error, status: 'error' };
        }
    }

    // ============================================================================
    // WRITE OPERATIONS
    // ============================================================================

    async createQuizSession(sessionData: Partial<QuizSession>): Promise<SupabaseApiResponse<QuizSession>> {
        await this.rateLimit();

        try {
            const { data, error } = await supabase
                .from('quiz_sessions')
                .insert(sessionData)
                .select()
                .single();

            if (error) {
                console.error('❌ Supabase Insert Error (quiz session):', error);
                return { data: null, error, status: 'error' };
            }

            // Clear related cache
            this.clearCache('quiz_sessions');

            console.log('✅ Quiz session created:', data.id);
            return { data, error: null, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error creating quiz session:', error);
            return { data: null, error, status: 'error' };
        }
    }

    async updateQuizSession(id: string, updates: Partial<QuizSession>): Promise<SupabaseApiResponse<QuizSession>> {
        await this.rateLimit();

        try {
            const { data, error } = await supabase
                .from('quiz_sessions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('❌ Supabase Update Error (quiz session):', error);
                return { data: null, error, status: 'error' };
            }

            // Clear related cache
            this.clearCache('quiz_sessions');

            console.log('✅ Quiz session updated:', id);
            return { data, error: null, status: 'success' };

        } catch (error) {
            console.error('❌ Unexpected error updating quiz session:', error);
            return { data: null, error, status: 'error' };
        }
    }

    // ============================================================================
    // UTILITY METHODS
    // ============================================================================

    async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; latency: number }> {
        const start = Date.now();

        try {
            const { error } = await supabase
                .from('quiz_sessions')
                .select('id')
                .limit(1);

            const latency = Date.now() - start;

            if (error) {
                return { status: 'unhealthy', latency };
            }

            return { status: 'healthy', latency };

        } catch (error) {
            const latency = Date.now() - start;
            return { status: 'unhealthy', latency };
        }
    }

    getCacheStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    clearAllCache(): void {
        this.cache.clear();
        console.log('🗑️ All Supabase cache cleared');
    }

    // ============================================================================
    // RAW SUPABASE ACCESS (para casos especiais)
    // ============================================================================

    getRawClient() {
        console.warn('⚠️ Using raw Supabase client - prefer using SupabaseApiClient methods');
        return supabase;
    }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const supabaseApiClient = new SupabaseApiClient();

// Default export
export default supabaseApiClient;