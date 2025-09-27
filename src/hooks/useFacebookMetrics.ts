/**
 * 🔗 HOOK PARA FACEBOOK METRICS
 * 
 * Hook personalizado para gerenciar métricas do Facebook de forma reativa
 */

import { useState, useEffect, useCallback } from 'react';
import FacebookMetricsService, {
    FunnelFacebookMetrics,
    FunnelTrackingConfig,
    FacebookMetricDetailed
} from '@/services/FacebookMetricsService';

export interface UseFacebookMetricsOptions {
    funnelId?: string;
    period?: '7d' | '14d' | '30d';
    autoRefresh?: boolean;
    refreshInterval?: number; // em millisegundos
}

export interface FacebookMetricsState {
    metrics: FunnelFacebookMetrics[];
    selectedFunnelMetrics: FunnelFacebookMetrics | null;
    trackingConfig: FunnelTrackingConfig | null;
    detailedMetrics: FacebookMetricDetailed[];
    isLoading: boolean;
    isRefreshing: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

export const useFacebookMetrics = (options: UseFacebookMetricsOptions = {}) => {
    const {
        funnelId,
        period = '30d',
        autoRefresh = false,
        refreshInterval = 60000 // 1 minuto
    } = options;

    const [state, setState] = useState<FacebookMetricsState>({
        metrics: [],
        selectedFunnelMetrics: null,
        trackingConfig: null,
        detailedMetrics: [],
        isLoading: true,
        isRefreshing: false,
        error: null,
        lastUpdated: null
    });

    // ============================================================================
    // FUNÇÕES DE CARREGAMENTO
    // ============================================================================

    const loadMetrics = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setState(prev => ({ ...prev, isLoading: true, error: null }));
            } else {
                setState(prev => ({ ...prev, isRefreshing: true, error: null }));
            }

            const daysAgo = parseInt(period.replace('d', ''));
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysAgo);
            const endDate = new Date();

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            // Carregar dados baseado no funnelId
            if (funnelId) {
                // Métricas específicas do funil
                const [metrics, config, detailed] = await Promise.all([
                    FacebookMetricsService.getFunnelMetrics(funnelId, startDateStr, endDateStr),
                    FacebookMetricsService.getFunnelTrackingConfig(funnelId),
                    FacebookMetricsService.getFunnelDetailedMetrics(funnelId, startDateStr, endDateStr)
                ]);

                setState(prev => ({
                    ...prev,
                    metrics: metrics ? [metrics] : [],
                    selectedFunnelMetrics: metrics,
                    trackingConfig: config,
                    detailedMetrics: detailed,
                    isLoading: false,
                    isRefreshing: false,
                    lastUpdated: new Date()
                }));
            } else {
                // Métricas de todos os funis
                const allMetrics = await FacebookMetricsService.getAllFunnelsMetrics(startDateStr, endDateStr);

                setState(prev => ({
                    ...prev,
                    metrics: allMetrics,
                    selectedFunnelMetrics: null,
                    trackingConfig: null,
                    detailedMetrics: [],
                    isLoading: false,
                    isRefreshing: false,
                    lastUpdated: new Date()
                }));
            }

        } catch (error) {
            console.error('❌ Erro ao carregar métricas:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                isRefreshing: false,
                error: 'Erro ao carregar métricas do Facebook'
            }));
        }
    }, [funnelId, period]);

    const refreshMetrics = useCallback(() => {
        loadMetrics(false);
    }, [loadMetrics]);

    // ============================================================================
    // FUNÇÕES DE AÇÃO
    // ============================================================================

    const syncMetrics = useCallback(async (): Promise<boolean> => {
        try {
            setState(prev => ({ ...prev, isRefreshing: true }));

            const result = await FacebookMetricsService.syncFacebookMetrics(funnelId);

            if (result.success) {
                // Recarregar métricas após sincronização
                await loadMetrics(false);
                return true;
            } else {
                setState(prev => ({
                    ...prev,
                    error: result.message,
                    isRefreshing: false
                }));
                return false;
            }
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            setState(prev => ({
                ...prev,
                error: 'Erro ao sincronizar métricas',
                isRefreshing: false
            }));
            return false;
        }
    }, [funnelId, loadMetrics]);

    const saveTrackingConfig = useCallback(async (config: Partial<FunnelTrackingConfig>): Promise<boolean> => {
        try {
            const success = await FacebookMetricsService.saveFunnelTrackingConfig(config);

            if (success && funnelId) {
                // Recarregar configuração atualizada
                const updatedConfig = await FacebookMetricsService.getFunnelTrackingConfig(funnelId);
                setState(prev => ({
                    ...prev,
                    trackingConfig: updatedConfig
                }));
            }

            return success;
        } catch (error) {
            console.error('❌ Erro ao salvar configuração:', error);
            return false;
        }
    }, [funnelId]);

    // ============================================================================
    // EFFECTS
    // ============================================================================

    // Carregamento inicial e quando dependências mudam
    useEffect(() => {
        loadMetrics();
    }, [loadMetrics]);

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh || refreshInterval <= 0) return;

        const interval = setInterval(() => {
            refreshMetrics();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, refreshMetrics]);

    // ============================================================================
    // CALCULADOS
    // ============================================================================

    const totals = state.metrics.reduce(
        (acc, metric) => ({
            impressions: acc.impressions + metric.total_impressions,
            clicks: acc.clicks + metric.total_clicks,
            spend: acc.spend + metric.total_spend,
            conversions: acc.conversions + metric.total_conversions,
            quiz_starts: acc.quiz_starts + metric.total_quiz_starts,
            leads: acc.leads + metric.total_leads
        }),
        {
            impressions: 0,
            clicks: 0,
            spend: 0,
            conversions: 0,
            quiz_starts: 0,
            leads: 0
        }
    );

    const averages = {
        ctr: state.metrics.length > 0
            ? state.metrics.reduce((acc, m) => acc + m.avg_ctr, 0) / state.metrics.length
            : 0,
        cpc: state.metrics.length > 0
            ? state.metrics.reduce((acc, m) => acc + m.avg_cpc, 0) / state.metrics.length
            : 0,
        roas: state.metrics.length > 0
            ? state.metrics.reduce((acc, m) => acc + m.roas, 0) / state.metrics.length
            : 0
    };

    // ============================================================================
    // RETURN
    // ============================================================================

    return {
        // State
        ...state,

        // Calculados
        totals,
        averages,

        // Ações
        refreshMetrics,
        syncMetrics,
        saveTrackingConfig,

        // Utilitários
        hasMetrics: state.metrics.length > 0,
        isConfigured: state.trackingConfig?.facebook_enabled === true,
        isEmpty: !state.isLoading && state.metrics.length === 0
    };
};

// ============================================================================
// HOOK ESPECIALIZADO PARA UM FUNIL ESPECÍFICO
// ============================================================================

export const useFunnelFacebookMetrics = (funnelId: string, options: Omit<UseFacebookMetricsOptions, 'funnelId'> = {}) => {
    return useFacebookMetrics({ ...options, funnelId });
};

// ============================================================================
// HOOK PARA CONFIGURAÇÕES DE TRACKING
// ============================================================================

export const useFacebookTrackingConfig = (funnelId: string) => {
    const [config, setConfig] = useState<FunnelTrackingConfig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const loadConfig = useCallback(async () => {
        try {
            setIsLoading(true);
            const trackingConfig = await FacebookMetricsService.getFunnelTrackingConfig(funnelId);
            setConfig(trackingConfig);
        } catch (error) {
            console.error('❌ Erro ao carregar configuração:', error);
        } finally {
            setIsLoading(false);
        }
    }, [funnelId]);

    const saveConfig = useCallback(async (newConfig: Partial<FunnelTrackingConfig>): Promise<boolean> => {
        try {
            setIsSaving(true);
            const success = await FacebookMetricsService.saveFunnelTrackingConfig({
                ...newConfig,
                funnel_id: funnelId
            });

            if (success) {
                await loadConfig(); // Recarregar configuração atualizada
            }

            return success;
        } catch (error) {
            console.error('❌ Erro ao salvar configuração:', error);
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [funnelId, loadConfig]);

    useEffect(() => {
        if (funnelId) {
            loadConfig();
        }
    }, [funnelId, loadConfig]);

    return {
        config,
        isLoading,
        isSaving,
        saveConfig,
        reloadConfig: loadConfig
    };
};

export default useFacebookMetrics;