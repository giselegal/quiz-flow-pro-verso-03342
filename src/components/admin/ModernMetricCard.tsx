/**
 * 🎨 MODERN METRIC CARD
 * 
 * Componente de card de métrica com design moderno e profissional
 * Usado no dashboard unificado
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernMetricCardProps {
    title: string;
    value: string | number;
    change?: {
        value: string;
        trend: 'up' | 'down' | 'neutral';
    };
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    className?: string;
}

const colorVariants = {
    blue: {
        gradient: 'from-blue-50 to-blue-100/50',
        border: 'border-blue-200/50',
        iconBg: 'bg-blue-200',
        iconColor: 'text-blue-700',
        titleColor: 'text-blue-800',
        valueColor: 'text-blue-900',
    },
    green: {
        gradient: 'from-green-50 to-green-100/50',
        border: 'border-green-200/50',
        iconBg: 'bg-green-200',
        iconColor: 'text-green-700',
        titleColor: 'text-green-800',
        valueColor: 'text-green-900',
    },
    purple: {
        gradient: 'from-purple-50 to-purple-100/50',
        border: 'border-purple-200/50',
        iconBg: 'bg-purple-200',
        iconColor: 'text-purple-700',
        titleColor: 'text-purple-800',
        valueColor: 'text-purple-900',
    },
    orange: {
        gradient: 'from-orange-50 to-orange-100/50',
        border: 'border-orange-200/50',
        iconBg: 'bg-orange-200',
        iconColor: 'text-orange-700',
        titleColor: 'text-orange-800',
        valueColor: 'text-orange-900',
    },
    red: {
        gradient: 'from-red-50 to-red-100/50',
        border: 'border-red-200/50',
        iconBg: 'bg-red-200',
        iconColor: 'text-red-700',
        titleColor: 'text-red-800',
        valueColor: 'text-red-900',
    },
};

const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
};

const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
};

export function ModernMetricCard({
    title,
    value,
    change,
    icon,
    color,
    className = '',
}: ModernMetricCardProps) {
    const colorVariant = colorVariants[color];

    return (
        <Card
            className={cn(
                'p-6 rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-xl transition-all duration-300 border backdrop-blur-sm',
                colorVariant.gradient,
                colorVariant.border,
                className
            )}
        >
            <CardContent className="p-0">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                        <p className={cn('text-sm font-medium mb-2', colorVariant.titleColor)}>
                            {title}
                        </p>
                        <p className={cn('text-2xl font-bold', colorVariant.valueColor)}>
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </p>
                    </div>

                    <div
                        className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center shadow-sm',
                            colorVariant.iconBg
                        )}
                    >
                        <div className={colorVariant.iconColor}>
                            {icon}
                        </div>
                    </div>
                </div>

                {change && (
                    <div className="flex items-center gap-1">
                        <span className={cn('text-sm font-medium', trendColors[change.trend])}>
                            {trendIcons[change.trend]} {change.value}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ModernMetricCard;