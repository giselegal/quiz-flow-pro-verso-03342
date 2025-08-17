import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import { Block, TestimonialContent, isTestimonialBlock } from '@/types/editor';
import { Eye, MessageCircle, Star, User } from 'lucide-react';
import React from 'react';
import { PropertyNumber } from '../components/PropertyNumber';

interface TestimonialPropertyEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  isPreviewMode?: boolean;
}

export const TestimonialPropertyEditor: React.FC<TestimonialPropertyEditorProps> = ({
  block,
  onUpdate,
  isPreviewMode = false,
}) => {
  // Verificar se é realmente um bloco de testimonial
  if (!isTestimonialBlock(block)) {
    return (
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="text-red-600 text-sm">
            Erro: Este editor é específico para blocos de testimonial. Tipo recebido: {block.type}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Agora temos tipagem específica garantida
  const content = block.content as TestimonialContent;

  const quote = content.quote || '';
  const author = content.author || '';
  const authorTitle = content.authorTitle || '';
  const authorImage = content.authorImage || '';
  const rating = content.rating || 5;
  const company = content.company || '';
  const showQuotes = content.showQuotes !== false;
  const layout = content.layout || 'card';
  const backgroundColor = content.backgroundColor || '#FFFFFF';
  const textColor = content.textColor || '#333333';

  const handleContentUpdate = (field: keyof TestimonialContent, value: any) => {
    const updates = {
      content: {
        ...content,
        [field]: value,
      },
    };
    onUpdate(updates);
  };

  const layoutOptions = [
    { value: 'card', label: 'Card', description: 'Layout em card com borda e sombra' },
    { value: 'minimal', label: 'Minimal', description: 'Layout limpo sem bordas' },
    {
      value: 'detailed',
      label: 'Detalhado',
      description: 'Layout completo com todos os elementos',
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const renderPreview = () => {
    const cardStyles = {
      backgroundColor,
      color: textColor,
      padding: layout === 'minimal' ? '16px' : '24px',
      borderRadius: layout === 'card' ? '12px' : '6px',
      border: layout === 'card' ? '1px solid #E5E5E5' : 'none',
      boxShadow: layout === 'card' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
    };

    return (
      <div style={cardStyles} className="max-w-md">
        {/* Quote */}
        <div className="mb-4">
          {showQuotes && <span className="text-4xl text-gray-400 leading-none">"</span>}
          <p className="text-base leading-relaxed italic" style={{ color: textColor }}>
            {quote || 'Escreva o depoimento aqui...'}
          </p>
          {showQuotes && <span className="text-4xl text-gray-400 leading-none">"</span>}
        </div>

        {/* Rating */}
        {rating > 0 && <div className="flex items-center mb-3">{renderStars(rating)}</div>}

        {/* Author Info */}
        <div className="flex items-center gap-3">
          {authorImage && (
            <img src={authorImage} alt={author} className="w-12 h-12 rounded-full object-cover" />
          )}

          <div className="flex-1">
            <div className="font-medium" style={{ color: textColor }}>
              {author || 'Nome do Cliente'}
            </div>

            {(authorTitle || company) && (
              <div className="text-sm opacity-75" style={{ color: textColor }}>
                {authorTitle}
                {authorTitle && company && ', '}
                {company}
              </div>
            )}
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
            Preview: Testimonial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
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
          <MessageCircle className="h-5 w-5 text-[#B89B7A]" />
          Propriedades: Testimonial
          <Badge variant="secondary" className="ml-auto">
            {layout}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Conteúdo do Depoimento */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quote">Depoimento</Label>
            <Textarea
              id="quote"
              value={quote}
              onChange={e => handleContentUpdate('quote', e.target.value)}
              placeholder="Digite o depoimento do cliente aqui..."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">{quote.length}/500 caracteres</div>
          </div>

          <div className="space-y-2">
            <PropertyNumber
              label="Avaliação (estrelas)"
              value={rating}
              onChange={(value: number) => handleContentUpdate('rating', value)}
              min={0}
              max={5}
              step={1}
            />
            <div className="flex items-center gap-1">
              {renderStars(rating)}
              <span className="text-sm text-gray-500 ml-2">{rating} de 5</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informações do Autor */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações do Autor
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="author">Nome do Cliente</Label>
              <Input
                id="author"
                value={author}
                onChange={e => handleContentUpdate('author', e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorTitle">Cargo/Título</Label>
              <Input
                id="authorTitle"
                value={authorTitle}
                onChange={e => handleContentUpdate('authorTitle', e.target.value)}
                placeholder="CEO, Gerente, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={company}
                onChange={e => handleContentUpdate('company', e.target.value)}
                placeholder="Nome da empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorImage">URL da Foto</Label>
              <Input
                id="authorImage"
                value={authorImage}
                onChange={e => handleContentUpdate('authorImage', e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Layout</h3>

          <div className="space-y-2">
            <Label htmlFor="layout">Estilo do Layout</Label>
            <Select
              value={layout}
              onValueChange={(value: 'card' | 'minimal' | 'detailed') =>
                handleContentUpdate('layout', value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {layoutOptions.map(option => (
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

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showQuotes">Mostrar Aspas</Label>
              <p className="text-sm text-gray-500">Exibe aspas decorativas ao redor do texto</p>
            </div>
            <Switch
              id="showQuotes"
              checked={showQuotes}
              onCheckedChange={checked => handleContentUpdate('showQuotes', checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Cores */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Cores</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Cor de Fundo</Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  id="backgroundColor"
                  value={backgroundColor}
                  onChange={e => handleContentUpdate('backgroundColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={backgroundColor}
                  onChange={e => handleContentUpdate('backgroundColor', e.target.value)}
                  placeholder="#FFFFFF"
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
                  onChange={e => handleContentUpdate('textColor', e.target.value)}
                  className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  value={textColor}
                  onChange={e => handleContentUpdate('textColor', e.target.value)}
                  placeholder="#333333"
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
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px] flex items-center justify-center">
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
