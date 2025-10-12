import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { StorageService } from '@/services/core/StorageService';

interface WebhookCardProps {
  initialUrl?: string;
  initialEnabled?: boolean;
}

export const WebhookCard: React.FC<WebhookCardProps> = ({
  initialUrl = '',
  initialEnabled = false,
}) => {
  const [webhookUrl, setWebhookUrl] = useState(initialUrl);
  const [webhookEnabled, setWebhookEnabled] = useState(initialEnabled);

  const handleSaveWebhook = () => {
    try {
      StorageService.safeSetString('webhook_url', webhookUrl);
      StorageService.safeSetString('webhook_enabled', String(webhookEnabled));
      toast({
        title: 'Webhook settings saved',
        description: 'Your webhook integration settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'There was an error saving your settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleTestConnection = () => {
    toast({
      title: 'Testing Webhook connection',
      description: 'Connection test initiated. Please check the console for results.',
    });
    console.log('Testing connection to Webhook...');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Custom Webhook</CardTitle>
            <CardDescription>Send analytics events to your own endpoint</CardDescription>
          </div>
          <Badge variant={webhookEnabled ? 'default' : 'outline'}>
            {webhookEnabled ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input
            id="webhook-url"
            placeholder="https://your-api.com/analytics-webhook"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Your endpoint that will receive analytics events
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="webhook-enabled"
            checked={webhookEnabled}
            onCheckedChange={setWebhookEnabled}
          />
          <Label htmlFor="webhook-enabled">Enable webhook</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTestConnection}>
          Test Webhook
        </Button>
        <Button onClick={handleSaveWebhook}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};
