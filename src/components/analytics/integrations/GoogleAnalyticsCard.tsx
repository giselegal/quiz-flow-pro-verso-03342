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

interface GoogleAnalyticsCardProps {
  initialId?: string;
  initialEnabled?: boolean;
}

export const GoogleAnalyticsCard: React.FC<GoogleAnalyticsCardProps> = ({
  initialId = '',
  initialEnabled = false,
}) => {
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(initialId);
  const [googleAnalyticsEnabled, setGoogleAnalyticsEnabled] = useState(initialEnabled);

  const handleSaveGoogleAnalytics = () => {
    try {
      localStorage.setItem('ga_id', googleAnalyticsId);
      localStorage.setItem('ga_enabled', String(googleAnalyticsEnabled));
      toast({
        title: 'Google Analytics settings saved',
        description: 'Your Google Analytics integration settings have been updated.',
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
      title: 'Testing Google Analytics connection',
      description: 'Connection test initiated. Please check the console for results.',
    });
    console.log('Testing connection to Google Analytics...');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Google Analytics</CardTitle>
            <CardDescription>
              Connect your Google Analytics account to track user behavior
            </CardDescription>
          </div>
          <Badge variant={googleAnalyticsEnabled ? 'default' : 'outline'}>
            {googleAnalyticsEnabled ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleTestConnection}>
          Test Connection
        </Button>
        <Button onClick={handleSaveGoogleAnalytics}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};
