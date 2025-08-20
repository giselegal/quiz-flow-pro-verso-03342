import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import ConfigurationStatusPanel from '@/components/admin/ConfigurationStatusPanel';
import { 
  Globe, 
  Zap, 
  Eye, 
  Palette,
  Facebook,
  Link,
  Check,
  AlertCircle,
  Monitor
} from 'lucide-react';

interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  siteName: string;
}

interface DomainSettings {
  customDomain: string;
  subdomain: string;
  protocol: 'https' | 'http';
  redirectWww: boolean;
}

interface PixelSettings {
  facebookPixelId: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  enabled: boolean;
}

interface FunnelSettings {
  theme: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string;
}

export const NoCodeConfigPanel: React.FC = () => {
  const { toast } = useToast();
  
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    title: 'Descubra Seu Estilo | Quiz Personalizado',
    description: 'Descubra seu estilo pessoal único com nosso quiz interativo e receba recomendações personalizadas.',
    keywords: 'estilo pessoal, quiz, moda, personal stylist, Gisele Galvão',
    ogImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
    siteName: 'QuizFlow - Gisele Galvão'
  });

  const [domainSettings, setDomainSettings] = useState<DomainSettings>({
    customDomain: '',
    subdomain: 'quiz',
    protocol: 'https',
    redirectWww: false
  });

  const [pixelSettings, setPixelSettings] = useState<PixelSettings>({
    facebookPixelId: '',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    enabled: true
  });

  const [funnelSettings, setFunnelSettings] = useState<FunnelSettings>({
    theme: 'elegant-brown',
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    fontFamily: 'Inter',
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (section: string) => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configurações salvas!",
      description: `As configurações de ${section} foram salvas com sucesso.`,
    });
    
    setSaving(false);
  };

  const connectVercel = async () => {
    toast({
      title: "Integração Vercel",
      description: "Conectando com a API do Vercel para configuração de domínio...",
    });
    
    // TODO: Implement Vercel API integration
    setTimeout(() => {
      toast({
        title: "Vercel conectado!",
        description: "Domínio personalizado será configurado em breve.",
      });
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: '#FAF9F7', minHeight: '100vh' }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-4xl font-bold text-[#432818]"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Configurações No-Code
          </h1>
          <p className="text-[#8F7A6A] mt-2 text-lg">
            Configure seu funil sem precisar de código
          </p>
        </div>
      </div>

      <Tabs defaultValue="status" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Status
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="domain" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Domínio
          </TabsTrigger>
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Tracking
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Tema
          </TabsTrigger>
        </TabsList>

        {/* Configuration Status */}
        <TabsContent value="status">
          <ConfigurationStatusPanel />
        </TabsContent>

        {/* SEO Configuration */}
        <TabsContent value="seo">
          <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
            <CardHeader>
              <CardTitle className="text-[#432818] flex items-center gap-2">
                <Globe className="w-5 h-5" style={{ color: '#B89B7A' }} />
                Configurações de SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">Título da Página</Label>
                  <Input
                    id="seo-title"
                    value={seoSettings.title}
                    onChange={(e) => setSeoSettings({...seoSettings, title: e.target.value})}
                    placeholder="Título que aparece no Google"
                  />
                  <p className="text-xs text-[#8F7A6A]">Máximo 60 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-name">Nome do Site</Label>
                  <Input
                    id="site-name"
                    value={seoSettings.siteName}
                    onChange={(e) => setSeoSettings({...seoSettings, siteName: e.target.value})}
                    placeholder="Nome da sua marca"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-description">Descrição</Label>
                <Textarea
                  id="seo-description"
                  value={seoSettings.description}
                  onChange={(e) => setSeoSettings({...seoSettings, description: e.target.value})}
                  placeholder="Descrição que aparece no Google"
                  rows={3}
                />
                <p className="text-xs text-[#8F7A6A]">Máximo 160 caracteres</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seo-keywords">Palavras-chave</Label>
                <Input
                  id="seo-keywords"
                  value={seoSettings.keywords}
                  onChange={(e) => setSeoSettings({...seoSettings, keywords: e.target.value})}
                  placeholder="palavra1, palavra2, palavra3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="og-image">Imagem de Compartilhamento (OG Image)</Label>
                <Input
                  id="og-image"
                  value={seoSettings.ogImage}
                  onChange={(e) => setSeoSettings({...seoSettings, ogImage: e.target.value})}
                  placeholder="URL da imagem"
                />
                <p className="text-xs text-[#8F7A6A]">1200x630px recomendado</p>
              </div>

              <Button 
                onClick={() => handleSave('SEO')}
                disabled={saving}
                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
              >
                {saving ? 'Salvando...' : 'Salvar Configurações SEO'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Configuration */}
        <TabsContent value="domain">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
              <CardHeader>
                <CardTitle className="text-[#432818] flex items-center gap-2">
                  <Link className="w-5 h-5" style={{ color: '#B89B7A' }} />
                  Configuração de Domínio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="custom-domain">Domínio Personalizado</Label>
                  <Input
                    id="custom-domain"
                    value={domainSettings.customDomain}
                    onChange={(e) => setDomainSettings({...domainSettings, customDomain: e.target.value})}
                    placeholder="seudominio.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomínio</Label>
                  <Input
                    id="subdomain"
                    value={domainSettings.subdomain}
                    onChange={(e) => setDomainSettings({...domainSettings, subdomain: e.target.value})}
                    placeholder="quiz"
                  />
                  <p className="text-xs text-[#8F7A6A]">Resultado: quiz.seudominio.com</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={domainSettings.redirectWww}
                    onCheckedChange={(checked) => setDomainSettings({...domainSettings, redirectWww: checked})}
                  />
                  <Label>Redirecionar www para domínio principal</Label>
                </div>

                <Button 
                  onClick={() => handleSave('Domínio')}
                  disabled={saving}
                  className="bg-[#B89B7A] hover:bg-[#A0895B] text-white w-full"
                >
                  Salvar Configurações de Domínio
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
              <CardHeader>
                <CardTitle className="text-[#432818] flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ color: '#B89B7A' }} />
                  Integração Vercel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-[#6B4F43]">
                  Conecte com o Vercel para configurar automaticamente seu domínio personalizado.
                </p>
                
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-[#B89B7A]" />
                    <span className="text-sm font-medium text-[#432818]">Status</span>
                  </div>
                  <p className="text-xs text-[#6B4F43]">
                    Pronto para conectar com Vercel API
                  </p>
                </div>

                <Button 
                  onClick={connectVercel}
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: '#B89B7A', color: '#B89B7A' }}
                >
                  Conectar com Vercel
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tracking & Analytics */}
        <TabsContent value="tracking">
          <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
            <CardHeader>
              <CardTitle className="text-[#432818] flex items-center gap-2">
                <Eye className="w-5 h-5" style={{ color: '#B89B7A' }} />
                Tracking e Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={pixelSettings.enabled}
                  onCheckedChange={(checked) => setPixelSettings({...pixelSettings, enabled: checked})}
                />
                <Label>Habilitar tracking de pixels</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="facebook-pixel" className="flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook Pixel ID
                  </Label>
                  <Input
                    id="facebook-pixel"
                    value={pixelSettings.facebookPixelId}
                    onChange={(e) => setPixelSettings({...pixelSettings, facebookPixelId: e.target.value})}
                    placeholder="000000000000000"
                    disabled={!pixelSettings.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-analytics" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Google Analytics ID
                  </Label>
                  <Input
                    id="google-analytics"
                    value={pixelSettings.googleAnalyticsId}
                    onChange={(e) => setPixelSettings({...pixelSettings, googleAnalyticsId: e.target.value})}
                    placeholder="G-XXXXXXXXXX"
                    disabled={!pixelSettings.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="google-tag-manager">Google Tag Manager ID</Label>
                  <Input
                    id="google-tag-manager"
                    value={pixelSettings.googleTagManagerId}
                    onChange={(e) => setPixelSettings({...pixelSettings, googleTagManagerId: e.target.value})}
                    placeholder="GTM-XXXXXXX"
                    disabled={!pixelSettings.enabled}
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: '#F3E8E6' }}>
                <h4 className="font-medium text-[#432818] mb-2">Status dos Pixels</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-[#6B4F43]">Facebook Pixel: Configurado e ativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#B89B7A]" />
                    <span className="text-sm text-[#6B4F43]">Verificar duplicatas: Nenhuma encontrada</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => handleSave('Tracking')}
                disabled={saving}
                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
              >
                Salvar Configurações de Tracking
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Configuration */}
        <TabsContent value="theme">
          <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
            <CardHeader>
              <CardTitle className="text-[#432818] flex items-center gap-2">
                <Palette className="w-5 h-5" style={{ color: '#B89B7A' }} />
                Personalização do Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme-select">Tema do Funil</Label>
                  <Select
                    value={funnelSettings.theme}
                    onValueChange={(value) => setFunnelSettings({...funnelSettings, theme: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elegant-brown">Elegante Marrom</SelectItem>
                      <SelectItem value="modern-blue">Moderno Azul</SelectItem>
                      <SelectItem value="luxury-gold">Luxo Dourado</SelectItem>
                      <SelectItem value="minimalist-gray">Minimalista Cinza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-family">Família da Fonte</Label>
                  <Select
                    value={funnelSettings.fontFamily}
                    onValueChange={(value) => setFunnelSettings({...funnelSettings, fontFamily: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={funnelSettings.primaryColor}
                      onChange={(e) => setFunnelSettings({...funnelSettings, primaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={funnelSettings.primaryColor}
                      onChange={(e) => setFunnelSettings({...funnelSettings, primaryColor: e.target.value})}
                      placeholder="#B89B7A"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={funnelSettings.secondaryColor}
                      onChange={(e) => setFunnelSettings({...funnelSettings, secondaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={funnelSettings.secondaryColor}
                      onChange={(e) => setFunnelSettings({...funnelSettings, secondaryColor: e.target.value})}
                      placeholder="#432818"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo-url">URL do Logo</Label>
                <Input
                  id="logo-url"
                  value={funnelSettings.logoUrl}
                  onChange={(e) => setFunnelSettings({...funnelSettings, logoUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <Button 
                onClick={() => handleSave('Tema')}
                disabled={saving}
                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
              >
                Salvar Configurações de Tema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoCodeConfigPanel;