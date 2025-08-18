import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SEOSettings as SEOSettingsType } from '@/types/funnelSettings';

interface SEOSettingsProps {
  settings: SEOSettingsType;
  onUpdate: (settings: Partial<SEOSettingsType>) => void;
}

export const SEOSettings: React.FC<SEOSettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Meta Tags Básicas</CardTitle>
          <CardDescription>
            Configure as meta tags principais para otimização dos mecanismos de busca
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Título da Página</Label>
            <Input
              id="metaTitle"
              value={settings.metaTitle}
              onChange={e => onUpdate({ metaTitle: e.target.value })}
              placeholder="Título principal da página"
              maxLength={60}
            />
            <p className="text-sm text-muted-foreground">
              Máximo 60 caracteres. {settings.metaTitle.length}/60
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Descrição da Página</Label>
            <Textarea
              id="metaDescription"
              value={settings.metaDescription}
              onChange={e => onUpdate({ metaDescription: e.target.value })}
              placeholder="Descrição que aparecerá nos resultados de busca"
              className="min-h-[80px]"
              maxLength={160}
            />
            <p className="text-sm text-muted-foreground">
              Máximo 160 caracteres. {settings.metaDescription.length}/160
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customUrl">URL Personalizada</Label>
            <Input
              id="customUrl"
              value={settings.customUrl}
              onChange={e => onUpdate({ customUrl: e.target.value })}
              placeholder="meu-funil-personalizado"
            />
            <p className="text-sm text-muted-foreground">
              URL amigável para o funil (apenas letras, números e hífens)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph</CardTitle>
          <CardDescription>
            Configure como seu funil aparece quando compartilhado nas redes sociais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ogTitle">Título do Open Graph</Label>
            <Input
              id="ogTitle"
              value={settings.ogTitle}
              onChange={e => onUpdate({ ogTitle: e.target.value })}
              placeholder="Título para redes sociais"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogDescription">Descrição do Open Graph</Label>
            <Textarea
              id="ogDescription"
              value={settings.ogDescription}
              onChange={e => onUpdate({ ogDescription: e.target.value })}
              placeholder="Descrição para redes sociais"
              className="min-h-[80px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage">Imagem do Open Graph</Label>
            <Input
              id="ogImage"
              value={settings.ogImage}
              onChange={e => onUpdate({ ogImage: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <p className="text-sm text-muted-foreground">
              Imagem que aparece quando o funil é compartilhado (1200x630px recomendado)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Avançadas</CardTitle>
          <CardDescription>Configurações adicionais de SEO</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="favicon">Favicon</Label>
            <Input
              id="favicon"
              value={settings.favicon}
              onChange={e => onUpdate({ favicon: e.target.value })}
              placeholder="https://exemplo.com/favicon.ico"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">URL Canônica</Label>
            <Input
              id="canonicalUrl"
              value={settings.canonicalUrl}
              onChange={e => onUpdate({ canonicalUrl: e.target.value })}
              placeholder="https://exemplo.com/pagina-principal"
            />
            <p className="text-sm text-muted-foreground">
              URL oficial da página para evitar conteúdo duplicado
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
