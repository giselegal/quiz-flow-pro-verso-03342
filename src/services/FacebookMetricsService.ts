/**
 * 🔗 FACEBOOK METRICS SERVICE
 * 
 * Serviço para integrar métricas do Facebook com funis específicos
 */

import { supabase } from '@/integrations/supabase/client';

// ============================================================================
// TYPES
// ============================================================================

export interface FunnelFacebookMetrics {
    funnel_id: string;
    funnel_name: string;
    total_campaigns: number;
    total_impressions: number;
    total_clicks: number;
    total_spend: number;
    total_conversions: number;
    total_quiz_starts: number;
    total_quiz_completions: number;
    total_leads: number;
    avg_ctr: number;
    avg_cpc: number;
    roas: number;
    facebook_pixel_id: string | null;
}

export interface FunnelTrackingConfig {
    id: string;
    funnel_id: string;
    facebook_pixel_id?: string;
    facebook_enabled: boolean;
    google_analytics_id?: string;
    google_enabled: boolean;
    utm_source: string;
    utm_medium: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
    track_custom_events: boolean;
    server_side_tracking: boolean;
    custom_events: CustomEvent[];
    is_active: boolean;
    last_sync?: string;
    created_at: string;
    updated_at: string;
}

export interface CustomEvent {
    name: string;
    facebook_event: string;
    description?: string;
}

export interface CampaignMapping {
    id: string;
    campaign_id: string;
    campaign_name: string;
    funnel_id: string;
    utm_parameters: Record<string, string>;
    target_audience: string;
    budget_daily: number;
    is_active: boolean;
}

export interface FacebookMetricDetailed {
    id: string;
    campaign_id: string;
    campaign_name: string;
    funnel_id: string;
    date_start: string;
    date_end: string;
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    conversions: number;
    quiz_starts: number;
    quiz_completions: number;
    leads_generated: number;
    device_breakdown: Record<string, number>;
    demographics: Record<string, any>;
}

// ============================================================================
// FACEBOOK METRICS SERVICE CLASS
// ============================================================================

export class FacebookMetricsService {

    /**
     * 📊 Buscar métricas resumidas de um funil específico
     */
    static async getFunnelMetrics(
        funnelId: string,
        dateStart?: string,
        dateEnd?: string
    ): Promise<FunnelFacebookMetrics | null> {
        try {
            console.log(`🔍 Buscando métricas do funil: ${funnelId}`);

            const startDate = dateStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const endDate = dateEnd || new Date().toISOString().split('T')[0];

            // Usar função do Supabase para buscar métricas do funil
            const { data, error } = await (supabase as any).rpc('get_funnel_facebook_summary', {
                funnel_id_param: funnelId,
                date_start_param: startDate,
                date_end_param: endDate
            });

            if (error) {
                console.error('❌ Erro ao buscar métricas do funil:', error);
                return null;
            }

            return (data as any)?.[0] || null;

        } catch (error) {
            console.error('❌ Erro no serviço de métricas:', error);
            return null;
        }
    }

    /**
     * 📋 Buscar todas as métricas detalhadas de um funil
     */
    static async getFunnelDetailedMetrics(
        funnelId: string,
        dateStart?: string,
        dateEnd?: string
    ): Promise<FacebookMetricDetailed[]> {
        try {
            const startDate = dateStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const endDate = dateEnd || new Date().toISOString().split('T')[0];

            const { data, error } = await (supabase as any)
                .from('facebook_metrics')
                .select('*')
                .eq('funnel_id', funnelId)
                .gte('date_start', startDate)
                .lte('date_end', endDate)
                .order('date_start', { ascending: false });

            if (error) {
                console.error('❌ Erro ao buscar métricas detalhadas:', error);
                return [];
            }

            return data || [];

        } catch (error) {
            console.error('❌ Erro ao buscar métricas detalhadas:', error);
            return [];
        }
    }

    /**
     * ⚙️ Buscar configurações de tracking de um funil
     */
    static async getFunnelTrackingConfig(funnelId: string): Promise<FunnelTrackingConfig | null> {
        try {
            const { data, error } = await (supabase as any)
                .from('funnel_tracking_config')
                .select('*')
                .eq('funnel_id', funnelId)
                .single();

            if (error) {
                console.error('❌ Erro ao buscar configuração do funil:', error);
                return null;
            }

            return data;

        } catch (error) {
            console.error('❌ Erro ao buscar configuração:', error);
            return null;
        }
    }

    /**
     * 💾 Salvar/Atualizar configurações de tracking de um funil
     */
    static async saveFunnelTrackingConfig(config: Partial<FunnelTrackingConfig>): Promise<boolean> {
        try {
            const { data, error } = await (supabase as any)
                .from('funnel_tracking_config')
                .upsert(config, {
                    onConflict: 'funnel_id',
                    ignoreDuplicates: false
                });

            if (error) {
                console.error('❌ Erro ao salvar configuração:', error);
                return false;
            }

            console.log('✅ Configuração salva com sucesso');
            return true;

        } catch (error) {
            console.error('❌ Erro ao salvar configuração:', error);
            return false;
        }
    }

    /**
     * 🎯 Buscar mapeamentos de campanha para funil
     */
    static async getFunnelCampaigns(funnelId: string): Promise<CampaignMapping[]> {
        try {
            const { data, error } = await (supabase as any)
                .from('facebook_campaign_funnel_mapping')
                .select('*')
                .eq('funnel_id', funnelId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Erro ao buscar campanhas do funil:', error);
                return [];
            }

            return data || [];

        } catch (error) {
            console.error('❌ Erro ao buscar campanhas:', error);
            return [];
        }
    }

    /**
     * 📈 Buscar métricas consolidadas de todos os funis
     */
    static async getAllFunnelsMetrics(dateStart?: string, dateEnd?: string): Promise<FunnelFacebookMetrics[]> {
        try {
            const startDate = dateStart || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const endDate = dateEnd || new Date().toISOString().split('T')[0];

            // Buscar todos os funis
            const { data: funnels, error: funnelsError } = await supabase
                .from('funnels')
                .select('id, name')
                .eq('is_published', true);

            if (funnelsError) {
                console.error('❌ Erro ao buscar funis:', funnelsError);
                return [];
            }

            // Buscar métricas para cada funil
            const metricsPromises = (funnels || []).map(funnel =>
                this.getFunnelMetrics(funnel.id, startDate, endDate)
            );

            const metrics = await Promise.all(metricsPromises);

            // Filtrar apenas funis com métricas
            return metrics.filter(metric =>
                metric !== null && metric.total_impressions > 0
            ) as FunnelFacebookMetrics[];

        } catch (error) {
            console.error('❌ Erro ao buscar métricas de todos os funis:', error);
            return [];
        }
    }

    /**
     * 🔄 Sincronizar métricas do Facebook (placeholder para integração futura com API)
     */
    static async syncFacebookMetrics(funnelId?: string): Promise<{ success: boolean; message: string }> {
        try {
            // TODO: Implementar integração real com Facebook Marketing API
            console.log('🔄 Sincronizando métricas do Facebook...', funnelId ? `para funil ${funnelId}` : 'todos os funis');

            // Por enquanto, simular sucesso
            await new Promise(resolve => setTimeout(resolve, 2000));

            return {
                success: true,
                message: 'Métricas sincronizadas com sucesso (simulado)'
            };

        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            return {
                success: false,
                message: 'Erro ao sincronizar métricas'
            };
        }
    }

    /**
     * 📊 Calcular métricas comparativas (período atual vs anterior)
     */
    static async getComparativeMetrics(funnelId: string, days: number = 30): Promise<{
        current: FunnelFacebookMetrics | null;
        previous: FunnelFacebookMetrics | null;
        growth: {
            impressions: number;
            clicks: number;
            spend: number;
            conversions: number;
            leads: number;
        };
    }> {
        try {
            const currentEnd = new Date();
            const currentStart = new Date(currentEnd.getTime() - days * 24 * 60 * 60 * 1000);
            const previousStart = new Date(currentStart.getTime() - days * 24 * 60 * 60 * 1000);

            const [current, previous] = await Promise.all([
                this.getFunnelMetrics(
                    funnelId,
                    currentStart.toISOString().split('T')[0],
                    currentEnd.toISOString().split('T')[0]
                ),
                this.getFunnelMetrics(
                    funnelId,
                    previousStart.toISOString().split('T')[0],
                    currentStart.toISOString().split('T')[0]
                )
            ]);

            // Calcular crescimento percentual
            const calculateGrowth = (current: number, previous: number): number => {
                if (previous === 0) return current > 0 ? 100 : 0;
                return Math.round(((current - previous) / previous) * 100);
            };

            const growth = {
                impressions: calculateGrowth(
                    current?.total_impressions || 0,
                    previous?.total_impressions || 0
                ),
                clicks: calculateGrowth(
                    current?.total_clicks || 0,
                    previous?.total_clicks || 0
                ),
                spend: calculateGrowth(
                    current?.total_spend || 0,
                    previous?.total_spend || 0
                ),
                conversions: calculateGrowth(
                    current?.total_conversions || 0,
                    previous?.total_conversions || 0
                ),
                leads: calculateGrowth(
                    current?.total_leads || 0,
                    previous?.total_leads || 0
                )
            };

            return { current, previous, growth };

        } catch (error) {
            console.error('❌ Erro ao calcular métricas comparativas:', error);
            return {
                current: null,
                previous: null,
                growth: {
                    impressions: 0,
                    clicks: 0,
                    spend: 0,
                    conversions: 0,
                    leads: 0
                }
            };
        }
    }
}

export default FacebookMetricsService;