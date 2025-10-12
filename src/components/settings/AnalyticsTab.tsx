import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'wouter';
import { BarChartHorizontal } from 'lucide-react';
import { StorageService } from '@/services/core/StorageService';

export const AnalyticsTab: React.FC = () => {
  const [pixelId, setPixelId] = useState(() => {
    try {
      // Try to extract the Pixel ID from an inline script in index.html
      const scriptContent = document.querySelector('script:not([src])')?.textContent || '';
      const match = scriptContent.match(/fbq\('init', ['"]([^'"]+)['"]\)/);
      return match?.[1] || '123456789012345';
    } catch (error) {
      console.error('Error extracting Pixel ID:', error);
      return '123456789012345';
    }
  });
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  const handleSavePixelSettings = () => {
    // In a real application, this would save to a backend
    // Here we're just simulating with localStorage
    StorageService.safeSetString('fb_pixel_id', pixelId);
    StorageService.safeSetString('tracking_enabled', String(trackingEnabled));

    toast({
      title: 'Settings saved',
      description: 'Pixel settings have been updated successfully.',
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Facebook Pixel Configuration</CardTitle>
          <CardDescription>Configure event tracking on Facebook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pixelId">Facebook Pixel ID</Label>
            <Input
              id="pixelId"
              value={pixelId}
              onChange={e => setPixelId(e.target.value)}
              placeholder="e.g. 123456789012345"
            />
            <p className="text-sm text-muted-foreground">
              You can find your Pixel ID in Facebook Events Manager &gt; Settings &gt; Facebook
              Pixel.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="trackingEnabled"
              checked={trackingEnabled}
              onCheckedChange={setTrackingEnabled}
            />
            <Label htmlFor="trackingEnabled">Enable event tracking</Label>
          </div>

          <Button className="bg-[#B89B7A] hover:bg-[#A38A69]" onClick={handleSavePixelSettings}>
            Save Pixel Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Teste A/B</CardTitle>
          <CardDescription>Compare diferentes versões da página de resultado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Use o teste A/B para comparar diferentes layouts, estruturas e apelos visuais da página
            de resultados e medir qual versão converte melhor.
          </p>

          <Button asChild variant="outline" className="w-full">
            <Link to="/admin/ab-test" className="flex items-center justify-center gap-2">
              <BarChartHorizontal className="h-4 w-4" />
              Acessar Teste A/B
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>View metrics and quiz performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p>
            Use the analytics dashboard to track important metrics such as conversions, completion
            rates, and conversion funnel.
          </p>

          <Button asChild>
            <Link to="/admin/analytics">View Analytics Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
