/**
 * 📊 FUNNEL ANALYTICS DASHBOARD
 * 
 * Centraliza todas as configurações de analytics e monitoramento
 * Implementa separação GESTÃO (painel) vs CRIAÇÃO (editor)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
    BarChart3,
    TrendingUp,
    Target,
    Eye,
    MousePointerClick,
    Users,
    DollarSign,
    Save,
    RefreshCw,
    ExternalLink,
    AlertTriangle,
    CheckCircle2,
    Download,
    Upload
} from 'lucide-react';

interface GoogleAnalyticsConfig {
    enabled: boolean;
    trackingId: string;
    measurementId: string;
    customEvents: string[];
}

interface FacebookPixelConfig {
    enabled: boolean;
    pixelId: string;
    accessToken: string;
    customEvents: string[];
}

interface UtmTrackingConfig {
    enabled: boolean;
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
}

interface ConversionGoal {
    id: string;
    name: string;
    type: 'completion' | 'email' | 'custom';
    value: number;
    description: string;
}

interface AnalyticsConfig {
    googleAnalytics: GoogleAnalyticsConfig;
    facebookPixel: FacebookPixelConfig;
    utmTracking: UtmTrackingConfig;
    conversionGoals: ConversionGoal[];
    heatmapEnabled: boolean;
    sessionRecordingEnabled: boolean;
    lastUpdated: string;
}

interface FunnelAnalyticsDashboardProps {
    className?: string;
    funnelId?: string;
    onConfigUpdate?: (config: AnalyticsConfig) => void;
}

const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
    googleAnalytics: {
        enabled: false,
        trackingId: '',
        measurementId: '',
        customEvents: ['quiz_start', 'quiz_complete', 'email_capture']
    },
    facebookPixel: {
        enabled: false,
        pixelId: '',
        accessToken: '',
        customEvents: ['ViewContent', 'Lead', 'Purchase']
    },
    utmTracking: {
        enabled: true,
        source: 'quiz',
        medium: 'organic',
        campaign: '',
        term: '',
        content: ''
    },
    conversionGoals: [
        {
            id: '1',
            name: 'Quiz Completion',
            type: 'completion',
            value: 100,
            description: 'User completes entire quiz'
        },
        {
            id: '2',
            name: 'Email Capture',
            type: 'email',
            value: 200,
            description: 'User provides email address'
        }
    ],
    heatmapEnabled: false,
    sessionRecordingEnabled: false,
    lastUpdated: new Date().toISOString()
};

const FunnelAnalyticsDashboard: React.FC<FunnelAnalyticsDashboardProps> = ({
    className = '',
    funnelId,
    onConfigUpdate
}) => {
    const [config, setConfig] = useState<AnalyticsConfig>(DEFAULT_ANALYTICS_CONFIG);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Carregar configuração salva
    useEffect(() => {
        const saved = localStorage.getItem(`analytics-config-${funnelId || 'default'}`);
        if (saved) {
            try {
                setConfig(JSON.parse(saved));
            } catch (error) {
                console.warn('Erro ao carregar config analytics:', error);
            }
        }
    }, [funnelId]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedConfig = {
                ...config,
                lastUpdated: new Date().toISOString()
            };

            localStorage.setItem(`analytics-config-${funnelId || 'default'}`, JSON.stringify(updatedConfig));
            setConfig(updatedConfig);
            onConfigUpdate?.(updatedConfig);
            setHasChanges(false);
        } catch (error) {
            console.error('Erro ao salvar config analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setConfig(DEFAULT_ANALYTICS_CONFIG);
        setHasChanges(true);
    };

    const updateGoogleAnalytics = (updates: Partial<GoogleAnalyticsConfig>) => {
        setConfig(prev => ({
            ...prev,
            googleAnalytics: { ...prev.googleAnalytics, ...updates }
        }));
        setHasChanges(true);
    };

    const updateFacebookPixel = (updates: Partial<FacebookPixelConfig>) => {
        setConfig(prev => ({
            ...prev,
            facebookPixel: { ...prev.facebookPixel, ...updates }
        }));
        setHasChanges(true);
    };

    const updateUtmTracking = (updates: Partial<UtmTrackingConfig>) => {
        setConfig(prev => ({
            ...prev,
            utmTracking: { ...prev.utmTracking, ...updates }
        }));
        setHasChanges(true);
    };

    const addConversionGoal = () => {
        const newGoal: ConversionGoal = {
            id: Date.now().toString(),
            name: `Goal ${config.conversionGoals.length + 1}`,
            type: 'custom',
            value: 50,
            description: 'Custom conversion goal'
        };

        setConfig(prev => ({
            ...prev,
            conversionGoals: [...prev.conversionGoals, newGoal]
        }));
        setHasChanges(true);
    };

    const removeConversionGoal = (goalId: string) => {
        setConfig(prev => ({
            ...prev,
            conversionGoals: prev.conversionGoals.filter(goal => goal.id !== goalId)
        }));
        setHasChanges(true);
    };

    const exportConfig = () => {
        const dataStr = JSON.stringify(config, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `analytics-config-${funnelId || 'default'}-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setConfig({
                    ...imported,
                    lastUpdated: new Date().toISOString()
                });
                setHasChanges(true);
            } catch (error) {
                console.error('Erro ao importar config:', error);
                alert('Erro ao importar arquivo. Verifique se é um JSON válido.');
            }
        };
        reader.readAsText(file);
    };

    const getConfigStatus = () => {
        const items = [
            config.googleAnalytics.enabled && config.googleAnalytics.trackingId,
            config.facebookPixel.enabled && config.facebookPixel.pixelId,
            config.utmTracking.enabled,
            config.conversionGoals.length > 0
        ].filter(Boolean);

        return `${items.length}/4`;
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-orange-600" />
                            <span>Funnel Analytics Dashboard</span>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                {getConfigStatus()} configuradas
                            </Badge>
                            {hasChanges && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                                    Não salvo
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleReset}
                                variant="outline"
                                size="sm"
                                className="text-gray-600"
                            >
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || !hasChanges}
                                className="bg-orange-600 hover:bg-orange-700"
                                size="sm"
                            >
                                {isLoading ? (
                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-1" />
                                )}
                                Salvar Analytics
                            </Button>
                        </div>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Configure tracking, conversões e monitoramento para análise completa do funil.
                        {funnelId && (
                            <span className="block mt-1 font-mono text-xs bg-gray-100 px-2 py-1 rounded w-fit">
                                Funil ID: {funnelId}
                            </span>
                        )}
                    </p>
                </CardHeader>
            </Card>

            {/* Analytics Content */}
            <Card>
                <CardContent className="p-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="border-b px-6 pt-6">
                            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
                                <TabsTrigger value="overview" className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger value="tracking" className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Tracking
                                </TabsTrigger>
                                <TabsTrigger value="conversions" className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Conversões
                                </TabsTrigger>
                                <TabsTrigger value="behavior" className="flex items-center gap-2">
                                    <MousePointerClick className="w-4 h-4" />
                                    Comportamento
                                </TabsTrigger>
                                <TabsTrigger value="export" className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Export
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="p-6">
                            {/* Overview */}
                            <TabsContent value="overview" className="mt-0 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-semibold">Google Analytics</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {config.googleAnalytics.enabled && config.googleAnalytics.trackingId ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            )}
                                            <span className="text-sm">
                                                {config.googleAnalytics.enabled ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            <h3 className="font-semibold">Facebook Pixel</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {config.facebookPixel.enabled && config.facebookPixel.pixelId ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            )}
                                            <span className="text-sm">
                                                {config.facebookPixel.enabled ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ExternalLink className="w-5 h-5 text-green-600" />
                                            <h3 className="font-semibold">UTM Tracking</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {config.utmTracking.enabled ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                            )}
                                            <span className="text-sm">
                                                {config.utmTracking.enabled ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <DollarSign className="w-5 h-5 text-yellow-600" />
                                            <h3 className="font-semibold">Goals</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-yellow-600">
                                                {config.conversionGoals.length}
                                            </span>
                                            <span className="text-sm">configuradas</span>
                                        </div>
                                    </Card>
                                </div>

                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <h3 className="font-semibold text-orange-900 mb-2">📊 Status do Analytics</h3>
                                    <p className="text-sm text-orange-700 mb-3">
                                        Configure seus sistemas de monitoramento para análise completa do desempenho do funil.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            {config.googleAnalytics.enabled ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                            )}
                                            <span>Google Analytics 4 configurado</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {config.facebookPixel.enabled ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                            )}
                                            <span>Facebook Pixel ativo</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {config.utmTracking.enabled ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                            )}
                                            <span>UTM Tracking habilitado</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {config.conversionGoals.length > 0 ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                                            )}
                                            <span>Metas de conversão definidas</span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Tracking */}
                            <TabsContent value="tracking" className="mt-0 space-y-6">
                                {/* Google Analytics */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Target className="w-5 h-5 text-blue-600" />
                                            Google Analytics 4
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="ga-enabled"
                                                checked={config.googleAnalytics.enabled}
                                                onCheckedChange={(checked) => updateGoogleAnalytics({ enabled: checked })}
                                            />
                                            <Label htmlFor="ga-enabled">Habilitar Google Analytics</Label>
                                        </div>

                                        {config.googleAnalytics.enabled && (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label>Tracking ID (UA-)</Label>
                                                    <Input
                                                        value={config.googleAnalytics.trackingId}
                                                        onChange={(e) => updateGoogleAnalytics({ trackingId: e.target.value })}
                                                        placeholder="UA-XXXXXXXXX-X"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Measurement ID (G-)</Label>
                                                    <Input
                                                        value={config.googleAnalytics.measurementId}
                                                        onChange={(e) => updateGoogleAnalytics({ measurementId: e.target.value })}
                                                        placeholder="G-XXXXXXXXXX"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Facebook Pixel */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            Facebook Pixel
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="fb-enabled"
                                                checked={config.facebookPixel.enabled}
                                                onCheckedChange={(checked) => updateFacebookPixel({ enabled: checked })}
                                            />
                                            <Label htmlFor="fb-enabled">Habilitar Facebook Pixel</Label>
                                        </div>

                                        {config.facebookPixel.enabled && (
                                            <div className="space-y-3">
                                                <div>
                                                    <Label>Pixel ID</Label>
                                                    <Input
                                                        value={config.facebookPixel.pixelId}
                                                        onChange={(e) => updateFacebookPixel({ pixelId: e.target.value })}
                                                        placeholder="123456789012345"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Access Token (Opcional)</Label>
                                                    <Input
                                                        value={config.facebookPixel.accessToken}
                                                        onChange={(e) => updateFacebookPixel({ accessToken: e.target.value })}
                                                        placeholder="EAAxxxxxxxxxxxxx"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* UTM Tracking */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ExternalLink className="w-5 h-5 text-green-600" />
                                            UTM Tracking
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="utm-enabled"
                                                checked={config.utmTracking.enabled}
                                                onCheckedChange={(checked) => updateUtmTracking({ enabled: checked })}
                                            />
                                            <Label htmlFor="utm-enabled">Habilitar UTM Tracking</Label>
                                        </div>

                                        {config.utmTracking.enabled && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Source</Label>
                                                    <Input
                                                        value={config.utmTracking.source}
                                                        onChange={(e) => updateUtmTracking({ source: e.target.value })}
                                                        placeholder="quiz"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Medium</Label>
                                                    <Input
                                                        value={config.utmTracking.medium}
                                                        onChange={(e) => updateUtmTracking({ medium: e.target.value })}
                                                        placeholder="organic"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Campaign</Label>
                                                    <Input
                                                        value={config.utmTracking.campaign}
                                                        onChange={(e) => updateUtmTracking({ campaign: e.target.value })}
                                                        placeholder="summer2024"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Term (Opcional)</Label>
                                                    <Input
                                                        value={config.utmTracking.term}
                                                        onChange={(e) => updateUtmTracking({ term: e.target.value })}
                                                        placeholder="keyword"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Conversões */}
                            <TabsContent value="conversions" className="mt-0 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Metas de Conversão</h3>
                                    <Button onClick={addConversionGoal} variant="outline" size="sm">
                                        <Target className="w-4 h-4 mr-1" />
                                        Adicionar Meta
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {config.conversionGoals.map((goal) => (
                                        <Card key={goal.id}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-yellow-600" />
                                                        <span className="font-medium">{goal.name}</span>
                                                        <Badge variant="outline">Valor: ${goal.value}</Badge>
                                                    </div>
                                                    <Button
                                                        onClick={() => removeConversionGoal(goal.id)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-red-600"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-600">{goal.description}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* Comportamento */}
                            <TabsContent value="behavior" className="mt-0 space-y-6">
                                <div className="space-y-4">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">Heatmap Tracking</h3>
                                                    <p className="text-sm text-gray-600">Mapear cliques e interações dos usuários</p>
                                                </div>
                                                <Switch
                                                    checked={config.heatmapEnabled}
                                                    onCheckedChange={(checked) => {
                                                        setConfig(prev => ({ ...prev, heatmapEnabled: checked }));
                                                        setHasChanges(true);
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">Session Recording</h3>
                                                    <p className="text-sm text-gray-600">Gravar sessões dos usuários para análise</p>
                                                </div>
                                                <Switch
                                                    checked={config.sessionRecordingEnabled}
                                                    onCheckedChange={(checked) => {
                                                        setConfig(prev => ({ ...prev, sessionRecordingEnabled: checked }));
                                                        setHasChanges(true);
                                                    }}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>

                            {/* Export */}
                            <TabsContent value="export" className="mt-0 space-y-6">
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="font-semibold mb-4">Backup & Restore</h3>
                                    <div className="flex gap-4">
                                        <Button onClick={exportConfig} variant="outline">
                                            <Download className="w-4 h-4 mr-2" />
                                            Exportar Configuração
                                        </Button>
                                        <label className="cursor-pointer">
                                            <Button variant="outline" asChild>
                                                <span>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Importar Configuração
                                                </span>
                                            </Button>
                                            <input
                                                type="file"
                                                accept=".json"
                                                onChange={importConfig}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Footer */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4 text-gray-600">
                            <span>Status: {getConfigStatus()} configurações ativas</span>
                            <span>•</span>
                            <span>Auto-save habilitado</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            Última atualização: {new Date(config.lastUpdated).toLocaleString()}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FunnelAnalyticsDashboard;