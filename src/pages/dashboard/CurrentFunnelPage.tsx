/**
 * 🎯 FUNIL ATUAL - PÁGINA ISOLADA
 * 
 * Exibe APENAS o funil em produção (Quiz de Estilo Pessoal - Gisele Galvão)
 * Oculta todos os outros templates e modelos
 * 
 * Funcionalidades:
 * - Visualização do funil atual em produção
 * - Acesso direto ao editor
 * - Métricas do funil atual
 * - Preview do quiz
 * - Link para publicação
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Play,
    Edit,
    Eye,
    BarChart3,
    Users,
    TrendingUp,
    Target,
    CheckCircle,
    ExternalLink,
    Zap,
    Award,
    Clock,
    GitBranch,
    Settings,
    Layers,
    Info,
    Sparkles
} from 'lucide-react';
import { EnhancedUnifiedDataService } from '@/services/core/EnhancedUnifiedDataService';

// ============================================================================
// CONFIGURAÇÃO DO FUNIL ATUAL
// ============================================================================

const CURRENT_FUNNEL = {
    id: 'quiz-estilo-gisele-galvao',
    name: 'Quiz de Estilo Pessoal',
    slug: 'quiz-estilo',
    description: 'Quiz completo para descobrir o estilo pessoal - Por Gisele Galvão',
    author: 'Gisele Galvão',
    authorRole: 'Consultora de Imagem e Branding Pessoal',
    version: '3.0',
    status: 'published' as const,
    totalSteps: 21,
    lastModified: new Date('2025-10-12'),
    url: '/quiz-estilo',
    editorUrl: '/editor/quiz-estilo-modular',
    previewUrl: '/preview?slug=quiz-estilo',
    structure: {
        intro: 1,             // Etapa 1: Coleta de lead
        mainQuestions: 10,    // Etapas 2-11: Perguntas principais
        transition1: 1,       // Etapa 12: Transição
        strategic: 6,         // Etapas 13-18: Perguntas estratégicas
        transition2: 1,       // Etapa 19: Transição
        result: 1,            // Etapa 20: Resultado
        offer: 1              // Etapa 21: Oferta
    },
    features: [
        '21 etapas otimizadas',
        'Sistema de pontuação por estilo',
        'Resultado personalizado',
        'Oferta R$97 com 78% desconto',
        'Integração com Hotmart',
        'Analytics em tempo real',
        'Responsivo mobile',
        'Templates JSON modulares'
    ],
    colors: {
        primary: '#B89B7A',    // Dourado da marca
        secondary: '#432818',  // Marrom
        background: '#fffaf7', // Creme
        accent: '#a08966'      // Dourado escuro
    }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const CurrentFunnelPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Carregar métricas do funil atual
    useEffect(() => {
        loadCurrentFunnelMetrics();
    }, []);

    const loadCurrentFunnelMetrics = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('📊 Carregando métricas do funil atual...');

            const realTimeMetrics = await EnhancedUnifiedDataService.getRealTimeMetrics();
            const analyticsData = await EnhancedUnifiedDataService.getAdvancedAnalytics({
                funnel: CURRENT_FUNNEL.slug,
                timeRange: '7d'
            });

            setMetrics({
                realTime: realTimeMetrics,
                analytics: analyticsData
            });

            console.log('✅ Métricas carregadas:', { realTimeMetrics, analyticsData });
        } catch (err) {
            console.error('❌ Erro ao carregar métricas:', err);
            setError('Não foi possível carregar as métricas. Usando dados demo.');

            // Fallback com dados demo
            setMetrics({
                realTime: {
                    activeUsers: 23,
                    conversionRate: 68,
                    totalRevenue: 12450
                },
                analytics: {
                    views: 1847,
                    completions: 1256,
                    conversionRate: 68
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handlers
    const handleOpenQuiz = () => {
        window.open(CURRENT_FUNNEL.url, '_blank');
    };

    const handleEditFunnel = () => {
        window.open(CURRENT_FUNNEL.editorUrl, '_blank');
    };

    const handlePreview = () => {
        window.open(CURRENT_FUNNEL.previewUrl, '_blank');
    };

    const handleViewAnalytics = () => {
        window.open(`/admin/analytics?funnel=${CURRENT_FUNNEL.slug}`, '_blank');
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header com Status */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold text-gray-900">
                            {CURRENT_FUNNEL.name}
                        </h2>
                        <Badge className="bg-green-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Em Produção
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            v{CURRENT_FUNNEL.version}
                        </Badge>
                    </div>
                    <p className="text-gray-600">{CURRENT_FUNNEL.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Award className="w-4 h-4" />
                        <span>{CURRENT_FUNNEL.author} - {CURRENT_FUNNEL.authorRole}</span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleOpenQuiz} variant="default" size="lg">
                        <Play className="w-4 h-4 mr-2" />
                        Ver Quiz Publicado
                    </Button>
                    <Button onClick={handleEditFunnel} variant="outline" size="lg">
                        <Edit className="w-4 h-4 mr-2" />
                        Editar no Editor
                    </Button>
                </div>
            </div>

            {/* Alerta de Erro (se houver) */}
            {error && (
                <Alert variant="destructive">
                    <Info className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            <Badge variant="outline" className="text-xs">Hoje</Badge>
                        </div>
                        <div className="text-3xl font-bold text-blue-700">
                            {metrics?.realTime?.activeUsers || 0}
                        </div>
                        <p className="text-sm text-blue-600">Usuários Ativos</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Target className="w-6 h-6 text-green-600" />
                            <Badge variant="outline" className="text-xs">7 dias</Badge>
                        </div>
                        <div className="text-3xl font-bold text-green-700">
                            {metrics?.realTime?.conversionRate || 0}%
                        </div>
                        <p className="text-sm text-green-600">Taxa Conversão</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="w-6 h-6 text-purple-600" />
                            <Badge variant="outline" className="text-xs">Total</Badge>
                        </div>
                        <div className="text-3xl font-bold text-purple-700">
                            {metrics?.analytics?.views || 0}
                        </div>
                        <p className="text-sm text-purple-600">Visualizações</p>
                    </CardContent>
                </Card>

                <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                            <Badge variant="outline" className="text-xs">Concluídos</Badge>
                        </div>
                        <div className="text-3xl font-bold text-orange-700">
                            {metrics?.analytics?.completions || 0}
                        </div>
                        <p className="text-sm text-orange-600">Completaram</p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs com Detalhes */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="structure">Estrutura</TabsTrigger>
                    <TabsTrigger value="actions">Ações</TabsTrigger>
                </TabsList>

                {/* Tab: Visão Geral */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Card de Informações */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="w-5 h-5" />
                                    Informações do Funil
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID:</span>
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                        {CURRENT_FUNNEL.id}
                                    </code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Slug:</span>
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                        {CURRENT_FUNNEL.slug}
                                    </code>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total de Etapas:</span>
                                    <Badge>{CURRENT_FUNNEL.totalSteps} etapas</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Última Modificação:</span>
                                    <span className="text-sm">
                                        {CURRENT_FUNNEL.lastModified.toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <Badge className="bg-green-500 text-white">
                                        {CURRENT_FUNNEL.status === 'published' ? 'Publicado' : 'Rascunho'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Card de Recursos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Recursos Implementados
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {CURRENT_FUNNEL.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Paleta de Cores */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="w-5 h-5" />
                                Identidade Visual
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <div
                                        className="h-16 rounded-lg border-2 border-gray-300"
                                        style={{ backgroundColor: CURRENT_FUNNEL.colors.primary }}
                                    ></div>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-700">Primária</p>
                                        <code className="text-xs text-gray-500">
                                            {CURRENT_FUNNEL.colors.primary}
                                        </code>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div
                                        className="h-16 rounded-lg border-2 border-gray-300"
                                        style={{ backgroundColor: CURRENT_FUNNEL.colors.secondary }}
                                    ></div>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-700">Secundária</p>
                                        <code className="text-xs text-gray-500">
                                            {CURRENT_FUNNEL.colors.secondary}
                                        </code>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div
                                        className="h-16 rounded-lg border-2 border-gray-300"
                                        style={{ backgroundColor: CURRENT_FUNNEL.colors.background }}
                                    ></div>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-700">Fundo</p>
                                        <code className="text-xs text-gray-500">
                                            {CURRENT_FUNNEL.colors.background}
                                        </code>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div
                                        className="h-16 rounded-lg border-2 border-gray-300"
                                        style={{ backgroundColor: CURRENT_FUNNEL.colors.accent }}
                                    ></div>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold text-gray-700">Acento</p>
                                        <code className="text-xs text-gray-500">
                                            {CURRENT_FUNNEL.colors.accent}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Estrutura */}
                <TabsContent value="structure" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GitBranch className="w-5 h-5" />
                                Estrutura das 21 Etapas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {Object.entries(CURRENT_FUNNEL.structure).map(([key, count], index) => {
                                    const labels: Record<string, { title: string; desc: string; icon: any }> = {
                                        intro: { title: 'Introdução', desc: 'Coleta de lead (nome + email)', icon: Users },
                                        mainQuestions: { title: 'Perguntas Principais', desc: 'Sistema de pontuação por estilo', icon: Target },
                                        transition1: { title: 'Transição 1', desc: 'Preparação para próxima fase', icon: Zap },
                                        strategic: { title: 'Perguntas Estratégicas', desc: 'Refinamento e qualificação', icon: Award },
                                        transition2: { title: 'Transição 2', desc: 'Preparação para resultado', icon: Zap },
                                        result: { title: 'Resultado', desc: 'Estilo personalizado descoberto', icon: Sparkles },
                                        offer: { title: 'Oferta', desc: 'Método 5 Passos - R$97', icon: TrendingUp }
                                    };

                                    const info = labels[key];
                                    const Icon = info.icon;

                                    return (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="font-semibold text-gray-900">{info.title}</p>
                                                    <p className="text-sm text-gray-600">{info.desc}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-sm">
                                                {count} {count === 1 ? 'etapa' : 'etapas'}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <strong>Total:</strong> {CURRENT_FUNNEL.totalSteps} etapas otimizadas para máxima conversão
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab: Ações */}
                <TabsContent value="actions" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Card de Ações Rápidas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    Ações Rápidas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={handleOpenQuiz} className="w-full justify-start" variant="outline">
                                    <Play className="w-4 h-4 mr-2" />
                                    Abrir Quiz Publicado
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                                <Button onClick={handlePreview} className="w-full justify-start" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Visualizar Preview
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                                <Button onClick={handleEditFunnel} className="w-full justify-start" variant="outline">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar no Editor Visual
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                                <Button onClick={handleViewAnalytics} className="w-full justify-start" variant="outline">
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Ver Analytics Completo
                                    <ExternalLink className="w-3 h-3 ml-auto" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Card de Links Úteis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLink className="w-5 h-5" />
                                    Links Úteis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-700 mb-1">URL Publicada:</p>
                                    <a
                                        href={CURRENT_FUNNEL.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {window.location.origin}{CURRENT_FUNNEL.url}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-1">Editor Visual:</p>
                                    <a
                                        href={CURRENT_FUNNEL.editorUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {window.location.origin}{CURRENT_FUNNEL.editorUrl}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-1">Preview:</p>
                                    <a
                                        href={CURRENT_FUNNEL.previewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        {window.location.origin}{CURRENT_FUNNEL.previewUrl}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informações Técnicas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="w-5 h-5" />
                                Informações Técnicas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Template Base:</p>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded block">
                                        quiz-estilo-21-steps
                                    </code>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Sistema de Pontuação:</p>
                                    <Badge variant="outline">8 estilos</Badge>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Integração:</p>
                                    <Badge variant="outline">Hotmart</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CurrentFunnelPage;
