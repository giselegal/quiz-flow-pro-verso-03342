/**
 * 🎛️ FUNNEL PUBLICATION SETTINGS
 * 
 * Configurações técnicas de publicação e marketing
 * Separadas das configurações de conteúdo (Painel de Propriedades)
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export interface FunnelPublicationSettings {
    // Domínio e URL
    domain: {
        customDomain?: string;
        subdomain?: string;
        slug: string;
        seoFriendlyUrl: boolean;
    };

    // Configurações de Resultados
    results: {
        primary: ResultConfiguration;
        secondary?: ResultConfiguration[];
        keywords: KeywordResultMapping[];
    };

    // SEO
    seo: {
        title?: string;
        description?: string;
        keywords?: string[];
        ogImage?: string;
        robots?: string;
        canonicalUrl?: string;
    };

    // Tracking & Analytics
    tracking: {
        googleAnalytics?: string;
        facebookPixel?: string;
        customPixels?: PixelConfiguration[];
        utmParameters: UTMConfiguration;
    };

    // Tokens & Authentication
    security: {
        accessToken?: string;
        apiKeys?: Record<string, string>;
        webhookUrls?: string[];
    };
}

export interface ResultConfiguration {
    id: string;
    username: string;
    title: string;
    description: string;
    percentage: number;
    primaryFunction: string;
    secondaryFunction?: string;
    images: {
        avatar?: string;
        banner?: string;
        thumbnail?: string;
    };
    metadata?: Record<string, any>;
}

export interface KeywordResultMapping {
    keywords: string[];
    resultId: string;
    weight: number;
    conditions?: Record<string, any>;
}

export interface PixelConfiguration {
    name: string;
    code: string;
    provider: 'facebook' | 'google' | 'custom';
    events: string[];
}

export interface UTMConfiguration {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
    customParameters?: Record<string, string>;
}
// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function FunnelPublicationPanel({
    funnelId,
    settings,
    onSettingsChange,
    onPublish
}: {
    funnelId: string;
    settings: FunnelPublicationSettings;
    onSettingsChange: (settings: FunnelPublicationSettings) => void;
    onPublish: () => void;
}) {
    const [activeTab, setActiveTab] = useState('domain');
    const [isPublishing, setIsPublishing] = useState(false);

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await onPublish();
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">📡 Configurações de Publicação</h2>
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            Depreciado
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Configure domínio, resultados, SEO e tracking para seu funil
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline">
                        👁️ Preview ({funnelId})
                    </Button>
                    <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                        {isPublishing ? '🚀 Publicando...' : '🚀 Publicar'}
                    </Button>
                </div>
            </div>

            {/* Aviso de Migração */}
            <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <strong>🚀 Funcionalidades Migradas!</strong>
                            <p className="mt-1 text-sm">
                                Todas as configurações de <strong>publicação, domínio, SEO e analytics</strong>
                                foram centralizadas no <strong>Painel Administrativo</strong> para melhor organização.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
                            onClick={() => {
                                window.open('/admin/funis', '_blank');
                            }}
                        >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Usar Painel Admin
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>

            <Separator />

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="domain">🌐 Domínio</TabsTrigger>
                    <TabsTrigger value="results">🎯 Resultados</TabsTrigger>
                    <TabsTrigger value="seo">📈 SEO</TabsTrigger>
                    <TabsTrigger value="tracking">📊 Tracking</TabsTrigger>
                    <TabsTrigger value="security">🔒 Segurança</TabsTrigger>
                </TabsList>

                {/* DOMÍNIO E URL */}
                <TabsContent value="domain" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🌐 Configuração de Domínio</CardTitle>
                            <CardDescription>
                                Configure onde seu funil será acessado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="subdomain">Subdomínio</Label>
                                    <Input
                                        id="subdomain"
                                        placeholder="meu-quiz"
                                        value={settings.domain.subdomain || ''}
                                        onChange={(e) => onSettingsChange({
                                            ...settings,
                                            domain: { ...settings.domain, subdomain: e.target.value }
                                        })}
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Será: <strong>meu-quiz.quizquest.com</strong>
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug do Funil</Label>
                                    <Input
                                        id="slug"
                                        placeholder="quiz-estilo-pessoal"
                                        value={settings.domain.slug}
                                        onChange={(e) => onSettingsChange({
                                            ...settings,
                                            domain: { ...settings.domain, slug: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="customDomain">Domínio Personalizado (Opcional)</Label>
                                <Input
                                    id="customDomain"
                                    placeholder="quiz.meusite.com"
                                    value={settings.domain.customDomain || ''}
                                    onChange={(e) => onSettingsChange({
                                        ...settings,
                                        domain: { ...settings.domain, customDomain: e.target.value }
                                    })}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    💡 Configure DNS CNAME apontando para nossos servidores
                                </p>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <h4 className="font-medium mb-2">🔗 URL Final:</h4>
                                <code className="text-sm bg-white dark:bg-slate-900 p-2 rounded border block">
                                    {settings.domain.customDomain ||
                                        `${settings.domain.subdomain || 'app'}.quizquest.com`}
                                    /{settings.domain.slug || 'funnel'}
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* RESULTADOS */}
                <TabsContent value="results" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🎯 Configuração de Resultados</CardTitle>
                            <CardDescription>
                                Configure os resultados baseados em palavras-chave
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResultsConfiguration
                                results={settings.results}
                                onChange={(results) => onSettingsChange({
                                    ...settings,
                                    results
                                })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEO */}
                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>📈 Configurações de SEO</CardTitle>
                            <CardDescription>
                                Otimize seu funil para motores de busca
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SEOConfiguration
                                seo={settings.seo}
                                onChange={(seo) => onSettingsChange({
                                    ...settings,
                                    seo
                                })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TRACKING */}
                <TabsContent value="tracking" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>📊 Tracking & Analytics</CardTitle>
                            <CardDescription>
                                Configure pixels, UTMs e análise de dados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TrackingConfiguration
                                tracking={settings.tracking}
                                onChange={(tracking) => onSettingsChange({
                                    ...settings,
                                    tracking
                                })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SEGURANÇA */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>🔒 Tokens & Segurança</CardTitle>
                            <CardDescription>
                                Configure tokens de acesso e chaves de API
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SecurityConfiguration
                                security={settings.security}
                                onChange={(security) => onSettingsChange({
                                    ...settings,
                                    security
                                })}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ResultsConfiguration({ results, onChange }: {
    results: FunnelPublicationSettings['results'];
    onChange: (results: FunnelPublicationSettings['results']) => void;
}) {
    return (
        <div className="space-y-6">

            {/* Resultado Principal */}
            <div>
                <h4 className="text-lg font-semibold mb-3">🏆 Resultado Principal</h4>
                <ResultEditor
                    result={results.primary}
                    onChange={(primary) => onChange({ ...results, primary })}
                />
            </div>

            <Separator />

            {/* Resultados Secundários */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold">🥈 Resultados Secundários</h4>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onChange({
                            ...results,
                            secondary: [...(results.secondary || []), createEmptyResult()]
                        })}
                    >
                        ➕ Adicionar
                    </Button>
                </div>

                <div className="space-y-4">
                    {(results.secondary || []).map((result, index) => (
                        <div key={result.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <Badge variant="secondary">Resultado {index + 1}</Badge>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onChange({
                                        ...results,
                                        secondary: results.secondary?.filter((_, i) => i !== index)
                                    })}
                                >
                                    🗑️
                                </Button>
                            </div>
                            <ResultEditor
                                result={result}
                                onChange={(updatedResult) => {
                                    const newSecondary = [...(results.secondary || [])];
                                    newSecondary[index] = updatedResult;
                                    onChange({ ...results, secondary: newSecondary });
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Mapeamento de Keywords */}
            <div>
                <h4 className="text-lg font-semibold mb-3">🔑 Mapeamento de Keywords</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    Configure quais palavras-chave levam a quais resultados
                </p>
                {/* KeywordMapper component aqui */}
            </div>
        </div>
    );
}

function ResultEditor({ result, onChange }: {
    result: ResultConfiguration;
    onChange: (result: ResultConfiguration) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    value={result.username}
                    onChange={(e) => onChange({ ...result, username: e.target.value })}
                    placeholder="@usuario_resultado"
                />
            </div>

            <div>
                <Label htmlFor="percentage">Porcentagem</Label>
                <Input
                    id="percentage"
                    type="number"
                    min="0"
                    max="100"
                    value={result.percentage}
                    onChange={(e) => onChange({ ...result, percentage: Number(e.target.value) })}
                />
            </div>

            <div className="col-span-2">
                <Label htmlFor="title">Título do Resultado</Label>
                <Input
                    id="title"
                    value={result.title}
                    onChange={(e) => onChange({ ...result, title: e.target.value })}
                    placeholder="Seu Estilo Clássico"
                />
            </div>

            <div className="col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                    id="description"
                    value={result.description}
                    onChange={(e) => onChange({ ...result, description: e.target.value })}
                    placeholder="Você tem um estilo elegante e atemporal..."
                    rows={3}
                />
            </div>

            <div>
                <Label htmlFor="primaryFunction">Função Principal</Label>
                <Input
                    id="primaryFunction"
                    value={result.primaryFunction}
                    onChange={(e) => onChange({ ...result, primaryFunction: e.target.value })}
                    placeholder="Elegância"
                />
            </div>

            <div>
                <Label htmlFor="secondaryFunction">Função Secundária</Label>
                <Input
                    id="secondaryFunction"
                    value={result.secondaryFunction || ''}
                    onChange={(e) => onChange({ ...result, secondaryFunction: e.target.value })}
                    placeholder="Sofisticação"
                />
            </div>
        </div>
    );
}

function SEOConfiguration({ seo, onChange }: {
    seo: FunnelPublicationSettings['seo'];
    onChange: (seo: FunnelPublicationSettings['seo']) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="seoTitle">Título SEO</Label>
                <Input
                    id="seoTitle"
                    value={seo.title || ''}
                    onChange={(e) => onChange({ ...seo, title: e.target.value })}
                    placeholder="Descubra Seu Estilo Pessoal - Quiz Gratuito"
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: 50-60 caracteres
                </p>
            </div>

            <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                    id="seoDescription"
                    value={seo.description || ''}
                    onChange={(e) => onChange({ ...seo, description: e.target.value })}
                    placeholder="Faça nosso quiz personalizado e descubra qual é o seu estilo único..."
                    rows={2}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    Recomendado: 150-160 caracteres
                </p>
            </div>

            <div>
                <Label htmlFor="seoKeywords">Palavras-chave</Label>
                <Input
                    id="seoKeywords"
                    value={seo.keywords?.join(', ') || ''}
                    onChange={(e) => onChange({
                        ...seo,
                        keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                    })}
                    placeholder="quiz de estilo, personalidade, moda"
                />
            </div>
        </div>
    );
}

function TrackingConfiguration({ tracking, onChange }: {
    tracking: FunnelPublicationSettings['tracking'];
    onChange: (tracking: FunnelPublicationSettings['tracking']) => void;
}) {
    return (
        <div className="space-y-6">

            {/* Google Analytics */}
            <div>
                <Label htmlFor="ga">Google Analytics ID</Label>
                <Input
                    id="ga"
                    value={tracking.googleAnalytics || ''}
                    onChange={(e) => onChange({ ...tracking, googleAnalytics: e.target.value })}
                    placeholder="GA4-XXXXXXXXX"
                />
            </div>

            {/* Facebook Pixel */}
            <div>
                <Label htmlFor="fbPixel">Facebook Pixel ID</Label>
                <Input
                    id="fbPixel"
                    value={tracking.facebookPixel || ''}
                    onChange={(e) => onChange({ ...tracking, facebookPixel: e.target.value })}
                    placeholder="123456789012345"
                />
            </div>

            {/* UTM Parameters */}
            <div>
                <h4 className="text-lg font-semibold mb-3">🔗 Parâmetros UTM</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="utmSource">UTM Source</Label>
                        <Input
                            id="utmSource"
                            value={tracking.utmParameters.source || ''}
                            onChange={(e) => onChange({
                                ...tracking,
                                utmParameters: { ...tracking.utmParameters, source: e.target.value }
                            })}
                            placeholder="facebook"
                        />
                    </div>

                    <div>
                        <Label htmlFor="utmMedium">UTM Medium</Label>
                        <Input
                            id="utmMedium"
                            value={tracking.utmParameters.medium || ''}
                            onChange={(e) => onChange({
                                ...tracking,
                                utmParameters: { ...tracking.utmParameters, medium: e.target.value }
                            })}
                            placeholder="social"
                        />
                    </div>

                    <div>
                        <Label htmlFor="utmCampaign">UTM Campaign</Label>
                        <Input
                            id="utmCampaign"
                            value={tracking.utmParameters.campaign || ''}
                            onChange={(e) => onChange({
                                ...tracking,
                                utmParameters: { ...tracking.utmParameters, campaign: e.target.value }
                            })}
                            placeholder="quiz-estilo-2025"
                        />
                    </div>

                    <div>
                        <Label htmlFor="utmTerm">UTM Term</Label>
                        <Input
                            id="utmTerm"
                            value={tracking.utmParameters.term || ''}
                            onChange={(e) => onChange({
                                ...tracking,
                                utmParameters: { ...tracking.utmParameters, term: e.target.value }
                            })}
                            placeholder="estilo-pessoal"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecurityConfiguration({ security, onChange }: {
    security: FunnelPublicationSettings['security'];
    onChange: (security: FunnelPublicationSettings['security']) => void;
}) {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="accessToken">Token de Acesso</Label>
                <Input
                    id="accessToken"
                    type="password"
                    value={security.accessToken || ''}
                    onChange={(e) => onChange({ ...security, accessToken: e.target.value })}
                    placeholder="••••••••••••••••"
                />
            </div>

            <div>
                <Label htmlFor="webhooks">URLs de Webhook</Label>
                <Textarea
                    id="webhooks"
                    value={security.webhookUrls?.join('\n') || ''}
                    onChange={(e) => onChange({
                        ...security,
                        webhookUrls: e.target.value.split('\n').filter(Boolean)
                    })}
                    placeholder="https://api.meusite.com/webhook/quiz&#10;https://zapier.com/hooks/catch/..."
                    rows={3}
                />
            </div>
        </div>
    );
}

// ============================================================================
// UTILITIES
// ============================================================================

function createEmptyResult(): ResultConfiguration {
    return {
        id: `result_${Date.now()}`,
        username: '',
        title: '',
        description: '',
        percentage: 0,
        primaryFunction: '',
        images: {}
    };
}
