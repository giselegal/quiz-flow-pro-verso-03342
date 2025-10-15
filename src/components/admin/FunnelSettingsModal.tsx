import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SEOSettings } from '@/components/editor/funnel-settings/sections/SEOSettings';
import { AnalyticsSettings } from '@/components/editor/funnel-settings/sections/AnalyticsSettings';
import { WebhookSettings } from '@/components/editor/funnel-settings/sections/WebhookSettings';
import { DomainSettings } from '@/components/editor/funnel-settings/sections/DomainSettings';
import { FunnelSettings, defaultFunnelSettings } from '@/types/funnelSettings';
import { FunnelSettingsService } from '@/services/funnelSettingsService';
import { Save, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FunnelSettingsModalProps {
    funnelId: string;
    funnelName: string;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (settings: FunnelSettings) => void;
}

export const FunnelSettingsModal: React.FC<FunnelSettingsModalProps> = ({
    funnelId,
    funnelName,
    isOpen,
    onClose,
    onSave,
}) => {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('seo');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [settings, setSettings] = useState<FunnelSettings>(defaultFunnelSettings);

    // Carregar configurações quando o modal abrir
    useEffect(() => {
        if (isOpen && funnelId) {
            loadSettings();
        }
    }, [isOpen, funnelId]);

    const loadSettings = async () => {
        setIsLoading(true);
        try {
            const loadedSettings = await FunnelSettingsService.loadSettings(funnelId);
            if (loadedSettings) {
                setSettings(loadedSettings);
                console.log('✅ Configurações carregadas para o funil:', funnelId, loadedSettings);
            } else {
                setSettings(defaultFunnelSettings);
                console.log('📝 Usando configurações padrão para o funil:', funnelId);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar configurações:', error);
            setSettings(defaultFunnelSettings);
            toast({
                title: 'Erro ao carregar configurações',
                description: 'Usando configurações padrão.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await FunnelSettingsService.saveSettings(funnelId, settings);

            if (onSave) {
                onSave(settings);
            }

            toast({
                title: 'Configurações salvas',
                description: `Configurações do funil "${funnelName}" foram salvas com sucesso.`,
            });

            onClose();
        } catch (error) {
            console.error('❌ Erro ao salvar configurações:', error);
            toast({
                title: 'Erro ao salvar',
                description: 'Não foi possível salvar as configurações. Tente novamente.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const updateSEOSettings = (seoSettings: Partial<FunnelSettings['seo']>) => {
        setSettings(prev => ({
            ...prev,
            seo: { ...prev.seo, ...seoSettings },
        }));
    };

    const updateAnalyticsSettings = (analyticsSettings: Partial<FunnelSettings['analytics']>) => {
        setSettings(prev => ({
            ...prev,
            analytics: { ...prev.analytics, ...analyticsSettings },
        }));
    };

    const updateWebhookSettings = (webhookSettings: Partial<FunnelSettings['webhooks']>) => {
        setSettings(prev => ({
            ...prev,
            webhooks: { ...prev.webhooks, ...webhookSettings },
        }));
    };

    const updateDomainSettings = (domainSettings: Partial<FunnelSettings['domain']>) => {
        setSettings(prev => ({
            ...prev,
            domain: { ...prev.domain, ...domainSettings },
        }));
    };

    const handleExportSettings = () => {
        try {
            FunnelSettingsService.exportSettings(settings, funnelId);
            toast({
                title: 'Configurações exportadas',
                description: 'Arquivo de configurações baixado com sucesso.',
            });
        } catch (error) {
            console.error('❌ Erro ao exportar configurações:', error);
            toast({
                title: 'Erro ao exportar',
                description: 'Não foi possível exportar as configurações.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="border-b pb-4">
                    <DialogTitle className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-[#432818]">Configurações do Funil</h2>
                            <p className="text-sm text-[#8F7A6A] mt-1">{funnelName}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportSettings}
                                disabled={isSaving}
                            >
                                Exportar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isSaving || isLoading}
                                size="sm"
                                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose}
                                className="text-[#8F7A6A] hover:text-[#432818]"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B89B7A] mx-auto mb-4"></div>
                            <p className="text-[#8F7A6A]">Carregando configurações...</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-y-auto flex-1">
                        <Alert className="mb-4 border-[#B89B7A]/30 bg-[#B89B7A]/5">
                            <AlertCircle className="h-4 w-4 text-[#B89B7A]" />
                            <AlertDescription className="text-[#432818]">
                                <strong>Dica:</strong> Configure SEO, analytics e webhooks para maximizar o desempenho do seu funil.
                                Essas configurações se aplicam a todas as páginas deste funil.
                            </AlertDescription>
                        </Alert>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 mb-6">
                                <TabsTrigger value="seo" className="text-sm">SEO & Meta Tags</TabsTrigger>
                                <TabsTrigger value="analytics" className="text-sm">Analytics & Tracking</TabsTrigger>
                                <TabsTrigger value="webhooks" className="text-sm">Webhooks & Integrações</TabsTrigger>
                                <TabsTrigger value="domain" className="text-sm">Domínio & SSL</TabsTrigger>
                            </TabsList>

                            <TabsContent value="seo" className="mt-0">
                                <SEOSettings settings={settings.seo} onUpdate={updateSEOSettings} />
                            </TabsContent>

                            <TabsContent value="analytics" className="mt-0">
                                <AnalyticsSettings settings={settings.analytics} onUpdate={updateAnalyticsSettings} />
                            </TabsContent>

                            <TabsContent value="webhooks" className="mt-0">
                                <WebhookSettings settings={settings.webhooks} onUpdate={updateWebhookSettings} />
                            </TabsContent>

                            <TabsContent value="domain" className="mt-0">
                                <DomainSettings settings={settings.domain} onUpdate={updateDomainSettings} />
                            </TabsContent>
                        </Tabs>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
