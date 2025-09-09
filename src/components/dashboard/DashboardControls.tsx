/**
 * 🎛️ CONTROLES DO DASHBOARD DE PARTICIPANTES
 * 
 * Componente para controlar visualizações e filtros avançados
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart3,
    Table,
    Filter,
    Calendar,
    Download,
    RefreshCw,
    TrendingUp,
    Eye
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface DashboardControlsProps {
    currentView: 'analytics' | 'table' | 'both';
    onViewChange: (view: 'analytics' | 'table' | 'both') => void;
    onRefresh?: () => void;
    onExport?: () => void;
    analyticsFilters?: {
        dateRange: string;
        deviceType: string;
        status: string;
    };
    onFiltersChange?: (filters: any) => void;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const DashboardControls: React.FC<DashboardControlsProps> = ({
    currentView,
    onViewChange,
    onRefresh,
    onExport,
    analyticsFilters = {
        dateRange: 'all',
        deviceType: 'all',
        status: 'all'
    },
    onFiltersChange
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        if (!onRefresh) return;
        
        setIsRefreshing(true);
        try {
            await onRefresh();
        } finally {
            setIsRefreshing(false);
        }
    };

    const viewOptions = [
        {
            value: 'both',
            label: 'Analytics + Tabela',
            icon: <Eye className="w-4 h-4" />,
            description: 'Visualização completa'
        },
        {
            value: 'analytics',
            label: 'Apenas Analytics',
            icon: <BarChart3 className="w-4 h-4" />,
            description: 'Foco em gráficos'
        },
        {
            value: 'table',
            label: 'Apenas Tabela',
            icon: <Table className="w-4 h-4" />,
            description: 'Foco em dados'
        }
    ];

    const dateRangeOptions = [
        { value: 'all', label: 'Todos os períodos' },
        { value: 'today', label: 'Hoje' },
        { value: 'week', label: 'Última semana' },
        { value: 'month', label: 'Último mês' },
        { value: 'quarter', label: 'Último trimestre' }
    ];

    const deviceOptions = [
        { value: 'all', label: 'Todos os dispositivos' },
        { value: 'mobile', label: 'Mobile' },
        { value: 'tablet', label: 'Tablet' },
        { value: 'desktop', label: 'Desktop' }
    ];

    const statusOptions = [
        { value: 'all', label: 'Todos os status' },
        { value: 'completed', label: 'Completados' },
        { value: 'abandoned', label: 'Abandonados' },
        { value: 'active', label: 'Em andamento' }
    ];

    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* CONTROLES DE VISUALIZAÇÃO */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Visualização:</span>
                        </div>
                        
                        <div className="flex gap-2">
                            {viewOptions.map((option) => (
                                <Button
                                    key={option.value}
                                    variant={currentView === option.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => onViewChange(option.value as any)}
                                    className="flex items-center gap-2"
                                >
                                    {option.icon}
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* AÇÕES RÁPIDAS */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                        </Button>

                        {onExport && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onExport}
                                className="flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Exportar
                            </Button>
                        )}
                    </div>
                </div>

                {/* FILTROS AVANÇADOS */}
                {currentView !== 'table' && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-700">Filtros Analytics:</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* FILTRO DE PERÍODO */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">
                                    📅 Período
                                </label>
                                <Select
                                    value={analyticsFilters.dateRange}
                                    onValueChange={(value) => 
                                        onFiltersChange?.({ ...analyticsFilters, dateRange: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dateRangeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* FILTRO DE DISPOSITIVO */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">
                                    📱 Dispositivo
                                </label>
                                <Select
                                    value={analyticsFilters.deviceType}
                                    onValueChange={(value) => 
                                        onFiltersChange?.({ ...analyticsFilters, deviceType: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar dispositivo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {deviceOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* FILTRO DE STATUS */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-600">
                                    🎯 Status
                                </label>
                                <Select
                                    value={analyticsFilters.status}
                                    onValueChange={(value) => 
                                        onFiltersChange?.({ ...analyticsFilters, status: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecionar status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* INDICADORES DE FILTROS ATIVOS */}
                        <div className="flex flex-wrap gap-2 mt-4">
                            {analyticsFilters.dateRange !== 'all' && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {dateRangeOptions.find(o => o.value === analyticsFilters.dateRange)?.label}
                                </Badge>
                            )}
                            {analyticsFilters.deviceType !== 'all' && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    📱 {deviceOptions.find(o => o.value === analyticsFilters.deviceType)?.label}
                                </Badge>
                            )}
                            {analyticsFilters.status !== 'all' && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                    🎯 {statusOptions.find(o => o.value === analyticsFilters.status)?.label}
                                </Badge>
                            )}
                        </div>
                    </div>
                )}

                {/* DICAS DE USO */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">💡 Dicas de uso:</p>
                            <ul className="text-xs space-y-1 opacity-90">
                                <li>• Use "Analytics + Tabela" para uma visão completa dos dados</li>
                                <li>• Filtre por período para análises temporais específicas</li>
                                <li>• Compare dispositivos para otimizar a experiência mobile</li>
                                <li>• Monitore abandonos para identificar pontos de melhoria</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardControls;
