/**
 * 📊 FUNNEL VISUALIZATION COMPONENT
 *
 * Componente para visualização gráfica do funil de conversão.
 * Exibe taxas de conversão, abandono e tempo por etapa.
 *
 * @example
 * ```tsx
 * <FunnelVisualization
 *   funnelId="quiz21StepsComplete"
 *   steps={[
 *     { id: 'step-01', name: 'Introdução', type: 'intro' },
 *     { id: 'step-02', name: 'Q1: Tipo de Roupa', type: 'question' },
 *     // ...
 *   ]}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFunnelMetrics } from './FunnelConversionTracker';
import { cn } from '@/lib/utils';

export interface FunnelStep {
  id: string;
  name: string;
  type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
  order?: number;
}

export interface FunnelVisualizationProps {
  /** ID do funil */
  funnelId: string;
  /** Lista de steps do funil */
  steps: FunnelStep[];
  /** Altura mínima das barras */
  minBarHeight?: number;
  /** Altura máxima das barras */
  maxBarHeight?: number;
  /** Se deve mostrar números absolutos */
  showAbsoluteNumbers?: boolean;
  /** Cores personalizadas */
  colors?: {
    good?: string;
    warning?: string;
    danger?: string;
    neutral?: string;
  };
}

interface StepStats {
  id: string;
  name: string;
  type: string;
  entries: number;
  completions: number;
  conversionRate: number;
  dropOffRate: number;
  avgTime: number;
  cumulativeRate: number;
}

const DEFAULT_COLORS = {
  good: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  neutral: 'bg-gray-300',
};

/**
 * Retorna a cor baseada na taxa de conversão
 */
function getConversionColor(rate: number, colors: typeof DEFAULT_COLORS): string {
  if (rate >= 90) return colors.good;
  if (rate >= 70) return colors.warning;
  if (rate > 0) return colors.danger;
  return colors.neutral;
}

/**
 * Formata o tempo em formato legível
 */
function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
}

/**
 * Componente de barra individual do funil
 */
const FunnelBar: React.FC<{
  stats: StepStats;
  maxHeight: number;
  minHeight: number;
  colors: typeof DEFAULT_COLORS;
  showAbsolute: boolean;
  isFirst: boolean;
  isLast: boolean;
}> = ({ stats, maxHeight, minHeight, colors, showAbsolute, isFirst, isLast }) => {
  const height = Math.max(minHeight, (stats.cumulativeRate / 100) * maxHeight);
  const colorClass = getConversionColor(stats.conversionRate, colors);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center flex-1 min-w-0">
            {/* Label do step */}
            <div className="text-[10px] text-muted-foreground text-center truncate w-full px-1 mb-1">
              {stats.name.length > 12 ? `${stats.name.slice(0, 10)}...` : stats.name}
            </div>

            {/* Barra */}
            <div
              className={cn(
                'w-full transition-all duration-300 relative group cursor-pointer',
                colorClass,
                isFirst && 'rounded-t-lg',
                isLast && 'rounded-b-lg'
              )}
              style={{ height: `${height}px` }}
            >
              {/* Percentual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {stats.cumulativeRate > 0 ? `${Math.round(stats.cumulativeRate)}%` : '-'}
                </span>
              </div>
            </div>

            {/* Tipo do step */}
            <Badge variant="outline" className="mt-1 text-[9px] px-1 py-0">
              {stats.type}
            </Badge>

            {/* Drop-off indicator */}
            {stats.dropOffRate > 10 && (
              <div className="text-[10px] text-red-500 font-medium mt-0.5">
                ↓{Math.round(stats.dropOffRate)}%
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1">
            <div className="font-semibold">{stats.name}</div>
            <div className="text-xs space-y-0.5">
              <div>
                Tipo: <span className="font-medium">{stats.type}</span>
              </div>
              {showAbsolute && (
                <>
                  <div>
                    Entradas: <span className="font-medium">{stats.entries}</span>
                  </div>
                  <div>
                    Conclusões: <span className="font-medium">{stats.completions}</span>
                  </div>
                </>
              )}
              <div>
                Taxa de Conversão:{' '}
                <span className="font-medium">{Math.round(stats.conversionRate)}%</span>
              </div>
              <div>
                Taxa de Abandono:{' '}
                <span className={cn('font-medium', stats.dropOffRate > 10 && 'text-red-500')}>
                  {Math.round(stats.dropOffRate)}%
                </span>
              </div>
              <div>
                Taxa Acumulada:{' '}
                <span className="font-medium">{Math.round(stats.cumulativeRate)}%</span>
              </div>
              {stats.avgTime > 0 && (
                <div>
                  Tempo Médio: <span className="font-medium">{formatTime(stats.avgTime)}</span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

/**
 * Componente principal de visualização do funil
 */
export const FunnelVisualization: React.FC<FunnelVisualizationProps> = ({
  funnelId,
  steps,
  minBarHeight = 30,
  maxBarHeight = 200,
  showAbsoluteNumbers = false,
  colors = DEFAULT_COLORS,
}) => {
  const { getMetricsByFunnel, getDropOffByStep, getAverageTimeByStep } = useFunnelMetrics();

  const metrics = useMemo(() => getMetricsByFunnel(funnelId), [funnelId, getMetricsByFunnel]);
  const dropOffs = useMemo(() => getDropOffByStep(funnelId), [funnelId, getDropOffByStep]);
  const avgTimes = useMemo(() => getAverageTimeByStep(funnelId), [funnelId, getAverageTimeByStep]);

  const stepStats: StepStats[] = useMemo(() => {
    // Calcular estatísticas por step
    const entriesByStep = new Map<string, number>();
    const completionsByStep = new Map<string, number>();

    metrics.forEach((m) => {
      if (m.type === 'step_enter') {
        entriesByStep.set(m.stepId, (entriesByStep.get(m.stepId) || 0) + 1);
      } else if (m.type === 'step_complete') {
        completionsByStep.set(m.stepId, (completionsByStep.get(m.stepId) || 0) + 1);
      }
    });

    // Calcular o número inicial (primeiro step)
    const firstStepId = steps[0]?.id;
    const totalStarts = entriesByStep.get(firstStepId) || 100; // Default para visualização

    return steps.map((step, index) => {
      const entries = entriesByStep.get(step.id) || 0;
      const completions = completionsByStep.get(step.id) || 0;
      const conversionRate = entries > 0 ? (completions / entries) * 100 : 100;
      const dropOffRate = dropOffs[step.id] || 0;
      const avgTime = avgTimes[step.id] || 0;

      // Taxa acumulada: baseada nas entradas relativas ao início
      const cumulativeRate = totalStarts > 0 ? (entries / totalStarts) * 100 : 100 - index * 5;

      return {
        id: step.id,
        name: step.name,
        type: step.type,
        entries,
        completions,
        conversionRate,
        dropOffRate,
        avgTime,
        cumulativeRate: Math.max(0, Math.min(100, cumulativeRate)),
      };
    });
  }, [steps, metrics, dropOffs, avgTimes]);

  // Métricas resumidas
  const summary = useMemo(() => {
    if (stepStats.length === 0) return null;

    const first = stepStats[0];
    const last = stepStats[stepStats.length - 1];
    const totalConversion = first.entries > 0 ? (last.completions / first.entries) * 100 : 0;

    const worstStep = stepStats.reduce(
      (worst, current) =>
        current.dropOffRate > (worst?.dropOffRate || 0) ? current : worst,
      stepStats[0]
    );

    const longestStep = stepStats.reduce(
      (longest, current) => (current.avgTime > (longest?.avgTime || 0) ? current : longest),
      stepStats[0]
    );

    return {
      totalConversion: Math.round(totalConversion * 10) / 10,
      worstStep: worstStep?.name || '-',
      worstDropOff: Math.round((worstStep?.dropOffRate || 0) * 10) / 10,
      longestStep: longestStep?.name || '-',
      longestTime: longestStep?.avgTime || 0,
    };
  }, [stepStats]);

  // Se não há dados, mostrar estado vazio
  const hasData = metrics.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Visualização do Funil</span>
          <Badge variant="outline" className="font-normal">
            {funnelId}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Resumo */}
        {summary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Taxa de Conversão</div>
              <div className="text-lg font-bold text-primary">{summary.totalConversion}%</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Maior Abandono</div>
              <div className="text-lg font-bold text-red-500">{summary.worstDropOff}%</div>
              <div className="text-[10px] text-muted-foreground truncate">{summary.worstStep}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Step Mais Longo</div>
              <div className="text-lg font-bold">{formatTime(summary.longestTime)}</div>
              <div className="text-[10px] text-muted-foreground truncate">
                {summary.longestStep}
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground">Total de Steps</div>
              <div className="text-lg font-bold">{steps.length}</div>
            </div>
          </div>
        )}

        {/* Gráfico do funil */}
        <div className="relative">
          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
              <div className="text-center text-muted-foreground">
                <p className="text-sm">Sem dados de conversão</p>
                <p className="text-xs mt-1">Navegue pelo funil para coletar métricas</p>
              </div>
            </div>
          )}

          <div
            className="flex items-end gap-1 overflow-x-auto pb-4"
            style={{ minHeight: maxBarHeight + 60 }}
          >
            {stepStats.map((stats, index) => (
              <FunnelBar
                key={stats.id}
                stats={stats}
                maxHeight={maxBarHeight}
                minHeight={minBarHeight}
                colors={{ ...DEFAULT_COLORS, ...colors }}
                showAbsolute={showAbsoluteNumbers}
                isFirst={index === 0}
                isLast={index === stepStats.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className={cn('w-3 h-3 rounded', colors.good || DEFAULT_COLORS.good)} />
            <span>≥90%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={cn('w-3 h-3 rounded', colors.warning || DEFAULT_COLORS.warning)} />
            <span>70-89%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={cn('w-3 h-3 rounded', colors.danger || DEFAULT_COLORS.danger)} />
            <span>&lt;70%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500">↓</span>
            <span>Abandono &gt;10%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FunnelVisualization;
