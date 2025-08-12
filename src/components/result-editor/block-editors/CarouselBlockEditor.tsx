import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Block } from '@/types/editor';

interface CarouselBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

interface CarouselImage {
  id: string;
  imageUrl: string;
  caption?: string;
}

export const CarouselBlockEditor: React.FC<CarouselBlockEditorProps> = ({ block, onUpdate }) => {
  const addImage = () => {
    const images = [
      ...(block.content.images || []),
      {
        id: Date.now().toString(),
        imageUrl: '',
        caption: '',
      },
    ];
    onUpdate({ ...block.content, images });
  };

  const removeImage = (index: number) => {
    const images = [...(block.content.images || [])];
    images.splice(index, 1);
    onUpdate({ ...block.content, images });
  };

  const updateImage = (index: number, field: string, value: string) => {
    const images = [...(block.content.images || [])];
    images[index] = { ...images[index], [field]: value };
    onUpdate({ ...block.content, images });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ''}
          onChange={e => onUpdate({ ...block.content, title: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Imagens do Carrossel</Label>
        <div className="space-y-2 mt-2">
          {(block.content.images || []).map((image: CarouselImage, index: number) => (
            <div key={image.id || index} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Imagem {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeImage(index)}
                  style={{ color: '#432818' }}
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>URL da Imagem</Label>
                <Input
                  value={image.imageUrl || ''}
                  onChange={e => updateImage(index, 'imageUrl', e.target.value)}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
              <div>
                <Label>Legenda</Label>
                <Input
                  value={image.caption || ''}
                  onChange={e => updateImage(index, 'caption', e.target.value)}
                  placeholder="Legenda opcional"
                />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addImage} className="mt-2 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Imagem
          </Button>
        </div>
      </div>
    </div>
  );
};
