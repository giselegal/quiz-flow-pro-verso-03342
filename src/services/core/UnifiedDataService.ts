/**
 * 🎯 UNIFIED DATA SERVICE - PONTO CENTRAL DE DADOS
 * 
 * Serviço único que consolida todas as fontes de dados:
 * - Supabase (dados reais de produção)
 * - localStorage/IndexedDB (cache local)
 * - Mock data (fallback para desenvolvimento)
 * 
 * Este serviço resolve a fragmentação identificada entre
 * admin/dashboard/editor fornecendo interface consistente.
 */

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { SampleDataService } from '@/services/SampleDataService';

// ============================================================================
// TYPES
// ============================================================================

type SupabaseFunnel = Database['public']['Tables']['funnels']['Row'];
type SupabaseFunnelPage = Database['public']['Tables']['funnel_pages']['Row'];

// ============================================================================
// INTERFACES UNIFICADAS
// ============================================================================

export interface UnifiedFunnel {
    id: string;
    name: string;
    description?: string;
    user_id: string;
    is_published: boolean;
    version: number;
    settings: {
        theme: string;
        category: string;
        autoSave: boolean;
        [key: string]: any;
    };
    pages: UnifiedFunnelPage[];
    created_at: string;
    updated_at: string;
    // Campos calculados
    views?: number;
    conversions?: number;
    conversion_rate?: number;
}

export interface UnifiedFunnelPage {
    id: string;
    funnel_id: string;
    page_type: string;
    title?: string;
    page_order: number;
    blocks: any[];
    metadata?: any;
    created_at: string;
    updated_at: string;
}

export interface UnifiedMetrics {
    totalFunnels: number;
    activeFunnels: number;
    draftFunnels: number;
    totalSessions: number;
    completedSessions: number;
    conversionRate: number;
    totalRevenue: number;
    activeUsersNow: number;
    topPerformingFunnels: Array<{
        id: string;
        name: string;
        conversions: number;
        conversion_rate: number;
    }>;
}

export interface UnifiedUser {
    id: string;
    email?: string;
    full_name?: string;
    avatar_url?: string;
    created_at: string;
}

export interface UnifiedAnalytics {
    funnelId: string;
    totalViews: number;
    totalConversions: number;
    conversionRate: number;
    averageCompletionTime: number;
    dropoffPoints: Array<{
        step: number;
        dropoffRate: number;
    }>;
    demographicData: {
        ageGroups: Record<string, number>;
        locations: Record<string, number>;
    };
}

// ============================================================================
// UNIFIED DATA SERVICE CLASS
// ============================================================================

class UnifiedDataServiceImpl {
    private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

    // ========================================================================
    // CACHE MANAGEMENT
    // ========================================================================

    private getCacheKey(type: string, params?: any): string {
        return `${type}_${JSON.stringify(params || {})}`;
    }

    private setCache(key: string, data: any, ttl = this.CACHE_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    private getCache<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data as T;
    }

    private clearCache(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        for (const key of this.cache.keys()) {
            if (key.includes(pattern)) {
                this.cache.delete(key);
            }
        }
    }

    // ========================================================================
    // FUNNEL MANAGEMENT
    // ========================================================================

    async getFunnels(options?: {
        status?: 'all' | 'published' | 'draft';
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<UnifiedFunnel[]> {
        const cacheKey = this.getCacheKey('funnels', options);
        const cached = this.getCache<UnifiedFunnel[]>(cacheKey);
        if (cached) return cached;

        try {
            console.log('🔍 UnifiedDataService: Carregando funis do Supabase...');

            let query = supabase
                .from('funnels')
                .select(`
          id,
          name,
          description,
          user_id,
          is_published,
          version,
          settings,
          created_at,
          updated_at,
          funnel_pages (
            id,
            funnel_id,
            page_type,
            title,
            page_order,
            blocks,
            metadata,
            created_at,
            updated_at
          )
        `)
                .order('updated_at', { ascending: false });

            // Aplicar filtros
            if (options?.status === 'published') {
                query = query.eq('is_published', true);
            } else if (options?.status === 'draft') {
                query = query.eq('is_published', false);
            }

            if (options?.userId) {
                query = query.eq('user_id', options.userId);
            }

            if (options?.limit) {
                query = query.limit(options.limit);
            }

            if (options?.offset) {
                query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
            }

            const { data, error } = await query;

            if (error) {
                console.error('❌ Erro ao carregar funis:', error);
                return this.getFallbackFunnels();
            }

            const funnels = await Promise.all((data || []).map(async (funnel: SupabaseFunnel & { funnel_pages?: SupabaseFunnelPage[] }) => {
                // Buscar métricas de analytics para cada funil
                const metrics = await this.getFunnelMetrics(funnel.id);

                return {
                    id: funnel.id,
                    name: funnel.name,
                    description: funnel.description || undefined,
                    user_id: funnel.user_id || 'anonymous',
                    is_published: funnel.is_published || false,
                    version: funnel.version || 1,
                    settings: this.parseSettings(funnel.settings),
                    pages: this.transformFunnelPages(funnel.funnel_pages || []),
                    created_at: funnel.created_at || new Date().toISOString(),
                    updated_at: funnel.updated_at || new Date().toISOString(),
                    views: metrics.views,
                    conversions: metrics.conversions,
                    conversion_rate: metrics.conversion_rate
                } as UnifiedFunnel;
            }));

            this.setCache(cacheKey, funnels);
            console.log(`✅ UnifiedDataService: ${funnels.length} funis carregados`);
            return funnels;

        } catch (error) {
            console.error('❌ Erro na conexão com Supabase:', error);
            return this.getFallbackFunnels();
        }
    }

    async getFunnel(id: string): Promise<UnifiedFunnel | null> {
        const cacheKey = this.getCacheKey('funnel', { id });
        const cached = this.getCache<UnifiedFunnel>(cacheKey);
        if (cached) return cached;

        try {
            const { data, error } = await supabase
                .from('funnels')
                .select(`
          id,
          name,
          description,
          user_id,
          is_published,
          version,
          settings,
          created_at,
          updated_at,
          funnel_pages (
            id,
            funnel_id,
            page_type,
            title,
            page_order,
            blocks,
            metadata,
            created_at,
            updated_at
          )
        `)
                .eq('id', id)
                .single();

            if (error || !data) {
                console.warn(`⚠️ Funil ${id} não encontrado no Supabase`);
                return this.getFallbackFunnel(id);
            }

            const metrics = await this.getFunnelMetrics(id);

            const typedData = data as SupabaseFunnel & { funnel_pages?: SupabaseFunnelPage[] };

            const funnel: UnifiedFunnel = {
                id: typedData.id,
                name: typedData.name,
                description: typedData.description || undefined,
                user_id: typedData.user_id || 'anonymous',
                is_published: typedData.is_published || false,
                version: typedData.version || 1,
                settings: this.parseSettings(typedData.settings),
                pages: this.transformFunnelPages(typedData.funnel_pages || []),
                created_at: typedData.created_at || new Date().toISOString(),
                updated_at: typedData.updated_at || new Date().toISOString(),
                views: metrics.views,
                conversions: metrics.conversions,
                conversion_rate: metrics.conversion_rate
            };

            this.setCache(cacheKey, funnel);
            return funnel;

        } catch (error) {
            console.error(`❌ Erro ao carregar funil ${id}:`, error);
            return this.getFallbackFunnel(id);
        }
    }

    async saveFunnel(funnel: Partial<UnifiedFunnel>): Promise<UnifiedFunnel> {
        try {
            console.log(`💾 UnifiedDataService: Salvando funil ${funnel.name}...`);

            const funnelData = {
                id: funnel.id || crypto.randomUUID(),
                name: funnel.name || 'Novo Funil',
                description: funnel.description,
                user_id: funnel.user_id || 'anonymous',
                is_published: funnel.is_published || false,
                version: (funnel.version || 0) + 1,
                settings: funnel.settings || { theme: 'default', category: 'general', autoSave: true },
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('funnels')
                .upsert(funnelData)
                .select()
                .single();

            if (error) {
                console.error('❌ Erro ao salvar funil:', error);
                throw error;
            }

            // Salvar páginas se fornecidas
            if (funnel.pages && funnel.pages.length > 0) {
                await this.saveFunnelPages(data.id, funnel.pages);
            }

            // Limpar cache relacionado
            this.clearCache('funnel');

            console.log(`✅ Funil ${data.name} salvo com sucesso`);
            return await this.getFunnel(data.id) as UnifiedFunnel;

        } catch (error) {
            console.error('❌ Erro ao salvar funil:', error);
            // Fallback para localStorage
            return this.saveFunnelToLocalStorage(funnel);
        }
    }

    async deleteFunnel(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('funnels')
                .delete()
                .eq('id', id);

            if (error) {
                console.error(`❌ Erro ao deletar funil ${id}:`, error);
                return false;
            }

            this.clearCache('funnel');
            console.log(`✅ Funil ${id} deletado com sucesso`);
            return true;

        } catch (error) {
            console.error(`❌ Erro ao deletar funil ${id}:`, error);
            return false;
        }
    }

    // ========================================================================
    // ANALYTICS & METRICS
    // ========================================================================

    async getDashboardMetrics(userId?: string): Promise<UnifiedMetrics> {
        const cacheKey = this.getCacheKey('dashboard_metrics', { userId });
        const cached = this.getCache<UnifiedMetrics>(cacheKey);
        if (cached) return cached;

        try {
            console.log('📊 UnifiedDataService: Carregando métricas do dashboard...');

            // Verificar se há dados disponíveis
            const dataCheck = await SampleDataService.checkDataAvailability();
            console.log('🔍 Status dos dados:', dataCheck);

            // Se não há dados reais, popular com dados de exemplo
            if (dataCheck.needsSampleData) {
                console.log('🌱 Nenhum dado encontrado, populando dados de exemplo...');
                await SampleDataService.populateSampleData();
                
                // Retornar métricas de exemplo
                const sampleMetrics = SampleDataService.getSampleMetrics();
                this.setCache(cacheKey, sampleMetrics);
                console.log('✅ Métricas de exemplo carregadas:', sampleMetrics);
                return sampleMetrics;
            }

            // Buscar dados de funis
            const funnels = await this.getFunnels({ userId });

            // Buscar dados de sessões
            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('id, funnel_id, completed_at, started_at')
                .order('started_at', { ascending: false });

            if (sessionsError) {
                console.warn('⚠️ Erro ao carregar sessões:', sessionsError);
            }

            const totalSessions = sessions?.length || 0;
            const completedSessions = sessions?.filter(s => s.completed_at).length || 0;
            const conversionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

            // Calcular top performing funnels
            const funnelMetrics = new Map();
            sessions?.forEach(session => {
                const count = funnelMetrics.get(session.funnel_id) || 0;
                funnelMetrics.set(session.funnel_id, count + 1);
            });

            const topPerformingFunnels = Array.from(funnelMetrics.entries())
                .map(([funnelId]) => {
                    const funnel = funnels.find(f => f.id === funnelId);
                    return funnel ? {
                        id: funnel.id,
                        name: funnel.name,
                        conversions: funnel.conversions || 0,
                        conversion_rate: funnel.conversion_rate || 0
                    } : null;
                })
                .filter(Boolean)
                .sort((a, b) => (b?.conversions || 0) - (a?.conversions || 0))
                .slice(0, 5);

            const metrics: UnifiedMetrics = {
                totalFunnels: funnels.length,
                activeFunnels: funnels.filter(f => f.is_published).length,
                draftFunnels: funnels.filter(f => !f.is_published).length,
                totalSessions,
                completedSessions,
                conversionRate,
                totalRevenue: completedSessions * 45, // R$ 45 por conversão
                activeUsersNow: Math.floor(Math.random() * 20) + 5, // Simulado
                topPerformingFunnels: topPerformingFunnels as any[]
            };

            this.setCache(cacheKey, metrics);
            console.log('✅ Métricas carregadas:', metrics);
            return metrics;

        } catch (error) {
            console.error('❌ Erro ao carregar métricas:', error);
            return this.getFallbackMetrics();
        }
    }

    async getFunnelAnalytics(funnelId: string): Promise<UnifiedAnalytics> {
        const cacheKey = this.getCacheKey('funnel_analytics', { funnelId });
        const cached = this.getCache<UnifiedAnalytics>(cacheKey);
        if (cached) return cached;

        try {
            // Buscar sessões do funil
            const { data: sessions, error } = await supabase
                .from('quiz_sessions')
                .select('id, completed_at, started_at')
                .eq('funnel_id', funnelId);

            if (error) {
                console.warn(`⚠️ Erro ao carregar analytics do funil ${funnelId}:`, error);
            }

            const totalViews = sessions?.length || 0;
            const totalConversions = sessions?.filter(s => s.completed_at).length || 0;
            const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;

            const analytics: UnifiedAnalytics = {
                funnelId,
                totalViews,
                totalConversions,
                conversionRate,
                averageCompletionTime: 180, // 3 minutos - simulado
                dropoffPoints: [
                    { step: 1, dropoffRate: 5 },
                    { step: 5, dropoffRate: 15 },
                    { step: 10, dropoffRate: 25 },
                    { step: 15, dropoffRate: 35 },
                    { step: 20, dropoffRate: 45 }
                ],
                demographicData: {
                    ageGroups: {
                        '18-25': 25,
                        '26-35': 40,
                        '36-45': 25,
                        '46+': 10
                    },
                    locations: {
                        'São Paulo': 30,
                        'Rio de Janeiro': 20,
                        'Belo Horizonte': 15,
                        'Outros': 35
                    }
                }
            };

            this.setCache(cacheKey, analytics);
            return analytics;

        } catch (error) {
            console.error(`❌ Erro ao carregar analytics do funil ${funnelId}:`, error);
            return this.getFallbackAnalytics(funnelId);
        }
    }

    // ========================================================================
    // USER MANAGEMENT
    // ========================================================================

    async getCurrentUser(): Promise<UnifiedUser | null> {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                console.warn('⚠️ Usuário não autenticado');
                return null;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            return {
                id: user.id,
                email: user.email,
                full_name: profile?.name || user.user_metadata?.full_name,
                avatar_url: user.user_metadata?.avatar_url,
                created_at: user.created_at
            };

        } catch (error) {
            console.error('❌ Erro ao carregar usuário atual:', error);
            return null;
        }
    }

    // ========================================================================
    // PRIVATE HELPERS
    // ========================================================================

    /**
     * Converte settings do Supabase para formato unificado
     */
    private parseSettings(settings: any): { theme: string; category: string; autoSave: boolean;[key: string]: any } {
        if (!settings || typeof settings !== 'object') {
            return { theme: 'default', category: 'general', autoSave: true };
        }

        return {
            theme: settings.theme || 'default',
            category: settings.category || 'general',
            autoSave: settings.autoSave !== false,
            ...settings
        };
    }

    /**
     * Transforma pages do Supabase para formato unificado
     */
    private transformFunnelPages(pages: SupabaseFunnelPage[]): UnifiedFunnelPage[] {
        return pages.map(page => ({
            id: page.id,
            funnel_id: page.funnel_id,
            page_type: page.page_type,
            title: page.title || undefined,
            page_order: page.page_order,
            blocks: Array.isArray(page.blocks) ? page.blocks : [],
            metadata: page.metadata || undefined,
            created_at: page.created_at || new Date().toISOString(),
            updated_at: page.updated_at || new Date().toISOString()
        }));
    }

    private async getFunnelMetrics(funnelId: string): Promise<{
        views: number;
        conversions: number;
        conversion_rate: number;
    }> {
        try {
            const { data: sessions } = await supabase
                .from('quiz_sessions')
                .select('id, completed_at')
                .eq('funnel_id', funnelId);

            const views = sessions?.length || 0;
            const conversions = sessions?.filter(s => s.completed_at).length || 0;
            const conversion_rate = views > 0 ? (conversions / views) * 100 : 0;

            return { views, conversions, conversion_rate };
        } catch (error) {
            return { views: 0, conversions: 0, conversion_rate: 0 };
        }
    }

    private async saveFunnelPages(funnelId: string, pages: UnifiedFunnelPage[]): Promise<void> {
        try {
            // Deletar páginas existentes
            await supabase
                .from('funnel_pages')
                .delete()
                .eq('funnel_id', funnelId);

            // Inserir novas páginas
            const pagesData = pages.map(page => ({
                ...page,
                funnel_id: funnelId,
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('funnel_pages')
                .insert(pagesData);

            if (error) {
                console.error('❌ Erro ao salvar páginas:', error);
            }
        } catch (error) {
            console.error('❌ Erro ao salvar páginas:', error);
        }
    }

    private getFallbackFunnels(): UnifiedFunnel[] {
        // Dados de fallback para quando Supabase não está disponível
        const fallbackFunnel: UnifiedFunnel = {
            id: 'fallback-funnel-1',
            name: 'Quiz de Estilo Pessoal (Fallback)',
            description: 'Funil de fallback para desenvolvimento',
            user_id: 'anonymous',
            is_published: true,
            version: 1,
            settings: { theme: 'default', category: 'style', autoSave: true },
            pages: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            views: 150,
            conversions: 45,
            conversion_rate: 30
        };

        console.log('⚠️ Usando dados de fallback para funis');
        return [fallbackFunnel];
    }

    private getFallbackFunnel(id: string): UnifiedFunnel {
        return {
            id,
            name: `Funil Fallback ${id}`,
            description: 'Funil de fallback para desenvolvimento',
            user_id: 'anonymous',
            is_published: false,
            version: 1,
            settings: { theme: 'default', category: 'general', autoSave: true },
            pages: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            views: 0,
            conversions: 0,
            conversion_rate: 0
        };
    }

    private getFallbackMetrics(): UnifiedMetrics {
        console.log('⚠️ Usando métricas de fallback');
        return {
            totalFunnels: 3,
            activeFunnels: 2,
            draftFunnels: 1,
            totalSessions: 125,
            completedSessions: 45,
            conversionRate: 36,
            totalRevenue: 2025,
            activeUsersNow: 12,
            topPerformingFunnels: [
                { id: 'fallback-1', name: 'Quiz de Estilo', conversions: 25, conversion_rate: 35 },
                { id: 'fallback-2', name: 'Funil Marketing', conversions: 20, conversion_rate: 30 }
            ]
        };
    }

    private getFallbackAnalytics(funnelId: string): UnifiedAnalytics {
        return {
            funnelId,
            totalViews: 100,
            totalConversions: 30,
            conversionRate: 30,
            averageCompletionTime: 180,
            dropoffPoints: [
                { step: 1, dropoffRate: 5 },
                { step: 10, dropoffRate: 20 },
                { step: 20, dropoffRate: 40 }
            ],
            demographicData: {
                ageGroups: { '18-25': 30, '26-35': 45, '36+': 25 },
                locations: { 'São Paulo': 40, 'Rio de Janeiro': 30, 'Outros': 30 }
            }
        };
    }

    private saveFunnelToLocalStorage(funnel: Partial<UnifiedFunnel>): UnifiedFunnel {
        const fallbackFunnel: UnifiedFunnel = {
            id: funnel.id || crypto.randomUUID(),
            name: funnel.name || 'Novo Funil',
            description: funnel.description || '',
            user_id: funnel.user_id || 'anonymous',
            is_published: funnel.is_published || false,
            version: (funnel.version || 0) + 1,
            settings: funnel.settings || { theme: 'default', category: 'general', autoSave: true },
            pages: funnel.pages || [],
            created_at: funnel.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            views: 0,
            conversions: 0,
            conversion_rate: 0
        };

        try {
            const key = `unified_funnel_${fallbackFunnel.id}`;
            localStorage.setItem(key, JSON.stringify(fallbackFunnel));
            console.log(`✅ Funil salvo no localStorage: ${key}`);
        } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
        }

        return fallbackFunnel;
    }

    // ========================================================================
    // PUBLIC UTILITIES
    // ========================================================================

    clearAllCache(): void {
        this.clearCache();
        console.log('🧹 Cache do UnifiedDataService limpo');
    }

    async refreshData(): Promise<void> {
        this.clearAllCache();
        // Recarregar dados essenciais
        await Promise.all([
            this.getFunnels(),
            this.getDashboardMetrics(),
            this.getCurrentUser()
        ]);
        console.log('🔄 Dados do UnifiedDataService atualizados');
    }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const UnifiedDataService = new UnifiedDataServiceImpl();
export default UnifiedDataService;