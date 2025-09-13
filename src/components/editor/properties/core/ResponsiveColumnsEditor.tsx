import React from 'react';
import { Smartphone, Tablet, Monitor, Grid3x3 } from 'lucide-react';
import ContextualTooltip, { tooltipLibrary } from './ContextualTooltip';
import type { PropertyEditorProps } from './types';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Editor especializado para configurações de colunas responsivas
 * Permite configurar diferentes números de colunas para mobile/tablet/desktop
 */
const ResponsiveColumnsEditor: React.FC<PropertyEditorProps> = ({ property, onChange }) => {
    const responsiveColumns = property.value || { mobile: 1, tablet: 2, desktop: 3 };

    const updateColumns = (breakpoint: string, columns: number) => {
        const newResponsiveColumns = {
            ...responsiveColumns,
            [breakpoint]: columns
        };
        onChange(property.key, newResponsiveColumns);
    };

    const getGridPreview = (columns: number) => {
        const items = Array.from({ length: Math.min(columns * 2, 8) });
        return (
            <div
                className="grid gap-1 w-full h-12 bg-gray-100 p-1 rounded border"
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`
                }}
            >
                {items.map((_, i) => (
                    <div
                        key={i}
                        className="bg-blue-200 rounded-sm flex items-center justify-center text-xs"
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
        );
    };

    const breakpoints = [
        {
            key: 'mobile',
            label: 'Mobile',
            icon: Smartphone,
            description: 'Celulares (< 768px)',
            min: 1,
            max: 2,
            current: responsiveColumns.mobile || 1
        },
        {
            key: 'tablet',
            label: 'Tablet',
            icon: Tablet,
            description: 'Tablets (768px - 1024px)',
            min: 1,
            max: 4,
            current: responsiveColumns.tablet || 2
        },
        {
            key: 'desktop',
            label: 'Desktop',
            icon: Monitor,
            description: 'Desktop (> 1024px)',
            min: 1,
            max: 6,
            current: responsiveColumns.desktop || 3
        }
    ];

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-green-600" />
                    <CardTitle className="text-sm">{property.label}</CardTitle>
                    <ContextualTooltip info={tooltipLibrary.responsiveColumns} compact />
                </div>
                {property.description && (
                    <p className="text-xs text-muted-foreground">{property.description}</p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {breakpoints.map((bp, index) => {
                    const Icon = bp.icon;
                    return (
                        <div key={bp.key} className="space-y-3">
                            {/* Header do breakpoint */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-gray-600" />
                                    <div>
                                        <Label className="text-sm font-medium">{bp.label}</Label>
                                        <p className="text-xs text-muted-foreground">{bp.description}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {bp.current} col{bp.current !== 1 ? 's' : ''}
                                </Badge>
                            </div>

                            {/* Slider de controle */}
                            <div className="space-y-2">
                                <Slider
                                    value={[bp.current]}
                                    onValueChange={([value]) => updateColumns(bp.key, value)}
                                    min={bp.min}
                                    max={bp.max}
                                    step={1}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>{bp.min}</span>
                                    <span>{bp.max}</span>
                                </div>
                            </div>

                            {/* Preview visual */}
                            <div className="space-y-1">
                                <Label className="text-xs text-gray-500">Preview:</Label>
                                {getGridPreview(bp.current)}
                            </div>

                            {/* Separador (não mostrar no último) */}
                            {index < breakpoints.length - 1 && (
                                <div className="border-b border-gray-200 mt-4" />
                            )}
                        </div>
                    );
                })}

                {/* Resumo final */}
                <div className="bg-green-50 p-3 rounded border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                        <Grid3x3 className="w-3 h-3 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Configuração Final:</span>
                    </div>
                    <div className="text-xs text-green-700">
                        <span className="font-mono">
                            Mobile: {responsiveColumns.mobile} |
                            Tablet: {responsiveColumns.tablet} |
                            Desktop: {responsiveColumns.desktop}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ResponsiveColumnsEditor;
