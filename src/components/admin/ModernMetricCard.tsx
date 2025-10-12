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
        gradient: 'from-white to-[#687ef7]/5',
        border: 'border-[#687ef7]/30',
        iconBg: 'bg-gradient-to-br from-[#687ef7]/20 to-[#d85dfb]/20',
        iconColor: 'text-[#687ef7]',
        titleColor: 'text-[#8F7A6A]',
        valueColor: 'text-[#432818]',
    },
    green: {
        gradient: 'from-white to-[#687ef7]/5',
        border: 'border-[#687ef7]/30',
        iconBg: 'bg-gradient-to-br from-[#687ef7]/20 to-[#d85dfb]/20',
        iconColor: 'text-[#687ef7]',
        titleColor: 'text-[#8F7A6A]',
        valueColor: 'text-[#432818]',
    },
    purple: {
        gradient: 'from-white to-[#d85dfb]/5',
        border: 'border-[#d85dfb]/30',
        iconBg: 'bg-gradient-to-br from-[#d85dfb]/20 to-[#687ef7]/20',
        iconColor: 'text-[#d85dfb]',
        titleColor: 'text-[#8F7A6A]',
        valueColor: 'text-[#432818]',
    },
    orange: {
        gradient: 'from-[#FFE8D6]/50 to-white',
        border: 'border-[#8F7A6A]/30',
        iconBg: 'bg-gradient-to-br from-[#8F7A6A]/20 to-[#432818]/10',
        iconColor: 'text-[#432818]',
        titleColor: 'text-[#8F7A6A]',
        valueColor: 'text-[#432818]',
    },
    red: {
        gradient: 'from-white to-red-50/30',
        border: 'border-red-400/30',
        iconBg: 'bg-gradient-to-br from-red-400/20 to-red-500/20',
        iconColor: 'text-red-500',
        titleColor: 'text-[#8F7A6A]',
        valueColor: 'text-[#432818]',
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
                'p-6 rounded-2xl bg-gradient-to-br shadow-lg hover:shadow-2xl transition-all duration-300 border backdrop-blur-sm',
                colorVariant.gradient,
                colorVariant.border,
                color === 'blue' && 'hover:shadow-[#687ef7]/20',
                color === 'purple' && 'hover:shadow-[#d85dfb]/20',
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
                            'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg',
                            colorVariant.iconBg
                        )}
                    >
                        <div className={colorVariant.iconColor}>
                            {icon}
                        </div>
                    </div>
                </div>

                {change && (
                    <div className="flex items-center gap-1 mt-1">
                        <span className={cn('text-sm font-semibold', trendColors[change.trend])}>
                            {trendIcons[change.trend]} {change.value}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default ModernMetricCard;