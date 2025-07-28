// =============================================================================
// COMPONENTE DE ANALYTICS E MÉTRICAS
// Sistema de Quiz Quest Challenge Verse
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
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
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

// =============================================================================
// INTERFACES
// =============================================================================

interface AnalyticsData {
  totalViews: number;
  totalAttempts: number;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  topQuestions: QuestionPerformance[];
  dailyStats: DailyStats[];
  userJourney: UserJourneyStep[];
  demographics: Demographics;
}

interface QuestionPerformance {
  questionId: string;
  questionText: string;
  correctRate: number;
  averageTime: number;
  skipRate: number;
}

interface DailyStats {
  date: string;
  views: number;
  attempts: number;
  completions: number;
}

interface UserJourneyStep {
  step: string;
  users: number;
  dropoffRate: number;
}

interface Demographics {
  devices: { name: string; value: number; color: string }[];
  sources: { name: string; value: number; color: string }[];
  locations: { name: string; value: number }[];
}

interface AnalyticsProps {
  quizId: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// =============================================================================
// CORES PARA GRÁFICOS
// =============================================================================

const CHART_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6'
];

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

const QuizAnalytics: React.FC<AnalyticsProps> = ({ quizId, dateRange }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'attempts' | 'completions'>('views');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // =============================================================================
  // EFEITOS
  // =============================================================================

  useEffect(() => {
    loadAnalytics();
  }, [quizId, timeframe, dateRange]);

  // =============================================================================
  // FUNÇÕES
  // =============================================================================

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // TODO: Implementar chamada real para API
      // Dados simulados por enquanto
      const mockData: AnalyticsData = {
        totalViews: 1245,
        totalAttempts: 892,
        completionRate: 73.5,
        averageScore: 78.3,
        averageTime: 285,
        topQuestions: [
          {
            questionId: '1',
            questionText: 'Qual é a capital do Brasil?',
            correctRate: 95.2,
            averageTime: 12,
            skipRate: 2.1
          },
          {
            questionId: '2',
            questionText: 'Quantos estados tem o Brasil?',
            correctRate: 67.8,
            averageTime: 18,
            skipRate: 8.5
          },
          {
            questionId: '3',
            questionText: 'Qual o maior estado brasileiro?',
            correctRate: 45.3,
            averageTime: 25,
            skipRate: 15.2
          }
        ],
        dailyStats: generateDailyStats(),
        userJourney: [
          { step: 'Visualização', users: 1245, dropoffRate: 0 },
          { step: 'Início', users: 892, dropoffRate: 28.4 },
          { step: 'Pergunta 1', users: 856, dropoffRate: 4.0 },
          { step: 'Pergunta 2', users: 789, dropoffRate: 7.8 },
          { step: 'Pergunta 3', users: 721, dropoffRate: 8.6 },
          { step: 'Conclusão', users: 656, dropoffRate: 9.0 }
        ],
        demographics: {
          devices: [
            { name: 'Desktop', value: 45, color: '#3B82F6' },
            { name: 'Mobile', value: 40, color: '#10B981' },
            { name: 'Tablet', value: 15, color: '#F59E0B' }
          ],
          sources: [
            { name: 'Direto', value: 35, color: '#3B82F6' },
            { name: 'Social', value: 30, color: '#10B981' },
            { name: 'Email', value: 20, color: '#F59E0B' },
            { name: 'Busca', value: 15, color: '#EF4444' }
          ],
          locations: [
            { name: 'São Paulo', value: 312 },
            { name: 'Rio de Janeiro', value: 234 },
            { name: 'Minas Gerais', value: 189 },
            { name: 'Bahia', value: 156 },
            { name: 'Outros', value: 354 }
          ]
        }
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Erro ao carregar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDailyStats = (): DailyStats[] => {
    const stats: DailyStats[] = [];
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      stats.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10,
        attempts: Math.floor(Math.random() * 30) + 5,
        completions: Math.floor(Math.random() * 20) + 3
      });
    }
    
    return stats;
  };

  const exportData = () => {
    // TODO: Implementar exportação de dados
    console.log('Exportando dados...');
  };

  // =============================================================================
  // RENDERIZAÇÃO DE MÉTRICAS
  // =============================================================================

  const renderMetricCard = (
    title: string,
    value: string | number,
    change: number,
    icon: React.ReactNode,
    color: string = 'blue'
  ) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
      </div>
    </div>
  );

  // =============================================================================
  // LOADING STATE
  // =============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span>Carregando analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Não foi possível carregar os dados de analytics.</p>
        <button 
          onClick={loadAnalytics}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // =============================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // =============================================================================

  return (
    <div className="space-y-6">
      {/* Header com Filtros */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics do Quiz</h2>
        
        <div className="flex items-center space-x-4">
          {/* Seletor de Período */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="all">Todos os tempos</option>
          </select>

          {/* Botão de Exportar */}
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>

          {/* Botão de Atualizar */}
          <button
            onClick={loadAnalytics}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Total de Visualizações',
          analyticsData.totalViews.toLocaleString(),
          12.5,
          <Eye className="w-6 h-6 text-blue-600" />,
          'blue'
        )}
        
        {renderMetricCard(
          'Tentativas',
          analyticsData.totalAttempts.toLocaleString(),
          8.3,
          <Users className="w-6 h-6 text-green-600" />,
          'green'
        )}
        
        {renderMetricCard(
          'Taxa de Conclusão',
          `${analyticsData.completionRate}%`,
          5.2,
          <CheckCircle className="w-6 h-6 text-purple-600" />,
          'purple'
        )}
        
        {renderMetricCard(
          'Pontuação Média',
          `${analyticsData.averageScore}%`,
          -2.1,
          <Target className="w-6 h-6 text-orange-600" />,
          'orange'
        )}
      </div>

      {/* Gráfico de Tendências */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Tendências ao Longo do Tempo</h3>
          
          <div className="flex space-x-2">
            {(['views', 'attempts', 'completions'] as const).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded text-sm ${
                  selectedMetric === metric
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {metric === 'views' ? 'Visualizações' :
                 metric === 'attempts' ? 'Tentativas' : 'Conclusões'}
              </button>
            ))}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke="#3B82F6"
              fillOpacity={0.3}
              fill="#3B82F6"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Layout de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance das Perguntas */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Performance das Perguntas</h3>
          
          <div className="space-y-4">
            {analyticsData.topQuestions.map((question, index) => (
              <div key={question.questionId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Pergunta {index + 1}</h4>
                  <span className={`px-2 py-1 rounded text-xs ${
                    question.correctRate >= 80 ? 'bg-green-100 text-green-800' :
                    question.correctRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.correctRate}% acertos
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 truncate">
                  {question.questionText}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Tempo médio:</span>
                    <p className="font-medium">{question.averageTime}s</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Taxa de pulo:</span>
                    <p className="font-medium">{question.skipRate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Acertos:</span>
                    <p className="font-medium">{question.correctRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jornada do Usuário */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Jornada do Usuário</h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.userJourney} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="step" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="users" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráficos de Demografia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispositivos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Dispositivos</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analyticsData.demographics.devices}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {analyticsData.demographics.devices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Fontes de Tráfego */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Fontes de Tráfego</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analyticsData.demographics.sources}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {analyticsData.demographics.sources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Localização */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Top Localizações</h3>
          
          <div className="space-y-3">
            {analyticsData.demographics.locations.map((location, index) => (
              <div key={location.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{location.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(location.value / Math.max(...analyticsData.demographics.locations.map(l => l.value))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{location.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnalytics;
