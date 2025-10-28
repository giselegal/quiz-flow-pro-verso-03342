/**
 * 🎯 LAZY CHARTS COMPONENTS
 * 
 * Lazy loading de recharts (-341 kB do bundle inicial)
 * Carregado apenas quando necessário (dashboards)
 */

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load do recharts completo
const RechartsComponents = React.lazy(() => import('recharts'));

// Componente de loading para charts
const ChartFallback: React.FC = () => (
    <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
);

// Wrappers com Suspense para cada componente usado
export const LazyLineChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <RechartsComponents.LineChart {...props} />
    </Suspense>
);

export const LazyLine: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Line {...props} />
    </Suspense>
);

export const LazyAreaChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <RechartsComponents.AreaChart {...props} />
    </Suspense>
);

export const LazyArea: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Area {...props} />
    </Suspense>
);

export const LazyBarChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <RechartsComponents.BarChart {...props} />
    </Suspense>
);

export const LazyBar: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Bar {...props} />
    </Suspense>
);

export const LazyPieChart: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <RechartsComponents.PieChart {...props} />
    </Suspense>
);

export const LazyPie: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Pie {...props} />
    </Suspense>
);

export const LazyXAxis: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.XAxis {...props} />
    </Suspense>
);

export const LazyYAxis: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.YAxis {...props} />
    </Suspense>
);

export const LazyCartesianGrid: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.CartesianGrid {...props} />
    </Suspense>
);

export const LazyTooltip: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Tooltip {...props} />
    </Suspense>
);

export const LazyResponsiveContainer: React.FC<any> = (props) => (
    <Suspense fallback={<ChartFallback />}>
        <RechartsComponents.ResponsiveContainer {...props} />
    </Suspense>
);

export const LazyLegend: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Legend {...props} />
    </Suspense>
);

export const LazyCell: React.FC<any> = (props) => (
    <Suspense fallback={null}>
        <RechartsComponents.Cell {...props} />
    </Suspense>
);

// Re-export conveniente para uso fácil
export {
    ChartFallback as ChartLoader,
};
