
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Eye,
  MousePointer,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const AdvancedAnalytics = () => {
  const [funnels, setFunnels] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch funnels
      const { data: funnelsData, error: funnelsError } = await supabase
        .from('funnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (funnelsError) {
        console.error('Error fetching funnels:', funnelsError);
      } else {
        setFunnels(funnelsData || []);
      }

      // Mock analytics data since we don't have the analytics tables
      const mockAnalyticsData = [
        {
          id: 1,
          funnel_id: funnelsData?.[0]?.id || 'funnel-1',
          event_type: 'page_view',
          user_session: 'session-1',
          created_at: new Date().toISOString(),
          metadata: { page: 'landing' }
        },
        {
          id: 2,
          funnel_id: funnelsData?.[0]?.id || 'funnel-1',
          event_type: 'quiz_started',
          user_session: 'session-1',
          created_at: new Date().toISOString(),
          metadata: { step: 1 }
        },
        {
          id: 3,
          funnel_id: funnelsData?.[0]?.id || 'funnel-1',
          event_type: 'quiz_completed',
          user_session: 'session-1',
          created_at: new Date().toISOString(),
          metadata: { result: 'elegante' }
        }
      ];

      setAnalytics(mockAnalyticsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const calculateMetrics = () => {
    if (!analytics.length) return {};

    const totalViews = analytics.filter(a => a.event_type === 'page_view').length;
    const totalStarts = analytics.filter(a => a.event_type === 'quiz_started').length;
    const totalCompletions = analytics.filter(a => a.event_type === 'quiz_completed').length;
    
    const conversionRate = totalViews > 0 ? (totalCompletions / totalViews) * 100 : 0;
    const completionRate = totalStarts > 0 ? (totalCompletions / totalStarts) * 100 : 0;
    const abandonmentRate = totalStarts > 0 ? ((totalStarts - totalCompletions) / totalStarts) * 100 : 0;

    return {
      totalViews,
      totalStarts,
      totalCompletions,
      conversionRate,
      completionRate,
      abandonmentRate
    };
  };

  const metrics = calculateMetrics();

  // Mock data for charts
  const dailyMetrics = [
    { date: '2024-01-01', views: 120, starts: 80, completions: 45 },
    { date: '2024-01-02', views: 150, starts: 95, completions: 60 },
    { date: '2024-01-03', views: 180, starts: 110, completions: 75 },
    { date: '2024-01-04', views: 200, starts: 130, completions: 85 },
    { date: '2024-01-05', views: 175, starts: 120, completions: 78 },
    { date: '2024-01-06', views: 220, starts: 145, completions: 92 },
    { date: '2024-01-07', views: 195, starts: 125, completions: 80 }
  ];

  const conversionFunnelData = [
    { name: 'Visualizações', value: metrics.totalViews || 1000, color: '#8884d8' },
    { name: 'Inicializações', value: metrics.totalStarts || 800, color: '#82ca9d' },
    { name: 'Conclusões', value: metrics.totalCompletions || 600, color: '#ffc658' },
    { name: 'Conversões', value: Math.round((metrics.totalCompletions || 600) * 0.8), color: '#ff7300' }
  ];

  const trafficSourcesData = [
    { name: 'Orgânico', value: 45, color: '#8884d8' },
    { name: 'Redes Sociais', value: 30, color: '#82ca9d' },
    { name: 'Direto', value: 15, color: '#ffc658' },
    { name: 'Referência', value: 10, color: '#ff7300' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Avançado</h1>
          <p className="text-gray-600 mt-2">Monitore o desempenho dos seus funnels em tempo real</p>
        </div>
        <Button onClick={fetchAnalyticsData} disabled={loading}>
          {loading ? 'Atualizando...' : 'Atualizar Dados'}
        </Button>
      </div>

      {/* Funnel Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Funil</CardTitle>
          <CardDescription>Escolha um funil para análise detalhada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {funnels.map((funnel) => (
              <div
                key={funnel.id}
                onClick={() => setSelectedFunnel(funnel)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedFunnel?.id === funnel.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold text-gray-900">{funnel.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{funnel.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge variant={funnel.is_published ? "default" : "secondary"}>
                    {funnel.is_published ? 'Publicado' : 'Rascunho'}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    v{funnel.version}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Iniciados</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStarts || 0}</div>
            <p className="text-xs text-muted-foreground">
              +15.3% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Concluídos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalCompletions || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversionRate?.toFixed(1) || 0}%</div>
            <p className="text-xs text-muted-foreground">
              +2.4% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Visualize o fluxo de usuários através do funil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnelData.map((step, index) => (
              <div key={step.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{step.name}</span>
                  <span className="text-sm text-gray-600">{step.value.toLocaleString()}</span>
                </div>
                <Progress 
                  percent={index === 0 ? 100 : (step.value / conversionFunnelData[0].value) * 100}
                  className="h-2"
                />
                {index > 0 && (
                  <div className="text-xs text-gray-500">
                    {((step.value / conversionFunnelData[index - 1].value) * 100).toFixed(1)}% do passo anterior
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Desempenho Diário</CardTitle>
            <CardDescription>Visualizações, inicializações e conclusões por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" name="Visualizações" />
                <Line type="monotone" dataKey="starts" stroke="#82ca9d" name="Inicializações" />
                <Line type="monotone" dataKey="completions" stroke="#ffc658" name="Conclusões" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
            <CardDescription>Distribuição de visitantes por origem</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficSourcesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {trafficSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Indicadores de Performance</CardTitle>
          <CardDescription>Métricas importantes para otimização</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {metrics.completionRate?.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-600 mt-2">Taxa de Conclusão</div>
              <Progress 
                percent={metrics.completionRate || 0}
                className="mt-2"
              />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {metrics.abandonmentRate?.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-600 mt-2">Taxa de Abandono</div>
              <Progress 
                percent={metrics.abandonmentRate || 0}
                className="mt-2"
              />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">2:34</div>
              <div className="text-sm text-gray-600 mt-2">Tempo Médio</div>
              <Progress 
                percent={75}
                className="mt-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade em Tempo Real</CardTitle>
          <CardDescription>Eventos recentes dos usuários</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {event.event_type === 'page_view' ? 'Visualização de página' :
                     event.event_type === 'quiz_started' ? 'Quiz iniciado' :
                     event.event_type === 'quiz_completed' ? 'Quiz concluído' : event.event_type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(event.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnalytics;
