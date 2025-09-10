import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Globe,
    Search,
    Zap,
    BarChart3,
    Webhook,
    Eye,
    Save,
    Download,
    Upload,
    Palette,
    Settings,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface GlobalConfig {
    // SEO Configuration
    seo: {
        title: string;
        description: string;
        keywords: string;
        ogTitle: string;
        ogDescription: string;
        ogImage: string;
        favicon: string;
        customMetaTags: string;
    };

    // Domain & Hosting
    domain: {
        primaryDomain: string;
        customDomains: string[];
        ssl: boolean;
        redirects: string;
    };

    // Tracking & Analytics
    tracking: {
        googleAnalytics: string;
        facebookPixel: string;
        googleTagManager: string;
        hotjar: string;
        customScripts: string;
        enableTracking: boolean;
    };

    // UTM & Campaign
    campaign: {
        defaultSource: string;
        defaultMedium: string;
        defaultCampaign: string;
        autoUTM: boolean;
        trackingPrefix: string;
    };

    // Webhooks & Integrations
    webhooks: {
        leadCapture: string;
        formSubmission: string;
        purchaseComplete: string;
        quizComplete: string;
        enableWebhooks: boolean;
        secretKey: string;
    };

    // Branding & Design
    branding: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        fontFamily: string;
        logoUrl: string;
        faviconUrl: string;
        customCSS: string;
    };

    // Legal & Compliance
    legal: {
        privacyPolicyUrl: string;
        termsOfServiceUrl: string;
        cookiePolicy: string;
        gdprCompliant: boolean;
        showCookieBanner: boolean;
    };
}

const defaultConfig: GlobalConfig = {
    seo: {
        title: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
        description: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança.',
        keywords: 'estilo pessoal, consultoria de imagem, quiz de estilo, moda, guarda-roupa',
        ogTitle: 'Descubra Seu Estilo Pessoal - Quiz Interativo',
        ogDescription: 'Descubra seu estilo predominante através do nosso quiz personalizado e transforme seu guarda-roupa com confiança.',
        ogImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/og-image-style-quiz.webp',
        favicon: '/favicon.ico',
        customMetaTags: ''
    },
    domain: {
        primaryDomain: 'quiz-sell-genius.com',
        customDomains: [],
        ssl: true,
        redirects: ''
    },
    tracking: {
        googleAnalytics: '',
        facebookPixel: '',
        googleTagManager: '',
        hotjar: '',
        customScripts: '',
        enableTracking: true
    },
    campaign: {
        defaultSource: 'facebook',
        defaultMedium: 'cpc',
        defaultCampaign: 'quiz_style_abtest_2025',
        autoUTM: true,
        trackingPrefix: 'qsq'
    },
    webhooks: {
        leadCapture: '',
        formSubmission: '',
        purchaseComplete: '',
        quizComplete: '',
        enableWebhooks: false,
        secretKey: ''
    },
    branding: {
        primaryColor: '#B89B7A',
        secondaryColor: '#432818',
        accentColor: '#3B82F6',
        fontFamily: 'Inter',
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        faviconUrl: '/favicon.ico',
        customCSS: ''
    },
    legal: {
        privacyPolicyUrl: '/privacy',
        termsOfServiceUrl: '/terms',
        cookiePolicy: '',
        gdprCompliant: true,
        showCookieBanner: true
    }
};

const STORAGE_KEY = 'quiz-global-config';

export const GlobalConfigPanel: React.FC = () => {
    const [config, setConfig] = useState<GlobalConfig>(defaultConfig);
    const [activeTab, setActiveTab] = useState('seo');
    const [isLoading, setIsLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Carregar configuração salva
    useEffect(() => {
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        if (savedConfig) {
            try {
                const parsed = JSON.parse(savedConfig);
                setConfig({ ...defaultConfig, ...parsed });
            } catch (error) {
                console.error('Erro ao carregar configuração:', error);
            }
        }
    }, []);

    // Marcar como modificado quando houver mudanças
    useEffect(() => {
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        const currentConfigStr = JSON.stringify(config);
        const savedConfigStr = savedConfig || JSON.stringify(defaultConfig);
        setHasChanges(currentConfigStr !== savedConfigStr);
    }, [config]);

    const updateConfig = (section: keyof GlobalConfig, field: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const saveConfig = async () => {
        setIsLoading(true);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
            setSaved(true);
            setHasChanges(false);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar configuração:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const exportConfig = () => {
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'global-config.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target?.result as string);
                    setConfig({ ...defaultConfig, ...imported });
                } catch (error) {
                    console.error('Erro ao importar configuração:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    const validateConfig = () => {
        const errors: string[] = [];

        if (!config.seo.title) errors.push('Título SEO é obrigatório');
        if (!config.seo.description) errors.push('Descrição SEO é obrigatória');
        if (config.tracking.enableTracking && !config.tracking.googleAnalytics && !config.tracking.facebookPixel) {
            errors.push('Configure pelo menos um código de rastreamento');
        }

        return errors;
    };

    const errors = validateConfig();

    return (
        <div className="space-y-6">
            {/* Header com ações */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#432818] flex items-center gap-2">
                        <Settings className="w-6 h-6" style={{ color: '#B89B7A' }} />
                        Configurações Globais
                    </h2>
                    <p className="text-[#8F7A6A] mt-1">
                        Configure SEO, tracking, domínio e outras configurações do seu funil
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Não salvo
                        </Badge>
                    )}
                    {saved && (
                        <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Salvo
                        </Badge>
                    )}

                    <Button
                        onClick={saveConfig}
                        disabled={isLoading || !hasChanges}
                        className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </div>

            {/* Alertas de validação */}
            {errors.length > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        <strong>Atenção:</strong>
                        <ul className="mt-1 list-disc list-inside">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Tabs de configuração */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 w-full">
                    <TabsTrigger value="seo" className="flex items-center gap-1">
                        <Search className="w-4 h-4" />
                        <span className="hidden sm:inline">SEO</span>
                    </TabsTrigger>
                    <TabsTrigger value="domain" className="flex items-center gap-1">
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">Domínio</span>
                    </TabsTrigger>
                    <TabsTrigger value="tracking" className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Tracking</span>
                    </TabsTrigger>
                    <TabsTrigger value="campaign" className="flex items-center gap-1">
                        <Zap className="w-4 h-4" />
                        <span className="hidden sm:inline">UTM</span>
                    </TabsTrigger>
                    <TabsTrigger value="webhooks" className="flex items-center gap-1">
                        <Webhook className="w-4 h-4" />
                        <span className="hidden sm:inline">Webhooks</span>
                    </TabsTrigger>
                    <TabsTrigger value="branding" className="flex items-center gap-1">
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Design</span>
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Legal</span>
                    </TabsTrigger>
                </TabsList>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="w-5 h-5" />
                                Configurações SEO
                            </CardTitle>
                            <CardDescription>
                                Configure meta tags, título, descrição e outros elementos de SEO
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="seo-title">Título da Página *</Label>
                                    <Input
                                        id="seo-title"
                                        value={config.seo.title}
                                        onChange={(e) => updateConfig('seo', 'title', e.target.value)}
                                        placeholder="Título que aparece no Google"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {config.seo.title.length}/60 caracteres
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="og-title">Título Open Graph</Label>
                                    <Input
                                        id="og-title"
                                        value={config.seo.ogTitle}
                                        onChange={(e) => updateConfig('seo', 'ogTitle', e.target.value)}
                                        placeholder="Título para redes sociais"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="seo-description">Descrição SEO *</Label>
                                <Textarea
                                    id="seo-description"
                                    value={config.seo.description}
                                    onChange={(e) => updateConfig('seo', 'description', e.target.value)}
                                    placeholder="Descrição que aparece nos resultados de busca"
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {config.seo.description.length}/160 caracteres
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="seo-keywords">Palavras-chave</Label>
                                <Input
                                    id="seo-keywords"
                                    value={config.seo.keywords}
                                    onChange={(e) => updateConfig('seo', 'keywords', e.target.value)}
                                    placeholder="palavra1, palavra2, palavra3"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="og-image">Imagem Open Graph (URL)</Label>
                                    <Input
                                        id="og-image"
                                        value={config.seo.ogImage}
                                        onChange={(e) => updateConfig('seo', 'ogImage', e.target.value)}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="favicon">Favicon (URL)</Label>
                                    <Input
                                        id="favicon"
                                        value={config.seo.favicon}
                                        onChange={(e) => updateConfig('seo', 'favicon', e.target.value)}
                                        placeholder="/favicon.ico"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="custom-meta">Meta Tags Personalizadas</Label>
                                <Textarea
                                    id="custom-meta"
                                    value={config.seo.customMetaTags}
                                    onChange={(e) => updateConfig('seo', 'customMetaTags', e.target.value)}
                                    placeholder='<meta name="author" content="Seu Nome">'
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Domain Tab */}
                <TabsContent value="domain" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Configurações de Domínio
                            </CardTitle>
                            <CardDescription>
                                Configure domínio principal, SSL e redirecionamentos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="primary-domain">Domínio Principal</Label>
                                <Input
                                    id="primary-domain"
                                    value={config.domain.primaryDomain}
                                    onChange={(e) => updateConfig('domain', 'primaryDomain', e.target.value)}
                                    placeholder="seudominio.com"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={config.domain.ssl}
                                    onCheckedChange={(checked: boolean) => updateConfig('domain', 'ssl', checked)}
                                />
                                <Label>SSL Habilitado (HTTPS)</Label>
                            </div>

                            <div>
                                <Label htmlFor="redirects">Redirecionamentos</Label>
                                <Textarea
                                    id="redirects"
                                    value={config.domain.redirects}
                                    onChange={(e) => updateConfig('domain', 'redirects', e.target.value)}
                                    placeholder="/old-page -> /new-page"
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tracking Tab */}
                <TabsContent value="tracking" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5" />
                                Tracking & Analytics
                            </CardTitle>
                            <CardDescription>
                                Configure códigos de rastreamento e analytics
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={config.tracking.enableTracking}
                                    onCheckedChange={(checked: boolean) => updateConfig('tracking', 'enableTracking', checked)}
                                />
                                <Label>Habilitar Rastreamento</Label>
                            </div>

                            {config.tracking.enableTracking && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="ga-id">Google Analytics ID</Label>
                                            <Input
                                                id="ga-id"
                                                value={config.tracking.googleAnalytics}
                                                onChange={(e) => updateConfig('tracking', 'googleAnalytics', e.target.value)}
                                                placeholder="GA4-XXXXXXXXX"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                                            <Input
                                                id="fb-pixel"
                                                value={config.tracking.facebookPixel}
                                                onChange={(e) => updateConfig('tracking', 'facebookPixel', e.target.value)}
                                                placeholder="123456789012345"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="gtm-id">Google Tag Manager</Label>
                                            <Input
                                                id="gtm-id"
                                                value={config.tracking.googleTagManager}
                                                onChange={(e) => updateConfig('tracking', 'googleTagManager', e.target.value)}
                                                placeholder="GTM-XXXXXXX"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="hotjar-id">Hotjar ID</Label>
                                            <Input
                                                id="hotjar-id"
                                                value={config.tracking.hotjar}
                                                onChange={(e) => updateConfig('tracking', 'hotjar', e.target.value)}
                                                placeholder="1234567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="custom-scripts">Scripts Personalizados</Label>
                                        <Textarea
                                            id="custom-scripts"
                                            value={config.tracking.customScripts}
                                            onChange={(e) => updateConfig('tracking', 'customScripts', e.target.value)}
                                            placeholder="<script>// Seu código aqui</script>"
                                            rows={6}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Campaign/UTM Tab */}
                <TabsContent value="campaign" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                Configurações UTM
                            </CardTitle>
                            <CardDescription>
                                Configure parâmetros UTM para rastreamento de campanhas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={config.campaign.autoUTM}
                                    onCheckedChange={(checked: boolean) => updateConfig('campaign', 'autoUTM', checked)}
                                />
                                <Label>Adicionar UTMs automaticamente</Label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="utm-source">UTM Source Padrão</Label>
                                    <Input
                                        id="utm-source"
                                        value={config.campaign.defaultSource}
                                        onChange={(e) => updateConfig('campaign', 'defaultSource', e.target.value)}
                                        placeholder="facebook"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="utm-medium">UTM Medium Padrão</Label>
                                    <Input
                                        id="utm-medium"
                                        value={config.campaign.defaultMedium}
                                        onChange={(e) => updateConfig('campaign', 'defaultMedium', e.target.value)}
                                        placeholder="cpc"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="utm-campaign">UTM Campaign Padrão</Label>
                                    <Input
                                        id="utm-campaign"
                                        value={config.campaign.defaultCampaign}
                                        onChange={(e) => updateConfig('campaign', 'defaultCampaign', e.target.value)}
                                        placeholder="quiz_style_2025"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tracking-prefix">Prefixo de Rastreamento</Label>
                                    <Input
                                        id="tracking-prefix"
                                        value={config.campaign.trackingPrefix}
                                        onChange={(e) => updateConfig('campaign', 'trackingPrefix', e.target.value)}
                                        placeholder="qsq"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Webhooks Tab */}
                <TabsContent value="webhooks" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Webhook className="w-5 h-5" />
                                Webhooks & Integrações
                            </CardTitle>
                            <CardDescription>
                                Configure webhooks para integração com outras ferramentas
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={config.webhooks.enableWebhooks}
                                    onCheckedChange={(checked: boolean) => updateConfig('webhooks', 'enableWebhooks', checked)}
                                />
                                <Label>Habilitar Webhooks</Label>
                            </div>

                            {config.webhooks.enableWebhooks && (
                                <>
                                    <div>
                                        <Label htmlFor="webhook-secret">Chave Secreta</Label>
                                        <Input
                                            id="webhook-secret"
                                            type="password"
                                            value={config.webhooks.secretKey}
                                            onChange={(e) => updateConfig('webhooks', 'secretKey', e.target.value)}
                                            placeholder="sua-chave-secreta"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <Label htmlFor="webhook-lead">Captura de Lead</Label>
                                            <Input
                                                id="webhook-lead"
                                                value={config.webhooks.leadCapture}
                                                onChange={(e) => updateConfig('webhooks', 'leadCapture', e.target.value)}
                                                placeholder="https://seu-webhook.com/lead"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="webhook-form">Envio de Formulário</Label>
                                            <Input
                                                id="webhook-form"
                                                value={config.webhooks.formSubmission}
                                                onChange={(e) => updateConfig('webhooks', 'formSubmission', e.target.value)}
                                                placeholder="https://seu-webhook.com/form"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="webhook-quiz">Quiz Completo</Label>
                                            <Input
                                                id="webhook-quiz"
                                                value={config.webhooks.quizComplete}
                                                onChange={(e) => updateConfig('webhooks', 'quizComplete', e.target.value)}
                                                placeholder="https://seu-webhook.com/quiz"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="webhook-purchase">Compra Concluída</Label>
                                            <Input
                                                id="webhook-purchase"
                                                value={config.webhooks.purchaseComplete}
                                                onChange={(e) => updateConfig('webhooks', 'purchaseComplete', e.target.value)}
                                                placeholder="https://seu-webhook.com/purchase"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Branding Tab */}
                <TabsContent value="branding" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Design & Branding
                            </CardTitle>
                            <CardDescription>
                                Configure cores, fontes e elementos visuais
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="primary-color">Cor Primária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="primary-color"
                                            type="color"
                                            value={config.branding.primaryColor}
                                            onChange={(e) => updateConfig('branding', 'primaryColor', e.target.value)}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            value={config.branding.primaryColor}
                                            onChange={(e) => updateConfig('branding', 'primaryColor', e.target.value)}
                                            placeholder="#B89B7A"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="secondary-color">Cor Secundária</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="secondary-color"
                                            type="color"
                                            value={config.branding.secondaryColor}
                                            onChange={(e) => updateConfig('branding', 'secondaryColor', e.target.value)}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            value={config.branding.secondaryColor}
                                            onChange={(e) => updateConfig('branding', 'secondaryColor', e.target.value)}
                                            placeholder="#432818"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="accent-color">Cor de Destaque</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="accent-color"
                                            type="color"
                                            value={config.branding.accentColor}
                                            onChange={(e) => updateConfig('branding', 'accentColor', e.target.value)}
                                            className="w-12 h-10 p-1"
                                        />
                                        <Input
                                            value={config.branding.accentColor}
                                            onChange={(e) => updateConfig('branding', 'accentColor', e.target.value)}
                                            placeholder="#3B82F6"
                                            className="flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="logo-url">URL do Logo</Label>
                                    <Input
                                        id="logo-url"
                                        value={config.branding.logoUrl}
                                        onChange={(e) => updateConfig('branding', 'logoUrl', e.target.value)}
                                        placeholder="https://exemplo.com/logo.png"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="font-family">Fonte Principal</Label>
                                    <Input
                                        id="font-family"
                                        value={config.branding.fontFamily}
                                        onChange={(e) => updateConfig('branding', 'fontFamily', e.target.value)}
                                        placeholder="Inter, sans-serif"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="custom-css">CSS Personalizado</Label>
                                <Textarea
                                    id="custom-css"
                                    value={config.branding.customCSS}
                                    onChange={(e) => updateConfig('branding', 'customCSS', e.target.value)}
                                    placeholder=".custom-class { color: red; }"
                                    rows={6}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Legal Tab */}
                <TabsContent value="legal" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="w-5 h-5" />
                                Legal & Compliance
                            </CardTitle>
                            <CardDescription>
                                Configure políticas de privacidade e conformidade
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="privacy-url">URL Política de Privacidade</Label>
                                    <Input
                                        id="privacy-url"
                                        value={config.legal.privacyPolicyUrl}
                                        onChange={(e) => updateConfig('legal', 'privacyPolicyUrl', e.target.value)}
                                        placeholder="/privacy"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="terms-url">URL Termos de Uso</Label>
                                    <Input
                                        id="terms-url"
                                        value={config.legal.termsOfServiceUrl}
                                        onChange={(e) => updateConfig('legal', 'termsOfServiceUrl', e.target.value)}
                                        placeholder="/terms"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={config.legal.gdprCompliant}
                                        onCheckedChange={(checked: boolean) => updateConfig('legal', 'gdprCompliant', checked)}
                                    />
                                    <Label>Conformidade GDPR</Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={config.legal.showCookieBanner}
                                        onCheckedChange={(checked: boolean) => updateConfig('legal', 'showCookieBanner', checked)}
                                    />
                                    <Label>Exibir Banner de Cookies</Label>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="cookie-policy">Política de Cookies</Label>
                                <Textarea
                                    id="cookie-policy"
                                    value={config.legal.cookiePolicy}
                                    onChange={(e) => updateConfig('legal', 'cookiePolicy', e.target.value)}
                                    placeholder="Este site utiliza cookies para melhorar sua experiência..."
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Ações de importar/exportar */}
            <Card>
                <CardHeader>
                    <CardTitle>Backup & Restauração</CardTitle>
                    <CardDescription>
                        Faça backup das suas configurações ou importe configurações salvas
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Button onClick={exportConfig} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Configurações
                    </Button>

                    <label className="cursor-pointer">
                        <Button variant="outline" asChild>
                            <span>
                                <Upload className="w-4 h-4 mr-2" />
                                Importar Configurações
                            </span>
                        </Button>
                        <input
                            type="file"
                            accept=".json"
                            onChange={importConfig}
                            className="hidden"
                        />
                    </label>
                </CardContent>
            </Card>
        </div>
    );
};

export default GlobalConfigPanel;
