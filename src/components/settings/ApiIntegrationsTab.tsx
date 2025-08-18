import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';

export const ApiIntegrationsTab: React.FC = () => {
  // Google Analytics states
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(() => {
    return localStorage.getItem('ga_id') || '';
  });
  const [googleAnalyticsEnabled, setGoogleAnalyticsEnabled] = useState(() => {
    return localStorage.getItem('ga_enabled') !== 'false';
  });

  // Webhook states
  const [webhookUrl, setWebhookUrl] = useState(() => {
    return localStorage.getItem('webhook_url') || '';
  });
  const [webhookEnabled, setWebhookEnabled] = useState(() => {
    return localStorage.getItem('webhook_enabled') === 'true';
  });

  const handleSaveGoogleAnalytics = () => {
    localStorage.setItem('ga_id', googleAnalyticsId);
    localStorage.setItem('ga_enabled', String(googleAnalyticsEnabled));

    toast({
      title: 'Settings saved',
      description: 'Google Analytics settings have been updated successfully.',
    });
  };

  const handleSaveWebhook = () => {
    localStorage.setItem('webhook_url', webhookUrl);
    localStorage.setItem('webhook_enabled', String(webhookEnabled));

    toast({
      title: 'Settings saved',
      description: 'Webhook settings have been updated successfully.',
    });
  };

  const handleTestConnection = (service: string) => {
    toast({
      title: `Testing ${service} connection`,
      description: 'Connection test initiated. Please check the console for results.',
    });
    console.log(`Testing connection to ${service}...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Google Analytics</CardTitle>
          <CardDescription>Configure Google Analytics integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="ga-id">Measurement ID</Label>
            <Input
              id="ga-id"
              placeholder="G-XXXXXXXXXX"
              value={googleAnalyticsId}
              onChange={e => setGoogleAnalyticsId(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Found in your Google Analytics property settings under "Data Streams"
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ga-tracking"
              checked={googleAnalyticsEnabled}
              onCheckedChange={setGoogleAnalyticsEnabled}
            />
            <Label htmlFor="ga-tracking">Enable Google Analytics tracking</Label>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleTestConnection('Google Analytics')}>
              Test Connection
            </Button>

            <Button className="bg-[#B89B7A] hover:bg-[#A38A69]" onClick={handleSaveGoogleAnalytics}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Integration</CardTitle>
          <CardDescription>Configure webhook for event notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-api.com/webhook"
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter the URL that should receive webhook notifications
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="webhook-enabled"
              checked={webhookEnabled}
              onCheckedChange={setWebhookEnabled}
            />
            <Label htmlFor="webhook-enabled">Enable webhook notifications</Label>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => handleTestConnection('Webhook')}>
              Test Webhook
            </Button>

            <Button className="bg-[#B89B7A] hover:bg-[#A38A69]" onClick={handleSaveWebhook}>
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Tokens</CardTitle>
          <CardDescription>Manage API tokens for your application</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            API tokens allow external services to access your application's data.
          </p>
          <Button variant="outline">Generate New API Token</Button>
        </CardContent>
      </Card>
    </div>
  );
};
