import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Webhook, Zap, CheckCircle, AlertTriangle, TestTube } from 'lucide-react';
import { FunnelWebhooksConfig } from '@/templates/funnel-configs/quiz21StepsComplete.config';

interface WebhooksConfigTabProps {
    webhooks: FunnelWebhooksConfig;
    onUpdate: (updates: Partial<FunnelWebhooksConfig>) => void;
    disabled?: boolean;
}

export default function WebhooksConfigTab({ webhooks, onUpdate, disabled = false }: WebhooksConfigTabProps) {
    // Validação de URLs
    const validateURL = (url: string) => {
        try {
            const parsed = new URL(url);
            return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
            return false;
        }
    };

    // Status dos webhooks
    const webhookFields = [
        { key: 'leadCapture', label: 'Captura de Lead', description: 'Disparado quando um visitante fornece seus dados de contato' },
        { key: 'formSubmission', label: 'Envio de Formulário', description: 'Disparado quando qualquer formulário é submetido' },
        { key: 'quizComplete', label: 'Quiz Finalizado', description: 'Disparado quando o usuário completa todo o quiz' },
        { key: 'purchaseComplete', label: 'Compra Finalizada', description: 'Disparado quando uma compra é concluída' }
    ];

    const getWebhookStatus = (url?: string) => {
        if (!url) return { status: 'empty', message: 'Não configurado', color: 'bg-gray-100 text-gray-800' };
        if (validateURL(url)) return { status: 'valid', message: 'Válido ✅', color: 'bg-green-100 text-green-800' };
        return { status: 'invalid', message: 'URL inválida', color: 'bg-red-100 text-red-800' };
    };

    // Teste de webhook (simulação)
    const testWebhook = async (url: string, type: string) => {
        if (!validateURL(url)) {
            alert('URL inválida para teste');
            return;
        }

        try {
            console.log(`🧪 Testando webhook ${type}: ${url}`);
            // Aqui você implementaria o teste real do webhook
            // Por enquanto, apenas simula o teste
            alert(`Teste de webhook enviado para: ${url}\n\nVerifique seus logs para confirmar o recebimento.`);
        } catch (error) {
            console.error('❌ Erro no teste do webhook:', error);
            alert('Erro ao testar webhook. Verifique a URL e tente novamente.');
        }
    };

    const activeWebhooks = webhookFields.filter(field => {
        const url = webhooks[field.key as keyof FunnelWebhooksConfig] as string;
        return url && validateURL(url);
    }).length;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5" />
                    Configurações de Webhooks
                </CardTitle>
                <CardDescription>
                    Configure endpoints para receber notificações em tempo real de eventos do funil
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Toggle Principal */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Webhooks Habilitados
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Habilite para receber notificações HTTP dos eventos do funil
                            </p>
                        </div>
                        <Switch
                            checked={webhooks.enabled || false}
                            onCheckedChange={(checked) => onUpdate({ enabled: checked })}
                            disabled={disabled}
                        />
                    </div>

                    {webhooks.enabled && (
                        <Alert>
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                                Webhooks habilitados! Configure as URLs abaixo para receber notificações.
                                {activeWebhooks > 0 && ` ${activeWebhooks} webhook(s) configurado(s).`}
                            </AlertDescription>
                        </Alert>
                    )}

                    {!webhooks.enabled && (
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Webhooks desabilitados. Nenhuma notificação será enviada mesmo com URLs configuradas.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Configuração de Webhooks */}
                {webhooks.enabled && (
                    <div className="space-y-6">
                        {webhookFields.map((field) => {
                            const url = webhooks[field.key as keyof FunnelWebhooksConfig] as string;
                            const status = getWebhookStatus(url);

                            return (
                                <div key={field.key} className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor={field.key} className="font-medium">
                                                {field.label}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                {field.description}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className={status.color}>
                                            {status.message}
                                        </Badge>
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            id={field.key}
                                            value={url || ''}
                                            onChange={(e) => onUpdate({ [field.key]: e.target.value })}
                                            placeholder="https://seu-endpoint.com/webhook"
                                            disabled={disabled}
                                            className={status.status === 'valid' ? 'border-green-300' : status.status === 'invalid' ? 'border-red-300' : ''}
                                        />
                                        {url && validateURL(url) && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => testWebhook(url, field.label)}
                                                className="gap-1 whitespace-nowrap"
                                                disabled={disabled}
                                            >
                                                <TestTube className="h-3 w-3" />
                                                Testar
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Informações sobre Payload */}
                {webhooks.enabled && (
                    <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium text-sm">Estrutura do Payload</h4>
                        <div className="bg-muted p-3 rounded-lg">
                            <pre className="text-xs overflow-auto">
                                {`{
  "event": "leadCapture",
  "timestamp": "2024-01-15T10:30:00Z",
  "funnelId": "quiz-example",
  "sessionId": "session_123",
  "data": {
    "email": "usuario@exemplo.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "customFields": { ... }
  },
  "source": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "campanha_teste"
  }
}`}
                            </pre>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Todos os webhooks enviarão dados no formato JSON via POST com Content-Type: application/json
                        </p>
                    </div>
                )}

                {/* Status Summary */}
                {webhooks.enabled && (
                    <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium text-sm">Status dos Webhooks</h4>
                        <div className="grid grid-cols-1 gap-2">
                            {webhookFields.map((field) => {
                                const url = webhooks[field.key as keyof FunnelWebhooksConfig] as string;
                                const status = getWebhookStatus(url);

                                return (
                                    <div key={field.key} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                                        <span>{field.label}</span>
                                        <Badge variant={status.status === 'valid' ? 'default' : 'secondary'}>
                                            {status.status === 'valid' ? 'Configurado' : 'Não configurado'}
                                        </Badge>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Configurações de Segurança */}
                {webhooks.enabled && (
                    <div className="border-t pt-4 space-y-3">
                        <h4 className="font-medium text-sm">Segurança e Boas Práticas</h4>
                        <div className="space-y-2 text-xs text-muted-foreground">
                            <p>• Use sempre HTTPS para URLs de webhook</p>
                            <p>• Configure timeouts apropriados em seu endpoint (recomendado: 10 segundos)</p>
                            <p>• Implemente validação de origem usando IPs ou tokens</p>
                            <p>• Retorne status HTTP 200 para confirmar recebimento</p>
                            <p>• Implemente retry logic para falhas temporárias</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}