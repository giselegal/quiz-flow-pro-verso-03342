/**
 * 🎛️ Header Configuration Panel
 * 
 * Interface sofisticada para configuração de cabeçalhos com toggles visuais,
 * similar ao exemplo HTML analisado. Integra com o sistema NoCode existente.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Eye,
  Palette,
  Layout,
  ArrowLeft,
  Image,
  BarChart3,
  Zap,
  Save,
  RotateCcw
} from 'lucide-react';
import { HeaderProperties, defaultHeaderProperties } from '@/config/headerPropertiesMapping';

interface HeaderConfigurationPanelProps {
  headerConfig: Partial<HeaderProperties>;
  onConfigChange: (config: Partial<HeaderProperties>) => void;
  onSave?: () => void;
  onReset?: () => void;
  showPreview?: boolean;
}

export const HeaderConfigurationPanel: React.FC<HeaderConfigurationPanelProps> = ({
  headerConfig,
  onConfigChange,
  onSave,
  onReset,
  showPreview = true,
}) => {
  const [activeTab, setActiveTab] = useState('visibility');

  // 🎛️ Funções auxiliares para atualização de configuração
  const updateConfig = (key: keyof HeaderProperties, value: any) => {
    onConfigChange({
      ...headerConfig,
      [key]: value,
    });
  };

  const resetToDefaults = () => {
    onConfigChange(defaultHeaderProperties);
    onReset?.();
  };

  // 🎨 Configuração atual com fallbacks
  const config = { ...defaultHeaderProperties, ...headerConfig };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* 📱 Header da Interface */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Configuração de Cabeçalho</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Interface avançada para personalização visual do header
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Restaurar Padrões
              </Button>
              {onSave && (
                <Button size="sm" onClick={onSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="visibility" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visibilidade</span>
              </TabsTrigger>
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Estilo</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                <span className="hidden sm:inline">Layout</span>
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Progresso</span>
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Avançado</span>
              </TabsTrigger>
            </TabsList>

            {/* 👁️ Aba de Visibilidade - Toggle Controls */}
            <TabsContent value="visibility" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 🎨 Logo Controls */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Image className="w-4 h-4 text-green-600" />
                      Controles do Logo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-logo" className="text-sm font-medium">
                        Mostrar Logo
                      </Label>
                      <Switch
                        id="show-logo"
                        checked={config.showLogo}
                        onCheckedChange={(checked) => updateConfig('showLogo', checked)}
                      />
                    </div>

                    {config.showLogo && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm">URL do Logo</Label>
                          <Input
                            value={config.logoUrl}
                            onChange={(e) => updateConfig('logoUrl', e.target.value)}
                            placeholder="https://exemplo.com/logo.png"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label className="text-sm">Largura</Label>
                            <Input
                              type="number"
                              value={config.logoWidth}
                              onChange={(e) => updateConfig('logoWidth', Number(e.target.value))}
                              min="20"
                              max="500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm">Altura</Label>
                            <Input
                              type="number"
                              value={config.logoHeight}
                              onChange={(e) => updateConfig('logoHeight', Number(e.target.value))}
                              min="20"
                              max="200"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">Posição do Logo</Label>
                          <Select value={config.logoPosition} onValueChange={(value) => updateConfig('logoPosition', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Esquerda</SelectItem>
                              <SelectItem value="center">Centro</SelectItem>
                              <SelectItem value="right">Direita</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* 🔙 Back Button Controls */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4 text-blue-600" />
                      Botão de Voltar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-back" className="text-sm font-medium">
                        Permitir Voltar
                      </Label>
                      <Switch
                        id="show-back"
                        checked={config.showBackButton}
                        onCheckedChange={(checked) => updateConfig('showBackButton', checked)}
                      />
                    </div>

                    {config.showBackButton && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-sm">Estilo do Botão</Label>
                          <Select value={config.backButtonStyle} onValueChange={(value) => updateConfig('backButtonStyle', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="icon">Apenas Ícone</SelectItem>
                              <SelectItem value="text">Apenas Texto</SelectItem>
                              <SelectItem value="both">Ícone + Texto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {config.backButtonStyle !== 'icon' && (
                          <div className="space-y-2">
                            <Label className="text-sm">Texto do Botão</Label>
                            <Input
                              value={config.backButtonText}
                              onChange={(e) => updateConfig('backButtonText', e.target.value)}
                              placeholder="Voltar"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label className="text-sm">Posição</Label>
                          <Select value={config.backButtonPosition} onValueChange={(value) => updateConfig('backButtonPosition', value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="left">Esquerda</SelectItem>
                              <SelectItem value="right">Direita</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 📊 Aba de Progresso */}
            <TabsContent value="progress" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    Configurações de Progresso
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-progress" className="text-sm font-medium">
                      Mostrar Progresso
                    </Label>
                    <Switch
                      id="show-progress"
                      checked={config.showProgress}
                      onCheckedChange={(checked) => updateConfig('showProgress', checked)}
                    />
                  </div>

                  {config.showProgress && (
                    <>
                      <div className="space-y-2">
                        <Label className="text-sm">Estilo do Progresso</Label>
                        <Select value={config.progressStyle} onValueChange={(value) => updateConfig('progressStyle', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">Barra</SelectItem>
                            <SelectItem value="circle">Circular</SelectItem>
                            <SelectItem value="dots">Pontos</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Valor Atual</Label>
                          <Input
                            type="number"
                            value={config.progressValue}
                            onChange={(e) => updateConfig('progressValue', Number(e.target.value))}
                            min="0"
                            max={config.progressMax}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Valor Máximo</Label>
                          <Input
                            type="number"
                            value={config.progressMax}
                            onChange={(e) => updateConfig('progressMax', Number(e.target.value))}
                            min="1"
                            max="100"
                          />
                        </div>
                      </div>

                      {config.progressStyle === 'bar' && (
                        <div className="space-y-2">
                          <Label className="text-sm">Altura da Barra: {config.progressHeight}px</Label>
                          <Slider
                            value={[config.progressHeight || 4]}
                            onValueChange={([value]) => updateConfig('progressHeight', value)}
                            min={2}
                            max={20}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Cor do Progresso</Label>
                          <Input
                            type="color"
                            value={config.progressColor}
                            onChange={(e) => updateConfig('progressColor', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Cor de Fundo</Label>
                          <Input
                            type="color"
                            value={config.progressBackgroundColor}
                            onChange={(e) => updateConfig('progressBackgroundColor', e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 🎨 Aba de Estilo */}
            <TabsContent value="style" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Aparência Geral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Estilo do Header</Label>
                    <Select value={config.headerStyle} onValueChange={(value) => updateConfig('headerStyle', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Padrão</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="compact">Compacto</SelectItem>
                        <SelectItem value="full">Completo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Cor de Fundo</Label>
                    <Input
                      type="color"
                      value={config.backgroundColor}
                      onChange={(e) => updateConfig('backgroundColor', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-border" className="text-sm font-medium">
                      Mostrar Borda
                    </Label>
                    <Switch
                      id="show-border"
                      checked={config.showBorder}
                      onCheckedChange={(checked) => updateConfig('showBorder', checked)}
                    />
                  </div>

                  {config.showBorder && (
                    <div className="space-y-2">
                      <Label className="text-sm">Cor da Borda</Label>
                      <Input
                        type="color"
                        value={config.borderColor}
                        onChange={(e) => updateConfig('borderColor', e.target.value)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 📐 Aba de Layout */}
            <TabsContent value="layout" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Configurações de Layout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="is-sticky" className="text-sm font-medium">
                      Header Fixo (Sticky)
                    </Label>
                    <Switch
                      id="is-sticky"
                      checked={config.isSticky}
                      onCheckedChange={(checked) => updateConfig('isSticky', checked)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">Margem Superior</Label>
                      <Input
                        type="number"
                        value={config.marginTop}
                        onChange={(e) => updateConfig('marginTop', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Margem Inferior</Label>
                      <Input
                        type="number"
                        value={config.marginBottom}
                        onChange={(e) => updateConfig('marginBottom', Number(e.target.value))}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ⚡ Aba Avançada */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Configurações Avançadas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-animation" className="text-sm font-medium">
                      Habilitar Animações
                    </Label>
                    <Switch
                      id="enable-animation"
                      checked={config.enableAnimation}
                      onCheckedChange={(checked) => updateConfig('enableAnimation', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Classes CSS Customizadas</Label>
                    <Input
                      value={config.customCssClass}
                      onChange={(e) => updateConfig('customCssClass', e.target.value)}
                      placeholder="custom-header another-class"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 👁️ Preview Section */}
      {showPreview && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600" />
              Preview da Configuração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Preview será implementado aqui com base nas configurações
                </div>
                <Badge variant="outline" className="text-xs">
                  🚧 Em desenvolvimento
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeaderConfigurationPanel;
