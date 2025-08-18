import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { AnalyticsSettings as AnalyticsSettingsType } from '@/types/funnelSettings';

interface AnalyticsSettingsProps {
  settings: AnalyticsSettingsType;
  onUpdate: (settings: Partial<AnalyticsSettingsType>) => void;
}

export const AnalyticsSettings: React.FC<AnalyticsSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Facebook Pixel</CardTitle>
          <CardDescription>
            Configure o Facebook Pixel para rastrear conversões e criar audiences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="facebookPixelId">ID do Facebook Pixel</Label>
            <Input
              id="facebookPixelId"
              value={settings.facebookPixelId}
              onChange={e => onUpdate({ facebookPixelId: e.target.value })}
              placeholder="123456789012345"
            />
            <p className="text-sm text-muted-foreground">
              Encontre seu ID do Pixel no Gerenciador de Eventos do Facebook
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Analytics</CardTitle>
          <CardDescription>
            Configure o Google Analytics para acompanhar o tráfego e comportamento dos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="googleAnalyticsId">ID do Google Analytics (GA4)</Label>
            <Input
              id="googleAnalyticsId"
              value={settings.googleAnalyticsId}
              onChange={e => onUpdate({ googleAnalyticsId: e.target.value })}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gtmId">ID do Google Tag Manager</Label>
            <Input
              id="gtmId"
              value={settings.gtmId}
              onChange={e => onUpdate({ gtmId: e.target.value })}
              placeholder="GTM-XXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outras Ferramentas</CardTitle>
          <CardDescription>Configure outras ferramentas de analytics e heatmaps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hotjarId">ID do Hotjar</Label>
            <Input
              id="hotjarId"
              value={settings.hotjarId}
              onChange={e => onUpdate({ hotjarId: e.target.value })}
              placeholder="1234567"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableConversionTracking"
              checked={settings.enableConversionTracking}
              onCheckedChange={checked => onUpdate({ enableConversionTracking: checked })}
            />
            <Label htmlFor="enableConversionTracking">
              Habilitar rastreamento de conversões avançado
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Código Personalizado</CardTitle>
          <CardDescription>
            Adicione códigos customizados para ferramentas específicas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customHeadCode">Código para o &lt;head&gt;</Label>
            <Textarea
              id="customHeadCode"
              value={settings.customHeadCode}
              onChange={e => onUpdate({ customHeadCode: e.target.value })}
              placeholder="<!-- Seu código personalizado aqui -->"
              className="min-h-[100px] font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Código que será inserido no head da página
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customBodyCode">Código para o &lt;body&gt;</Label>
            <Textarea
              id="customBodyCode"
              value={settings.customBodyCode}
              onChange={e => onUpdate({ customBodyCode: e.target.value })}
              placeholder="<!-- Seu código personalizado aqui -->"
              className="min-h-[100px] font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Código que será inserido no final do body da página
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
