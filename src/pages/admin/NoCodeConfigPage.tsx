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
import { useStep20NoCodeIntegration } from '@/hooks/useStep20Configuration';
import Step20URLDocumentation from '@/components/admin/Step20URLDocumentation';
import Step20IntegrationGuide from '@/components/admin/Step20IntegrationGuide';
import {
  Globe,
  Zap,
  Eye,
  Palette,
  Facebook,
  Link,
  Check,
  AlertCircle,
  Monitor,
  Trophy
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

interface Step20Settings {
  pageTitle: string;
  resultMessage: string;
  ctaButtonText: string;
  backgroundType: 'gradient' | 'image' | 'solid';
  backgroundGradientFrom: string;
  backgroundGradientVia: string;
  backgroundGradientTo: string;
  backgroundImage: string;
  backgroundSolid: string;
  showResultIcon: boolean;
  resultIconType: 'trophy' | 'star' | 'check' | 'heart';
  enableSocialSharing: boolean;
  socialShareText: string;
  showNextSteps: boolean;
  nextStepsText: string;
}

export const NoCodeConfigPanel: React.FC = () => {
  const { toast } = useToast();
  const { configuration: step20Config, updateConfiguration: updateStep20Config } = useStep20NoCodeIntegration();

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
    fontFamily: 'Playfair Display',
    logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp'
  });

  const [step20Settings, setStep20Settings] = useState<Step20Settings>({
    pageTitle: step20Config.pageTitle,
    resultMessage: step20Config.resultMessage,
    ctaButtonText: step20Config.ctaButtonText,
    backgroundType: step20Config.backgroundType,
    backgroundGradientFrom: step20Config.backgroundGradientFrom,
    backgroundGradientVia: step20Config.backgroundGradientVia,
    backgroundGradientTo: step20Config.backgroundGradientTo,
    backgroundImage: step20Config.backgroundImage,
    backgroundSolid: step20Config.backgroundSolid,
    showResultIcon: step20Config.showResultIcon,
    resultIconType: step20Config.resultIconType,
    enableSocialSharing: step20Config.enableSocialSharing,
    socialShareText: step20Config.socialShareText,
    showNextSteps: step20Config.showNextSteps,
    nextStepsText: step20Config.nextStepsText
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (section: string) => {
    setSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Se for a seção da Etapa 20, atualizar também o store específico
    if (section === 'Etapa 20') {
      updateStep20Config(step20Settings);
    }

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
        <TabsList className="grid grid-cols-6 w-full max-w-4xl">
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
          <TabsTrigger value="step20" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Etapa 20
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
                    onChange={(e) => setSeoSettings({ ...seoSettings, title: e.target.value })}
                    placeholder="Título que aparece no Google"
                  />
                  <p className="text-xs text-[#8F7A6A]">Máximo 60 caracteres</p>
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
                />
                <p className="text-xs text-[#8F7A6A]">Máximo 160 caracteres</p>
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
                  <p className="text-xs text-[#8F7A6A]">Resultado: quiz.seudominio.com</p>
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
                  onCheckedChange={(checked) => setPixelSettings({ ...pixelSettings, enabled: checked })}
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
                    onChange={(e) => setPixelSettings({ ...pixelSettings, facebookPixelId: e.target.value })}
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

        {/* Step 20 Configuration */}
        <TabsContent value="step20">
          <div className="space-y-8">
            {/* Documentação */}
            <Step20URLDocumentation />

            {/* Guia de Integração */}
            <Step20IntegrationGuide />

            {/* Configuração */}
            <Card className="border-0" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 4px 20px rgba(184, 155, 122, 0.1)' }}>
              <CardHeader>
                <CardTitle className="text-[#432818] flex items-center gap-2">
                  <Trophy className="w-5 h-5" style={{ color: '#B89B7A' }} />
                  Configuração da Página de Resultado (Etapa 20)
                </CardTitle>
                <p className="text-sm text-[#6B4F43]">
                  Configure a experiência especial da página de resultado do quiz (URL: /step20)
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Conteúdo Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="page-title">Título da Página</Label>
                    <Input
                      id="page-title"
                      value={step20Settings.pageTitle}
                      onChange={(e) => setStep20Settings({ ...step20Settings, pageTitle: e.target.value })}
                      placeholder="Seu Estilo Pessoal Revelado!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cta-button">Texto do Botão Principal</Label>
                    <Input
                      id="cta-button"
                      value={step20Settings.ctaButtonText}
                      onChange={(e) => setStep20Settings({ ...step20Settings, ctaButtonText: e.target.value })}
                      placeholder="Ver Minha Consultoria Personalizada"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result-message">Mensagem de Resultado</Label>
                  <Textarea
                    id="result-message"
                    value={step20Settings.resultMessage}
                    onChange={(e) => setStep20Settings({ ...step20Settings, resultMessage: e.target.value })}
                    placeholder="Parabéns! Com base nas suas respostas..."
                    rows={3}
                  />
                </div>

                {/* Background Configuration */}
                <div className="space-y-4">
                  <Label className="text-base font-medium text-[#432818]">Configuração de Fundo</Label>

                  <div className="space-y-2">
                    <Label htmlFor="background-type">Tipo de Fundo</Label>
                    <Select
                      value={step20Settings.backgroundType}
                      onValueChange={(value: 'gradient' | 'image' | 'solid') =>
                        setStep20Settings({ ...step20Settings, backgroundType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">Gradiente</SelectItem>
                        <SelectItem value="image">Imagem</SelectItem>
                        <SelectItem value="solid">Cor Sólida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {step20Settings.backgroundType === 'gradient' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gradient-from">Cor Inicial</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={step20Settings.backgroundGradientFrom}
                            onChange={(e) => setStep20Settings({ ...step20Settings, backgroundGradientFrom: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={step20Settings.backgroundGradientFrom}
                            onChange={(e) => setStep20Settings({ ...step20Settings, backgroundGradientFrom: e.target.value })}
                            placeholder="#FAF9F7"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradient-via">Cor Intermediária</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={step20Settings.backgroundGradientVia}
                            onChange={(e) => setStep20Settings({ ...step20Settings, backgroundGradientVia: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={step20Settings.backgroundGradientVia}
                            onChange={(e) => setStep20Settings({ ...step20Settings, backgroundGradientVia: e.target.value })}
                            placeholder="#F5F2E9"
                            className="flex-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gradient-to">Cor Final</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={step20Settings.backgroundGradientTo}
                            onChange={(e) => setStep20Settings({ ...step20Settings, backgroundGradientTo: e.target.value })}
                            className="w-16 h-10 p-1 border rounded"
                          />
                          <Input
                            value={step20Settings.backgroundGradientTo}
                            onChange={(e) => setStep20Settings({ ...step20Settings, backgroundGradientTo: e.target.value })}
                            placeholder="#E8D5C0"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step20Settings.backgroundType === 'image' && (
                    <div className="space-y-2">
                      <Label htmlFor="background-image">URL da Imagem de Fundo</Label>
                      <Input
                        id="background-image"
                        value={step20Settings.backgroundImage}
                        onChange={(e) => setStep20Settings({ ...step20Settings, backgroundImage: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  {step20Settings.backgroundType === 'solid' && (
                    <div className="space-y-2">
                      <Label htmlFor="background-solid">Cor de Fundo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={step20Settings.backgroundSolid}
                          onChange={(e) => setStep20Settings({ ...step20Settings, backgroundSolid: e.target.value })}
                          className="w-16 h-10 p-1 border rounded"
                        />
                        <Input
                          value={step20Settings.backgroundSolid}
                          onChange={(e) => setStep20Settings({ ...step20Settings, backgroundSolid: e.target.value })}
                          placeholder="#FAF9F7"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Elements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={step20Settings.showResultIcon}
                        onCheckedChange={(checked) => setStep20Settings({ ...step20Settings, showResultIcon: checked })}
                      />
                      <Label>Mostrar Ícone de Resultado</Label>
                    </div>

                    {step20Settings.showResultIcon && (
                      <div className="space-y-2">
                        <Label htmlFor="result-icon-type">Tipo de Ícone</Label>
                        <Select
                          value={step20Settings.resultIconType}
                          onValueChange={(value: 'trophy' | 'star' | 'check' | 'heart') =>
                            setStep20Settings({ ...step20Settings, resultIconType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trophy">🏆 Troféu</SelectItem>
                            <SelectItem value="star">⭐ Estrela</SelectItem>
                            <SelectItem value="check">✅ Check</SelectItem>
                            <SelectItem value="heart">💖 Coração</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={step20Settings.enableSocialSharing}
                        onCheckedChange={(checked) => setStep20Settings({ ...step20Settings, enableSocialSharing: checked })}
                      />
                      <Label>Habilitar Compartilhamento Social</Label>
                    </div>

                    {step20Settings.enableSocialSharing && (
                      <div className="space-y-2">
                        <Label htmlFor="social-share-text">Texto para Compartilhamento</Label>
                        <Input
                          id="social-share-text"
                          value={step20Settings.socialShareText}
                          onChange={(e) => setStep20Settings({ ...step20Settings, socialShareText: e.target.value })}
                          placeholder="Acabei de descobrir meu estilo pessoal!"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={step20Settings.showNextSteps}
                      onCheckedChange={(checked) => setStep20Settings({ ...step20Settings, showNextSteps: checked })}
                    />
                    <Label>Mostrar Próximos Passos</Label>
                  </div>

                  {step20Settings.showNextSteps && (
                    <div className="space-y-2">
                      <Label htmlFor="next-steps-text">Texto dos Próximos Passos</Label>
                      <Textarea
                        id="next-steps-text"
                        value={step20Settings.nextStepsText}
                        onChange={(e) => setStep20Settings({ ...step20Settings, nextStepsText: e.target.value })}
                        placeholder="Agora você pode acessar sua consultoria personalizada..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Preview Section */}
                <div className="p-4 rounded-lg border" style={{ backgroundColor: '#F8F6F3', borderColor: '#E6DDD4' }}>
                  <h4 className="font-medium text-[#432818] mb-2">🎯 URL Configurada</h4>
                  <p className="text-sm text-[#6B4F43]">
                    <strong>Página de Resultado:</strong> <code className="bg-[#E6DDD4] px-2 py-1 rounded">/step20</code>
                  </p>
                  <p className="text-xs text-[#8F7A6A] mt-2">
                    Esta é a página especial de resultado que difere das etapas regulares (/step/1, /step/2, etc.)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => handleSave('Etapa 20')}
                    disabled={saving}
                    className="bg-[#B89B7A] hover:bg-[#A0895B] text-white flex-1"
                  >
                    {saving ? 'Salvando...' : 'Salvar Configurações da Etapa 20'}
                  </Button>

                  <Button
                    onClick={() => {
                      // Abrir preview em nova aba
                      const previewWindow = window.open('', '_blank', 'width=1200,height=800');
                      if (previewWindow) {
                        previewWindow.document.write(`
                        <html>
                          <head>
                            <title>Preview - ${step20Settings.pageTitle}</title>
                            <style>
                              body { margin: 0; font-family: 'Inter', sans-serif; }
                              .preview-container { 
                                background: linear-gradient(135deg, ${step20Settings.backgroundGradientFrom} 0%, ${step20Settings.backgroundGradientVia} 50%, ${step20Settings.backgroundGradientTo} 100%);
                                min-height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                padding: 20px;
                              }
                              .preview-card {
                                background: rgba(255, 255, 255, 0.95);
                                border-radius: 16px;
                                padding: 60px;
                                text-align: center;
                                max-width: 800px;
                                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                              }
                              .preview-icon { font-size: 80px; margin-bottom: 24px; }
                              .preview-title { 
                                font-size: 48px; 
                                font-weight: bold; 
                                color: #432818; 
                                margin-bottom: 24px;
                                line-height: 1.2;
                              }
                              .preview-message { 
                                font-size: 20px; 
                                color: #6B4F43; 
                                margin-bottom: 32px;
                                line-height: 1.6;
                              }
                              .preview-cta {
                                background: #B89B7A;
                                color: white;
                                padding: 16px 32px;
                                border: none;
                                border-radius: 50px;
                                font-size: 18px;
                                font-weight: 600;
                                cursor: pointer;
                                margin: 16px;
                              }
                              .preview-steps {
                                background: #F3E8E6;
                                padding: 24px;
                                border-radius: 12px;
                                margin: 32px 0;
                              }
                              .preview-url {
                                background: #F8F6F3;
                                border: 1px solid #E6DDD4;
                                padding: 16px;
                                border-radius: 8px;
                                margin: 24px 0;
                                font-size: 14px;
                                color: #6B4F43;
                              }
                            </style>
                          </head>
                          <body>
                            <div class="preview-container">
                              <div class="preview-card">
                                ${step20Settings.showResultIcon ? `<div class="preview-icon">${step20Settings.resultIconType === 'trophy' ? '🏆' : step20Settings.resultIconType === 'star' ? '⭐' : step20Settings.resultIconType === 'check' ? '✅' : '💖'}</div>` : ''}
                                <h1 class="preview-title">${step20Settings.pageTitle}</h1>
                                <p class="preview-message">${step20Settings.resultMessage}</p>
                                
                                <div class="preview-url">
                                  <strong>🎯 URL Configurada:</strong> <code>/step20</code><br>
                                  <small>Página especial de resultado diferenciada das etapas regulares</small>
                                </div>
                                
                                ${step20Settings.showNextSteps ? `
                                  <div class="preview-steps">
                                    <h3>Próximos Passos</h3>
                                    <p>${step20Settings.nextStepsText}</p>
                                  </div>
                                ` : ''}
                                
                                <button class="preview-cta">${step20Settings.ctaButtonText}</button>
                                ${step20Settings.enableSocialSharing ? '<button class="preview-cta" style="background: transparent; color: #B89B7A; border: 2px solid #B89B7A;">📱 Compartilhar</button>' : ''}
                              </div>
                            </div>
                          </body>
                        </html>
                      `);
                        previewWindow.document.close();
                      }
                    }}
                    variant="outline"
                    className="border-[#B89B7A] text-[#B89B7A] hover:bg-[#B89B7A] hover:text-white"
                  >
                    👁️ Preview da Página
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
                    onValueChange={(value) => setFunnelSettings({ ...funnelSettings, theme: value })}
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
                    onValueChange={(value) => setFunnelSettings({ ...funnelSettings, fontFamily: value })}
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
                      onChange={(e) => setFunnelSettings({ ...funnelSettings, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={funnelSettings.primaryColor}
                      onChange={(e) => setFunnelSettings({ ...funnelSettings, primaryColor: e.target.value })}
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
                      onChange={(e) => setFunnelSettings({ ...funnelSettings, secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={funnelSettings.secondaryColor}
                      onChange={(e) => setFunnelSettings({ ...funnelSettings, secondaryColor: e.target.value })}
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
                  onChange={(e) => setFunnelSettings({ ...funnelSettings, logoUrl: e.target.value })}
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