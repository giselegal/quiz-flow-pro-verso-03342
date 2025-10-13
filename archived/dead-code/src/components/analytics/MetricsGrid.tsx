// @ts-nocheck
import { MetricCard } from './MetricCard';
import { Skeleton } from '@/components/ui/skeleton';
import * as LucideIcons from 'lucide-react';

interface MetricsGridProps {
  metrics: {
    totalStarts: number;
    totalCompletes: number;
    totalResultViews: number;
    totalLeads: number;
    totalSales: number;
    completionRate: number;
    conversionRate: number;
    salesRate: number;
  } | null;
  loading?: boolean;
  timeRange: '7d' | '30d' | 'all';
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  loading = false,
  timeRange,
}) => {
  const timeRangeLabel =
    timeRange === '7d'
      ? 'últimos 7 dias'
      : timeRange === '30d'
        ? 'últimos 30 dias'
        : 'todo período';

  if (loading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-card rounded-lg border border-border/40 p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatPercent = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        title="Inicios de Quiz"
        value={formatNumber(metrics.totalStarts)}
        description={`Total de inícios nos ${timeRangeLabel}`}
        icon="Activity"
      />

      <MetricCard
        title="Taxa de Conclusão"
        value={formatPercent(metrics.completionRate)}
        description={`${metrics.totalCompletes} de ${metrics.totalStarts} quizzes concluídos`}
        icon="Target"
      />

      <MetricCard
        title="Resultados Vistos"
        value={formatNumber(metrics.totalResultViews)}
        description={`Pessoas que viram seus resultados`}
        icon="BarChart3"
      />

      <MetricCard
        title="Leads Gerados"
        value={formatNumber(metrics.totalLeads)}
        description={`Total de leads capturados`}
        icon="Users"
      />

      <MetricCard
        title="Taxa de Conversão"
        value={formatPercent(metrics.conversionRate)}
        description={`Conversão de leads dos inícios`}
        icon="ArrowUpRight"
      />

      <MetricCard
        title="Vendas"
        value={formatNumber(metrics.totalSales)}
        description={`Total de compras realizadas`}
        icon="ShoppingCart"
      />

      <MetricCard
        title="Taxa de Vendas"
        value={formatPercent(metrics.salesRate)}
        description={`Taxa de compras de leads`}
        icon="Share2"
      />

      <MetricCard
        title="Tempo Médio"
        value="3:27"
        description={`Tempo médio para concluir`}
        icon="Clock"
      />
    </div>
  );
};
