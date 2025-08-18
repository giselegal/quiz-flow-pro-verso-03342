import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFunnelSettingsHistory } from '@/hooks/editor/useFunnelSettingsHistory';
import { SEOSettings } from './sections/SEOSettings';
import { AnalyticsSettings } from './sections/AnalyticsSettings';
import { WebhookSettings } from './sections/WebhookSettings';
import { DomainSettings } from './sections/DomainSettings';
import { FunnelSettings, defaultFunnelSettings } from '@/types/funnelSettings';
import { FunnelSettingsService } from '@/services/funnelSettingsService';
import { Save, Undo, Redo, RotateCcw } from 'lucide-react';

interface FunnelSettingsPanelProps {
  funnelId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const FunnelSettingsPanel: React.FC<FunnelSettingsPanelProps> = ({
  funnelId,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('seo');
  const [isSaving, setIsSaving] = useState(false);

  // Inicializar com configurações padrão
  const { settings, updateSettings, saveState, undo, redo, reset, canUndo, canRedo } =
    useFunnelSettingsHistory(funnelId, defaultFunnelSettings);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await FunnelSettingsService.saveSettings(funnelId, settings);
      saveState(settings);
      toast({
        title: 'Configurações salvas',
        description: 'Todas as configurações foram salvas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    const newSettings = undo();
    updateSettings(newSettings);
    toast({
      title: 'Ação desfeita',
      description: 'A última alteração foi desfeita.',
    });
  };

  const handleRedo = () => {
    const newSettings = redo();
    updateSettings(newSettings);
    toast({
      title: 'Ação refeita',
      description: 'A alteração foi refeita.',
    });
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todas as configurações?')) {
      reset();
      updateSettings(defaultFunnelSettings);
      toast({
        title: 'Configurações resetadas',
        description: 'Todas as configurações foram resetadas para os valores padrão.',
      });
    }
  };

  const updateSEOSettings = (seoSettings: Partial<FunnelSettings['seo']>) => {
    const newSettings = {
      ...settings,
      seo: { ...settings.seo, ...seoSettings },
    };
    updateSettings(newSettings);
  };

  const updateAnalyticsSettings = (analyticsSettings: Partial<FunnelSettings['analytics']>) => {
    const newSettings = {
      ...settings,
      analytics: { ...settings.analytics, ...analyticsSettings },
    };
    updateSettings(newSettings);
  };

  const updateWebhookSettings = (webhookSettings: Partial<FunnelSettings['webhooks']>) => {
    const newSettings = {
      ...settings,
      webhooks: { ...settings.webhooks, ...webhookSettings },
    };
    updateSettings(newSettings);
  };

  const updateDomainSettings = (domainSettings: Partial<FunnelSettings['domain']>) => {
    const newSettings = {
      ...settings,
      domain: { ...settings.domain, ...domainSettings },
    };
    updateSettings(newSettings);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Configurações do Funil</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleUndo} disabled={!canUndo}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRedo} disabled={!canRedo}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="domain">Domínio</TabsTrigger>
            </TabsList>

            <TabsContent value="seo" className="mt-4">
              <SEOSettings settings={settings.seo} onUpdate={updateSEOSettings} />
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              <AnalyticsSettings settings={settings.analytics} onUpdate={updateAnalyticsSettings} />
            </TabsContent>

            <TabsContent value="webhooks" className="mt-4">
              <WebhookSettings settings={settings.webhooks} onUpdate={updateWebhookSettings} />
            </TabsContent>

            <TabsContent value="domain" className="mt-4">
              <DomainSettings settings={settings.domain} onUpdate={updateDomainSettings} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
