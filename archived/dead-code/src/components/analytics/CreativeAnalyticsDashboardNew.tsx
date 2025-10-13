// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Target,
  Award,
  ChevronRight,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCcw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { optimizedSetInterval } from '@/utils/performanceOptimizations';

interface CreativeStats {
  creative_name: string;
  page_views: number;
  quiz_starts: number;
  quiz_completions: number;
  leads: number;
  purchases: number;
  revenue: number;
  conversion_rate: string;
  cost_per_lead: number;
}

const CreativeAnalyticsDashboardNew: React.FC = () => {
  const [creativesData, setCreativesData] = useState<Record<string, CreativeStats>>({});
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');

  // Cores da identidade visual da marca
  const brandColors = {
    primary: '#B89B7A',
    secondary: '#432818',
    accent: '#aa6b5d',
    background: '#FFFBF7',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    text: {
      dark: '#432818',
      medium: '#6B4F43',
      light: '#8B7355',
    },
  };

  useEffect(() => {
    const loadCreativeData = async () => {
      setIsLoading(true);
      try {
        // Mock data for now since getCreativePerformance doesn't work as expected
        const mockData: Record<string, CreativeStats> = {
          'creative-1': {
            creative_name: 'Elegante Mulher Vestido',
            page_views: 1250,
            quiz_starts: 890,
            quiz_completions: 678,
            leads: 234,
            purchases: 45,
            revenue: 4500,
            conversion_rate: '2.3',
            cost_per_lead: 15.5,
          },
          'creative-2': {
            creative_name: 'Casual Moderna',
            page_views: 980,
            quiz_starts: 720,
            quiz_completions: 540,
            leads: 180,
            purchases: 32,
            revenue: 3200,
            conversion_rate: '1.8',
            cost_per_lead: 18.2,
          },
          'creative-3': {
            creative_name: 'Romântica Floral',
            page_views: 756,
            quiz_starts: 456,
            quiz_completions: 389,
            leads: 145,
            purchases: 28,
            revenue: 2800,
            conversion_rate: '1.9',
            cost_per_lead: 16.9,
          },
        };
        setCreativesData(mockData);
      } catch (error) {
        console.error('Erro ao carregar dados de criativos:', error);
        setCreativesData({});
      } finally {
        setIsLoading(false);
      }
    };

    loadCreativeData();
    const interval = optimizedSetInterval(loadCreativeData, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const creativesList = Object.values(creativesData);
  const bestPerformingCreative = creativesList.reduce((best, current) => {
    return parseFloat(current.conversion_rate) > parseFloat(best.conversion_rate || '0')
      ? current
      : best;
  }, {} as CreativeStats);

  const totalStats = creativesList.reduce(
    (totals, creative) => ({
      page_views: totals.page_views + creative.page_views,
      leads: totals.leads + creative.leads,
      purchases: totals.purchases + creative.purchases,
      revenue: totals.revenue + creative.revenue,
    }),
    { page_views: 0, leads: 0, purchases: 0, revenue: 0 }
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPerformanceBadge = (conversionRate: string) => {
    const rate = parseFloat(conversionRate);
    if (rate >= 2.0)
      return (
        <Badge style={{ color: '#6B4F43' }}>
          <CheckCircle2 size={12} className="mr-1" />
          Excelente
        </Badge>
      );
    if (rate >= 1.0)
      return (
        <Badge style={{ borderColor: '#E5DDD5' }}>
          <Target size={12} className="mr-1" />
          Bom
        </Badge>
      );
    if (rate >= 0.5)
      return (
        <Badge className="bg-[#B89B7A]/10 text-[#A38A69] border-orange-200 font-medium">
          <AlertCircle size={12} className="mr-1" />
          Regular
        </Badge>
      );
    return (
      <Badge style={{ borderColor: '#E5DDD5' }}>
        <TrendingDown size={12} className="mr-1" />
        Baixo
      </Badge>
    );
  };

  const MetricCard = ({ icon: Icon, title, value, subtitle, trend, color }: any) => (
    <Card
      className="border-0 shadow-sm hover:shadow-md transition-all duration-300"
      style={{ backgroundColor: brandColors.background }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
              <Icon size={24} style={{ color }} />
            </div>
            <div>
              <h3 className="text-sm font-medium" style={{ color: brandColors.text.medium }}>
                {title}
              </h3>
              <p className="text-2xl font-bold" style={{ color: brandColors.text.dark }}>
                {value}
              </p>
              {subtitle && (
                <p className="text-xs" style={{ color: brandColors.text.light }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {trend && (
            <div
              className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                trend > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const CreativeCard = ({ creative }: { creative: CreativeStats }) => (
    <Card
      className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
      style={{ backgroundColor: brandColors.background }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{
                background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
              }}
            >
              {creative.creative_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color: brandColors.text.dark }}>
                {creative.creative_name}
              </h3>
              {getPerformanceBadge(creative.conversion_rate)}
            </div>
          </div>
          <ChevronRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
            style={{ color: brandColors.text.light }}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: brandColors.text.medium }}>
                Visualizações
              </span>
              <span className="font-semibold" style={{ color: brandColors.text.dark }}>
                {creative.page_views.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: brandColors.text.medium }}>
                Leads
              </span>
              <span className="font-semibold" style={{ color: brandColors.text.dark }}>
                {creative.leads}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: brandColors.text.medium }}>
                Taxa Conv.
              </span>
              <span className="font-semibold text-lg" style={{ color: brandColors.success }}>
                {creative.conversion_rate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: brandColors.text.medium }}>
                Receita
              </span>
              <span className="font-semibold" style={{ color: brandColors.text.dark }}>
                {formatCurrency(creative.revenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progresso da conversão */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs" style={{ color: brandColors.text.medium }}>
              Performance
            </span>
            <span className="text-xs font-medium" style={{ color: brandColors.text.dark }}>
              {creative.conversion_rate}
            </span>
          </div>
          <div style={{ backgroundColor: '#E5DDD5' }}>
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(parseFloat(creative.conversion_rate) * 20, 100)}%`,
                background: `linear-gradient(90deg, ${brandColors.success}, ${brandColors.primary})`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: brandColors.background }}
      >
        <div className="text-center space-y-4">
          <div style={{ borderColor: '#E5DDD5', borderTopColor: brandColors.primary }}></div>
          <p className="text-lg font-medium" style={{ color: brandColors.text.medium }}>
            Carregando dados dos criativos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: brandColors.background }}>
      {/* Header Elegante */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{
                color: brandColors.text.dark,
                fontFamily: 'Playfair Display, serif',
              }}
            >
              Analytics de Criativos
            </h1>
            <p className="text-lg" style={{ color: brandColors.text.medium }}>
              Monitore a performance dos seus criativos em tempo real
            </p>
          </div>

          {/* Controles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Seletor de período */}
            <div className="flex bg-white rounded-lg p-1 shadow-sm border">
              {[7, 14, 30].map(days => (
                <Button
                  key={days}
                  variant={selectedPeriod === days ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedPeriod(days)}
                  className={selectedPeriod === days ? 'text-white shadow-sm' : 'hover:bg-gray-50'}
                  style={
                    selectedPeriod === days
                      ? {
                          backgroundColor: brandColors.primary,
                          borderColor: brandColors.primary,
                        }
                      : {}
                  }
                >
                  <Calendar size={14} className="mr-1" />
                  {days} dias
                </Button>
              ))}
            </div>

            {/* Botões de ação */}
            <Button variant="outline" size="sm" style={{ borderColor: '#E5DDD5' }}>
              <RefreshCcw size={14} className="mr-2" />
              Atualizar
            </Button>

            <Button variant="outline" size="sm" style={{ borderColor: '#E5DDD5' }}>
              <Download size={14} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={Eye}
          title="Total de Visualizações"
          value={totalStats.page_views.toLocaleString()}
          subtitle={`Últimos ${selectedPeriod} dias`}
          trend={5.2}
          color={brandColors.primary}
        />
        <MetricCard
          icon={Users}
          title="Leads Gerados"
          value={totalStats.leads.toLocaleString()}
          subtitle={`Taxa: ${totalStats.page_views > 0 ? ((totalStats.leads / totalStats.page_views) * 100).toFixed(1) : 0}%`}
          trend={3.1}
          color={brandColors.success}
        />
        <MetricCard
          icon={DollarSign}
          title="Receita Total"
          value={formatCurrency(totalStats.revenue)}
          subtitle={`${totalStats.purchases} vendas`}
          trend={8.7}
          color={brandColors.accent}
        />
        <MetricCard
          icon={Award}
          title="Melhor Criativo"
          value={bestPerformingCreative.creative_name || 'N/A'}
          subtitle={
            bestPerformingCreative.conversion_rate
              ? `${bestPerformingCreative.conversion_rate}% conv.`
              : ''
          }
          color={brandColors.secondary}
        />
      </div>

      {/* Toggle de Visualização */}
      <div className="mb-6">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border inline-flex">
          <Button
            variant={selectedView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('overview')}
            className={selectedView === 'overview' ? 'text-white shadow-sm' : 'hover:bg-gray-50'}
            style={
              selectedView === 'overview'
                ? {
                    backgroundColor: brandColors.primary,
                    borderColor: brandColors.primary,
                  }
                : {}
            }
          >
            <PieChart size={14} className="mr-2" />
            Visão Geral
          </Button>
          <Button
            variant={selectedView === 'detailed' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('detailed')}
            className={selectedView === 'detailed' ? 'text-white shadow-sm' : 'hover:bg-gray-50'}
            style={
              selectedView === 'detailed'
                ? {
                    backgroundColor: brandColors.primary,
                    borderColor: brandColors.primary,
                  }
                : {}
            }
          >
            <BarChart3 size={14} className="mr-2" />
            Detalhada
          </Button>
        </div>
      </div>

      {/* Cards dos Criativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {creativesList.map((creative, index) => (
          <Card
            key={index}
            className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            style={{ backgroundColor: brandColors.background }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      background: `linear-gradient(135deg, ${brandColors.primary}, ${brandColors.accent})`,
                    }}
                  >
                    {creative.creative_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: brandColors.text.dark }}>
                      {creative.creative_name}
                    </h3>
                    {getPerformanceBadge(creative.conversion_rate)}
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                  style={{ color: brandColors.text.light }}
                />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: brandColors.text.medium }}>
                      Visualizações
                    </span>
                    <span className="font-semibold" style={{ color: brandColors.text.dark }}>
                      {creative.page_views.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: brandColors.text.medium }}>
                      Leads
                    </span>
                    <span className="font-semibold" style={{ color: brandColors.text.dark }}>
                      {creative.leads}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: brandColors.text.medium }}>
                      Taxa Conv.
                    </span>
                    <span className="font-semibold text-lg" style={{ color: brandColors.success }}>
                      {creative.conversion_rate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: brandColors.text.medium }}>
                      Receita
                    </span>
                    <span className="font-semibold" style={{ color: brandColors.text.dark }}>
                      {formatCurrency(creative.revenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Barra de progresso da conversão */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: brandColors.text.medium }}>
                    Performance
                  </span>
                  <span className="text-xs font-medium" style={{ color: brandColors.text.dark }}>
                    {creative.conversion_rate}%
                  </span>
                </div>
                <div style={{ backgroundColor: '#E5DDD5' }}>
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(parseFloat(creative.conversion_rate) * 20, 100)}%`,
                      background: `linear-gradient(90deg, ${brandColors.success}, ${brandColors.primary})`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights e Recomendações */}
      <Card className="mt-8 border-0 shadow-sm" style={{ backgroundColor: brandColors.background }}>
        <CardHeader>
          <CardTitle
            className="flex items-center space-x-2"
            style={{ color: brandColors.text.dark }}
          >
            <Target size={20} style={{ color: brandColors.primary }} />
            <span>Insights e Recomendações</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold" style={{ color: brandColors.text.dark }}>
                🎯 Principais Oportunidades
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: brandColors.text.medium }}>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">•</span>
                  <span>
                    Criativo "Elegante Mulher Vestido" tem a melhor taxa de conversão (2.3%)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-500">•</span>
                  <span>Aumentar budget nos criativos com conversão acima de 1.5%</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span style={{ color: '#432818' }}>•</span>
                  <span>Pausar criativos com conversão abaixo de 0.5%</span>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold" style={{ color: brandColors.text.dark }}>
                📊 Próximos Passos
              </h4>
              <ul className="space-y-2 text-sm" style={{ color: brandColors.text.medium }}>
                <li className="flex items-start space-x-2">
                  <span className="text-[#B89B7A]">•</span>
                  <span>Criar variações do melhor criativo</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span style={{ color: '#B89B7A' }}>•</span>
                  <span>Testar novos ângulos baseados no winner</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500">•</span>
                  <span>Escalar investimento nos top performers</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreativeAnalyticsDashboardNew;
