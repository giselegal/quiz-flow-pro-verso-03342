// Dashboard de Analytics Avançado
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  MousePointer, 
  Clock,
  Target,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { supabase } from '../../../lib/supabase';

// Tipos para analytics
export interface AnalyticsMetrics {
  totalViews: number;
  uniqueVisitors: number;
  conversions: number;
  conversionRate: number;
  averageTimeOnPage: number;
  bounceRate: number;
  completionRate: number;
  averageStepsCompleted: number;
}

export interface TimeSeriesData {
  date: string;
  views: number;
  visitors: number;
  conversions: number;
}

export interface DeviceBreakdown {
  device: 'mobile' | 'tablet' | 'desktop';
  count: number;
  percentage: number;
}

export interface PageAnalytics {
  pageId: string;
  pageName: string;
  views: number;
  averageTime: number;
  exitRate: number;
  bounceRate: number;
}

export interface ConversionFunnel {
  step: string;
  users: number;
  dropoffRate: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  campaign?: string;
  sessions: number;
  conversions: number;
  conversionRate: number;
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  funnelId?: string;
  deviceType?: 'all' | 'mobile' | 'tablet' | 'desktop';
  trafficSource?: string;
  country?: string;
}

// Hook para analytics
export const useAnalytics = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<DeviceBreakdown[]>([]);
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAnalytics = useCallback(async (filters: AnalyticsFilters) => {
    setLoading(true);
    try {
      // Carregar métricas principais
      const metricsPromise = loadMetrics(filters);
      
      // Carregar dados de série temporal
      const timeSeriesPromise = loadTimeSeriesData(filters);
      
      // Carregar breakdown por dispositivo
      const devicePromise = loadDeviceBreakdown(filters);
      
      // Carregar analytics por página
      const pagePromise = loadPageAnalytics(filters);
      
      // Carregar funil de conversão
      const funnelPromise = loadConversionFunnel(filters);
      
      // Carregar fontes de tráfego
      const trafficPromise = loadTrafficSources(filters);

      const [
        metricsData,
        timeSeriesResult,
        deviceResult,
        pageResult,
        funnelResult,
        trafficResult
      ] = await Promise.all([
        metricsPromise,
        timeSeriesPromise,
        devicePromise,
        pagePromise,
        funnelPromise,
        trafficPromise
      ]);

      setMetrics(metricsData);
      setTimeSeriesData(timeSeriesResult);
      setDeviceBreakdown(deviceResult);
      setPageAnalytics(pageResult);
      setConversionFunnel(funnelResult);
      setTrafficSources(trafficResult);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMetrics = async (filters: AnalyticsFilters): Promise<AnalyticsMetrics> => {
    // Query simulada - substituir por query real
    const { data: sessions } = await supabase
      .from('funnel_analytics')
      .select('*')
      .gte('created_at', filters.dateRange.start.toISOString())
      .lte('created_at', filters.dateRange.end.toISOString());

    const totalViews = sessions?.length || 0;
    const uniqueVisitors = new Set(sessions?.map(s => s.user_session)).size || 0;
    const conversions = sessions?.filter(s => s.event_type === 'conversion').length || 0;

    return {
      totalViews,
      uniqueVisitors,
      conversions,
      conversionRate: totalViews > 0 ? (conversions / totalViews) * 100 : 0,
      averageTimeOnPage: 180, // Simulado
      bounceRate: 35.5, // Simulado
      completionRate: 67.8, // Simulado
      averageStepsCompleted: 8.3 // Simulado
    };
  };

  const loadTimeSeriesData = async (filters: AnalyticsFilters): Promise<TimeSeriesData[]> => {
    // Dados simulados - substituir por query real
    const days = Math.ceil((filters.dateRange.end.getTime() - filters.dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const data: TimeSeriesData[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date(filters.dateRange.start);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 300) + 50,
        conversions: Math.floor(Math.random() * 50) + 10
      });
    }

    return data;
  };

  const loadDeviceBreakdown = async (filters: AnalyticsFilters): Promise<DeviceBreakdown[]> => {
    // Dados simulados
    const total = 1000;
    return [
      { device: 'mobile', count: 650, percentage: 65 },
      { device: 'desktop', count: 280, percentage: 28 },
      { device: 'tablet', count: 70, percentage: 7 }
    ];
  };

  const loadPageAnalytics = async (filters: AnalyticsFilters): Promise<PageAnalytics[]> => {
    // Dados simulados
    return [
      { pageId: '1', pageName: 'Introdução', views: 1500, averageTime: 45, exitRate: 15, bounceRate: 12 },
      { pageId: '2', pageName: 'Primeira Pergunta', views: 1275, averageTime: 65, exitRate: 18, bounceRate: 8 },
      { pageId: '3', pageName: 'Segunda Pergunta', views: 1045, averageTime: 52, exitRate: 22, bounceRate: 6 },
      { pageId: '4', pageName: 'Resultado', views: 815, averageTime: 120, exitRate: 35, bounceRate: 25 }
    ];
  };

  const loadConversionFunnel = async (filters: AnalyticsFilters): Promise<ConversionFunnel[]> => {
    // Dados simulados
    return [
      { step: 'Página Inicial', users: 1000, dropoffRate: 0 },
      { step: 'Primeira Pergunta', users: 850, dropoffRate: 15 },
      { step: 'Segunda Pergunta', users: 720, dropoffRate: 15.3 },
      { step: 'Terceira Pergunta', users: 615, dropoffRate: 14.6 },
      { step: 'Resultado', users: 520, dropoffRate: 15.4 },
      { step: 'Conversão', users: 185, dropoffRate: 64.4 }
    ];
  };

  const loadTrafficSources = async (filters: AnalyticsFilters): Promise<TrafficSource[]> => {
    // Dados simulados
    return [
      { source: 'google', medium: 'organic', sessions: 450, conversions: 85, conversionRate: 18.9 },
      { source: 'facebook', medium: 'social', sessions: 320, conversions: 45, conversionRate: 14.1 },
      { source: 'instagram', medium: 'social', sessions: 280, conversions: 38, conversionRate: 13.6 },
      { source: 'direct', medium: 'none', sessions: 150, conversions: 35, conversionRate: 23.3 },
      { source: 'google', medium: 'cpc', campaign: 'quiz-campaign', sessions: 200, conversions: 55, conversionRate: 27.5 }
    ];
  };

  const exportData = useCallback(async (format: 'csv' | 'json' = 'csv', filters: AnalyticsFilters) => {
    try {
      const data = {
        metrics,
        timeSeriesData,
        deviceBreakdown,
        pageAnalytics,
        conversionFunnel,
        trafficSources,
        filters,
        exportedAt: new Date().toISOString()
      };

      if (format === 'csv') {
        // Criar CSV das métricas principais
        const csvData = [
          ['Métrica', 'Valor'],
          ['Total de Visualizações', metrics?.totalViews || 0],
          ['Visitantes Únicos', metrics?.uniqueVisitors || 0],
          ['Conversões', metrics?.conversions || 0],
          ['Taxa de Conversão (%)', (metrics?.conversionRate || 0).toFixed(2)],
          ['Tempo Médio na Página (s)', metrics?.averageTimeOnPage || 0],
          ['Taxa de Rejeição (%)', (metrics?.bounceRate || 0).toFixed(2)],
          ['Taxa de Completude (%)', (metrics?.completionRate || 0).toFixed(2)]
        ];

        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }, [metrics, timeSeriesData, deviceBreakdown, pageAnalytics, conversionFunnel, trafficSources]);

  return {
    metrics,
    timeSeriesData,
    deviceBreakdown,
    pageAnalytics,
    conversionFunnel,
    trafficSources,
    loading,
    loadAnalytics,
    exportData
  };
};

// Componente de métrica individual
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  format?: 'number' | 'percentage' | 'duration';
}> = ({ title, value, change, icon: Icon, format = 'number' }) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'duration':
        return `${Math.floor(val / 60)}:${(val % 60).toString().padStart(2, '0')}`;
      default:
        return val.toLocaleString();
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente principal do dashboard
export const AnalyticsDashboard: React.FC<{
  funnelId?: string;
}> = ({ funnelId }) => {
  const {
    metrics,
    timeSeriesData,
    deviceBreakdown,
    pageAnalytics,
    conversionFunnel,
    trafficSources,
    loading,
    loadAnalytics,
    exportData
  } = useAnalytics();

  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
      end: new Date()
    },
    funnelId,
    deviceType: 'all'
  });

  useEffect(() => {
    loadAnalytics(filters);
  }, [filters, loadAnalytics]);

  const deviceColors = {
    mobile: '#3B82F6',
    desktop: '#10B981',
    tablet: '#F59E0B'
  };

  const deviceIcons = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Analytics</h1>
          <p className="text-gray-600">Acompanhe o performance dos seus funis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportData('csv', filters)}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          <Button variant="outline" onClick={() => loadAnalytics(filters)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Data Início</label>
              <Input
                type="date"
                value={filters.dateRange.start.toISOString().split('T')[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: {
                    ...prev.dateRange,
                    start: new Date(e.target.value)
                  }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Data Fim</label>
              <Input
                type="date"
                value={filters.dateRange.end.toISOString().split('T')[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: {
                    ...prev.dateRange,
                    end: new Date(e.target.value)
                  }
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Dispositivo</label>
              <Select
                value={filters.deviceType}
                onValueChange={(value: any) => setFilters(prev => ({ ...prev, deviceType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os dispositivos</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={() => loadAnalytics(filters)} className="w-full">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      )}

      {!loading && metrics && (
        <>
          {/* Métricas Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total de Visualizações"
              value={metrics.totalViews}
              icon={Eye}
              change={12.5}
            />
            <MetricCard
              title="Visitantes Únicos"
              value={metrics.uniqueVisitors}
              icon={Users}
              change={8.3}
            />
            <MetricCard
              title="Taxa de Conversão"
              value={metrics.conversionRate}
              icon={Target}
              format="percentage"
              change={-2.1}
            />
            <MetricCard
              title="Tempo Médio"
              value={metrics.averageTimeOnPage}
              icon={Clock}
              format="duration"
              change={15.7}
            />
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="funnel">Funil de Conversão</TabsTrigger>
              <TabsTrigger value="pages">Páginas</TabsTrigger>
              <TabsTrigger value="traffic">Tráfego</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Gráfico de Linha Temporal */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance ao Longo do Tempo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="views" stroke="#3B82F6" name="Visualizações" />
                      <Line type="monotone" dataKey="visitors" stroke="#10B981" name="Visitantes" />
                      <Line type="monotone" dataKey="conversions" stroke="#F59E0B" name="Conversões" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Breakdown por Dispositivo */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Dispositivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={deviceBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {deviceBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={deviceColors[entry.device]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes por Dispositivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deviceBreakdown.map((device) => {
                        const Icon = deviceIcons[device.device];
                        return (
                          <div key={device.device} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5" style={{ color: deviceColors[device.device] }} />
                              <span className="font-medium capitalize">{device.device}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">{device.count.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">{device.percentage}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="funnel" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnel.map((step, index) => {
                      const conversionRate = index === 0 ? 100 : ((step.users / conversionFunnel[0].users) * 100);
                      return (
                        <div key={step.step} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{step.step}</span>
                            <div className="text-right">
                              <div className="font-bold">{step.users.toLocaleString()} usuários</div>
                              <div className="text-sm text-gray-600">{conversionRate.toFixed(1)}%</div>
                            </div>
                          </div>
                          <Progress value={conversionRate} className="h-2" />
                          {index > 0 && (
                            <div className="text-sm text-red-600">
                              {step.dropoffRate.toFixed(1)}% de abandono
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Página</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Página</th>
                          <th className="text-right py-2">Visualizações</th>
                          <th className="text-right py-2">Tempo Médio</th>
                          <th className="text-right py-2">Taxa de Saída</th>
                          <th className="text-right py-2">Taxa de Rejeição</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pageAnalytics.map((page) => (
                          <tr key={page.pageId} className="border-b">
                            <td className="py-3 font-medium">{page.pageName}</td>
                            <td className="py-3 text-right">{page.views.toLocaleString()}</td>
                            <td className="py-3 text-right">{page.averageTime}s</td>
                            <td className="py-3 text-right">
                              <Badge variant={page.exitRate > 30 ? "destructive" : page.exitRate > 20 ? "outline" : "secondary"}>
                                {page.exitRate}%
                              </Badge>
                            </td>
                            <td className="py-3 text-right">
                              <Badge variant={page.bounceRate > 20 ? "destructive" : page.bounceRate > 10 ? "outline" : "secondary"}>
                                {page.bounceRate}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fontes de Tráfego</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Fonte / Meio</th>
                          <th className="text-right py-2">Sessões</th>
                          <th className="text-right py-2">Conversões</th>
                          <th className="text-right py-2">Taxa de Conversão</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trafficSources.map((source, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3">
                              <div>
                                <div className="font-medium">
                                  {source.source} / {source.medium}
                                </div>
                                {source.campaign && (
                                  <div className="text-sm text-gray-600">
                                    Campanha: {source.campaign}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 text-right">{source.sessions.toLocaleString()}</td>
                            <td className="py-3 text-right">{source.conversions.toLocaleString()}</td>
                            <td className="py-3 text-right">
                              <Badge variant={source.conversionRate > 20 ? "secondary" : source.conversionRate > 15 ? "outline" : "destructive"}>
                                {source.conversionRate.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default useAnalytics;
