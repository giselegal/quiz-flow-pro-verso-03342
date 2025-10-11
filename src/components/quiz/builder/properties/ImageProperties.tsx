import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImagePropertiesProps {
  component: QuizComponentData;
  onUpdate: (id: string, data: any) => void;
}

export const ImageProperties: React.FC<ImagePropertiesProps> = ({ component, onUpdate }) => {
  const data = component.data || {};

  const handleUpdate = (field: string, value: any) => {
    onUpdate(component.id, {
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={data.imageUrl || ''}
          onChange={e => handleUpdate('imageUrl', e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div>
        <Label htmlFor="alt">Texto Alternativo</Label>
        <Input
          id="alt"
          value={data.alt || ''}
          onChange={e => handleUpdate('alt', e.target.value)}
          placeholder="Descrição da imagem"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="width">Largura</Label>
          <Input
            id="width"
            value={data.width || ''}
            onChange={e => handleUpdate('width', e.target.value)}
            placeholder="100%"
          />
        </div>
        <div>
          <Label htmlFor="height">Altura</Label>
          <Input
            id="height"
            value={data.height || ''}
            onChange={e => handleUpdate('height', e.target.value)}
            placeholder="auto"
          />
        </div>
      </div>
    </div>
  );
};
