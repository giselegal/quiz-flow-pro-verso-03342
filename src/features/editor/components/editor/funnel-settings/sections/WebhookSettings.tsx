import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { WebhookSettings as WebhookSettingsType } from '@/types/funnelSettings';
import { Plus, Trash2, TestTube, ExternalLink } from 'lucide-react';

interface WebhookSettingsProps {
  settings: WebhookSettingsType;
  onUpdate: (settings: Partial<WebhookSettingsType>) => void;
}

export const WebhookSettings: React.FC<WebhookSettingsProps> = ({ settings, onUpdate }) => {
  const { toast } = useToast();
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const addCustomWebhook = () => {
    const newWebhook = {
      id: Date.now().toString(),
      name: 'Novo Webhook',
      url: '',
      events: ['lead_capture'],
      headers: {},
      active: true,
    };

    onUpdate({
      customWebhooks: [...settings.customWebhooks, newWebhook],
    });
  };

  const updateCustomWebhook = (id: string, updates: any) => {
    const updatedWebhooks = settings.customWebhooks.map(webhook =>
      webhook.id === id ? { ...webhook, ...updates } : webhook
    );
    onUpdate({ customWebhooks: updatedWebhooks });
  };

  const removeCustomWebhook = (id: string) => {
    const updatedWebhooks = settings.customWebhooks.filter(webhook => webhook.id !== id);
    onUpdate({ customWebhooks: updatedWebhooks });
  };

  const testWebhook = async (url: string, id: string) => {
    setTestingWebhook(id);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          event: 'test_webhook',
        }),
      });

      if (response.ok) {
        toast({
          title: 'Webhook testado com sucesso',
          description: 'O webhook respondeu corretamente.',
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: 'Erro no teste do webhook',
        description: 'O webhook não respondeu ou retornou erro.',
        variant: 'destructive',
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hotmart</CardTitle>
          <CardDescription>
            Configure o postback da Hotmart para receber notificações de vendas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotmartPostback">URL de Postback</Label>
            <Input
              id="hotmartPostback"
              value={settings.hotmartPostbackUrl}
              onChange={e => onUpdate({ hotmartPostbackUrl: e.target.value })}
              placeholder="https://api.minhaapi.com/hotmart/postback"
            />
            <p className="text-sm text-muted-foreground">
              URL que receberá as notificações de vendas da Hotmart
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="testMode"
              checked={settings.testMode}
              onCheckedChange={checked => onUpdate({ testMode: checked })}
            />
            <Label htmlFor="testMode">Modo de teste</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Webhooks Personalizados</span>
            <Button onClick={addCustomWebhook} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </CardTitle>
          <CardDescription>
            Configure webhooks personalizados para integrar com suas próprias APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.customWebhooks.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhum webhook personalizado configurado
            </p>
          ) : (
            settings.customWebhooks.map(webhook => (
              <Card key={webhook.id} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={webhook.name}
                          onChange={e =>
                            updateCustomWebhook(webhook.id, {
                              name: e.target.value,
                            })
                          }
                          className="w-48"
                          placeholder="Nome do webhook"
                        />
                        <Switch
                          checked={webhook.active}
                          onCheckedChange={checked =>
                            updateCustomWebhook(webhook.id, { active: checked })
                          }
                        />
                        <Badge variant={webhook.active ? 'default' : 'secondary'}>
                          {webhook.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testWebhook(webhook.url, webhook.id)}
                          disabled={!webhook.url || testingWebhook === webhook.id}
                        >
                          <TestTube className="w-4 h-4 mr-2" />
                          {testingWebhook === webhook.id ? 'Testando...' : 'Testar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomWebhook(webhook.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>URL do Webhook</Label>
                      <Input
                        value={webhook.url}
                        onChange={e =>
                          updateCustomWebhook(webhook.id, {
                            url: e.target.value,
                          })
                        }
                        placeholder="https://api.exemplo.com/webhook"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Eventos</Label>
                      <div className="flex flex-wrap gap-2">
                        {['lead_capture', 'form_submit', 'page_view', 'conversion'].map(event => (
                          <Badge
                            key={event}
                            variant={webhook.events.includes(event) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => {
                              const events = webhook.events.includes(event)
                                ? webhook.events.filter(e => e !== event)
                                : [...webhook.events, event];
                              updateCustomWebhook(webhook.id, { events });
                            }}
                          >
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação</CardTitle>
          <CardDescription>Links úteis para configurar seus webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://hotmart.com/en/club/hotmart-developers"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Documentação Hotmart
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
