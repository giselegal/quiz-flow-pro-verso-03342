// @ts-nocheck
/**
 * 📊 ANALYTICS DASHBOARD - Dashboard de Analytics e Monitoramento
 * 
 * Funcionalidades:
 * - Visualizações interativas
 * - Gráficos em tempo real
 * - Filtros avançados
 * - Exportação de dados
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Activity,
  Zap,
  Database,
  MessageSquare,
  GitBranch,
  Settings
} from 'lucide-react';
// MIGRATION: substituído analyticsService legacy por analyticsServiceAdapter (compat layer)
import { analyticsServiceAdapter as analyticsService } from '@/analytics/compat/analyticsServiceAdapter';
// Tipos mínimos locais (até remoção completa do legacy)
interface Metric { name: string; category: string; value: number; timestamp: Date; }
interface AnalyticsEvent { id: string; type: string; timestamp: string; }
interface Alert { id: string; title: string; message: string; severity: 'low' | 'medium' | 'high' | 'critical'; threshold: number; currentValue: number; timestamp: string; }

interface AnalyticsDashboardProps {
  funnelId: string;
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AnalyticsDashboard({
  funnelId,
  userId,
  isOpen,
  onClose
}: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'collaboration' | 'versioning' | 'usage' | 'alerts'>('overview');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    if (isOpen) {
      loadAnalyticsData();
    }
  }, [isOpen, timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Carregar métricas
      // Adapter ainda não fornece métricas categorizadas reais; gerar stubs a partir de snapshot e placeholders
      const snapshot = analyticsService.getRealtimeSnapshot(funnelId);
      const now = new Date();
      const makeMetric = (name: string, category: string, value: number): Metric => ({ name, category, value, timestamp: now });
      const perf: Metric[] = [
        makeMetric('editorLoadTime', 'performance', Math.random() * 800 + 200),
        makeMetric('stageLoadTime', 'performance', Math.random() * 400 + 120),
        makeMetric('blockRenderTime', 'performance', Math.random() * 120 + 30),
        makeMetric('memoryUsage', 'performance', Math.random() * 300 + 150),
        makeMetric('networkLatency', 'performance', Math.random() * 120 + 40),
        makeMetric('cacheHitRate', 'performance', Math.random())
      ];
      const collab: Metric[] = [
        makeMetric('activeUsers', 'collaboration', snapshot.activeUsers || 0),
        makeMetric('concurrentEditors', 'collaboration', Math.floor((snapshot.activeUsers || 0) * 0.4)),
        makeMetric('chatMessages', 'collaboration', Math.floor(Math.random() * 50)),
        makeMetric('changesPerMinute', 'collaboration', Math.floor(Math.random() * 20)),
        makeMetric('conflictsResolved', 'collaboration', Math.floor(Math.random() * 5)),
        makeMetric('commentsAdded', 'collaboration', Math.floor(Math.random() * 15))
      ];
      const versioning: Metric[] = [
        makeMetric('snapshotsCreated', 'versioning', Math.floor(Math.random() * 40)),
        makeMetric('versionsCompared', 'versioning', Math.floor(Math.random() * 25)),
        makeMetric('rollbacksPerformed', 'versioning', Math.floor(Math.random() * 5)),
        makeMetric('historyEntries', 'versioning', Math.floor(Math.random() * 120)),
        makeMetric('storageUsed', 'versioning', Math.floor(Math.random() * 500)),
        makeMetric('compressionRatio', 'versioning', Math.random())
      ];
      const usage: Metric[] = [
        makeMetric('pageViews', 'usage', Math.floor(Math.random() * 1000)),
        makeMetric('uniqueUsers', 'usage', Math.floor(Math.random() * 300)),
        makeMetric('sessionDuration', 'usage', Math.floor(Math.random() * 25) + 5),
        makeMetric('bounceRate', 'usage', Math.random()),
        makeMetric('userRetention', 'usage', Math.random()),
        makeMetric('conversionRate', 'usage', Math.random())
      ];
      setMetrics([...perf, ...collab, ...versioning, ...usage]);

      // Eventos fictícios básicos a partir de métricas recentes
      const eventsGenerated: AnalyticsEvent[] = Array.from({ length: 6 }).map((_, i) => ({
        id: `evt-${Date.now()}-${i}`,
        type: i % 2 === 0 ? 'page_view' : 'user_action',
        timestamp: new Date(Date.now() - i * 60000).toISOString()
      }));
      setEvents(eventsGenerated);

      // Alertas simulados se thresholds superados
      const alertsGenerated: Alert[] = [];
      if (perf[0].value > 1200) {
        alertsGenerated.push({ id: 'alert-load', title: 'Tempo de carregamento alto', message: 'Editor acima de 1200ms', severity: 'medium', threshold: 1200, currentValue: perf[0].value, timestamp: now.toISOString() });
      }
      if ((perf.find(m => m.name === 'errorRate')?.value || 0) > 0.05) {
        alertsGenerated.push({ id: 'alert-error', title: 'Taxa de erro elevada', message: 'Erros acima de 5%', severity: 'high', threshold: 0.05, currentValue: perf.find(m => m.name === 'errorRate')!.value, timestamp: now.toISOString() });
      }
      setAlerts(alertsGenerated);

      setLastRefresh(new Date());
    } catch (error) {
      console.error('❌ Erro ao carregar dados de analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  const handleExport = () => {
    const data = {
      metrics,
      events,
      alerts,
      exportedAt: new Date().toISOString(),
      timeRange,
      funnelId
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${funnelId}-${timeRange}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricValue = (name: string, category: string): number => {
    const metric = metrics.find(m => m.name === name && m.category === category);
    return metric?.value || 0;
  };

  const getMetricTrend = (name: string, category: string): 'up' | 'down' | 'stable' => {
    const recentMetrics = metrics
      .filter(m => m.name === name && m.category === category)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 2);

    if (recentMetrics.length < 2) return 'stable';

    const current = recentMetrics[0].value;
    const previous = recentMetrics[1].value;

    if (current > previous * 1.1) return 'up';
    if (current < previous * 0.9) return 'down';
    return 'stable';
  };

  const getSeverityColor = (severity: Alert['severity']): string => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Analytics Dashboard</h2>
            <span className="text-sm text-gray-500">Funnel: {funnelId}</span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            >
              <option value="1h">Última Hora</option>
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExport}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Visão Geral', icon: Eye },
            { id: 'performance', label: 'Performance', icon: Zap },
            { id: 'collaboration', label: 'Colaboração', icon: Users },
            { id: 'versioning', label: 'Versionamento', icon: GitBranch },
            { id: 'usage', label: 'Uso', icon: Activity },
            { id: 'alerts', label: 'Alertas', icon: AlertTriangle }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {id === 'alerts' && alerts.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Carregando dados de analytics...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Visão Geral */}
              {activeTab === 'overview' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Performance Card */}
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Performance</h3>
                        <Zap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Tempo de Carregamento</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('editorLoadTime', 'performance').toFixed(0)}ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Uso de Memória</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('memoryUsage', 'performance').toFixed(0)}MB
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Taxa de Erro</span>
                          <span className="text-sm font-medium">
                            {(getMetricValue('errorRate', 'performance') * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Colaboração Card */}
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Colaboração</h3>
                        <Users className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Usuários Ativos</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('activeUsers', 'collaboration')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Editores Simultâneos</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('concurrentEditors', 'collaboration')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Mensagens de Chat</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('chatMessages', 'collaboration')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Versionamento Card */}
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Versionamento</h3>
                        <GitBranch className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Snapshots Criados</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('snapshotsCreated', 'versioning')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Versões Comparadas</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('versionsCompared', 'versioning')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Rollbacks</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('rollbacksPerformed', 'versioning')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Uso Card */}
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Uso</h3>
                        <Activity className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Visualizações</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('pageViews', 'usage')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Usuários Únicos</span>
                          <span className="text-sm font-medium">
                            {getMetricValue('uniqueUsers', 'usage')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Taxa de Retenção</span>
                          <span className="text-sm font-medium">
                            {(getMetricValue('userRetention', 'usage') * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gráficos */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium mb-4">Métricas de Performance</h3>
                      <div className="space-y-3">
                        {['editorLoadTime', 'stageLoadTime', 'blockRenderTime'].map(metric => (
                          <div key={metric} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{metric}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">
                                {getMetricValue(metric, 'performance').toFixed(0)}ms
                              </span>
                              {getMetricTrend(metric, 'performance') === 'up' && (
                                <TrendingUp className="w-4 h-4 text-red-500" />
                              )}
                              {getMetricTrend(metric, 'performance') === 'down' && (
                                <TrendingDown className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h3 className="font-medium mb-4">Atividade Recente</h3>
                      <div className="space-y-2">
                        {events.slice(0, 5).map(event => (
                          <div key={event.id} className="flex items-center space-x-2 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">{event.type}</span>
                            <span className="text-gray-400">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance */}
              {activeTab === 'performance' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'editorLoadTime', label: 'Tempo de Carregamento do Editor', unit: 'ms' },
                      { name: 'stageLoadTime', label: 'Tempo de Carregamento da Etapa', unit: 'ms' },
                      { name: 'blockRenderTime', label: 'Tempo de Renderização do Bloco', unit: 'ms' },
                      { name: 'memoryUsage', label: 'Uso de Memória', unit: 'MB' },
                      { name: 'networkLatency', label: 'Latência de Rede', unit: 'ms' },
                      { name: 'cacheHitRate', label: 'Taxa de Acerto do Cache', unit: '%' }
                    ].map(({ name, label, unit }) => (
                      <div key={name} className="bg-white border rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium mb-2">{label}</h3>
                        <div className="text-2xl font-bold text-blue-600">
                          {name.includes('Rate')
                            ? (getMetricValue(name, 'performance') * 100).toFixed(1)
                            : getMetricValue(name, 'performance').toFixed(0)
                          }{unit}
                        </div>
                        <div className="flex items-center mt-2">
                          {getMetricTrend(name, 'performance') === 'up' && (
                            <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                          )}
                          {getMetricTrend(name, 'performance') === 'down' && (
                            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                          )}
                          <span className="text-sm text-gray-600">
                            {getMetricTrend(name, 'performance') === 'up' ? 'Aumentando' :
                              getMetricTrend(name, 'performance') === 'down' ? 'Diminuindo' : 'Estável'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Colaboração */}
              {activeTab === 'collaboration' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'activeUsers', label: 'Usuários Ativos', unit: '' },
                      { name: 'concurrentEditors', label: 'Editores Simultâneos', unit: '' },
                      { name: 'changesPerMinute', label: 'Mudanças por Minuto', unit: '' },
                      { name: 'conflictsResolved', label: 'Conflitos Resolvidos', unit: '' },
                      { name: 'chatMessages', label: 'Mensagens de Chat', unit: '' },
                      { name: 'commentsAdded', label: 'Comentários Adicionados', unit: '' }
                    ].map(({ name, label, unit }) => (
                      <div key={name} className="bg-white border rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium mb-2">{label}</h3>
                        <div className="text-2xl font-bold text-green-600">
                          {getMetricValue(name, 'collaboration')}{unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Versionamento */}
              {activeTab === 'versioning' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'snapshotsCreated', label: 'Snapshots Criados', unit: '' },
                      { name: 'versionsCompared', label: 'Versões Comparadas', unit: '' },
                      { name: 'rollbacksPerformed', label: 'Rollbacks Realizados', unit: '' },
                      { name: 'historyEntries', label: 'Entradas de Histórico', unit: '' },
                      { name: 'storageUsed', label: 'Armazenamento Usado', unit: 'MB' },
                      { name: 'compressionRatio', label: 'Taxa de Compressão', unit: '%' }
                    ].map(({ name, label, unit }) => (
                      <div key={name} className="bg-white border rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium mb-2">{label}</h3>
                        <div className="text-2xl font-bold text-purple-600">
                          {name.includes('Ratio')
                            ? (getMetricValue(name, 'versioning') * 100).toFixed(1)
                            : getMetricValue(name, 'versioning')
                          }{unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uso */}
              {activeTab === 'usage' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { name: 'pageViews', label: 'Visualizações de Página', unit: '' },
                      { name: 'uniqueUsers', label: 'Usuários Únicos', unit: '' },
                      { name: 'sessionDuration', label: 'Duração da Sessão', unit: 'min' },
                      { name: 'bounceRate', label: 'Taxa de Rejeição', unit: '%' },
                      { name: 'userRetention', label: 'Retenção de Usuários', unit: '%' },
                      { name: 'conversionRate', label: 'Taxa de Conversão', unit: '%' }
                    ].map(({ name, label, unit }) => (
                      <div key={name} className="bg-white border rounded-lg p-4 shadow-sm">
                        <h3 className="font-medium mb-2">{label}</h3>
                        <div className="text-2xl font-bold text-orange-600">
                          {name.includes('Rate') || name.includes('Retention')
                            ? (getMetricValue(name, 'usage') * 100).toFixed(1)
                            : getMetricValue(name, 'usage')
                          }{unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Alertas */}
              {activeTab === 'alerts' && (
                <div className="h-full overflow-y-auto p-6">
                  {alerts.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">Nenhum alerta ativo</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {alerts.map(alert => (
                        <div key={alert.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                                  {alert.severity.toUpperCase()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {new Date(alert.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                              <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Limite: {alert.threshold}</span>
                                <span>Atual: {alert.currentValue}</span>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Settings className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Última atualização: {lastRefresh.toLocaleString()}</span>
            <span>Total de métricas: {metrics.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
