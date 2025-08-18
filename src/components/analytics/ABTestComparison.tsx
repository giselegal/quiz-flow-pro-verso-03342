// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MetricCard } from '@/components/analytics/MetricCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MousePointer,
  ShoppingCart,
  Eye,
  Target,
  Activity,
  Clock,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Zap,
  Award,
} from 'lucide-react';
import { LANDING_PAGE_AB_TEST } from '@/utils/abtest';
import { FUNNEL_CONFIGS } from '@/services/pixelManager';
import { toast } from '@/components/ui/use-toast';
import { getAnalyticsEvents } from '@/utils/analytics';
import ABTestAlerts from './ABTestAlerts';

interface ABTestMetrics {
  variant: 'A' | 'B';
  route: string;
  description: string;
  pixelId: string;
  visitors: number;
  conversionRate: number;
  quizStarts: number;
  quizCompletions: number;
  leads: number;
  sales: number;
  averageSessionTime: number;
  bounceRate: number;
  revenue: number;
}

interface ABTestComparisonProps {
  timeRange?: '24h' | '7d' | '30d' | 'all';
}

const ABTestComparison: React.FC<ABTestComparisonProps> = ({ timeRange = '7d' }) => {
  const [metrics, setMetrics] = useState<{
    A: ABTestMetrics;
    B: ABTestMetrics;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'conversion' | 'engagement' | 'revenue'>(
    'conversion'
  );
  const [confidenceLevel, setConfidenceLevel] = useState<number>(0);
  const [winner, setWinner] = useState<'A' | 'B' | 'tie' | null>(null);
  const [significance, setSignificance] = useState<boolean>(false);

  useEffect(() => {
    loadABTestData();
  }, [timeRange]);

  const loadABTestData = async () => {
    setLoading(true);
    try {
      const events = getAnalyticsEvents();
      const now = new Date();

      // Filtrar eventos pelo período
      const filteredEvents = events.filter(event => {
        const eventDate = new Date(event.timestamp);
        const diffDays = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 3600 * 24));

        switch (timeRange) {
          case '24h':
            return diffDays === 0;
          case '7d':
            return diffDays <= 7;
          case '30d':
            return diffDays <= 30;
          default:
            return true;
        }
      });

      // Calcular métricas para cada variante
      const variantAMetrics = calculateVariantMetrics('A', filteredEvents);
      const variantBMetrics = calculateVariantMetrics('B', filteredEvents);

      setMetrics({ A: variantAMetrics, B: variantBMetrics });

      // Calcular significância estatística
      const { confidence, isSignificant, winningVariant } = calculateStatisticalSignificance(
        variantAMetrics,
        variantBMetrics
      );

      setConfidenceLevel(confidence);
      setSignificance(isSignificant);
      setWinner(winningVariant);
    } catch (error) {
      console.error('Erro ao carregar dados do teste A/B:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados do teste A/B',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateVariantMetrics = (variant: 'A' | 'B', events: any[]): ABTestMetrics => {
    const route =
      variant === 'A' ? LANDING_PAGE_AB_TEST.variantA.route : LANDING_PAGE_AB_TEST.variantB.route;
    const description =
      variant === 'A'
        ? LANDING_PAGE_AB_TEST.variantA.description
        : LANDING_PAGE_AB_TEST.variantB.description;
    const pixelId =
      variant === 'A'
        ? FUNNEL_CONFIGS.default.pixelId
        : FUNNEL_CONFIGS['quiz-descubra-seu-estilo'].pixelId;

    // Filtrar eventos por variante (usando pixel ID ou rota)
    const variantEvents = events.filter(event => {
      if (event.customData?.pixel_id) {
        return event.customData.pixel_id === pixelId;
      }
      if (event.customData?.page) {
        return event.customData.page.includes(route);
      }
      return event.eventName.includes(`variant_${variant}`);
    });

    const pageViews = variantEvents.filter(e => e.eventName === 'PageView').length;
    const quizStarts = variantEvents.filter(e => e.eventName === 'QuizStart').length;
    const quizCompletions = variantEvents.filter(e => e.eventName === 'QuizComplete').length;
    const leads = variantEvents.filter(e => e.eventName === 'Lead').length;
    const sales = variantEvents.filter(e => e.eventName === 'Purchase').length;

    // Calcular sessões únicas baseado em session_id
    const uniqueSessions = new Set(variantEvents.map(e => e.customData?.session_id).filter(Boolean))
      .size;
    const visitors = Math.max(uniqueSessions, pageViews);

    // Calcular taxa de conversão (leads/visitantes)
    const conversionRate = visitors > 0 ? (leads / visitors) * 100 : 0;

    // Calcular taxa de bounce (simplificado)
    const bounceRate = visitors > 0 ? Math.max(0, ((visitors - quizStarts) / visitors) * 100) : 0;

    // Simular receita baseada em vendas (R$ 39,90 por venda)
    const revenue = sales * 39.9;

    return {
      variant,
      route,
      description,
      pixelId,
      visitors,
      conversionRate,
      quizStarts,
      quizCompletions,
      leads,
      sales,
      averageSessionTime: 0, // Placeholder - seria calculado com dados reais de sessão
      bounceRate,
      revenue,
    };
  };

  const calculateStatisticalSignificance = (
    variantA: ABTestMetrics,
    variantB: ABTestMetrics
  ): {
    confidence: number;
    isSignificant: boolean;
    winningVariant: 'A' | 'B' | 'tie';
  } => {
    // Cálculo simplificado de significância estatística
    const totalA = variantA.visitors;
    const totalB = variantB.visitors;
    const conversionsA = variantA.leads;
    const conversionsB = variantB.leads;

    if (totalA < 30 || totalB < 30) {
      return { confidence: 0, isSignificant: false, winningVariant: 'tie' };
    }

    const rateA = conversionsA / totalA;
    const rateB = conversionsB / totalB;

    // Z-test simplificado
    const pooledRate = (conversionsA + conversionsB) / (totalA + totalB);
    const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / totalA + 1 / totalB));
    const zScore = Math.abs(rateA - rateB) / standardError;

    // Converter Z-score para nível de confiança (aproximado)
    let confidence = 0;
    if (zScore > 1.96) confidence = 95;
    else if (zScore > 1.65) confidence = 90;
    else if (zScore > 1.28) confidence = 80;
    else confidence = Math.min(zScore * 40, 75);

    const isSignificant = confidence >= 95;
    const winningVariant = rateA > rateB ? 'A' : rateB > rateA ? 'B' : 'tie';

    return { confidence, isSignificant, winningVariant };
  };

  const getComparisonIcon = (variantA: number, variantB: number) => {
    if (variantA > variantB) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (variantB > variantA) {
      return <TrendingDown style={{ color: '#432818' }} />;
    }
    return <div className="h-4 w-4" />;
  };

  const getMetricComparison = (
    metricA: number,
    metricB: number,
    format: 'percentage' | 'number' | 'currency' = 'number'
  ) => {
    const diff = ((metricB - metricA) / metricA) * 100;
    const isPositive = diff > 0;

    let formattedA, formattedB;
    switch (format) {
      case 'percentage':
        formattedA = `${metricA.toFixed(1)}%`;
        formattedB = `${metricB.toFixed(1)}%`;
        break;
      case 'currency':
        formattedA = `R$ ${metricA.toFixed(2)}`;
        formattedB = `R$ ${metricB.toFixed(2)}`;
        break;
      default:
        formattedA = metricA.toString();
        formattedB = metricB.toString();
    }

    return {
      valueA: formattedA,
      valueB: formattedB,
      difference: `${isPositive ? '+' : ''}${diff.toFixed(1)}%`,
      isPositive,
      icon: getComparisonIcon(metricA, metricB),
    };
  };

  const renderTrendsCharts = () => {
    if (!metrics) return null;

    // Criar dados simulados de tendência baseados nos eventos
    const events = getAnalyticsEvents();
    const now = Date.now();
    const oneDay = 86400000;

    // Agrupar eventos por dia
    const dailyData = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = now - oneDay * i;
      const dayEnd = dayStart + oneDay;
      const dayName = new Date(dayStart).toLocaleDateString('pt-BR', {
        month: 'short',
        day: 'numeric',
      });

      // Eventos da versão A
      const eventsA = events.filter(
        e =>
          e.timestamp >= dayStart &&
          e.timestamp < dayEnd &&
          e.customData?.pixel_id === '1311550759901086'
      );

      // Eventos da versão B
      const eventsB = events.filter(
        e =>
          e.timestamp >= dayStart &&
          e.timestamp < dayEnd &&
          e.customData?.pixel_id === '1038647624890676'
      );

      const visitorsA = new Set(
        eventsA.filter(e => e.eventName === 'PageView').map(e => e.customData?.session_id)
      ).size;
      const visitorsB = new Set(
        eventsB.filter(e => e.eventName === 'PageView').map(e => e.customData?.session_id)
      ).size;
      const leadsA = eventsA.filter(e => e.eventName === 'Lead').length;
      const leadsB = eventsB.filter(e => e.eventName === 'Lead').length;
      const conversionA = visitorsA > 0 ? (leadsA / visitorsA) * 100 : 0;
      const conversionB = visitorsB > 0 ? (leadsB / visitorsB) * 100 : 0;

      dailyData.push({
        day: dayName,
        'Visitantes A': visitorsA,
        'Visitantes B': visitorsB,
        'Conversão A': conversionA,
        'Conversão B': conversionB,
        'Leads A': leadsA,
        'Leads B': leadsB,
      });
    }

    return (
      <div className="space-y-6">
        {/* Gráfico de Visitantes por Dia */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Visitantes por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="Visitantes A"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Visitantes B"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Taxa de Conversão por Dia */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Taxa de Conversão por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={value => [`${Number(value).toFixed(1)}%`, '']} />
              <Line
                type="monotone"
                dataKey="Conversão A"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Conversão B"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Leads por Dia */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Leads Gerados por Dia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Leads A" fill="#3b82f6" name="Versão A" />
              <Bar dataKey="Leads B" fill="#10b981" name="Versão B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resumo de Tendências */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Tendências</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#B89B7A]">
                  {dailyData.reduce((sum, day) => sum + day['Visitantes A'], 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Visitantes A</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dailyData.reduce((sum, day) => sum + day['Visitantes B'], 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Visitantes B</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#B89B7A]">
                  {(
                    dailyData.reduce((sum, day) => sum + day['Conversão B'], 0) / 7 -
                    dailyData.reduce((sum, day) => sum + day['Conversão A'], 0) / 7
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-muted-foreground">Diferença Média</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const exportData = () => {
    if (!metrics) return;

    const data = {
      testName: LANDING_PAGE_AB_TEST.testName,
      timeRange,
      generatedAt: new Date().toISOString(),
      variantA: metrics.A,
      variantB: metrics.B,
      statisticalAnalysis: {
        confidenceLevel,
        isSignificant: significance,
        winner,
      },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-report-${timeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Relatório Exportado',
      description: 'Os dados do teste A/B foram exportados com sucesso',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando dados do teste A/B...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500" />
            <h3 className="mt-4 text-lg font-semibold">Dados Insuficientes</h3>
            <p className="text-muted-foreground">
              Não há dados suficientes para gerar o relatório do teste A/B
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'Visitantes',
      'Versão A': metrics.A.visitors,
      'Versão B': metrics.B.visitors,
    },
    {
      name: 'Quiz Iniciados',
      'Versão A': metrics.A.quizStarts,
      'Versão B': metrics.B.quizStarts,
    },
    {
      name: 'Quiz Completos',
      'Versão A': metrics.A.quizCompletions,
      'Versão B': metrics.B.quizCompletions,
    },
    {
      name: 'Leads',
      'Versão A': metrics.A.leads,
      'Versão B': metrics.B.leads,
    },
    {
      name: 'Vendas',
      'Versão A': metrics.A.sales,
      'Versão B': metrics.B.sales,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header com status do teste */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Teste A/B: Landing Pages
              </CardTitle>
              <CardDescription>
                Comparação entre {LANDING_PAGE_AB_TEST.variantA.description} vs{' '}
                {LANDING_PAGE_AB_TEST.variantB.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={significance ? 'default' : 'secondary'}>
                {significance ? 'Estatisticamente Significativo' : 'Dados Insuficientes'}
              </Badge>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm" onClick={loadABTestData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{confidenceLevel.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Nível de Confiança</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {winner === 'tie' ? '🤝' : winner === 'A' ? '🅰️' : '🅱️'}
              </div>
              <div className="text-sm text-muted-foreground">
                {winner === 'tie' ? 'Empate' : `Versão ${winner} Vencendo`}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {(metrics.A.visitors + metrics.B.visitors).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total de Visitantes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Taxa de Conversão */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Conversão</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{metrics.A.conversionRate.toFixed(1)}%</div>
                  <Badge variant="outline" className="text-xs">
                    A
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-2xl font-bold">{metrics.B.conversionRate.toFixed(1)}%</div>
                  <Badge variant="outline" className="text-xs">
                    B
                  </Badge>
                </div>
              </div>
              <Target className="h-8 w-8 text-[#B89B7A]" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {
                getMetricComparison(
                  metrics.A.conversionRate,
                  metrics.B.conversionRate,
                  'percentage'
                ).difference
              }{' '}
              vs Versão A
            </div>
          </CardContent>
        </Card>

        {/* Visitantes */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Visitantes</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{metrics.A.visitors}</div>
                  <Badge variant="outline" className="text-xs">
                    A
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-2xl font-bold">{metrics.B.visitors}</div>
                  <Badge variant="outline" className="text-xs">
                    B
                  </Badge>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {getMetricComparison(metrics.A.visitors, metrics.B.visitors).difference} vs Versão A
            </div>
          </CardContent>
        </Card>

        {/* Leads Gerados */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{metrics.A.leads}</div>
                  <Badge variant="outline" className="text-xs">
                    A
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-2xl font-bold">{metrics.B.leads}</div>
                  <Badge variant="outline" className="text-xs">
                    B
                  </Badge>
                </div>
              </div>
              <MousePointer className="h-8 w-8 text-[#B89B7A]" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {getMetricComparison(metrics.A.leads, metrics.B.leads).difference} vs Versão A
            </div>
          </CardContent>
        </Card>

        {/* Receita */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita</p>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">R$ {metrics.A.revenue.toFixed(0)}</div>
                  <Badge variant="outline" className="text-xs">
                    A
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-2xl font-bold">R$ {metrics.B.revenue.toFixed(0)}</div>
                  <Badge variant="outline" className="text-xs">
                    B
                  </Badge>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-[#B89B7A]" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {getMetricComparison(metrics.A.revenue, metrics.B.revenue, 'currency').difference} vs
              Versão A
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Análises Detalhadas */}
      <Tabs defaultValue="funnel" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="funnel">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="comparison">Comparação Detalhada</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Comparação step-by-step entre as duas versões</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Versão A" fill="#8884d8" />
                  <Bar dataKey="Versão B" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Versão A */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Versão A</Badge>
                  {LANDING_PAGE_AB_TEST.variantA.description}
                </CardTitle>
                <CardDescription>Rota: {LANDING_PAGE_AB_TEST.variantA.route}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Visitantes</span>
                    <span className="font-semibold">{metrics.A.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quiz Iniciados</span>
                    <span className="font-semibold">{metrics.A.quizStarts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quiz Completos</span>
                    <span className="font-semibold">{metrics.A.quizCompletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Leads</span>
                    <span className="font-semibold">{metrics.A.leads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Vendas</span>
                    <span className="font-semibold">{metrics.A.sales}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm font-medium">Taxa de Conversão</span>
                    <span className="font-bold text-lg">
                      {metrics.A.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Versão B */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Versão B</Badge>
                  {LANDING_PAGE_AB_TEST.variantB.description}
                </CardTitle>
                <CardDescription>Rota: {LANDING_PAGE_AB_TEST.variantB.route}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Visitantes</span>
                    <span className="font-semibold">{metrics.B.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quiz Iniciados</span>
                    <span className="font-semibold">{metrics.B.quizStarts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quiz Completos</span>
                    <span className="font-semibold">{metrics.B.quizCompletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Leads</span>
                    <span className="font-semibold">{metrics.B.leads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Vendas</span>
                    <span className="font-semibold">{metrics.B.sales}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-sm font-medium">Taxa de Conversão</span>
                    <span className="font-bold text-lg">
                      {metrics.B.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
              <CardDescription>Performance ao longo do tempo</CardDescription>
            </CardHeader>
            <CardContent>{renderTrendsCharts()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Insights e Recomendações</CardTitle>
              <CardDescription>Análise automatizada dos resultados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Insight sobre significância */}
              <div className="border-l-4 border-[#B89B7A] pl-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Significância Estatística
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {significance
                    ? `✅ O teste atingiu significância estatística com ${confidenceLevel.toFixed(1)}% de confiança`
                    : `⚠️ O teste ainda não atingiu significância estatística (${confidenceLevel.toFixed(1)}% de confiança)`}
                </p>
              </div>

              {/* Insight sobre performance */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance de Conversão
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {metrics.A.conversionRate > metrics.B.conversionRate
                    ? `A Versão A está convertendo ${(((metrics.A.conversionRate - metrics.B.conversionRate) / metrics.B.conversionRate) * 100).toFixed(1)}% melhor que a Versão B`
                    : `A Versão B está convertendo ${(((metrics.B.conversionRate - metrics.A.conversionRate) / metrics.A.conversionRate) * 100).toFixed(1)}% melhor que a Versão A`}
                </p>
              </div>

              {/* Insight sobre tamanho da amostra */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Tamanho da Amostra
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {metrics.A.visitors + metrics.B.visitors < 100
                    ? '⚠️ Amostra pequena - recomenda-se aguardar mais dados para conclusões definitivas'
                    : '✅ Amostra adequada para análise estatística'}
                </p>
              </div>

              {/* Recomendação */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Recomendação
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {significance
                    ? `📊 Implementar a ${winner === 'A' ? 'Versão A' : 'Versão B'} como padrão com base nos resultados significativos`
                    : '⏳ Continuar o teste por mais tempo para obter resultados conclusivos'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <ABTestAlerts
            metrics={metrics}
            significance={significance}
            confidenceLevel={confidenceLevel}
            winner={winner}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ABTestComparison;
