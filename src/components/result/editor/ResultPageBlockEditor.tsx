// @ts-nocheck
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  CarouselBlock,
  CTABlock,
  ResultPageBlock,
  StyleResultBlock,
  TestimonialBlock,
} from '@/types/quizResult';
import { Copy, PlusCircle, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface ResultPageBlockEditorProps {
  block: ResultPageBlock;
  onUpdate: (updatedBlock: ResultPageBlock) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  abTestVariants?: string[];
  abTestEnabled?: boolean;
}

export const ResultPageBlockEditor: React.FC<ResultPageBlockEditorProps> = ({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
  abTestVariants = [],
  abTestEnabled = false,
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({
      ...block,
      content: e.target.value,
    });
  };

  const handleSettingChange = (key: string, value: any) => {
    onUpdate({
      ...block,
      settings: {
        ...block.settings,
        [key]: value,
      },
    });
  };

  const handleVisibilityToggle = () => {
    onUpdate({
      ...block,
      isVisible: block.isVisible === undefined ? false : !block.isVisible,
    });
  };

  const handleAbTestVariantChange = (variant: string) => {
    onUpdate({
      ...block,
      abTestVariant: variant === 'all' ? '' : variant,
    });
  };

  const renderSpecificBlockEditor = () => {
    switch (block.type) {
      case 'styleResult':
        return renderStyleResultEditor(block as StyleResultBlock);
      case 'cta':
        return renderCTAEditor(block as CTABlock);
      case 'testimonial':
        return renderTestimonialEditor(block as TestimonialBlock);
      case 'carousel':
        return renderCarouselEditor(block as CarouselBlock);
      default:
        return renderDefaultEditor();
    }
  };

  const renderStyleResultEditor = (styleBlock: StyleResultBlock) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="styleCategory">Categoria de Estilo</Label>
        <Select
          value={styleBlock.styleCategory}
          onValueChange={value => onUpdate({ ...styleBlock, styleCategory: value })}
        >
          <SelectTrigger id="styleCategory">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Natural">Natural</SelectItem>
            <SelectItem value="Clássico">Clássico</SelectItem>
            <SelectItem value="Contemporâneo">Contemporâneo</SelectItem>
            <SelectItem value="Elegante">Elegante</SelectItem>
            <SelectItem value="Romântico">Romântico</SelectItem>
            <SelectItem value="Sexy">Sexy</SelectItem>
            <SelectItem value="Dramático">Dramático</SelectItem>
            <SelectItem value="Criativo">Criativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="percentage">Porcentagem</Label>
        <Input
          id="percentage"
          type="number"
          min="0"
          max="100"
          value={styleBlock.percentage || 0}
          onChange={e => onUpdate({ ...styleBlock, percentage: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={styleBlock.description || ''}
          onChange={e => onUpdate({ ...styleBlock, description: e.target.value })}
          rows={4}
        />
      </div>
    </div>
  );

  const renderCTAEditor = (ctaBlock: CTABlock) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão</Label>
        <Input
          id="buttonText"
          value={ctaBlock.buttonText}
          onChange={e => onUpdate({ ...ctaBlock, buttonText: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={ctaBlock.url}
          onChange={e => onUpdate({ ...ctaBlock, url: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pixelId">ID do Pixel (opcional)</Label>
        <Input
          id="pixelId"
          value={ctaBlock.pixelId || ''}
          onChange={e => onUpdate({ ...ctaBlock, pixelId: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Cor de Fundo</Label>
        <div className="flex items-center gap-2">
          <Input
            id="backgroundColor"
            type="color"
            className="w-12 h-10 p-1"
            value={ctaBlock.backgroundColor || '#000000'}
            onChange={e => onUpdate({ ...ctaBlock, backgroundColor: e.target.value })}
          />
          <Input
            value={ctaBlock.backgroundColor || '#000000'}
            onChange={e => onUpdate({ ...ctaBlock, backgroundColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="textColor">Cor do Texto</Label>
        <div className="flex items-center gap-2">
          <Input
            id="textColor"
            type="color"
            className="w-12 h-10 p-1"
            value={ctaBlock.textColor || '#ffffff'}
            onChange={e => onUpdate({ ...ctaBlock, textColor: e.target.value })}
          />
          <Input
            value={ctaBlock.textColor || '#ffffff'}
            onChange={e => onUpdate({ ...ctaBlock, textColor: e.target.value })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );

  const renderTestimonialEditor = (testimonialBlock: TestimonialBlock) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Depoimento</Label>
        <Textarea
          id="content"
          value={testimonialBlock.content}
          onChange={handleContentChange}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Autor</Label>
        <Input
          id="author"
          value={testimonialBlock.author}
          onChange={e => onUpdate({ ...testimonialBlock, author: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="authorImage">Imagem do Autor (URL)</Label>
        <Input
          id="authorImage"
          value={testimonialBlock.authorImage || ''}
          onChange={e => onUpdate({ ...testimonialBlock, authorImage: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rating">Avaliação (1-5)</Label>
        <Input
          id="rating"
          type="number"
          min="1"
          max="5"
          value={testimonialBlock.rating || 5}
          onChange={e => onUpdate({ ...testimonialBlock, rating: Number(e.target.value) })}
        />
      </div>
    </div>
  );

  const renderCarouselEditor = (carouselBlock: CarouselBlock) => {
    const addCarouselItem = () => {
      const newItem = {
        id: `item-${Date.now()}`,
        imageUrl: '',
        caption: '',
      };

      onUpdate({
        ...carouselBlock,
        items: [...(carouselBlock.items || []), newItem],
      });
    };

    const updateCarouselItem = (index: number, key: string, value: string) => {
      const updatedItems = [...(carouselBlock.items || [])];
      updatedItems[index] = {
        ...updatedItems[index],
        [key]: value,
      };

      onUpdate({
        ...carouselBlock,
        items: updatedItems,
      });
    };

    const removeCarouselItem = (index: number) => {
      const updatedItems = [...(carouselBlock.items || [])];
      updatedItems.splice(index, 1);

      onUpdate({
        ...carouselBlock,
        items: updatedItems,
      });
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Itens do Carrossel</Label>
          <Button size="sm" variant="outline" onClick={addCarouselItem}>
            <PlusCircle className="h-4 w-4 mr-1" /> Adicionar Item
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {(carouselBlock.items || []).map((item, index) => (
              <Card key={item.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium">Item {index + 1}</h4>
                  <Button size="sm" variant="ghost" onClick={() => removeCarouselItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor={`item-${index}-image`}>URL da Imagem</Label>
                    <Input
                      id={`item-${index}-image`}
                      value={item.imageUrl}
                      onChange={e => updateCarouselItem(index, 'imageUrl', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`item-${index}-caption`}>Legenda</Label>
                    <Input
                      id={`item-${index}-caption`}
                      value={item.caption || ''}
                      onChange={e => updateCarouselItem(index, 'caption', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderDefaultEditor = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea id="content" value={block.content} onChange={handleContentChange} rows={6} />
      </div>

      {block.type === 'image' && (
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input
            id="imageUrl"
            value={block.imageUrl || ''}
            onChange={e => onUpdate({ ...block, imageUrl: e.target.value })}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-medium capitalize">{block.type}</h3>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={onDuplicate}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Conteúdo</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="pt-4">
          {renderSpecificBlockEditor()}
        </TabsContent>

        <TabsContent value="settings" className="pt-4">
          <div className="space-y-4">
            {abTestEnabled && (
              <div className="space-y-2">
                <Label htmlFor="abTestVariant">Variante de Teste A/B</Label>
                <Select
                  value={block.abTestVariant || 'all'}
                  onValueChange={handleAbTestVariantChange}
                >
                  <SelectTrigger id="abTestVariant">
                    <SelectValue placeholder="Selecione a variante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as variantes</SelectItem>
                    {abTestVariants.filter(variant => variant && variant !== '').map(variant => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 border border-[#B89B7A]/20 rounded-lg bg-[#B89B7A]/5">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="isVisible" className="font-medium">
                    Visibilidade do Bloco
                  </Label>
                  <Switch
                    id="isVisible"
                    checked={block.isVisible !== false}
                    onCheckedChange={() => handleVisibilityToggle()}
                  />
                </div>
                <p className="text-sm text-[#8F7A6A]">
                  {block.isVisible !== false
                    ? '🟢 Este bloco será exibido na página de resultados'
                    : '🔴 Este bloco está oculto e não será exibido'}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
