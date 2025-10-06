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
  AlertCircle,
} from 'lucide-react';
import { useAnalytics, AnalyticsMetrics, ConversionFunnel } from '../../services/AnalyticsService';

interface AnalyticsDashboardProps {
  quizId?: string;
  className?: string;
  onClose?: () => void;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  quizId = 'default',
  className = ''
}) => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [funnel, setFunnel] = useState<ConversionFunnel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

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
        getConversionFunnel(quizId),
      ]);

      setMetrics(metricsData);
      setFunnel(funnelData);

      console.log('✅ [Analytics Dashboard] Data loaded:', {
        metricsData,
        funnelData,
      });
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

  // Componente de métrica simplificado
  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
  }> = ({ title, value, description, icon }) => (
    <div className="bg-white p-6 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 style={{ color: '#6B4F43' }}>{title}</h3>
        {icon}
      </div>
      <div style={{ color: '#432818' }}>{value}</div>
      <p style={{ color: '#8B7355' }}>{description}</p>
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
        <div style={{ borderColor: '#E5DDD5' }}>
          <div className="flex items-center space-x-2">
            <AlertCircle style={{ color: '#432818' }} />
            <div>
              <p className="font-medium text-red-900">Erro ao carregar analytics</p>
              <p style={{ color: '#432818' }}>{error}</p>
              <Button onClick={loadAnalytics} className="mt-2 bg-red-600 hover:bg-red-700">
                Tentar novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-white border rounded-lg p-12 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 style={{ color: '#432818' }}>Nenhum dado disponível</h3>
          <p style={{ color: '#6B4F43' }}>
            Ainda não há dados de analytics para este quiz.
            <br />
            Comece a compartilhar seu quiz para ver as estatísticas aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p style={{ color: '#6B4F43' }}>
            Última atualização: {new Date(metrics.last_updated).toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadAnalytics} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline">
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
          icon={<Eye className="h-4 w-4 text-[#B89B7A]" />}
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
          icon={<Target style={{ color: '#B89B7A' }} />}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={`${metrics.completion_rate}%`}
          description="% de conclusão"
          icon={<TrendingUp className="h-4 w-4 text-orange-500" />}
        />
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div style={{ borderColor: '#E5DDD5' }}>
          <nav className="-mb-px flex space-x-8">
            {['overview', 'funnel', 'performance'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                    ? 'border-[#B89B7A] text-[#B89B7A]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab === 'overview'
                  ? 'Visão Geral'
                  : tab === 'funnel'
                    ? 'Funil de Conversão'
                    : 'Performance'}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Métricas detalhadas */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Métricas Detalhadas</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span style={{ color: '#6B4F43' }}>Taxa de Conversão:</span>
                    <Badge variant={metrics.conversion_rate > 10 ? 'default' : 'secondary'}>
                      {metrics.conversion_rate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6B4F43' }}>Taxa de Rejeição:</span>
                    <Badge variant={metrics.bounce_rate < 50 ? 'default' : 'destructive'}>
                      {metrics.bounce_rate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6B4F43' }}>Tempo Médio:</span>
                    <span className="font-medium">
                      {Math.floor(metrics.average_time / 60)}m {metrics.average_time % 60}s
                    </span>
                  </div>
                </div>
              </div>

              {/* Status geral */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Status do Quiz</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Performance:</span>
                    <Badge variant={metrics.completion_rate > 50 ? 'default' : 'secondary'}>
                      {metrics.completion_rate > 70
                        ? 'Excelente'
                        : metrics.completion_rate > 50
                          ? 'Boa'
                          : metrics.completion_rate > 30
                            ? 'Regular'
                            : 'Baixa'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Engajamento:</span>
                    <Badge variant={metrics.bounce_rate < 30 ? 'default' : 'secondary'}>
                      {metrics.bounce_rate < 30
                        ? 'Alto'
                        : metrics.bounce_rate < 60
                          ? 'Médio'
                          : 'Baixo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'funnel' && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Funil de Conversão</h3>
              <p style={{ color: '#6B4F43' }}>Visualize onde os usuários abandonam o processo</p>

              {funnel.length > 0 ? (
                <div className="space-y-4">
                  {funnel.map((step, index) => (
                    <div key={step.step_name} className="relative">
                      <div style={{ backgroundColor: '#FAF9F7' }}>
                        <div className="flex-1">
                          <h4 className="font-medium">{step.step_name}</h4>
                          <p style={{ color: '#6B4F43' }}>{step.total_users} usuários</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{step.conversion_rate}%</div>
                          {step.drop_off_rate > 0 && (
                            <div style={{ color: '#432818' }}>-{step.drop_off_rate}% drop-off</div>
                          )}
                        </div>
                      </div>
                      {index < funnel.length - 1 && (
                        <div className="flex justify-center my-2">
                          <div style={{ borderColor: '#E5DDD5' }}></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p style={{ color: '#6B4F43' }}>Dados do funil não disponíveis</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Análise de Performance</h3>
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
                        <AlertCircle style={{ color: '#432818' }} />
                        <span>Taxa de rejeição alta. Melhore a primeira impressão.</span>
                      </li>
                    )}
                    {metrics.average_time > 300 && (
                      <li className="flex items-start space-x-2">
                        <Clock className="h-4 w-4 text-[#B89B7A] mt-0.5" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
