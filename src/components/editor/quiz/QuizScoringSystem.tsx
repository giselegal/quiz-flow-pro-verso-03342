/**
 * 🎯 QUIZ SCORING SYSTEM VISUAL - FASE 2
 * 
 * Interface visual para configurar pontuação e feedback das questões,
 * permitindo mapear respostas para estilos e definir pesos.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Target, Crown, Heart, Brain, Palette, Users, Zap, Star,
    BarChart3, Settings, Plus, Minus, Check, AlertCircle
} from 'lucide-react';

import { QuizQuestion, QuizAnswer, QuizStyle } from '@/types/quiz';

interface QuizScoringSystemProps {
    question: QuizQuestion;
    styles: QuizStyle[];
    onQuestionChange: (question: QuizQuestion) => void;
    onStylesChange: (styles: QuizStyle[]) => void;
    className?: string;
}

interface StylePoint {
    styleId: string;
    points: number;
}

interface ScoringMatrix {
    [answerId: string]: StylePoint[];
}

const DEFAULT_STYLES: QuizStyle[] = [
    {
        id: 'classic',
        name: 'Clássico',
        icon: Crown,
        description: 'Elegante e atemporal',
        characteristics: ['Refinado', 'Sofisticado', 'Tradicional'],
        color: '#8B5CF6'
    },
    {
        id: 'creative',
        name: 'Criativo',
        icon: Palette,
        description: 'Expressivo e artístico',
        characteristics: ['Inovador', 'Expressivo', 'Original'],
        color: '#F59E0B'
    },
    {
        id: 'minimal',
        name: 'Minimalista',
        icon: Zap,
        description: 'Limpo e funcional',
        characteristics: ['Simples', 'Funcional', 'Moderno'],
        color: '#10B981'
    },
    {
        id: 'romantic',
        name: 'Romântico',
        icon: Heart,
        description: 'Delicado e feminino',
        characteristics: ['Suave', 'Delicado', 'Acolhedor'],
        color: '#EF4444'
    },
    {
        id: 'bold',
        name: 'Arrojado',
        icon: Target,
        description: 'Ousado e marcante',
        characteristics: ['Ousado', 'Marcante', 'Confiante'],
        color: '#8B5CF6'
    },
    {
        id: 'social',
        name: 'Social',
        icon: Users,
        description: 'Conectado e extrovertido',
        characteristics: ['Conectado', 'Extrovertido', 'Colaborativo'],
        color: '#3B82F6'
    },
    {
        id: 'analytical',
        name: 'Analítico',
        icon: Brain,
        description: 'Lógico e estruturado',
        characteristics: ['Lógico', 'Estruturado', 'Preciso'],
        color: '#6B7280'
    },
    {
        id: 'premium',
        name: 'Premium',
        icon: Star,
        description: 'Luxuoso e exclusivo',
        characteristics: ['Luxuoso', 'Exclusivo', 'Refinado'],
        color: '#F59E0B'
    }
];

const QuizScoringSystem: React.FC<QuizScoringSystemProps> = ({
    question,
    styles = DEFAULT_STYLES,
    onQuestionChange,
    onStylesChange,
    className = ''
}) => {
    const [activeTab, setActiveTab] = useState('scoring');
    const [scoringMatrix, setScoringMatrix] = useState<ScoringMatrix>({});

    // Inicializar matriz de pontuação
    useEffect(() => {
        if (!question.answers?.length) return;

        const matrix: ScoringMatrix = {};
        question.answers.forEach(answer => {
            matrix[answer.id] = styles.map(style => ({
                styleId: style.id,
                points: answer.stylePoints?.[style.id] || 0
            }));
        });

        setScoringMatrix(matrix);
    }, [question.answers, styles]);

    // Atualizar pontuação de uma resposta para um estilo
    const handleScoreChange = useCallback((answerId: string, styleId: string, points: number) => {
        setScoringMatrix(prev => {
            const updated = { ...prev };
            if (!updated[answerId]) {
                updated[answerId] = styles.map(style => ({
                    styleId: style.id,
                    points: style.id === styleId ? points : 0
                }));
            } else {
                updated[answerId] = updated[answerId].map(sp =>
                    sp.styleId === styleId ? { ...sp, points } : sp
                );
            }
            return updated;
        });

        // Atualizar a questão
        const updatedAnswers = question.answers?.map(answer => {
            if (answer.id === answerId) {
                const newStylePoints = { ...answer.stylePoints, [styleId]: points };
                return { ...answer, stylePoints: newStylePoints };
            }
            return answer;
        }) || [];

        onQuestionChange({ ...question, answers: updatedAnswers });
    }, [question, styles, onQuestionChange]);

    // Distribuir pontos automaticamente
    const handleAutoDistribute = useCallback((answerId: string) => {
        const answer = question.answers?.find(a => a.id === answerId);
        if (!answer) return;

        // Distribuição baseada no texto da resposta
        const distributions: Record<string, Record<string, number>> = {
            'classic': { classic: 5, premium: 3, analytical: 2 },
            'creative': { creative: 5, bold: 3, social: 2 },
            'minimal': { minimal: 5, analytical: 3, classic: 2 },
            'romantic': { romantic: 5, social: 3, creative: 2 },
            'bold': { bold: 5, creative: 3, social: 2 },
            'social': { social: 5, romantic: 3, bold: 2 },
            'analytical': { analytical: 5, minimal: 3, classic: 2 },
            'premium': { premium: 5, classic: 3, bold: 2 }
        };

        // Detectar estilo principal baseado no texto
        const text = answer.text.toLowerCase();
        let primaryStyle = 'classic';

        Object.keys(distributions).forEach(style => {
            if (text.includes(style) || text.includes(styles.find(s => s.id === style)?.name.toLowerCase() || '')) {
                primaryStyle = style;
            }
        });

        // Aplicar distribuição
        const distribution = distributions[primaryStyle] || distributions.classic;
        Object.entries(distribution).forEach(([styleId, points]) => {
            handleScoreChange(answerId, styleId, points);
        });
    }, [question.answers, styles, handleScoreChange]);

    // Calcular totais por estilo
    const getStyleTotals = useCallback(() => {
        const totals: Record<string, number> = {};
        styles.forEach(style => {
            totals[style.id] = Object.values(scoringMatrix).reduce((sum, stylePoints) => {
                const points = stylePoints.find(sp => sp.styleId === style.id)?.points || 0;
                return sum + points;
            }, 0);
        });
        return totals;
    }, [scoringMatrix, styles]);

    const styleTotals = getStyleTotals();

    return (
        <Card className={`quiz-scoring-system ${className}`}>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Sistema de Pontuação
                    <Badge variant="outline">FASE 2 - Configuração</Badge>
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="scoring">Pontuação</TabsTrigger>
                        <TabsTrigger value="styles">Estilos</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scoring" className="mt-6">
                        <div className="space-y-6">
                            {/* Cabeçalho explicativo */}
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Configure quanto cada resposta contribui para cada estilo.
                                    Valores mais altos indicam maior afinidade com o estilo.
                                </AlertDescription>
                            </Alert>

                            {/* Matriz de pontuação */}
                            <div className="space-y-4">
                                {question.answers?.map((answer, answerIndex) => (
                                    <Card key={answer.id} className="p-4">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-semibold">{answer.text}</h4>
                                                    {answer.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {answer.description}
                                                        </p>
                                                    )}
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleAutoDistribute(answer.id)}
                                                >
                                                    <Zap className="w-4 h-4 mr-2" />
                                                    Auto
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {styles.map(style => {
                                                    const Icon = style.icon;
                                                    const currentPoints = scoringMatrix[answer.id]?.find(sp => sp.styleId === style.id)?.points || 0;

                                                    return (
                                                        <div key={style.id} className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <Icon className="w-4 h-4" style={{ color: style.color }} />
                                                                <Label className="text-sm">{style.name}</Label>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Slider
                                                                    value={[currentPoints]}
                                                                    onValueChange={([value]) => handleScoreChange(answer.id, style.id, value)}
                                                                    max={5}
                                                                    min={0}
                                                                    step={1}
                                                                    className="w-full"
                                                                />

                                                                <div className="flex justify-between text-xs text-muted-foreground">
                                                                    <span>0</span>
                                                                    <span className="font-medium">{currentPoints}</span>
                                                                    <span>5</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Resumo de pontuação */}
                            <Card className="p-4 bg-muted/30">
                                <h4 className="font-semibold mb-3">Distribuição Total por Estilo</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {styles.map(style => {
                                        const Icon = style.icon;
                                        const total = styleTotals[style.id];

                                        return (
                                            <div key={style.id} className="text-center space-y-1">
                                                <Icon className="w-6 h-6 mx-auto" style={{ color: style.color }} />
                                                <div className="text-sm font-medium">{style.name}</div>
                                                <Badge variant={total > 0 ? "default" : "outline"}>
                                                    {total} pts
                                                </Badge>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="styles" className="mt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-semibold">Estilos Disponíveis</h4>
                                <Badge variant="outline">{styles.length} estilos</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {styles.map(style => {
                                    const Icon = style.icon;

                                    return (
                                        <Card key={style.id} className="p-4">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className="p-2 rounded-lg flex-shrink-0"
                                                    style={{ backgroundColor: `${style.color}20` }}
                                                >
                                                    <Icon className="w-5 h-5" style={{ color: style.color }} />
                                                </div>

                                                <div className="flex-1">
                                                    <h5 className="font-semibold">{style.name}</h5>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {style.description}
                                                    </p>

                                                    <div className="flex flex-wrap gap-1">
                                                        {style.characteristics?.map(char => (
                                                            <Badge key={char} variant="outline" className="text-xs">
                                                                {char}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <div className="mt-2 text-xs text-muted-foreground">
                                                        Total: {styleTotals[style.id]} pontos
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview" className="mt-6">
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Simulação de Resultado</h4>

                            <Alert>
                                <Target className="h-4 w-4" />
                                <AlertDescription>
                                    Esta simulação mostra como as respostas são convertidas em estilos.
                                    O estilo com mais pontos será o resultado final.
                                </AlertDescription>
                            </Alert>

                            {/* Simulador de resposta */}
                            <Card className="p-4">
                                <h5 className="font-semibold mb-3">Teste com diferentes respostas:</h5>

                                <div className="space-y-3">
                                    {question.answers?.map(answer => {
                                        const Icon = Target;

                                        return (
                                            <Button
                                                key={answer.id}
                                                variant="outline"
                                                className="w-full justify-start h-auto p-3"
                                            >
                                                <div className="text-left">
                                                    <div className="font-medium">{answer.text}</div>
                                                    <div className="text-sm text-muted-foreground mt-1">
                                                        Pontos: {Object.entries(answer.stylePoints || {})
                                                            .filter(([, points]) => points > 0)
                                                            .map(([styleId, points]) => {
                                                                const style = styles.find(s => s.id === styleId);
                                                                return `${style?.name}: ${points}`;
                                                            })
                                                            .join(', ') || 'Nenhuma pontuação'}
                                                    </div>
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </Card>

                            {/* Ranking de estilos */}
                            <Card className="p-4">
                                <h5 className="font-semibold mb-3">Ranking de Estilos (Total)</h5>

                                <div className="space-y-2">
                                    {styles
                                        .sort((a, b) => styleTotals[b.id] - styleTotals[a.id])
                                        .map((style, index) => {
                                            const Icon = style.icon;
                                            const total = styleTotals[style.id];

                                            return (
                                                <div key={style.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                                                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                                                        {index + 1}
                                                    </Badge>

                                                    <Icon className="w-5 h-5" style={{ color: style.color }} />

                                                    <div className="flex-1">
                                                        <div className="font-medium">{style.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {total} pontos
                                                        </div>
                                                    </div>

                                                    {index === 0 && total > 0 && (
                                                        <Badge variant="default">
                                                            <Crown className="w-3 h-3 mr-1" />
                                                            Vencedor
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default QuizScoringSystem;