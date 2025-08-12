import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface TextPropertiesProps {
  component: QuizComponentData;
  onUpdate: (id: string, data: any) => void;
}

export const TextProperties: React.FC<TextPropertiesProps> = ({ component, onUpdate }) => {
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
        <Label htmlFor="text">Texto</Label>
        <Textarea
          id="text"
          value={data.text || ''}
          onChange={e => handleUpdate('text', e.target.value)}
          placeholder="Digite o texto"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="textColor">Cor do Texto</Label>
        <Input
          id="textColor"
          type="color"
          value={data.textColor || '#000000'}
          onChange={e => handleUpdate('textColor', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="fontSize">Tamanho da Fonte</Label>
        <Input
          id="fontSize"
          value={data.fontSize || '16'}
          onChange={e => handleUpdate('fontSize', e.target.value)}
          placeholder="Tamanho em px"
        />
      </div>
    </div>
  );
};
