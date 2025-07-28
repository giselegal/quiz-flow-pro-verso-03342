
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Settings, CheckCircle } from 'lucide-react';

interface IntegrationTabProps {
  data: {
    integrationsData: {
      googleAnalytics: {
        enabled: boolean;
        trackingId: string;
        sessions: number;
        pageviews: number;
        conversionRate: number;
      };
      facebookPixel: {
        enabled: boolean;
        pixelId: string;
        events: number;
        conversions: number;
        cpm: number;
      };
      webhooks: {
        enabled: boolean;
        endpoints: Array<{
          url: string;
          events: string[];
          status: 'active' | 'inactive';
        }>;
      };
      zapier: {
        enabled: boolean;
        zaps: number;
        lastSync: string;
      };
    };
  };
}

export const IntegrationTab: React.FC<IntegrationTabProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { integrationsData } = data;

  const integrations = [
    {
      id: 'analytics',
      name: 'Google Analytics',
      icon: '📊',
      enabled: integrationsData.googleAnalytics.enabled,
      description: 'Rastreamento detalhado de conversões',
      data: integrationsData.googleAnalytics
    },
    {
      id: 'facebook',
      name: 'Facebook Pixel',
      icon: '📘',
      enabled: integrationsData.facebookPixel.enabled,
      description: 'Otimização de campanhas publicitárias',
      data: integrationsData.facebookPixel
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      icon: '🔗',
      enabled: integrationsData.webhooks.enabled,
      description: 'Integração com sistemas externos',
      data: integrationsData.webhooks
    },
    {
      id: 'zapier',
      name: 'Zapier',
      icon: '⚡',
      enabled: integrationsData.zapier.enabled,
      description: 'Automações avançadas',
      data: integrationsData.zapier
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{integration.icon}</span>
                  <CardTitle className="text-sm">{integration.name}</CardTitle>
                </div>
                <Badge variant={integration.enabled ? 'default' : 'secondary'}>
                  {integration.enabled ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">{integration.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="w-3 h-3 mr-2" />
                Configurar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Detalhadas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="zapier">Zapier</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.googleAnalytics.sessions.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Sessões</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.googleAnalytics.pageviews.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Visualizações</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.googleAnalytics.conversionRate}%</div>
                    <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="facebook" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.facebookPixel.events.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Eventos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.facebookPixel.conversions}</div>
                    <p className="text-xs text-muted-foreground">Conversões</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">R$ {integrationsData.facebookPixel.cpm}</div>
                    <p className="text-xs text-muted-foreground">CPM</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="webhooks" className="space-y-4">
              <div className="space-y-3">
                {integrationsData.webhooks.endpoints.map((endpoint, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className={`w-4 h-4 ${endpoint.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                          <div>
                            <p className="font-medium text-sm">{endpoint.url}</p>
                            <p className="text-xs text-muted-foreground">
                              {endpoint.events.join(', ')}
                            </p>
                          </div>
                        </div>
                        <Badge variant={endpoint.status === 'active' ? 'default' : 'secondary'}>
                          {endpoint.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="zapier" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.zapier.zaps}</div>
                    <p className="text-xs text-muted-foreground">Zaps Ativos</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">{integrationsData.zapier.lastSync}</div>
                    <p className="text-xs text-muted-foreground">Última Sincronização</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
