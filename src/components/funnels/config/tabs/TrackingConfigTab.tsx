import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Facebook, Eye, Zap } from 'lucide-react';
import { FunnelTrackingConfig } from '@/templates/funnel-configs/quiz21StepsComplete.config';

interface TrackingConfigTabProps {
    tracking: FunnelTrackingConfig;
    onUpdate: (updates: Partial<FunnelTrackingConfig>) => void;
    disabled?: boolean;
}

export default function TrackingConfigTab({ tracking, onUpdate, disabled = false }: TrackingConfigTabProps) {
    // Validação de IDs
    const validatePixelId = (id: string) => {
        return id.length >= 15 && /^\d+$/.test(id);
    };

    const validateGoogleAnalytics = (id: string) => {
        return /^(GA-\d+-\d+|G-[A-Z0-9]+)$/.test(id);
    };

    const validateHotjar = (id: string) => {
        return id.length >= 6 && /^\d+$/.test(id);
    };

    const getValidationStatus = (value: string, validator: (id: string) => boolean) => {
        if (!value) return { status: 'empty', message: 'Não configurado' };
        if (validator(value)) return { status: 'valid', message: 'Válido ✅' };
        return { status: 'invalid', message: 'Formato inválido' };
    };

    const pixelStatus = getValidationStatus(tracking.facebookPixel || '', validatePixelId);
    const gaStatus = getValidationStatus(tracking.googleAnalytics || '', validateGoogleAnalytics);
    const hotjarStatus = getValidationStatus(tracking.hotjar || '', validateHotjar);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return 'bg-green-100 text-green-800';
            case 'invalid': return 'bg-red-100 text-red-800';
            case 'empty': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Configurações de Tracking
                </CardTitle>
                <CardDescription>
                    Configure pixels e ferramentas de análise para acompanhar conversões
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Facebook Pixel */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="facebook-pixel" className="flex items-center gap-2">
                            <Facebook className="h-4 w-4 text-blue-600" />
                            Facebook Pixel ID
                        </Label>
                        <Badge variant="outline" className={getStatusColor(pixelStatus.status)}>
                            {pixelStatus.message}
                        </Badge>
                    </div>
                    <Input
                        id="facebook-pixel"
                        value={tracking.facebookPixel || ''}
                        onChange={(e) => onUpdate({ facebookPixel: e.target.value })}
                        placeholder="123456789012345 (15 dígitos)"
                        disabled={disabled}
                        className={pixelStatus.status === 'valid' ? 'border-green-300' : pixelStatus.status === 'invalid' ? 'border-red-300' : ''}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {pixelStatus.status === 'invalid' && 'ID deve conter apenas números e ter pelo menos 15 dígitos'}
                            {pixelStatus.status === 'empty' && 'Encontre seu Pixel ID no Facebook Business Manager'}
                            {pixelStatus.status === 'valid' && 'Pixel configurado corretamente!'}
                        </span>
                        {tracking.facebookPixel && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-xs"
                                onClick={() => window.open(`https://business.facebook.com/events_manager2/list/pixel/${tracking.facebookPixel}/overview`, '_blank')}
                            >
                                Verificar no Facebook
                            </Button>
                        )}
                    </div>
                </div>

                {/* Google Analytics */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="google-analytics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-orange-600" />
                            Google Analytics ID
                        </Label>
                        <Badge variant="outline" className={getStatusColor(gaStatus.status)}>
                            {gaStatus.message}
                        </Badge>
                    </div>
                    <Input
                        id="google-analytics"
                        value={tracking.googleAnalytics || ''}
                        onChange={(e) => onUpdate({ googleAnalytics: e.target.value })}
                        placeholder="G-XXXXXXXXXX ou GA-XXXXX-X"
                        disabled={disabled}
                        className={gaStatus.status === 'valid' ? 'border-green-300' : gaStatus.status === 'invalid' ? 'border-red-300' : ''}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {gaStatus.status === 'invalid' && 'Formato deve ser G-XXXXXXXXXX (GA4) ou GA-XXXXX-X (Universal)'}
                            {gaStatus.status === 'empty' && 'Encontre seu Measurement ID no Google Analytics'}
                            {gaStatus.status === 'valid' && 'Google Analytics configurado corretamente!'}
                        </span>
                        {tracking.googleAnalytics && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-xs"
                                onClick={() => window.open('https://analytics.google.com/', '_blank')}
                            >
                                Abrir Analytics
                            </Button>
                        )}
                    </div>
                </div>

                {/* Hotjar */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="hotjar" className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-red-600" />
                            Hotjar Site ID
                        </Label>
                        <Badge variant="outline" className={getStatusColor(hotjarStatus.status)}>
                            {hotjarStatus.message}
                        </Badge>
                    </div>
                    <Input
                        id="hotjar"
                        value={tracking.hotjar || ''}
                        onChange={(e) => onUpdate({ hotjar: e.target.value })}
                        placeholder="1234567"
                        disabled={disabled}
                        className={hotjarStatus.status === 'valid' ? 'border-green-300' : hotjarStatus.status === 'invalid' ? 'border-red-300' : ''}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {hotjarStatus.status === 'invalid' && 'ID deve conter apenas números e ter pelo menos 6 dígitos'}
                            {hotjarStatus.status === 'empty' && 'Encontre seu Site ID no painel do Hotjar'}
                            {hotjarStatus.status === 'valid' && 'Hotjar configurado corretamente!'}
                        </span>
                        {tracking.hotjar && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-1 text-xs"
                                onClick={() => window.open(`https://insights.hotjar.com/sites/${tracking.hotjar}/dashboard`, '_blank')}
                            >
                                Abrir Hotjar
                            </Button>
                        )}
                    </div>
                </div>

                {/* Eventos Personalizados */}
                <div className="border-t pt-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <h4 className="font-medium text-sm">Eventos Personalizados</h4>
                    </div>

                    {tracking.customEvents && Object.keys(tracking.customEvents).length > 0 ? (
                        <div className="space-y-2">
                            {Object.entries(tracking.customEvents).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                                    <span className="text-sm font-mono">{key}</span>
                                    <Badge variant="secondary">{typeof value}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Nenhum evento personalizado configurado. Eventos podem ser adicionados via código.
                        </p>
                    )}
                </div>

                {/* Status Summary */}
                <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-3">Status das Configurações</h4>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                            <span>Facebook Pixel</span>
                            <Badge variant={pixelStatus.status === 'valid' ? 'default' : 'secondary'}>
                                {pixelStatus.status === 'valid' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                            <span>Google Analytics</span>
                            <Badge variant={gaStatus.status === 'valid' ? 'default' : 'secondary'}>
                                {gaStatus.status === 'valid' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                            <span>Hotjar</span>
                            <Badge variant={hotjarStatus.status === 'valid' ? 'default' : 'secondary'}>
                                {hotjarStatus.status === 'valid' ? 'Ativo' : 'Inativo'}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}