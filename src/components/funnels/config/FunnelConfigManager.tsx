'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Loader2, Settings, Copy, RefreshCw } from 'lucide-react';

import { FunnelConfigPersistenceService } from '@/services/FunnelConfigPersistenceService';
import {
    FunnelConfig,
    FunnelSEOOverrides,
    FunnelTrackingConfig,
    FunnelUTMConfig,
    FunnelWebhooksConfig,
} from '@/templates/funnel-configs/quiz21StepsComplete.config';

import SEOConfigTab from './tabs/SEOConfigTab';
import TrackingConfigTab from './tabs/TrackingConfigTab';
import UTMConfigTab from './tabs/UTMConfigTab';
import WebhooksConfigTab from './tabs/WebhooksConfigTab';

interface FunnelConfigManagerProps {
    funnelId: string;
    onConfigChange?: (config: FunnelConfig) => void;
    className?: string;
}

export default function FunnelConfigManager({
    funnelId,
    onConfigChange,
    className = ''
}: FunnelConfigManagerProps) {
    // =================== Estados ===================
    const [config, setConfig] = useState<FunnelConfig>();
    const [originalConfig, setOriginalConfig] = useState<FunnelConfig>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [activeTab, setActiveTab] = useState('seo');
    const [error, setError] = useState<string | null>(null);

    const persistenceService = FunnelConfigPersistenceService.getInstance();

    // =================== Carregar configuração ===================
    const loadConfiguration = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log(`🔧 Carregando configuração para funil: ${funnelId}`);

            const loadedData = await persistenceService.loadConfig(funnelId);
            if (loadedData?.config) {
                setConfig(loadedData.config);
                setOriginalConfig(loadedData.config);
                console.log('✅ Configuração carregada:', loadedData.config);
            } else {
                throw new Error('Configuração não encontrada');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar configuração:', error);
            setError('Erro ao carregar configuração do funil. Tente recarregar a página.');
        } finally {
            setLoading(false);
        }
    }, [funnelId, persistenceService]);

    // =================== Effects ===================
    useEffect(() => {
        loadConfiguration();
    }, [loadConfiguration]);

    // Detectar mudanças na configuração
    useEffect(() => {
        if (!config || !originalConfig) return;
        const hasDiff = JSON.stringify(config) !== JSON.stringify(originalConfig);
        setHasChanges(hasDiff);
    }, [config, originalConfig]);

    // =================== Update handlers ===================
    const updateSEO = useCallback((seoUpdates: Partial<FunnelSEOOverrides>) => {
        setConfig(prev => prev ? {
            ...prev,
            seo: { ...prev.seo, ...seoUpdates }
        } : prev);
    }, []);

    const updateTracking = useCallback((trackingUpdates: Partial<FunnelTrackingConfig>) => {
        setConfig(prev => prev ? {
            ...prev,
            tracking: { ...prev.tracking, ...trackingUpdates }
        } : prev);
    }, []);

    const updateUTM = useCallback((utmUpdates: Partial<FunnelUTMConfig>) => {
        setConfig(prev => prev ? {
            ...prev,
            utm: { ...prev.utm, ...utmUpdates }
        } : prev);
    }, []);

    const updateWebhooks = useCallback((webhooksUpdates: Partial<FunnelWebhooksConfig>) => {
        setConfig(prev => prev ? {
            ...prev,
            webhooks: {
                ...prev.webhooks,
                ...webhooksUpdates,
                enabled: webhooksUpdates.enabled ?? prev.webhooks?.enabled ?? false
            }
        } : prev);
    }, []);

    // =================== Salvar configuração ===================
    const saveConfiguration = async () => {
        if (!config) return;

        setSaving(true);
        try {
            console.log('💾 Salvando configuração:', config);

            const savedData = await persistenceService.saveConfig(
                funnelId,
                config,
                {
                    validate: true,
                    backup: true,
                    updateCache: true,
                    source: 'manual',
                    userId: 'current-user' // TODO: Obter do contexto de auth
                }
            );

            setOriginalConfig(config);
            setHasChanges(false);
            onConfigChange?.(config);

            console.log('✅ Configuração salva com sucesso:', savedData);
        } catch (error) {
            console.error('❌ Erro ao salvar configuração:', error);
            setError('Erro ao salvar configuração. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    // =================== Copiar configuração ===================
    const copyConfig = async () => {
        if (!config) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
            console.log('📋 Configuração copiada para área de transferência');
        } catch (err) {
            console.error('❌ Erro ao copiar configuração:', err);
        }
    };

    // =================== Render loading ===================
    if (loading) {
        return (
            <Card className={className}>
                <CardContent className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Carregando configurações...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // =================== Render error ===================
    if (error) {
        return (
            <Card className={className}>
                <CardContent className="py-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="text-destructive text-sm">{error}</div>
                        <Button
                            variant="outline"
                            onClick={loadConfiguration}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Tentar novamente
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // =================== Render principal ===================
    if (!config) return null;

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Configurações do Funil
                        </CardTitle>
                        <CardDescription>
                            Configure SEO, tracking, UTM, webhooks e outras opções técnicas
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-3">
                        {hasChanges && (
                            <Badge variant="secondary">
                                Alterações pendentes
                            </Badge>
                        )}

                        <div className="flex items-center gap-2">
                            <Switch checked={previewMode} onCheckedChange={setPreviewMode} />
                            <span className="text-sm text-muted-foreground">Preview JSON</span>
                        </div>

                        <Button
                            onClick={saveConfiguration}
                            disabled={!hasChanges || saving}
                            className="gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Salvando...
                                </>
                            ) : hasChanges ? (
                                <>
                                    <Save className="h-4 w-4" />
                                    Salvar alterações
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Salvo
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Tabs de configuração */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="seo">SEO</TabsTrigger>
                        <TabsTrigger value="tracking">Tracking</TabsTrigger>
                        <TabsTrigger value="utm">UTM</TabsTrigger>
                        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                    </TabsList>

                    <TabsContent value="seo">
                        <SEOConfigTab
                            seo={config.seo || {}}
                            onUpdate={updateSEO}
                            disabled={previewMode}
                        />
                    </TabsContent>

                    <TabsContent value="tracking">
                        <TrackingConfigTab
                            tracking={config.tracking || {}}
                            onUpdate={updateTracking}
                            disabled={previewMode}
                        />
                    </TabsContent>

                    <TabsContent value="utm">
                        <UTMConfigTab
                            utm={config.utm || {}}
                            onUpdate={updateUTM}
                            disabled={previewMode}
                        />
                    </TabsContent>

                    <TabsContent value="webhooks">
                        <WebhooksConfigTab
                            webhooks={config.webhooks || { enabled: false }}
                            onUpdate={updateWebhooks}
                            disabled={previewMode}
                        />
                    </TabsContent>
                </Tabs>

                {/* Preview JSON */}
                <AnimatePresence>
                    {previewMode && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6"
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Pré-visualização JSON</CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={copyConfig}
                                            className="gap-2"
                                        >
                                            <Copy className="h-4 w-4" />
                                            Copiar
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96">
                                        {JSON.stringify(config, null, 2)}
                                    </pre>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}