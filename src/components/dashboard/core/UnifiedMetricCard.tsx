/**
 * 🎯 UNIFIED METRIC CARD
 * 
 * Componente unificado que substitui as 12+ versões diferentes de MetricCard
 * Baseado nas melhores práticas dos dashboards existentes
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

export interface UnifiedMetricCardProps {
    title: string;
    value: string | number;
    change?: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
    };
    icon: React.ReactNode;
    className?: string;
    color?: 'green' | 'blue' | 'brand' | 'orange' | 'red';
}

export const UnifiedMetricCard: React.FC<UnifiedMetricCardProps> = ({
    title,
    value,
    change,
    icon,
    className,
    color = 'blue'
}) => {
    const colorClasses = {
        green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100',
        blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100',
        brand: 'border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100',
        orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100',
        red: 'border-red-200 bg-gradient-to-br from-red-50 to-red-100'
    };

    return (
        <Card className={cn(
            "transition-all hover:shadow-md border-2",
            colorClasses[color],
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                <div className="text-gray-400">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {change && (
                    <div className={cn(
                        "flex items-center text-xs mt-1",
                        change.trend === 'up' && "text-green-600",
                        change.trend === 'down' && "text-red-600",
                        change.trend === 'neutral' && "text-gray-600"
                    )}>
                        {change.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-1" />}
                        {change.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {change.value}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Grid component para organizar as métricas
export interface UnifiedMetricsGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    className?: string;
}

export const UnifiedMetricsGrid: React.FC<UnifiedMetricsGridProps> = ({
    children,
    columns = 4,
    className
}) => {
    const gridClasses = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <div className={cn(
            "grid gap-6",
            gridClasses[columns],
            className
        )}>
            {children}
        </div>
    );
};