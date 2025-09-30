// @ts-nocheck
/**
 * 📊 PÁGINA DE ANALYTICS AVANÇADO - FASE 2  
 * Dashboard de métricas profundas com AI insights
 */

import React, { useState, useEffect } from 'react';
import { enhancedUnifiedDataServiceAdapter as EnhancedUnifiedDataService } from '@/analytics/compat/enhancedUnifiedDataServiceAdapter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Clock,
  Zap,
  Eye,
  MousePointer,
  Heart,
  Layers,
  Activity,
  PieChart,
  LineChart,
  DollarSign,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

// Mock hook para compatibilidade
const useQuizRealTimeAnalytics = () => ({
  analytics: {},
  isTracking: true,
  startTracking: () => { },
  stopTracking: () => { },
  getSessionAnalytics: () => ({})
});

export const AdvancedAnalyticsPage: React.FC = () => {
  // Real data integration 
  const [isLoading, setIsLoading] = useState(true);
  const [advancedMetrics, setAdvancedMetrics] = useState<any>(null);
  const [selectedFunnel, setSelectedFunnel] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('7d');

  const {
    analytics = {},
    isTracking,
    startTracking,
    stopTracking,
    getSessionAnalytics = () => ({})
  } = useQuizRealTimeAnalytics();

  useEffect(() => {
    loadAdvancedAnalytics();
  }, [selectedFunnel, timeRange]);

  const loadAdvancedAnalytics = async () => {
    try {
      setIsLoading(true);
      const metrics = await EnhancedUnifiedDataService.getAdvancedAnalytics({
        funnel: selectedFunnel,
        timeRange: timeRange
      });
      setAdvancedMetrics(metrics);
      console.log('✅ Advanced Analytics carregado:', metrics);
    } catch (error) {
      console.error('❌ Erro ao carregar analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data para demonstração
  const conversionData = [
    { step: 'Step 1', visitors: 1000, conversions: 850 },
    { step: 'Step 2', visitors: 850, conversions: 720 },
    { step: 'Step 3', visitors: 720, conversions: 580 },
    { step: 'Step 4', visitors: 580, conversions: 450 },
    { step: 'Result', visitors: 450, conversions: 380 }
  ];

  const demographicData = [
    { name: '18-25', value: 25, color: '#8884d8' },
    { name: '26-35', value: 35, color: '#82ca9d' },
    { name: '36-45', value: 25, color: '#ffc658' },
    { name: '46+', value: 15, color: '#ff7c7c' }
  ];

  const timeSeriesData = [
    { date: '2024-01', conversions: 120, leads: 150 },
    { date: '2024-02', conversions: 180, leads: 220 },
    { date: '2024-03', conversions: 250, leads: 290 },
    { date: '2024-04', conversions: 200, leads: 240 },
    { date: '2024-05', conversions: 300, leads: 350 },
    { date: '2024-06', conversions: 280, leads: 320 }
  ];

  return (
    <div className="space-y-6">
      {/* Filtros e Controles */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics Avançado</h1>
        <div className="flex items-center space-x-4">
          <Select value={selectedFunnel} onValueChange={setSelectedFunnel}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Funil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Funis</SelectItem>
              <SelectItem value="quiz-style">Quiz de Estilo</SelectItem>
              <SelectItem value="lead-magnet">Lead Magnet</SelectItem>
              <SelectItem value="webinar">Webinar</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={loadAdvancedAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">12.5%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3m 24s</div>
            <p className="text-xs text-muted-foreground">
              -15s vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ 18.2K</div>
            <p className="text-xs text-muted-foreground">
              +8% vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="funnel">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="behavior">Comportamento</TabsTrigger>
          <TabsTrigger value="demographics">Demografia</TabsTrigger>
          <TabsTrigger value="realtime">Tempo Real</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Gráfico de Tendências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="w-5 h-5" />
                <span>Tendências de Conversão</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="conversions" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="leads" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          {/* Análise do Funil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Análise do Funil de Conversão</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#8884d8" />
                  <Bar dataKey="conversions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4">
          {/* Análise de Comportamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MousePointer className="w-5 h-5" />
                  <span>Pontos de Abandono</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div>
                      <div className="font-medium text-red-900">Pergunta 3</div>
                      <div className="text-sm text-red-700">Taxa de abandono alta</div>
                    </div>
                    <Badge className="bg-red-500 hover:bg-red-600">32%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-900">Página de Resultados</div>
                      <div className="text-sm text-yellow-700">Tempo de permanência baixo</div>
                    </div>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">18%</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <div className="font-medium text-green-900">Pergunta 1</div>
                      <div className="text-sm text-green-700">Excelente engajamento</div>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">95%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Tempo por Etapa</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pergunta 1</span>
                    <span className="font-medium">45s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pergunta 2</span>
                    <span className="font-medium">38s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pergunta 3</span>
                    <span className="font-medium text-red-600">2m 15s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pergunta 4</span>
                    <span className="font-medium">52s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Resultados</span>
                    <span className="font-medium">1m 30s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          {/* Demografia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Distribuição por Idade</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights Demográficos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Público Principal</div>
                      <div className="text-sm text-blue-700">
                        26-35 anos representa 35% dos usuários com maior taxa de conversão
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Oportunidade</div>
                      <div className="text-sm text-green-700">
                        Segmento 18-25 tem baixa conversão mas alto engajamento
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          {/* Tempo Real */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Usuários Online</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">47</div>
                <p className="text-sm text-muted-foreground">
                  Usuários ativos agora
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Visualizações</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">128</div>
                <p className="text-sm text-muted-foreground">
                  Nas últimas 24h
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Conversões Hoje</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">23</div>
                <p className="text-sm text-muted-foreground">
                  Taxa: 18.2%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalyticsPage;