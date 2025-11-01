/**
 * 🎯 LAZY CHARTS COMPONENTS - FIXED VERSION
 * 
 * Lazy loading de recharts (-341 kB do bundle inicial)
 * Carregado apenas quando necessário (dashboards)
 * 
 * Fix: Avoiding "Cannot access 'O' before initialization" error
 * by using more stable import pattern
 */

import React, { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// More stable lazy loading pattern to avoid initialization errors
const createLazyComponent = (componentName: string) => {
    return React.lazy(async () => {
        try {
            const module = await import('recharts');
            const Component = (module as any)[componentName];
            if (!Component) {
                throw new Error(`Component ${componentName} not found in recharts`);
            }
            return { default: Component };
        } catch (error) {
            console.error(`Failed to load recharts component ${componentName}:`, error);
            // Return a fallback component to prevent crashes
            return {
                default: () => React.createElement('div', {
                    className: 'text-red-500 p-4'
                }, `Failed to load ${componentName}`)
            };
        }
    });
};

// Lazy load individual components with error handling
const LazyLineChartComponent = createLazyComponent('LineChart');
const LazyLineComponent = createLazyComponent('Line');
const LazyAreaChartComponent = createLazyComponent('AreaChart');
const LazyAreaComponent = createLazyComponent('Area');
const LazyBarChartComponent = createLazyComponent('BarChart');
const LazyBarComponent = createLazyComponent('Bar');
const LazyPieChartComponent = createLazyComponent('PieChart');
const LazyPieComponent = createLazyComponent('Pie');
const LazyCellComponent = createLazyComponent('Cell');
const LazyXAxisComponent = createLazyComponent('XAxis');
const LazyYAxisComponent = createLazyComponent('YAxis');
const LazyCartesianGridComponent = createLazyComponent('CartesianGrid');
const LazyTooltipComponent = createLazyComponent('Tooltip');
const LazyLegendComponent = createLazyComponent('Legend');
const LazyResponsiveContainerComponent = createLazyComponent('ResponsiveContainer');

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
