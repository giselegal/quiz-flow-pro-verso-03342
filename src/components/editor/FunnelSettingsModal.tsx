import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Link, 
  Eye, 
  Palette, 
  X, 
  Save, 
  Check,
  Facebook,
  Settings
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

interface FunnelSettingsModalProps {
  funnelId: string;
  funnelName: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 🎯 MODAL DE CONFIGURAÇÕES DO FUNIL NO EDITOR
 * 
 * Modal completo com todas as configurações:
 * - SEO (title, description, keywords, og image)
 * - Domínio (custom domain, subdomain)
 * - Tracking (Facebook Pixel, Google Analytics, GTM)
 * - Tema (cores, fontes, logo)
 */
export const FunnelSettingsModal: React.FC<FunnelSettingsModalProps> = ({
  funnelId,
  funnelName,
  isOpen,
  onClose
}) => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('seo');

  // 🎛️ Estados das configurações
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
    facebookPixelId: '1311550759901086',
    googleAnalyticsId: '',
    googleTagManagerId: '',
    enabled: true
  });

  const [funnelSettings, setFunnelSettings] = useState<FunnelSettings>({
    theme: 'elegant-brown',
    primaryColor: '#B89B7A',
    secondaryColor: '#432818',
    fontFamily: 'Playfair Display',
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
  });

  // 💾 Carregar configurações do localStorage/Supabase
  useEffect(() => {
    if (isOpen && funnelId) {
      loadSettings();
    }
  }, [isOpen, funnelId]);

  const loadSettings = async () => {
    try {
      console.log('📋 Carregando configurações do funil:', funnelId);
      
      // Tentar carregar do localStorage primeiro
      const savedSettings = localStorage.getItem(`funnel-settings-${funnelId}`);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.seo) setSeoSettings(parsed.seo);
        if (parsed.domain) setDomainSettings(parsed.domain);
        if (parsed.pixel) setPixelSettings(parsed.pixel);
        if (parsed.funnel) setFunnelSettings(parsed.funnel);
        console.log('✅ Configurações carregadas do localStorage');
      }
    } catch (error) {
      console.error('❌ Erro ao carregar configurações:', error);
    }
  };

  // 💾 Salvar configurações
  const handleSave = async (section?: string) => {
    setSaving(true);
    try {
      const allSettings = {
        seo: seoSettings,
        domain: domainSettings,
        pixel: pixelSettings,
        funnel: funnelSettings,
        lastModified: new Date().toISOString()
      };

      // Salvar no localStorage
      localStorage.setItem(`funnel-settings-${funnelId}`, JSON.stringify(allSettings));
      
      // TODO: Implementar salvamento no Supabase
      console.log('💾 Configurações salvas:', { section, funnelId, settings: allSettings });
      
      // Feedback visual
      alert(`✅ Configurações ${section ? `de ${section}` : ''} salvas com sucesso!`);
      
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      alert('❌ Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#B89B7A]" />
                Configurações do Funil
              </h2>
              <p className="text-gray-600 mt-1">
                Configure SEO, domínio, tracking e tema para: <Badge variant="outline">{funnelName}</Badge>
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid grid-cols-4 w-full">
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

            {/* SEO Tab */}
            <TabsContent value="seo" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#B89B7A]" />
                    Configurações de SEO
                  </CardTitle>
                  <CardDescription>
                    Configure como seu funil aparece nos mecanismos de busca
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seo-title">Título da Página</Label>
                      <Input
                        id="seo-title"
                        value={seoSettings.title}
                        onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                        placeholder="Título que aparece no Google"
                        maxLength={60}
                      />
                      <p className="text-xs text-gray-500">Máximo 60 caracteres ({seoSettings.title.length}/60)</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="site-name">Nome do Site</Label>
                      <Input
                        id="site-name"
                        value={seoSettings.siteName}
                        onChange={(e) => setSeoSettings({ ...seoSettings, siteName: e.target.value })}
                        placeholder="Nome da sua marca"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-description">Descrição</Label>
                    <Textarea
                      id="seo-description"
                      value={seoSettings.description}
                      onChange={(e) => setSeoSettings({ ...seoSettings, description: e.target.value })}
                      placeholder="Descrição que aparece no Google"
                      rows={3}
                      maxLength={160}
                    />
                    <p className="text-xs text-gray-500">Máximo 160 caracteres ({seoSettings.description.length}/160)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seo-keywords">Palavras-chave</Label>
                    <Input
                      id="seo-keywords"
                      value={seoSettings.keywords}
                      onChange={(e) => setSeoSettings({ ...seoSettings, keywords: e.target.value })}
                      placeholder="palavra1, palavra2, palavra3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="og-image">Imagem de Compartilhamento (OG Image)</Label>
                    <Input
                      id="og-image"
                      value={seoSettings.ogImage}
                      onChange={(e) => setSeoSettings({ ...seoSettings, ogImage: e.target.value })}
                      placeholder="URL da imagem"
                    />
                    <p className="text-xs text-gray-500">1200x630px recomendado</p>
                  </div>

                  <Button
                    onClick={() => handleSave('SEO')}
                    disabled={saving}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Salvando...' : 'Salvar Configurações SEO'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Domain Tab */}
            <TabsContent value="domain" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="w-5 h-5 text-[#B89B7A]" />
                    Configuração de Domínio
                  </CardTitle>
                  <CardDescription>
                    Configure seu domínio personalizado
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">Domínio Personalizado</Label>
                    <Input
                      id="custom-domain"
                      value={domainSettings.customDomain}
                      onChange={(e) => setDomainSettings({ ...domainSettings, customDomain: e.target.value })}
                      placeholder="seudominio.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdomain">Subdomínio</Label>
                    <Input
                      id="subdomain"
                      value={domainSettings.subdomain}
                      onChange={(e) => setDomainSettings({ ...domainSettings, subdomain: e.target.value })}
                      placeholder="quiz"
                    />
                    <p className="text-xs text-gray-500">
                      Resultado: {domainSettings.subdomain}.{domainSettings.customDomain || 'seudominio.com'}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={domainSettings.redirectWww}
                      onCheckedChange={(checked) => setDomainSettings({ ...domainSettings, redirectWww: checked })}
                    />
                    <Label>Redirecionar www para domínio principal</Label>
                  </div>

                  <Button
                    onClick={() => handleSave('Domínio')}
                    disabled={saving}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações de Domínio
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tracking Tab */}
            <TabsContent value="tracking" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#B89B7A]" />
                    Tracking e Analytics
                  </CardTitle>
                  <CardDescription>
                    Configure pixels e ferramentas de análise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={pixelSettings.enabled}
                      onCheckedChange={(checked) => setPixelSettings({ ...pixelSettings, enabled: checked })}
                    />
                    <Label>Habilitar tracking de pixels</Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook-pixel" className="flex items-center gap-2">
                        <Facebook className="w-4 h-4" />
                        Facebook Pixel ID
                      </Label>
                      <Input
                        id="facebook-pixel"
                        value={pixelSettings.facebookPixelId}
                        onChange={(e) => setPixelSettings({ ...pixelSettings, facebookPixelId: e.target.value })}
                        placeholder="000000000000000"
                        disabled={!pixelSettings.enabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="google-analytics">Google Analytics ID</Label>
                      <Input
                        id="google-analytics"
                        value={pixelSettings.googleAnalyticsId}
                        onChange={(e) => setPixelSettings({ ...pixelSettings, googleAnalyticsId: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                        disabled={!pixelSettings.enabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="google-tag-manager">Google Tag Manager ID</Label>
                      <Input
                        id="google-tag-manager"
                        value={pixelSettings.googleTagManagerId}
                        onChange={(e) => setPixelSettings({ ...pixelSettings, googleTagManagerId: e.target.value })}
                        placeholder="GTM-XXXXXXX"
                        disabled={!pixelSettings.enabled}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Status dos Pixels
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Facebook Pixel: {pixelSettings.facebookPixelId ? 'Configurado' : 'Não configurado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${pixelSettings.googleAnalyticsId ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <span>Google Analytics: {pixelSettings.googleAnalyticsId ? 'Configurado' : 'Não configurado'}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSave('Tracking')}
                    disabled={saving}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações de Tracking
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="p-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#B89B7A]" />
                    Configurações de Tema
                  </CardTitle>
                  <CardDescription>
                    Personalize a aparência do seu funil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Cor Primária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primary-color"
                          value={funnelSettings.primaryColor}
                          onChange={(e) => setFunnelSettings({ ...funnelSettings, primaryColor: e.target.value })}
                          placeholder="#B89B7A"
                        />
                        <div 
                          className="w-10 h-10 rounded border border-gray-300"
                          style={{ backgroundColor: funnelSettings.primaryColor }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Cor Secundária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondary-color"
                          value={funnelSettings.secondaryColor}
                          onChange={(e) => setFunnelSettings({ ...funnelSettings, secondaryColor: e.target.value })}
                          placeholder="#432818"
                        />
                        <div 
                          className="w-10 h-10 rounded border border-gray-300"
                          style={{ backgroundColor: funnelSettings.secondaryColor }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-family">Fonte Principal</Label>
                    <select
                      id="font-family"
                      value={funnelSettings.fontFamily}
                      onChange={(e) => setFunnelSettings({ ...funnelSettings, fontFamily: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B89B7A] focus:border-transparent"
                    >
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo-url">URL do Logo</Label>
                    <Input
                      id="logo-url"
                      value={funnelSettings.logoUrl}
                      onChange={(e) => setFunnelSettings({ ...funnelSettings, logoUrl: e.target.value })}
                      placeholder="https://exemplo.com/logo.png"
                    />
                  </div>

                  <Button
                    onClick={() => handleSave('Tema')}
                    disabled={saving}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações de Tema
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Configurações para o funil: <Badge variant="outline">{funnelId}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                onClick={() => handleSave()}
                disabled={saving}
                className="bg-[#B89B7A] hover:bg-[#A0895B] text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar Todas as Configurações'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelSettingsModal;
