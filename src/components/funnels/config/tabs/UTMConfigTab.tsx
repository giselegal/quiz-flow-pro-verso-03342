import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Target, Copy } from 'lucide-react';
import { FunnelUTMConfig } from '@/templates/funnel-configs/quiz21StepsComplete.config';

interface UTMConfigTabProps {
    utm: FunnelUTMConfig;
    onUpdate: (updates: Partial<FunnelUTMConfig>) => void;
    disabled?: boolean;
}

export default function UTMConfigTab({ utm, onUpdate, disabled = false }: UTMConfigTabProps) {
    // Validação de campos obrigatórios
    const requiredFields = ['source', 'medium', 'campaign'];
    const isComplete = requiredFields.every(field => utm[field as keyof FunnelUTMConfig]);

    // Gerar URL de exemplo
    const generateExampleURL = () => {
        if (!utm.source || !utm.medium || !utm.campaign) return '';

        const baseURL = 'https://seudominio.com/funil';
        const params = new URLSearchParams();

        if (utm.source) params.append('utm_source', utm.source);
        if (utm.medium) params.append('utm_medium', utm.medium);
        if (utm.campaign) params.append('utm_campaign', utm.campaign);
        if (utm.term) params.append('utm_term', utm.term);
        if (utm.content) params.append('utm_content', utm.content);

        return `${baseURL}?${params.toString()}`;
    };

    const exampleURL = generateExampleURL();

    const copyURL = async () => {
        if (!exampleURL) return;
        try {
            await navigator.clipboard.writeText(exampleURL);
            console.log('🔗 URL UTM copiada para área de transferência');
        } catch (err) {
            console.error('❌ Erro ao copiar URL:', err);
        }
    };

    // Sugestões comuns
    const sourceSuggestions = ['google', 'facebook', 'instagram', 'email', 'linkedin', 'youtube', 'direct'];
    const mediumSuggestions = ['cpc', 'social', 'email', 'organic', 'referral', 'display', 'video'];

    const fillSuggestion = (field: keyof FunnelUTMConfig, value: string) => {
        onUpdate({ [field]: value });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Configurações UTM
                </CardTitle>
                <CardDescription>
                    Configure parâmetros UTM para rastrear origem do tráfego e campanhas
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Campos Obrigatórios */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant={isComplete ? 'default' : 'secondary'}>
                            {isComplete ? 'Configuração Completa' : 'Campos Obrigatórios'}
                        </Badge>
                    </div>

                    {/* UTM Source */}
                    <div className="space-y-2">
                        <Label htmlFor="utm-source" className="flex items-center gap-2">
                            UTM Source <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="utm-source"
                            value={utm.source || ''}
                            onChange={(e) => onUpdate({ source: e.target.value })}
                            placeholder="google, facebook, email, etc."
                            disabled={disabled}
                            required
                        />
                        <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-muted-foreground mr-2">Sugestões:</span>
                            {sourceSuggestions.map((suggestion) => (
                                <Button
                                    key={suggestion}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => fillSuggestion('source', suggestion)}
                                    disabled={disabled}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* UTM Medium */}
                    <div className="space-y-2">
                        <Label htmlFor="utm-medium" className="flex items-center gap-2">
                            UTM Medium <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="utm-medium"
                            value={utm.medium || ''}
                            onChange={(e) => onUpdate({ medium: e.target.value })}
                            placeholder="cpc, social, email, etc."
                            disabled={disabled}
                            required
                        />
                        <div className="flex flex-wrap gap-1">
                            <span className="text-xs text-muted-foreground mr-2">Sugestões:</span>
                            {mediumSuggestions.map((suggestion) => (
                                <Button
                                    key={suggestion}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => fillSuggestion('medium', suggestion)}
                                    disabled={disabled}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* UTM Campaign */}
                    <div className="space-y-2">
                        <Label htmlFor="utm-campaign" className="flex items-center gap-2">
                            UTM Campaign <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="utm-campaign"
                            value={utm.campaign || ''}
                            onChange={(e) => onUpdate({ campaign: e.target.value })}
                            placeholder="promo_verao_2024, lancamento_produto, etc."
                            disabled={disabled}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Nome específico da campanha ou promoção
                        </p>
                    </div>
                </div>

                {/* Campos Opcionais */}
                <div className="border-t pt-4 space-y-4">
                    <h4 className="font-medium text-sm">Parâmetros Opcionais</h4>

                    {/* UTM Term */}
                    <div className="space-y-2">
                        <Label htmlFor="utm-term">UTM Term</Label>
                        <Input
                            id="utm-term"
                            value={utm.term || ''}
                            onChange={(e) => onUpdate({ term: e.target.value })}
                            placeholder="palavras-chave pagas, segmentação, etc."
                            disabled={disabled}
                        />
                        <p className="text-xs text-muted-foreground">
                            Usado principalmente para campanhas pagas (palavras-chave)
                        </p>
                    </div>

                    {/* UTM Content */}
                    <div className="space-y-2">
                        <Label htmlFor="utm-content">UTM Content</Label>
                        <Input
                            id="utm-content"
                            value={utm.content || ''}
                            onChange={(e) => onUpdate({ content: e.target.value })}
                            placeholder="banner_superior, link_texto, botao_cta, etc."
                            disabled={disabled}
                        />
                        <p className="text-xs text-muted-foreground">
                            Identifica o conteúdo específico que foi clicado
                        </p>
                    </div>
                </div>

                {/* Preview da URL */}
                {exampleURL && (
                    <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                                <Link className="h-4 w-4" />
                                URL de Exemplo
                            </Label>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyURL}
                                className="gap-2"
                                disabled={!exampleURL}
                            >
                                <Copy className="h-4 w-4" />
                                Copiar
                            </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                            <code className="text-xs break-all">{exampleURL}</code>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Esta URL incluirá automaticamente os parâmetros UTM configurados
                        </p>
                    </div>
                )}

                {/* Documentação UTM */}
                <div className="border-t pt-4 space-y-3">
                    <h4 className="font-medium text-sm">Guia Rápido UTM</h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">utm_source</span>
                            <span className="text-muted-foreground">De onde veio o tráfego</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">utm_medium</span>
                            <span className="text-muted-foreground">Tipo de mídia/canal</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">utm_campaign</span>
                            <span className="text-muted-foreground">Nome da campanha</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">utm_term</span>
                            <span className="text-muted-foreground">Palavras-chave (opcional)</span>
                        </div>
                        <div className="flex justify-between p-2 bg-muted rounded">
                            <span className="font-medium">utm_content</span>
                            <span className="text-muted-foreground">Conteúdo específico (opcional)</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}