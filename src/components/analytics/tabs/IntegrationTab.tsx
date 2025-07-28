
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Settings, CheckCircle, AlertCircle } from 'lucide-react';

export const IntegrationTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState('facebook');

  const integrations = [
    {
      id: 'facebook',
      name: 'Facebook Pixel',
      description: 'Track conversions and optimize ads',
      status: 'connected',
      icon: '📘',
      settings: {
        pixelId: '1234567890',
        trackPurchases: true,
        trackLeads: true,
        trackPageViews: true
      }
    },
    {
      id: 'google',
      name: 'Google Analytics',
      description: 'Comprehensive web analytics',
      status: 'connected',
      icon: '📊',
      settings: {
        measurementId: 'G-XXXXXXXXXX',
        trackEvents: true,
        trackConversions: true,
        enhancedEcommerce: false
      }
    },
    {
      id: 'hotmart',
      name: 'Hotmart',
      description: 'E-commerce and affiliate tracking',
      status: 'disconnected',
      icon: '🛒',
      settings: {
        affiliateId: '',
        trackSales: false,
        trackCommissions: false
      }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Settings className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Integrações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="hotmart">Hotmart</TabsTrigger>
          </TabsList>

          {integrations.map((integration) => (
            <TabsContent key={integration.id} value={integration.id} className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(integration.status)}>
                    {getStatusIcon(integration.status)}
                    {integration.status === 'connected' ? 'Conectado' : 'Desconectado'}
                  </Badge>
                </div>

                {integration.id === 'facebook' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pixelId">Pixel ID</Label>
                        <Input
                          id="pixelId"
                          value={integration.settings.pixelId}
                          placeholder="Digite o ID do Pixel"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackPurchases">Rastrear Compras</Label>
                        <Switch
                          id="trackPurchases"
                          checked={integration.settings.trackPurchases}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackLeads">Rastrear Leads</Label>
                        <Switch
                          id="trackLeads"
                          checked={integration.settings.trackLeads}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackPageViews">Rastrear Visualizações</Label>
                        <Switch
                          id="trackPageViews"
                          checked={integration.settings.trackPageViews}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {integration.id === 'google' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="measurementId">Measurement ID</Label>
                        <Input
                          id="measurementId"
                          value={integration.settings.measurementId}
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackEvents">Rastrear Eventos</Label>
                        <Switch
                          id="trackEvents"
                          checked={integration.settings.trackEvents}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackConversions">Rastrear Conversões</Label>
                        <Switch
                          id="trackConversions"
                          checked={integration.settings.trackConversions}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="enhancedEcommerce">Enhanced E-commerce</Label>
                        <Switch
                          id="enhancedEcommerce"
                          checked={integration.settings.enhancedEcommerce}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {integration.id === 'hotmart' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="affiliateId">Affiliate ID</Label>
                        <Input
                          id="affiliateId"
                          value={integration.settings.affiliateId}
                          placeholder="Digite o ID do afiliado"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackSales">Rastrear Vendas</Label>
                        <Switch
                          id="trackSales"
                          checked={integration.settings.trackSales}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trackCommissions">Rastrear Comissões</Label>
                        <Switch
                          id="trackCommissions"
                          checked={integration.settings.trackCommissions}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Testar Conexão</Button>
                  <Button>
                    {integration.status === 'connected' ? 'Atualizar' : 'Conectar'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
