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
        green: 'border-[#687ef7]/30 bg-gradient-to-br from-white to-[#687ef7]/5 shadow-lg hover:shadow-2xl hover:shadow-[#687ef7]/20 transition-all',
        blue: 'border-[#d85dfb]/30 bg-gradient-to-br from-white to-[#d85dfb]/5 shadow-lg hover:shadow-2xl hover:shadow-[#d85dfb]/20 transition-all',
        brand: 'border-[#432818]/20 bg-gradient-to-br from-[#FFE8D6] to-white shadow-lg hover:shadow-xl transition-all',
        orange: 'border-[#8F7A6A]/30 bg-gradient-to-br from-[#FFE8D6]/50 to-white shadow-md hover:shadow-lg transition-all',
        red: 'border-red-400/30 bg-gradient-to-br from-white to-red-50/30 shadow-lg hover:shadow-xl transition-all'
    };

    return (
        <Card className={cn(
            "transition-all hover:shadow-md border-2",
            colorClasses[color],
            className
        )}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#8F7A6A]">{title}</CardTitle>
                <div className="text-[#687ef7]">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-[#432818]">{value}</div>
                {change && (
                    <div className={cn(
                        "flex items-center text-sm mt-2 font-medium",
                        change.trend === 'up' && "text-[#687ef7]",
                        change.trend === 'down' && "text-red-500",
                        change.trend === 'neutral' && "text-[#8F7A6A]"
                    )}>
                        {change.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                        {change.trend === 'down' && <ArrowDownRight className="w-4 h-4 mr-1" />}
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