import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  icon: string;
  lastSync?: string;
  settings?: Record<string, any>;
}

interface IntegrationTabProps {
  funnelId?: string;
}

const IntegrationTab: React.FC<IntegrationTabProps> = ({ funnelId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [integrations] = useState<Integration[]>([
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      status: 'connected',
      description: 'Track visitor behavior and conversion metrics',
      icon: '📊',
      lastSync: '2 minutes ago',
      settings: { trackingId: 'UA-12345678-1' }
    },
    {
      id: 'facebook-pixel',
      name: 'Facebook Pixel',
      status: 'connected',
      description: 'Track conversions for Facebook ads',
      icon: '📘',
      lastSync: '5 minutes ago',
      settings: { pixelId: '123456789' }
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      status: 'disconnected',
      description: 'Sync leads to email marketing campaigns',
      icon: '📧',
      settings: {}
    },
    {
      id: 'zapier',
      name: 'Zapier',
      status: 'error',
      description: 'Automate workflows and data sync',
      icon: '⚡',
      lastSync: '2 hours ago',
      settings: { webhookUrl: 'https://hooks.zapier.com/...' }
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      status: 'connected',
      description: 'CRM integration for lead management',
      icon: '🎯',
      lastSync: '10 minutes ago',
      settings: { apiKey: 'hub_key_123' }
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    if (activeTab === 'all') return true;
    return integration.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Integrations</h3>
          <p className="text-sm text-gray-600">
            Connect your funnel to external services
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Manage All
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="disconnected">Disconnected</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{integration.name}</h4>
                        {getStatusIcon(integration.status)}
                      </div>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last sync: {integration.lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(integration.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </Button>
                  </div>
                </div>

                {/* Settings Preview */}
                {integration.status === 'connected' && Object.keys(integration.settings || {}).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Settings:</span>
                      {Object.entries(integration.settings || {}).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {String(value).substring(0, 10)}...
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="mt-4">
          <div className="space-y-4">
            {filteredIntegrations.filter(i => i.status === 'connected').map((integration) => (
              <Card key={integration.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{integration.name}</h4>
                        {getStatusIcon(integration.status)}
                      </div>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last sync: {integration.lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(integration.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </Button>
                  </div>
                </div>

                {/* Settings Preview */}
                {integration.status === 'connected' && Object.keys(integration.settings || {}).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Settings:</span>
                      {Object.entries(integration.settings || {}).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {String(value).substring(0, 10)}...
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="disconnected" className="mt-4">
          <div className="space-y-4">
            {filteredIntegrations.filter(i => i.status === 'disconnected').map((integration) => (
              <Card key={integration.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{integration.name}</h4>
                        {getStatusIcon(integration.status)}
                      </div>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last sync: {integration.lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(integration.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </Button>
                  </div>
                </div>

                {/* Settings Preview */}
                {integration.status === 'connected' && Object.keys(integration.settings || {}).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Settings:</span>
                      {Object.entries(integration.settings || {}).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {String(value).substring(0, 10)}...
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="error" className="mt-4">
          <div className="space-y-4">
            {filteredIntegrations.filter(i => i.status === 'error').map((integration) => (
              <Card key={integration.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{integration.icon}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{integration.name}</h4>
                        {getStatusIcon(integration.status)}
                      </div>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                      {integration.lastSync && (
                        <p className="text-xs text-gray-500">
                          Last sync: {integration.lastSync}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(integration.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configure</span>
                    </Button>
                  </div>
                </div>

                {/* Settings Preview */}
                {integration.status === 'connected' && Object.keys(integration.settings || {}).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>Settings:</span>
                      {Object.entries(integration.settings || {}).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="text-xs">
                          {key}: {String(value).substring(0, 10)}...
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Quick Actions</h4>
            <p className="text-sm text-gray-600">
              Common integration tasks
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Browse Apps
            </Button>
            <Button variant="outline" size="sm">
              Test All
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationTab;
