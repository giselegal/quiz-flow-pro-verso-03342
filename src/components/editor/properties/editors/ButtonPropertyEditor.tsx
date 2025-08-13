import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  MousePointer, Eye, Palette, Link, 
  ExternalLink, Download, Mail, Phone,
  ArrowRight, ArrowLeft, Plus, Check, X
} from 'lucide-react';
import { Block } from '@/types/editor';
import { PropertyNumber } from '../PropertyNumber';

interface ButtonPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const ButtonPropertyEditor: React.FC<ButtonPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false
}) => {
  // Propriedades específicas do botão
  const text = block.content?.text || 'Clique Aqui';
  const buttonType = block.content?.buttonType || 'primary';
  const size = block.content?.size || 'default';
  const href = block.content?.href || '';
  const target = block.content?.target || '_self';
  const disabled = block.content?.disabled || false;
  const loading = block.content?.loading || false;
  const fullWidth = block.content?.fullWidth || false;
  const icon = block.content?.icon || '';
  const iconPosition = block.content?.iconPosition || 'left';
  const borderRadius = block.content?.borderRadius || 6;
  const backgroundColor = block.content?.backgroundColor || '#B89B7A';
  const textColor = block.content?.textColor || '#FFFFFF';
  const borderColor = block.content?.borderColor || 'transparent';
  const hoverBackgroundColor = block.content?.hoverBackgroundColor || '#A08869';
  const onClick = block.content?.onClick || '';
  const animation = block.content?.animation || 'none';

  const handleContentUpdate = (field: string, value: any) => {
    const updates = {
      content: {
        ...block.content,
        [field]: value
      }
    };
    onUpdate(updates);
  };

  const buttonTypeOptions = [
    { value: 'primary', label: 'Primário', description: 'Botão principal da página' },
    { value: 'secondary', label: 'Secundário', description: 'Botão de ação secundária' },
    { value: 'outline', label: 'Contorno', description: 'Botão com borda apenas' },
    { value: 'ghost', label: 'Fantasma', description: 'Botão transparente' },
    { value: 'link', label: 'Link', description: 'Estilo de link' },
    { value: 'destructive', label: 'Destrutivo', description: 'Ação perigosa (excluir, etc.)' }
  ];

  const sizeOptions = [
    { value: 'xs', label: 'Extra Pequeno' },
    { value: 'sm', label: 'Pequeno' },
    { value: 'default', label: 'Padrão' },
    { value: 'lg', label: 'Grande' },
    { value: 'xl', label: 'Extra Grande' }
  ];

  const iconOptions = [
    { value: '', label: 'Nenhum', icon: null },
    { value: 'arrow-right', label: 'Seta Direita', icon: ArrowRight },
    { value: 'arrow-left', label: 'Seta Esquerda', icon: ArrowLeft },
    { value: 'external-link', label: 'Link Externo', icon: ExternalLink },
    { value: 'download', label: 'Download', icon: Download },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Telefone', icon: Phone },
    { value: 'plus', label: 'Adicionar', icon: Plus },
    { value: 'check', label: 'Confirmar', icon: Check },
    { value: 'x', label: 'Fechar', icon: X }
  ];

  const animationOptions = [
    { value: 'none', label: 'Nenhuma' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'shake', label: 'Shake' },
    { value: 'glow', label: 'Glow' }
  ];

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      'arrow-right': ArrowRight,
      'arrow-left': ArrowLeft,
      'external-link': ExternalLink,
      'download': Download,
      'mail': Mail,
      'phone': Phone,
      'plus': Plus,
      'check': Check,
      'x': X
    };
    return iconMap[iconName];
  };

  const renderPreview = () => {
    const IconComponent = icon ? getIconComponent(icon) : null;
    
    const buttonStyles = {
      padding: size === 'xs' ? '6px 12px' : 
               size === 'sm' ? '8px 16px' :
               size === 'lg' ? '12px 24px' :
               size === 'xl' ? '16px 32px' : '10px 20px',
      fontSize: size === 'xs' ? '12px' :
                size === 'sm' ? '14px' :
                size === 'lg' ? '18px' :
                size === 'xl' ? '20px' : '16px',
      borderRadius: `${borderRadius}px`,
      backgroundColor: buttonType === 'outline' || buttonType === 'ghost' ? 'transparent' : backgroundColor,
      color: buttonType === 'outline' ? backgroundColor : textColor,
      border: buttonType === 'outline' ? `2px solid ${borderColor || backgroundColor}` : 
              borderColor !== 'transparent' ? `1px solid ${borderColor}` : 'none',
      width: fullWidth ? '100%' : 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      textDecoration: buttonType === 'link' ? 'underline' : 'none',
      position: 'relative' as const,
      overflow: 'hidden' as const
    };

    const animationStyles = animation !== 'none' ? {
      animation: animation === 'bounce' ? 'bounce 2s infinite' :
                animation === 'pulse' ? 'pulse 2s infinite' :
                animation === 'shake' ? 'shake 0.5s infinite' :
                animation === 'glow' ? 'glow 2s infinite' : 'none'
    } : {};

    return (
      <div style={{ ...buttonStyles, ...animationStyles }}>
        {loading && <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />}
        {IconComponent && iconPosition === 'left' && <IconComponent className="h-4 w-4" />}
        {text}
        {IconComponent && iconPosition === 'right' && <IconComponent className="h-4 w-4" />}
      </div>
    );
  };

  if (isPreviewMode) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#B89B7A]" />
            Preview: Botão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[100px] flex items-center justify-center">
            {renderPreview()}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer className="h-5 w-5 text-[#B89B7A]" />
          Propriedades: Botão
          <Badge variant="secondary" className="ml-auto">
            {buttonType}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Texto e Tipo */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Texto do Botão</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => handleContentUpdate('text', e.target.value)}
              placeholder="Texto que aparece no botão"
              maxLength={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buttonType">Tipo de Botão</Label>
              <Select value={buttonType} onValueChange={(value) => handleContentUpdate('buttonType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {buttonTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex flex-col">
                        <span>{option.label}</span>
                        <span className="text-xs text-gray-500">{option.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Tamanho</Label>
              <Select value={size} onValueChange={(value) => handleContentUpdate('size', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Link e Ação */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Ação do Botão
          </h3>
          
          <div className="space-y-2">
            <Label htmlFor="href">URL de Destino</Label>
            <Input
              id="href"
              value={href}
              onChange={(e) => handleContentUpdate('href', e.target.value)}
              placeholder="https://exemplo.com ou #secao"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Abrir Link</Label>
              <Select value={target} onValueChange={(value) => handleContentUpdate('target', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_self">Na mesma aba</SelectItem>
                  <SelectItem value="_blank">Em nova aba</SelectItem>
                  <SelectItem value="_parent">Na janela pai</SelectItem>
                  <SelectItem value="_top">Na janela principal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onClick">Ação JavaScript</Label>
              <Input
                id="onClick"
                value={onClick}
                onChange={(e) => handleContentUpdate('onClick', e.target.value)}
                placeholder="alert('Olá!')"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Ícone */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Ícone</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Tipo de Ícone</Label>
              <Select value={icon} onValueChange={(value) => handleContentUpdate('icon', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon && <option.icon className="h-4 w-4" />}
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="iconPosition">Posição do Ícone</Label>
              <Select 
                value={iconPosition} 
                onValueChange={(value) => handleContentUpdate('iconPosition', value)}
                disabled={!icon}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Esquerda</SelectItem>
                  <SelectItem value="right">Direita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Cores
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={(e) => handleContentUpdate('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => handleContentUpdate('backgroundColor', e.target.value)}
                  placeholder="#B89B7A"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Cor do Texto</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="textColor"
                  value={textColor}
                  onChange={(e) => handleContentUpdate('textColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={textColor}
                  onChange={(e) => handleContentUpdate('textColor', e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="borderColor">Cor da Borda</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="borderColor"
                  value={borderColor === 'transparent' ? '#000000' : borderColor}
                  onChange={(e) => handleContentUpdate('borderColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={borderColor}
                  onChange={(e) => handleContentUpdate('borderColor', e.target.value)}
                  placeholder="transparent"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hoverBackgroundColor">Cor ao Passar Mouse</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="hoverBackgroundColor"
                  value={hoverBackgroundColor}
                  onChange={(e) => handleContentUpdate('hoverBackgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={hoverBackgroundColor}
                  onChange={(e) => handleContentUpdate('hoverBackgroundColor', e.target.value)}
                  placeholder="#A08869"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configurações</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fullWidth">Largura Total</Label>
                <p className="text-sm text-gray-500">O botão ocupa toda a largura disponível</p>
              </div>
              <Switch
                id="fullWidth"
                checked={fullWidth}
                onCheckedChange={(checked) => handleContentUpdate('fullWidth', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="disabled">Desabilitado</Label>
                <p className="text-sm text-gray-500">O botão não pode ser clicado</p>
              </div>
              <Switch
                id="disabled"
                checked={disabled}
                onCheckedChange={(checked) => handleContentUpdate('disabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="loading">Estado de Loading</Label>
                <p className="text-sm text-gray-500">Mostra indicador de carregamento</p>
              </div>
              <Switch
                id="loading"
                checked={loading}
                onCheckedChange={(checked) => handleContentUpdate('loading', checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Border Radius</Label>
              <PropertyNumber
                value={borderRadius}
                onChange={(value) => handleContentUpdate('borderRadius', value)}
                min={0}
                max={50}
                step={1}
                suffix="px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="animation">Animação</Label>
              <Select value={animation} onValueChange={(value) => handleContentUpdate('animation', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {animationOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[80px] flex items-center justify-center">
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
