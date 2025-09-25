import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Tag } from 'lucide-react';
import { FunnelSEOOverrides } from '@/templates/funnel-configs/quiz21StepsComplete.config';

interface SEOConfigTabProps {
    seo: FunnelSEOOverrides;
    onUpdate: (updates: Partial<FunnelSEOOverrides>) => void;
    disabled?: boolean;
}

export default function SEOConfigTab({ seo, onUpdate, disabled = false }: SEOConfigTabProps) {
    const titleLength = seo.title?.length || 0;
    const descriptionLength = seo.description?.length || 0;

    // Validações de SEO
    const titleStatus = titleLength === 0 ? 'empty' : titleLength < 30 ? 'short' : titleLength > 60 ? 'long' : 'good';
    const descriptionStatus = descriptionLength === 0 ? 'empty' : descriptionLength < 120 ? 'short' : descriptionLength > 160 ? 'long' : 'good';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return 'bg-green-100 text-green-800';
            case 'short': return 'bg-yellow-100 text-yellow-800';
            case 'long': return 'bg-red-100 text-red-800';
            case 'empty': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Configurações de SEO
                </CardTitle>
                <CardDescription>
                    Otimize seu funil para mecanismos de busca e redes sociais
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Título SEO */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="seo-title" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Título SEO
                        </Label>
                        <Badge variant="outline" className={getStatusColor(titleStatus)}>
                            {titleLength} chars
                        </Badge>
                    </div>
                    <Input
                        id="seo-title"
                        value={seo.title || ''}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        placeholder="Título otimizado para SEO (30-60 caracteres recomendados)"
                        disabled={disabled}
                        className={titleStatus === 'good' ? 'border-green-300' : titleStatus === 'long' || titleStatus === 'short' ? 'border-yellow-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        {titleStatus === 'empty' && 'Título obrigatório para SEO'}
                        {titleStatus === 'short' && 'Título muito curto. Recomendado 30-60 caracteres.'}
                        {titleStatus === 'long' && 'Título muito longo. Pode ser cortado nos resultados de busca.'}
                        {titleStatus === 'good' && 'Comprimento ideal para SEO! ✅'}
                    </p>
                </div>

                {/* Descrição SEO */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="seo-description">Descrição SEO</Label>
                        <Badge variant="outline" className={getStatusColor(descriptionStatus)}>
                            {descriptionLength} chars
                        </Badge>
                    </div>
                    <Textarea
                        id="seo-description"
                        value={seo.description || ''}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        placeholder="Descrição atrativa e otimizada para SEO (120-160 caracteres recomendados)"
                        disabled={disabled}
                        rows={3}
                        className={descriptionStatus === 'good' ? 'border-green-300' : descriptionStatus === 'long' || descriptionStatus === 'short' ? 'border-yellow-300' : ''}
                    />
                    <p className="text-xs text-muted-foreground">
                        {descriptionStatus === 'empty' && 'Descrição recomendada para melhor SEO'}
                        {descriptionStatus === 'short' && 'Descrição muito curta. Recomendado 120-160 caracteres.'}
                        {descriptionStatus === 'long' && 'Descrição muito longa. Pode ser cortada nos resultados de busca.'}
                        {descriptionStatus === 'good' && 'Comprimento ideal para SEO! ✅'}
                    </p>
                </div>

                {/* Palavras-chave */}
                <div className="space-y-2">
                    <Label htmlFor="seo-keywords" className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Palavras-chave
                    </Label>
                    <Input
                        id="seo-keywords"
                        value={seo.keywords?.join(', ') || ''}
                        onChange={(e) => onUpdate({
                            keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        })}
                        placeholder="palavra1, palavra2, palavra3"
                        disabled={disabled}
                    />
                    <p className="text-xs text-muted-foreground">
                        Separe as palavras-chave com vírgulas. Máximo de 10 palavras recomendado.
                    </p>
                    {seo.keywords && seo.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {seo.keywords.map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                    {keyword}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Open Graph */}
                <div className="border-t pt-4 space-y-4">
                    <h4 className="font-medium text-sm">Open Graph (Redes Sociais)</h4>

                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="og-title">Título para Redes Sociais</Label>
                            <Input
                                id="og-title"
                                value={seo.ogTitle || ''}
                                onChange={(e) => onUpdate({ ogTitle: e.target.value })}
                                placeholder="Título otimizado para compartilhamento em redes sociais"
                                disabled={disabled}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="og-description">Descrição para Redes Sociais</Label>
                            <Textarea
                                id="og-description"
                                value={seo.ogDescription || ''}
                                onChange={(e) => onUpdate({ ogDescription: e.target.value })}
                                placeholder="Descrição atrativa para compartilhamento"
                                disabled={disabled}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="og-image">URL da Imagem de Compartilhamento</Label>
                            <Input
                                id="og-image"
                                value={seo.ogImage || ''}
                                onChange={(e) => onUpdate({ ogImage: e.target.value })}
                                placeholder="https://exemplo.com/imagem.jpg"
                                disabled={disabled}
                                type="url"
                            />
                            <p className="text-xs text-muted-foreground">
                                Recomendado: 1200x630px para melhor compatibilidade com redes sociais
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}