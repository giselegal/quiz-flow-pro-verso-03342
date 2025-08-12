import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricCard } from '../MetricCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface OverviewTabProps {
  analyticsData: any;
  loading?: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ analyticsData, loading = false }) => {
  if (loading || !analyticsData) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // Ensure metrics exist and provide default values if they don't
  const metrics = analyticsData.metrics || {};
  const compactView = analyticsData.compactView;

  // Transform data for chart
  const chartData = [];
  if (analyticsData.events && Array.isArray(analyticsData.events)) {
    // Group by day and count events
    const eventsByDate = analyticsData.events.reduce((acc: any, event: any) => {
      if (!event.timestamp) return acc;

      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          quiz_start: 0,
          quiz_complete: 0,
          result_view: 0,
          lead_generated: 0,
          sale: 0,
        };
      }

      if (acc[date][event.type] !== undefined) {
        acc[date][event.type] += 1;
      }

      return acc;
    }, {});

    // Convert to array and sort by date
    chartData.push(...Object.values(eventsByDate));
    chartData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  // Format date labels for chart
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Safe access to metrics with defaults
  const safeMetric = (value: any, defaultValue: number = 0) => {
    return typeof value === 'number' ? value : defaultValue;
  };

  const formatPercentage = (value: any) => {
    if (value === undefined || value === null) return '0.0%';
    return `${safeMetric(value, 0).toFixed(1)}%`;
  };

  const conversionMetrics = [
    {
      title: 'Taxa de Conclusão',
      value: formatPercentage(metrics.completionRate),
      description: 'Quiz iniciado → Quiz completo',
      change: '+2.5%',
      trend: 'up',
      color: '#4f46e5',
    },
    {
      title: 'Taxa de Conversão',
      value: formatPercentage(metrics.conversionRate),
      description: 'Quiz iniciado → Lead',
      change: '+1.2%',
      trend: 'up',
      color: '#10b981',
    },
    {
      title: 'Taxa de Vendas',
      value: formatPercentage(metrics.salesRate),
      description: 'Lead → Venda',
      change: '-0.8%',
      trend: 'down',
      color: '#f59e0b',
    },
  ];

  return (
    <div className="space-y-6">
      <div
        className={`grid ${compactView ? 'grid-cols-2 md:grid-cols-4 xl:grid-cols-7' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'} gap-4`}
      >
        <MetricCard
          title="Inicios de Quiz"
          value={safeMetric(metrics.totalStarts)}
          icon="Play"
          trend="up"
          change="+12%"
          compact={compactView}
        />
        <MetricCard
          title="Quiz Completos"
          value={safeMetric(metrics.totalCompletes)}
          icon="CheckCircle"
          trend="up"
          change="+8%"
          compact={compactView}
        />
        <MetricCard
          title="Resultados Vistos"
          value={safeMetric(metrics.totalResultViews)}
          icon="Eye"
          trend="up"
          change="+15%"
          compact={compactView}
        />
        <MetricCard
          title="Leads Gerados"
          value={safeMetric(metrics.totalLeads)}
          icon="Users"
          trend="up"
          change="+5%"
          compact={compactView}
        />
        <MetricCard
          title="Vendas"
          value={safeMetric(metrics.totalSales)}
          icon="ShoppingCart"
          trend="up"
          change="+3%"
          compact={compactView}
        />
        <MetricCard
          title="Taxa de Conclusão"
          value={formatPercentage(metrics.completionRate)}
          icon="BarChart"
          trend="up"
          change="+2%"
          compact={compactView}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={formatPercentage(metrics.conversionRate)}
          icon="TrendingUp"
          trend="down"
          change="-1%"
          compact={compactView}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência de Eventos</CardTitle>
          <CardDescription>Visualização dos eventos por data</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <div className={`w-full ${compactView ? 'h-[250px]' : 'h-[400px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === 'quiz_start'
                      ? 'Início do Quiz'
                      : name === 'quiz_complete'
                        ? 'Quiz Completo'
                        : name === 'result_view'
                          ? 'Visualizações'
                          : name === 'lead_generated'
                            ? 'Leads'
                            : 'Vendas',
                  ]}
                  labelFormatter={label => `Data: ${formatDate(label)}`}
                />
                <Legend
                  formatter={value =>
                    value === 'quiz_start'
                      ? 'Início do Quiz'
                      : value === 'quiz_complete'
                        ? 'Quiz Completo'
                        : value === 'result_view'
                          ? 'Visualizações'
                          : value === 'lead_generated'
                            ? 'Leads'
                            : 'Vendas'
                  }
                />
                <Line type="monotone" dataKey="quiz_start" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="quiz_complete" stroke="#82ca9d" />
                <Line type="monotone" dataKey="result_view" stroke="#ffc658" />
                <Line type="monotone" dataKey="lead_generated" stroke="#ff7300" />
                <Line type="monotone" dataKey="sale" stroke="#ff0000" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversão do Funil</CardTitle>
          <CardDescription>Análise das taxas de conversão entre etapas do funil</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`w-full ${compactView ? 'h-[200px]' : 'h-[300px]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionMetrics}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis tickFormatter={value => `${value}%`} />
                <Tooltip
                  formatter={value => [value, 'Taxa']}
                  labelFormatter={label => `${label}`}
                />
                <Bar dataKey="value" name="Taxa" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
