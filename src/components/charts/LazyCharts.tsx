/**
 * 🎯 LAZY CHARTS COMPONENTS - FIXED
 * 
 * Lazy loading de recharts (-341 kB do bundle inicial)
 * Carregado apenas quando necessário (dashboards)
 * 
 * FIX: Evitar problema "Cannot access 'O' before initialization"
 */

import * as React from 'react';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { appLogger } from '@/lib/utils/appLogger';

// Função auxiliar para criar lazy components de forma segura
const createSafeLazyComponent = (componentName: string) => {
    return React.lazy(async () => {
        try {
            // Aguardar um tick do event loop para garantir inicialização
            await new Promise(resolve => setTimeout(resolve, 0));

            const rechartsModule = await import('recharts');
            const Component = (rechartsModule as any)[componentName];

            if (!Component) {
                throw new Error(`Component ${componentName} not found in recharts`);
            }

            return { default: Component };
        } catch (error) {
            appLogger.error(`Failed to load recharts component ${componentName}:`, { data: [error] });
            // Fallback component
            return {
                default: () => React.createElement('div', {
                    style: { color: 'red', padding: '10px' }
                }, `Error loading ${componentName}`)
            };
        }
    });
};

// Criar componentes lazy de forma segura
const LazyLineChartComponent = createSafeLazyComponent('LineChart');
const LazyLineComponent = createSafeLazyComponent('Line');
const LazyAreaChartComponent = createSafeLazyComponent('AreaChart');
const LazyAreaComponent = createSafeLazyComponent('Area');
const LazyBarChartComponent = createSafeLazyComponent('BarChart');
const LazyBarComponent = createSafeLazyComponent('Bar');
const LazyPieChartComponent = createSafeLazyComponent('PieChart');
const LazyPieComponent = createSafeLazyComponent('Pie');
const LazyCellComponent = createSafeLazyComponent('Cell');
const LazyXAxisComponent = createSafeLazyComponent('XAxis');
const LazyYAxisComponent = createSafeLazyComponent('YAxis');
const LazyCartesianGridComponent = createSafeLazyComponent('CartesianGrid');
const LazyTooltipComponent = createSafeLazyComponent('Tooltip');
const LazyLegendComponent = createSafeLazyComponent('Legend');
const LazyResponsiveContainerComponent = createSafeLazyComponent('ResponsiveContainer');

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
