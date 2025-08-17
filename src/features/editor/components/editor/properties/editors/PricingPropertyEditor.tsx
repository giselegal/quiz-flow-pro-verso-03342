import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Block, PricingContent, isPricingBlock } from '@/types/editor';
import { DollarSign, Eye, Plus, Star, Trash2 } from 'lucide-react';
import React from 'react';

interface PricingPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const PricingPropertyEditor: React.FC<PricingPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Verificar se é realmente um bloco de pricing com tipagem específica
  if (!isPricingBlock(block)) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="text-red-600 text-sm">
            Erro: Este editor é específico para blocos de pricing. Tipo recebido: {block.type}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Tipagem específica garantida
  const content = block.content as PricingContent;

  const title = content.title || '';
  const price = content.price || '';
  const currency = content.currency || 'R$';
  const period = content.period || 'month';
  const customPeriod = content.customPeriod || '';
  const features = content.features || [];
  const ctaText = content.ctaText || 'Escolher Plano';
  const ctaUrl = content.ctaUrl || '';
  const isPopular = content.isPopular || false;
  const popularLabel = content.popularLabel || 'Mais Popular';
  const description = content.description || '';
  const priceColor = content.priceColor || '#B89B7A';
  const ctaColor = content.ctaColor || '#B89B7A';

  const handleContentUpdate = (field: keyof PricingContent, value: any) => {
    const updates = {
      content: {
        ...content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const periodOptions = [
    { value: 'month', label: 'por mês', display: '/mês' },
    { value: 'year', label: 'por ano', display: '/ano' },
    { value: 'one-time', label: 'pagamento único', display: 'único' },
    { value: 'custom', label: 'personalizado', display: customPeriod || '/período' },
  ];

  const handleFeaturesUpdate = (newFeatures: string[]) => {
    handleContentUpdate('features', newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [...features, ''];
    handleFeaturesUpdate(newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    handleFeaturesUpdate(newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    handleFeaturesUpdate(newFeatures);
  };

  const renderPreview = () => {
    const displayPeriod =
      period === 'custom'
        ? customPeriod
        : periodOptions.find(p => p.value === period)?.display || '';

    return (
      <div className="max-w-sm mx-auto">
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white relative">
          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                {popularLabel}
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-bold text-center mb-2">{title || 'Nome do Plano'}</h3>

            {/* Description */}
            {description && <p className="text-gray-600 text-center text-sm mb-4">{description}</p>}

            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg text-gray-600">{currency}</span>
                <span className="text-4xl font-bold" style={{ color: priceColor }}>
                  {price || '0'}
                </span>
                <span className="text-gray-600">{displayPeriod}</span>
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="mb-6">
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-3 h-3 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span>{feature || `Recurso ${index + 1}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA Button */}
            <button
              className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors"
              style={{ backgroundColor: ctaColor }}
            >
              {ctaText}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isPreviewMode) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-[#B89B7A]" />
            Preview: Pricing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
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
          <DollarSign className="h-5 w-5 text-[#B89B7A]" />
          Propriedades: Pricing
          {isPopular && (
            <Badge variant="secondary" className="ml-auto flex items-center gap-1">
              <Star className="h-3 w-3" />
              Popular
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome do Plano</Label>
            <Input
              id="title"
              value={title}
              onChange={e => handleContentUpdate('title', e.target.value)}
              placeholder="Plano Básico, Premium, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={e => handleContentUpdate('description', e.target.value)}
              placeholder="Breve descrição do plano"
            />
          </div>
        </div>

        <Separator />

        {/* Preço */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Preço</h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select
                value={currency}
                onValueChange={(value: string) => handleContentUpdate('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R$">R$ (Real)</SelectItem>
                  <SelectItem value="US$">US$ (Dólar)</SelectItem>
                  <SelectItem value="€">€ (Euro)</SelectItem>
                  <SelectItem value="£">£ (Libra)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Valor</Label>
              <Input
                id="price"
                value={price}
                onChange={e => handleContentUpdate('price', e.target.value)}
                placeholder="99"
                type="text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select
                value={period}
                onValueChange={(value: 'month' | 'year' | 'one-time' | 'custom') =>
                  handleContentUpdate('period', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {period === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customPeriod">Período Personalizado</Label>
              <Input
                id="customPeriod"
                value={customPeriod}
                onChange={e => handleContentUpdate('customPeriod', e.target.value)}
                placeholder="/trimestre, /semestre, etc."
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Recursos/Features */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Recursos do Plano</h3>

          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={e => updateFeature(index, e.target.value)}
                  placeholder={`Recurso ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeFeature(index)}
                  disabled={features.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={addFeature}
            disabled={features.length >= 10}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Recurso
          </Button>
        </div>

        <Separator />

        {/* CTA */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Call to Action</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Texto do Botão</Label>
              <Input
                id="ctaText"
                value={ctaText}
                onChange={e => handleContentUpdate('ctaText', e.target.value)}
                placeholder="Escolher Plano"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaUrl">URL do Botão</Label>
              <Input
                id="ctaUrl"
                value={ctaUrl}
                onChange={e => handleContentUpdate('ctaUrl', e.target.value)}
                placeholder="https://exemplo.com/checkout"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Configurações</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="isPopular">Plano Popular</Label>
              <p className="text-sm text-gray-500">Destaca este plano com um badge especial</p>
            </div>
            <Switch
              id="isPopular"
              checked={isPopular}
              onCheckedChange={checked => handleContentUpdate('isPopular', checked)}
            />
          </div>

          {isPopular && (
            <div className="space-y-2">
              <Label htmlFor="popularLabel">Texto do Badge</Label>
              <Input
                id="popularLabel"
                value={popularLabel}
                onChange={e => handleContentUpdate('popularLabel', e.target.value)}
                placeholder="Mais Popular, Recomendado, etc."
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priceColor">Cor do Preço</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="priceColor"
                  value={priceColor}
                  onChange={e => handleContentUpdate('priceColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={priceColor}
                  onChange={e => handleContentUpdate('priceColor', e.target.value)}
                  placeholder="#B89B7A"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaColor">Cor do Botão</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="ctaColor"
                  value={ctaColor}
                  onChange={e => handleContentUpdate('ctaColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={ctaColor}
                  onChange={e => handleContentUpdate('ctaColor', e.target.value)}
                  placeholder="#B89B7A"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Preview */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[400px] flex items-center justify-center">
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
