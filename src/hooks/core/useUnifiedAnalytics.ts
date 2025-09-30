// @ts-nocheck
/**
 * 📊 USE UNIFIED ANALYTICS - Hook de Analytics e Monitoramento
 * 
 * Funcionalidades:
 * - Métricas em tempo real
 * - Análise de comportamento
 * - Performance monitoring
 * - Relatórios automáticos
 */

import { useState, useEffect, useCallback } from 'react';
// Migração: remover dependência de AnalyticsService legacy
import { unifiedEventTracker } from '@/analytics/UnifiedEventTracker';
import { unifiedAnalyticsEngine } from '@/analytics/UnifiedAnalyticsEngine';

// Tipos mínimos derivados / placeholders enquanto schema definitivo não é consolidado
type MetricCategory = 'performance' | 'collaboration' | 'versioning' | 'usage';
interface Metric { name: string; value: number; unit: string; category: MetricCategory; tags?: Record<string, string>; timestamp: string; }
interface AnalyticsEvent { type: string; timestamp: string; funnelId: string; userId?: string; payload?: any; }
interface Alert { id: string; type: string; severity: 'low' | 'medium' | 'high'; title: string; message: string; threshold: number; currentValue: number; resolved?: boolean; resolvedAt?: Date; resolvedBy?: string; createdAt?: string; }

export interface AnalyticsState {
  // Métricas
  performanceMetrics: Metric[];
  collaborationMetrics: Metric[];
  versioningMetrics: Metric[];
  usageMetrics: Metric[];

  // Eventos
  events: AnalyticsEvent[];
  recentEvents: AnalyticsEvent[];

  // Alertas
  alerts: Alert[];
  activeAlerts: Alert[];

  // Estados
  isLoading: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export interface AnalyticsActions {
  // Métricas
  recordMetric: (name: string, value: number, unit: string, category: MetricCategory, tags?: Record<string, string>) => Promise<void>;
  recordEvent: (type: string, properties?: Record<string, any>) => Promise<void>;

  // Coleta de dados
  collectPerformanceMetrics: () => Promise<void>;
  collectCollaborationMetrics: () => Promise<void>;
  collectVersioningMetrics: () => Promise<void>;
  collectUsageMetrics: () => Promise<void>;

  // Alertas
  createAlert: (type: Alert['type'], severity: Alert['severity'], title: string, message: string, threshold: number, currentValue: number) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;

  // Utilitários
  refresh: () => Promise<void>;
  exportData: (format: 'json' | 'csv') => Promise<void>;
  getMetricsByCategory: (category: MetricCategory) => Metric[];
  getEventsByType: (type: string) => AnalyticsEvent[];
  getActiveAlerts: () => Alert[];
}

export function useUnifiedAnalytics(
  funnelId: string,
  userId: string
): AnalyticsState & AnalyticsActions {

  const [state, setState] = useState<AnalyticsState>({
    performanceMetrics: [],
    collaborationMetrics: [],
    versioningMetrics: [],
    usageMetrics: [],
    events: [],
    recentEvents: [],
    alerts: [],
    activeAlerts: [],
    isLoading: true,
    lastUpdate: null,
    error: null
  });

  /**
   * 🎯 Inicializar analytics
   */
  useEffect(() => {
    initializeAnalytics();
  }, [funnelId, userId]);

  /**
   * 🔄 Atualização automática
   */
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, []);

  /**
   * 🎯 Inicializar analytics
   */
  const initializeAnalytics = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      await refresh();

      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      console.error('❌ Erro ao inicializar analytics:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  };

  /**
   * 📊 Registrar métrica
   */
  const recordMetric = useCallback(async (
    name: string,
    value: number,
    unit: string,
    category: MetricCategory,
    tags: Record<string, string> = {}
  ): Promise<void> => {
    try {
      const metric: Metric = { name, value, unit, category, tags, timestamp: new Date().toISOString() };
      setState(prev => ({
        ...prev,
        [`${category}Metrics`]: [...(prev as any)[`${category}Metrics`], metric],
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('❌ Erro ao registrar métrica:', error);
    }
  }, []);

  /**
   * 🎯 Registrar evento
   */
  const recordEvent = useCallback(async (
    type: string,
    properties: Record<string, any> = {}
  ): Promise<void> => {
    try {
      unifiedEventTracker.track({ type, funnelId, userId, sessionId: `${funnelId}-${userId}`, payload: properties });
      const event: AnalyticsEvent = { type, funnelId, userId, timestamp: new Date().toISOString(), payload: properties };
      setState(prev => ({
        ...prev,
        events: [...prev.events, event],
        recentEvents: [event, ...prev.recentEvents.slice(0, 49)],
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('❌ Erro ao registrar evento:', error);
    }
  }, [userId, funnelId]);

  /**
   * ⚡ Coletar métricas de performance
   */
  const collectPerformanceMetrics = useCallback(async (): Promise<void> => {
    try {
      // Placeholder: obter métricas agregadas do unifiedAnalyticsEngine se disponível
      const summary = unifiedAnalyticsEngine.getFunnelSummary(funnelId);
      const metrics: Record<string, number> = {
        averageCompletionTime: summary.averageTime || 0,
        totalParticipants: summary.totalParticipants || 0
      };

      // Registrar métricas individuais
      for (const [key, value] of Object.entries(metrics)) {
        await recordMetric(
          key,
          value,
          key.includes('Time') || key.includes('Latency') ? 'ms' :
            key.includes('Usage') || key.includes('Rate') ? '%' : 'count',
          'performance',
          { source: 'system' }
        );
      }
    } catch (error) {
      console.error('❌ Erro ao coletar métricas de performance:', error);
    }
  }, [recordMetric]);

  /**
   * 👥 Coletar métricas de colaboração
   */
  const collectCollaborationMetrics = useCallback(async (): Promise<void> => {
    try {
      const metrics: Record<string, number> = { activeCollaborators: 0, editsLastHour: 0 };

      // Registrar métricas individuais
      for (const [key, value] of Object.entries(metrics)) {
        await recordMetric(
          key,
          value,
          key.includes('Rate') || key.includes('Duration') ? 'min' : 'count',
          'collaboration',
          { funnelId }
        );
      }
    } catch (error) {
      console.error('❌ Erro ao coletar métricas de colaboração:', error);
    }
  }, [funnelId, recordMetric]);

  /**
   * 🔄 Coletar métricas de versionamento
   */
  const collectVersioningMetrics = useCallback(async (): Promise<void> => {
    try {
      const metrics: Record<string, number> = { versions: 1, autosaves: 0 };

      // Registrar métricas individuais
      for (const [key, value] of Object.entries(metrics)) {
        await recordMetric(
          key,
          value,
          key.includes('Ratio') ? '%' : key.includes('Storage') ? 'MB' : 'count',
          'versioning',
          { funnelId }
        );
      }
    } catch (error) {
      console.error('❌ Erro ao coletar métricas de versionamento:', error);
    }
  }, [funnelId, recordMetric]);

  /**
   * 📈 Coletar métricas de uso
   */
  const collectUsageMetrics = useCallback(async (): Promise<void> => {
    try {
      const realTime = unifiedAnalyticsEngine.getRealtimeSnapshot(funnelId);
      const metrics: Record<string, number> = { activeUsers: realTime.activeUsers || 0 };

      // Registrar métricas individuais
      for (const [key, value] of Object.entries(metrics)) {
        if (typeof value === 'number') {
          await recordMetric(
            key,
            value,
            key.includes('Rate') ? '%' : key.includes('Duration') ? 'min' : 'count',
            'usage',
            { source: 'analytics' }
          );
        }
      }
    } catch (error) {
      console.error('❌ Erro ao coletar métricas de uso:', error);
    }
  }, [recordMetric]);

  /**
   * 🚨 Criar alerta
   */
  const createAlert = useCallback(async (
    type: Alert['type'],
    severity: Alert['severity'],
    title: string,
    message: string,
    threshold: number,
    currentValue: number
  ): Promise<void> => {
    try {
      const alert: Alert = { id: `al_${Date.now()}`, type, severity, title, message, threshold, currentValue, createdAt: new Date().toISOString() };
      setState(prev => ({
        ...prev,
        alerts: [...prev.alerts, alert],
        activeAlerts: [...prev.activeAlerts, alert],
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('❌ Erro ao criar alerta:', error);
    }
  }, []);

  /**
   * ✅ Resolver alerta
   */
  const resolveAlert = useCallback(async (alertId: string): Promise<void> => {
    try {
      setState(prev => ({
        ...prev,
        alerts: prev.alerts.map(alert =>
          alert.id === alertId
            ? { ...alert, resolved: true, resolvedAt: new Date(), resolvedBy: userId }
            : alert
        ),
        activeAlerts: prev.activeAlerts.filter(alert => alert.id !== alertId),
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('❌ Erro ao resolver alerta:', error);
    }
  }, [userId]);

  /**
   * 🔄 Atualizar dados
   */
  const refresh = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Carregar métricas
      const performanceMetrics = state.performanceMetrics;
      const collaborationMetrics = state.collaborationMetrics;
      const versioningMetrics = state.versioningMetrics;
      const usageMetrics = state.usageMetrics;
      const events = state.events;
      const recentEvents = events.slice(0, 50);
      const alerts = state.alerts;
      const activeAlerts = alerts.filter(a => !a.resolved);

      setState(prev => ({
        ...prev,
        performanceMetrics,
        collaborationMetrics,
        versioningMetrics,
        usageMetrics,
        events,
        recentEvents,
        alerts,
        activeAlerts,
        isLoading: false,
        lastUpdate: new Date(),
        error: null
      }));
    } catch (error) {
      console.error('❌ Erro ao atualizar analytics:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      }));
    }
  }, []);

  /**
   * 📤 Exportar dados
   */
  const exportData = useCallback(async (format: 'json' | 'csv'): Promise<void> => {
    try {
      const data = {
        funnelId,
        userId,
        timestamp: new Date().toISOString(),
        performanceMetrics: state.performanceMetrics,
        collaborationMetrics: state.collaborationMetrics,
        versioningMetrics: state.versioningMetrics,
        usageMetrics: state.usageMetrics,
        events: state.events,
        alerts: state.alerts
      };

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${funnelId}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'csv') {
        // Implementar exportação CSV
        console.log('📤 Exportação CSV não implementada ainda');
      }
    } catch (error) {
      console.error('❌ Erro ao exportar dados:', error);
    }
  }, [funnelId, userId, state]);

  /**
   * 📊 Obter métricas por categoria
   */
  const getMetricsByCategory = useCallback((category: MetricCategory): Metric[] => {
    return (state as any)[`${category}Metrics`] as Metric[];
  }, [state]);

  /**
   * 🎯 Obter eventos por tipo
   */
  const getEventsByType = useCallback((type: string): AnalyticsEvent[] => {
    if (type === 'all') return state.events;
    return state.events.filter(e => e.type === type);
  }, [state.events]);

  /**
   * 🚨 Obter alertas ativos
   */
  const getActiveAlerts = useCallback((): Alert[] => {
    return state.alerts.filter(a => !a.resolved);
  }, [state.alerts]);

  return {
    ...state,
    recordMetric,
    recordEvent,
    collectPerformanceMetrics,
    collectCollaborationMetrics,
    collectVersioningMetrics,
    collectUsageMetrics,
    createAlert,
    resolveAlert,
    refresh,
    exportData,
    getMetricsByCategory,
    getEventsByType,
    getActiveAlerts
  };
}
