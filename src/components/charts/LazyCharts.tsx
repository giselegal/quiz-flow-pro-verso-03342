// @ts-nocheck
/**
 * 🎯 LAZY CHARTS COMPONENTS
 * 
 * Lazy loading de recharts (-341 kB do bundle inicial)
 * Carregado apenas quando necessário (dashboards)
 */

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load individual components to avoid circular deps
const LazyLineChartComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.LineChart }))
);

const LazyLineComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Line }))
);

const LazyAreaChartComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.AreaChart }))
);

const LazyAreaComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Area }))
);

const LazyBarChartComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.BarChart }))
);

const LazyBarComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Bar }))
);

const LazyPieChartComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.PieChart }))
);

const LazyPieComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Pie }))
);

const LazyCellComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Cell }))
);

const LazyXAxisComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.XAxis }))
);

const LazyYAxisComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.YAxis }))
);

const LazyCartesianGridComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.CartesianGrid }))
);

const LazyTooltipComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Tooltip }))
);

const LazyLegendComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.Legend }))
);

const LazyResponsiveContainerComponent = React.lazy(() =>
    import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

// Componente de loading para charts
const ChartFallback: React.FC = () => (
    <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
);

// Wrappers com Suspense para cada componente usado
export const LazyLineChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <LazyLineChartComponent {...props} />
    </Suspense>
);

export const LazyLine: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyLineComponent {...props} />
    </Suspense>
);

export const LazyAreaChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <LazyAreaChartComponent {...props} />
    </Suspense>
);

export const LazyArea: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyAreaComponent {...props} />
    </Suspense>
);

export const LazyBarChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <LazyBarChartComponent {...props} />
    </Suspense>
);

export const LazyBar: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyBarComponent {...props} />
    </Suspense>
);

export const LazyPieChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <LazyPieChartComponent {...props} />
    </Suspense>
);

export const LazyPie: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyPieComponent {...props} />
    </Suspense>
);

export const LazyXAxis: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyXAxisComponent {...props} />
    </Suspense>
);

export const LazyYAxis: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyYAxisComponent {...props} />
    </Suspense>
);

export const LazyCartesianGrid: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyCartesianGridComponent {...props} />
    </Suspense>
);

export const LazyTooltip: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyTooltipComponent {...props} />
    </Suspense>
);

export const LazyResponsiveContainer: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <LazyResponsiveContainerComponent {...props} />
    </Suspense>
);

export const LazyLegend: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyLegendComponent {...props} />
    </Suspense>
);

export const LazyCell: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <LazyCellComponent {...props} />
    </Suspense>
);

// Re-export conveniente para uso fácil
export {
    ChartFallback as ChartLoader,
};
