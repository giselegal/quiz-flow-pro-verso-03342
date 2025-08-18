// @ts-nocheck
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { BlockEditorProps } from './types';

// Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const BonusCarouselBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  const bonusImages = block.content.bonusImages || [];

  const addImage = () => {
    const newImages = [...bonusImages, { url: '', alt: '', title: '' }];
    onUpdate({ bonusImages: newImages });
  };

  const removeImage = (index: number) => {
    const newImages = bonusImages.filter((_: any, i: number) => i !== index);
    onUpdate({ bonusImages: newImages });
  };

  const updateImage = (index: number, field: 'url' | 'alt' | 'title', value: string) => {
    const newImages = bonusImages.map((img: any, i: number) =>
      i === index ? { ...img, [field]: value } : img
    );
    onUpdate({ bonusImages: newImages });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título da Seção</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          className="mt-1"
          placeholder="Você recebe também:"
        />
      </div>

      <div className="space-y-4">
        <Label>Imagens dos Bônus</Label>
        {bonusImages.map((image: any, index: number) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg bg-[#FAF9F7]">
            <div className="flex justify-between items-center">
              <Label>Bônus {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeImage(index)}
                style={{ color: '#432818' }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={image.url}
              onChange={e => updateImage(index, 'url', e.target.value)}
              placeholder="URL da imagem"
              className="mt-1"
            />

            <Input
              value={image.title || ''}
              onChange={e => updateImage(index, 'title', e.target.value)}
              placeholder="Título do bônus"
              className="mt-1"
            />

            <Input
              value={image.alt}
              onChange={e => updateImage(index, 'alt', e.target.value)}
              placeholder="Texto alternativo"
              className="mt-1"
            />
          </div>
        ))}

        <Button variant="outline" onClick={addImage} className="w-full mt-2">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Imagem
        </Button>
      </div>
    </div>
  );
};
