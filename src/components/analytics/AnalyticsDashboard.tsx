import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  BarChart3,
  Users,
  Eye,
  Target,
  TrendingUp,
  Clock,
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAnalytics, AnalyticsMetrics, ConversionFunnel } from '../../services/analyticsService';

interface AnalyticsDashboardProps {
  quizId: string;
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  quizId,
  className = ''
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [funnel, setFunnel] = useState<ConversionFunnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getQuizMetrics, getConversionFunnel, syncLocalEvents } = useAnalytics();

  // Carregar dados analytics
  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 [Analytics Dashboard] Loading data for quiz:', quizId);
      
      // Sincronizar eventos locais primeiro
      await syncLocalEvents();
      
      // Carregar métricas e funil
      const [metricsData, funnelData] = await Promise.all([
        getQuizMetrics(quizId),
        getConversionFunnel(quizId)
      ]);

      setMetrics(metricsData);
      setFunnel(funnelData);
      
      console.log('✅ [Analytics Dashboard] Data loaded:', { metricsData, funnelData });
    } catch (err) {
      console.error('❌ [Analytics Dashboard] Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      loadAnalytics();
    }
  }, [quizId]);

  // Componente de métrica
  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
  }> = ({ title, value, description, icon, trend = 'neutral' }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
          {trend === 'down' && <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />}
          {description}
        </p>
      </CardContent>
    </Card>
  );

  // Componente de funil de conversão
  const FunnelStep: React.FC<{ step: ConversionFunnel; isLast: boolean }> = ({ step, isLast }) => (
    <div className="relative">
      <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
        <div className="flex-1">
          <h4 className="font-medium">{step.step_name}</h4>
          <p className="text-sm text-gray-600">{step.total_users} usuários</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">{step.conversion_rate}%</div>
          {step.drop_off_rate > 0 && (
            <div className="text-sm text-red-600">-{step.drop_off_rate}% drop-off</div>
          )}
        </div>
      </div>
      {!isLast && (
        <div className="flex justify-center my-2">
          <div className="w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent border-t-8 border-gray-300"></div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Carregando analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <Card className="border-red-200">
          <CardContent className="flex items-center space-x-2 p-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium text-red-900">Erro ao carregar analytics</p>
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={loadAnalytics} variant="outline" size="sm" className="mt-2">
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`p-6 ${className}`}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum dado disponível</h3>
            <p className="text-sm text-gray-600 text-center mt-2">
              Ainda não há dados de analytics para este quiz.
              <br />
              Comece a compartilhar seu quiz para ver as estatísticas aqui.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">
            Última atualização: {new Date(metrics.last_updated).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadAnalytics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Visualizações"
          value={metrics.total_views.toLocaleString()}
          description="Páginas visualizadas"
          icon={<Eye className="h-4 w-4 text-blue-500" />}
        />
        <MetricCard
          title="Iniciados"
          value={metrics.total_starts.toLocaleString()}
          description="Quizzes iniciados"
          icon={<Users className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Completados"
          value={metrics.total_completions.toLocaleString()}
          description="Quizzes finalizados"
          icon={<Target className="h-4 w-4 text-purple-500" />}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={`${metrics.completion_rate}%`}
          description="% de conclusão"
          icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
          trend={metrics.completion_rate > 50 ? 'up' : 'down'}
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="funnel">Funil de Conversão</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Métricas secundárias */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Conversão:</span>
                  <Badge variant={metrics.conversion_rate > 10 ? 'default' : 'secondary'}>
                    {metrics.conversion_rate}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Rejeição:</span>
                  <Badge variant={metrics.bounce_rate < 50 ? 'default' : 'destructive'}>
                    {metrics.bounce_rate}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tempo Médio:</span>
                  <span className="font-medium">
                    {Math.floor(metrics.average_time / 60)}m {metrics.average_time % 60}s
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Status geral */}
            <Card>
              <CardHeader>
                <CardTitle>Status do Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Performance:</span>
                    <Badge variant={metrics.completion_rate > 50 ? 'default' : 'secondary'}>
                      {metrics.completion_rate > 70 ? 'Excelente' : 
                       metrics.completion_rate > 50 ? 'Boa' : 
                       metrics.completion_rate > 30 ? 'Regular' : 'Baixa'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Engajamento:</span>
                    <Badge variant={metrics.bounce_rate < 30 ? 'default' : 'secondary'}>
                      {metrics.bounce_rate < 30 ? 'Alto' : 
                       metrics.bounce_rate < 60 ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>
                Visualize onde os usuários abandonam o processo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {funnel.length > 0 ? (
                <div className="space-y-4">
                  {funnel.map((step, index) => (
                    <FunnelStep 
                      key={step.step_name} 
                      step={step} 
                      isLast={index === funnel.length - 1} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Dados do funil não disponíveis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Recomendações</h4>
                  <ul className="space-y-2 text-sm">
                    {metrics.completion_rate < 50 && (
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>Taxa de conclusão baixa. Considere simplificar o quiz.</span>
                      </li>
                    )}
                    {metrics.bounce_rate > 60 && (
                      <li className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        <span>Taxa de rejeição alta. Melhore a primeira impressão.</span>
                      </li>
                    )}
                    {metrics.average_time > 300 && (
                      <li className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Quiz muito longo. Considere reduzir o número de perguntas.</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Benchmarks</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Taxa de conclusão ideal:</span>
                      <span className="text-green-600">60-80%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de rejeição ideal:</span>
                      <span className="text-green-600">&lt; 40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tempo ideal:</span>
                      <span className="text-green-600">2-5 minutos</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
