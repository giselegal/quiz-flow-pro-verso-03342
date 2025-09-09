/**
 * 🎯 GRÁFICOS AVANÇADOS DE ANALYTICS
 * 
 * Funil de conversão, heatmaps e análises de jornada do usuário
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine
} from 'recharts';
import {
    TrendingDown,
    AlertTriangle,
    Clock,
    Target,
    Users,
    Zap
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface FunnelStep {
    step: number;
    name: string;
    participants: number;
    percentage: number;
    dropoff: number;
    dropoffPercentage: number;
    averageTime: number;
    difficulty: 'easy' | 'medium' | 'hard' | 'critical';
}

interface HeatmapData {
    step: number;
    name: string;
    avgResponseTime: number;
    abandonmentRate: number;
    retryRate: number;
    difficulty: number; // 0-100
    color: string;
}

interface AdvancedAnalyticsProps {
    filters?: {
        dateRange: string;
        deviceType: string;
        status: string;
    };
}

// ============================================================================
// CONSTANTES
// ============================================================================

const STEP_NAMES = {
    1: 'Boas-vindas',
    2: 'Cor Favorita',
    3: 'Estilo Atual',
    4: 'Ocasião Especial',
    5: 'Inspiração',
    6: 'Silhueta',
    7: 'Tecidos',
    8: 'Acessórios',
    9: 'Maquiagem',
    10: 'Cabelo',
    11: 'Personalidade',
    12: 'Lifestyle',
    13: 'Trabalho',
    14: 'Lazer',
    15: 'Orçamento',
    16: 'Compras',
    17: 'Influências',
    18: 'Tendências',
    19: 'Sustentabilidade',
    20: 'Futuro',
    21: 'Finalização'
};

const DIFFICULTY_COLORS = {
    easy: '#10b981',    // Verde
    medium: '#f59e0b',  // Amarelo
    hard: '#ef4444',    // Vermelho
    critical: '#7c2d12' // Vermelho escuro
};

// ============================================================================
// COMPONENTES
// ============================================================================

const CustomFunnelTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-2">
                    Etapa {data.step}: {data.name}
                </h3>
                <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Participantes:</span> {data.participants}</p>
                    <p><span className="font-medium">Taxa:</span> {data.percentage.toFixed(1)}%</p>
                    <p><span className="font-medium text-red-600">Saíram:</span> {data.dropoff}</p>
                    <p><span className="font-medium">Tempo médio:</span> {data.averageTime}s</p>
                </div>
            </div>
        );
    }
    return null;
};

const HeatmapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[220px]">
                <h3 className="font-semibold text-gray-800 mb-2">
                    Etapa {data.step}: {data.name}
                </h3>
                <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Tempo médio:</span> {data.avgResponseTime}s</p>
                    <p><span className="font-medium">Taxa abandono:</span> {data.abandonmentRate.toFixed(1)}%</p>
                    <p><span className="font-medium">Dificuldade:</span> {data.difficulty}/100</p>
                    <div className="flex items-center gap-2 mt-2">
                        <div 
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: data.color }}
                        ></div>
                        <span className="text-xs">
                            {data.difficulty > 75 ? 'Crítico' : 
                             data.difficulty > 50 ? 'Difícil' : 
                             data.difficulty > 25 ? 'Médio' : 'Fácil'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ filters = {} }) => {
    const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
    const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
    const [loading, setLoading] = useState(true);

    // ========================================================================
    // FETCH DE DADOS
    // ========================================================================

    const fetchAdvancedData = async () => {
        try {
            setLoading(true);

            // Buscar todas as sessões
            const { data: sessions, error: sessionsError } = await supabase
                .from('quiz_sessions')
                .select('*');

            if (sessionsError) {
                console.error('Erro ao buscar sessões:', sessionsError);
                return;
            }

            // Buscar todas as respostas por etapa
            const { data: responses, error: responsesError } = await supabase
                .from('quiz_step_responses')
                .select('*');

            if (responsesError) {
                console.error('Erro ao buscar respostas:', responsesError);
            }

            // Processar dados do funil
            const processedFunnel = processFunnelData(sessions || []);
            setFunnelData(processedFunnel);

            // Processar dados do heatmap
            const processedHeatmap = processHeatmapData(sessions || [], responses || []);
            setHeatmapData(processedHeatmap);

        } catch (error) {
            console.error('Erro ao buscar dados avançados:', error);
        } finally {
            setLoading(false);
        }
    };

    const processFunnelData = (sessions: any[]): FunnelStep[] => {
        const totalParticipants = sessions.length;
        if (totalParticipants === 0) return [];

        const stepData: FunnelStep[] = [];
        
        for (let step = 1; step <= 21; step++) {
            // Contar participantes que chegaram até esta etapa
            const participantsAtStep = sessions.filter(s => s.current_step >= step).length;
            
            // Contar participantes que saíram nesta etapa
            const dropoffAtStep = sessions.filter(s => 
                s.current_step === step && s.status === 'abandoned'
            ).length;

            // Calcular tempo médio para esta etapa
            const stepSessions = sessions.filter(s => s.current_step >= step);
            const averageTime = stepSessions.length > 0 
                ? stepSessions.reduce((acc, s) => acc + (s.metadata?.time_spent || 0), 0) / stepSessions.length / step
                : 0;

            // Determinar dificuldade baseada em abandono e tempo
            const abandonmentRate = participantsAtStep > 0 ? (dropoffAtStep / participantsAtStep) * 100 : 0;
            let difficulty: FunnelStep['difficulty'] = 'easy';
            
            if (abandonmentRate > 15 || averageTime > 60) difficulty = 'critical';
            else if (abandonmentRate > 10 || averageTime > 45) difficulty = 'hard';
            else if (abandonmentRate > 5 || averageTime > 30) difficulty = 'medium';

            stepData.push({
                step,
                name: STEP_NAMES[step as keyof typeof STEP_NAMES] || `Etapa ${step}`,
                participants: participantsAtStep,
                percentage: (participantsAtStep / totalParticipants) * 100,
                dropoff: dropoffAtStep,
                dropoffPercentage: abandonmentRate,
                averageTime: Math.round(averageTime),
                difficulty
            });
        }

        return stepData;
    };

    const processHeatmapData = (sessions: any[], responses: any[]): HeatmapData[] => {
        const heatmapData: HeatmapData[] = [];

        for (let step = 1; step <= 21; step++) {
            const stepResponses = responses.filter(r => r.step_number === step);
            const stepSessions = sessions.filter(s => s.current_step >= step);

            // Tempo médio de resposta
            const avgResponseTime = stepResponses.length > 0
                ? stepResponses.reduce((acc, r) => acc + (r.response_time_ms || 0), 0) / stepResponses.length / 1000
                : 0;

            // Taxa de abandono nesta etapa
            const abandonedAtStep = sessions.filter(s => 
                s.current_step === step && s.status === 'abandoned'
            ).length;
            const abandonmentRate = stepSessions.length > 0 
                ? (abandonedAtStep / stepSessions.length) * 100 
                : 0;

            // Taxa de retry (aproximada baseada em tempo excessivo)
            const retryRate = stepResponses.filter(r => 
                (r.response_time_ms || 0) > 60000 // Mais de 1 minuto
            ).length / Math.max(stepResponses.length, 1) * 100;

            // Calcular dificuldade (0-100)
            const difficulty = Math.min(100, Math.round(
                (avgResponseTime / 2) + // Tempo contribui até 50 pontos
                (abandonmentRate * 2) + // Abandono contribui até 50 pontos  
                (retryRate / 2) // Retry contribui até 50 pontos
            ));

            // Determinar cor baseada na dificuldade
            let color = DIFFICULTY_COLORS.easy;
            if (difficulty > 75) color = DIFFICULTY_COLORS.critical;
            else if (difficulty > 50) color = DIFFICULTY_COLORS.hard;
            else if (difficulty > 25) color = DIFFICULTY_COLORS.medium;

            heatmapData.push({
                step,
                name: STEP_NAMES[step as keyof typeof STEP_NAMES] || `Etapa ${step}`,
                avgResponseTime: Math.round(avgResponseTime),
                abandonmentRate,
                retryRate,
                difficulty,
                color
            });
        }

        return heatmapData;
    };

    useEffect(() => {
        fetchAdvancedData();
    }, [filters]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-80 bg-gray-200 rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Calcular estatísticas do funil
    const totalDropoff = funnelData.reduce((acc, step) => acc + step.dropoff, 0);
    const criticalSteps = funnelData.filter(step => step.difficulty === 'critical');
    const biggestDropoff = funnelData.reduce((max, step) => 
        step.dropoff > max.dropoff ? step : max, funnelData[0] || { dropoff: 0 }
    );

    return (
        <div className="space-y-6">
            {/* ESTATÍSTICAS DO FUNIL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-red-800">Total de Saídas</p>
                                <p className="text-2xl font-bold text-red-600">{totalDropoff}</p>
                                <p className="text-xs text-red-600">Participantes que abandonaram</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-orange-800">Etapas Críticas</p>
                                <p className="text-2xl font-bold text-orange-600">{criticalSteps.length}</p>
                                <p className="text-xs text-orange-600">Precisam de atenção</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Target className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">Maior Gargalo</p>
                                <p className="text-2xl font-bold text-blue-600">Etapa {biggestDropoff?.step}</p>
                                <p className="text-xs text-blue-600">{biggestDropoff?.dropoff} saídas</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* GRÁFICOS AVANÇADOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* FUNIL DE CONVERSÃO */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5" />
                            Funil de Conversão por Etapa
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Visualize exatamente onde os usuários abandonam o quiz
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="step" 
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomFunnelTooltip />} />
                                <Bar dataKey="participants" name="Participantes">
                                    {funnelData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={DIFFICULTY_COLORS[entry.difficulty]}
                                        />
                                    ))}
                                </Bar>
                                <ReferenceLine 
                                    y={funnelData[0]?.participants * 0.7} 
                                    stroke="#10b981" 
                                    strokeDasharray="5 5"
                                    label="Meta 70%"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        
                        {/* LEGENDA DE DIFICULDADE */}
                        <div className="flex flex-wrap gap-4 mt-4 justify-center">
                            {Object.entries(DIFFICULTY_COLORS).map(([difficulty, color]) => (
                                <div key={difficulty} className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    <span className="text-xs capitalize">
                                        {difficulty === 'easy' ? 'Fácil' : 
                                         difficulty === 'medium' ? 'Médio' : 
                                         difficulty === 'hard' ? 'Difícil' : 'Crítico'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* HEATMAP DE DIFICULDADE */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Heatmap de Dificuldade por Etapa
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            Identifique as etapas mais desafiadoras baseado em tempo e abandono
                        </p>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={heatmapData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="step" 
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<HeatmapTooltip />} />
                                <Bar dataKey="difficulty" name="Dificuldade">
                                    {heatmapData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                                <ReferenceLine 
                                    y={50} 
                                    stroke="#f59e0b" 
                                    strokeDasharray="5 5"
                                    label="Limite Aceitável"
                                />
                            </BarChart>
                        </ResponsiveContainer>

                        {/* ETAPAS MAIS CRÍTICAS */}
                        <div className="mt-4">
                            <h4 className="font-medium text-gray-800 mb-2">🚨 Etapas que precisam de atenção:</h4>
                            <div className="flex flex-wrap gap-2">
                                {heatmapData
                                    .filter(step => step.difficulty > 60)
                                    .sort((a, b) => b.difficulty - a.difficulty)
                                    .slice(0, 5)
                                    .map(step => (
                                        <Badge 
                                            key={step.step} 
                                            variant="destructive"
                                            className="text-xs"
                                        >
                                            Etapa {step.step}: {step.name} ({step.difficulty}/100)
                                        </Badge>
                                    ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* INSIGHTS E RECOMENDAÇÕES */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-blue-600" />
                        Insights e Recomendações
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold text-blue-800 mb-2">🎯 Pontos Críticos Identificados:</h4>
                            <ul className="space-y-2 text-sm text-blue-700">
                                {criticalSteps.slice(0, 3).map(step => (
                                    <li key={step.step} className="flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>Etapa {step.step}</strong> ({step.name}): 
                                            {step.dropoff} abandonos ({step.dropoffPercentage.toFixed(1)}%)
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h4 className="font-semibold text-purple-800 mb-2">💡 Recomendações:</h4>
                            <ul className="space-y-2 text-sm text-purple-700">
                                <li className="flex items-start gap-2">
                                    <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Simplifique as etapas com maior abandono</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Adicione dicas nas etapas com maior tempo de resposta</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Users className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Considere A/B testing nas etapas críticas</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdvancedAnalytics;
