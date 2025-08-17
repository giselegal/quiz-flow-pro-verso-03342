import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface HeaderPropertiesProps {
  component: QuizComponentData;
  onUpdate: (id: string, data: any) => void;
}

export const HeaderProperties: React.FC<HeaderPropertiesProps> = ({ component, onUpdate }) => {
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
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={e => handleUpdate('title', e.target.value)}
          placeholder="Digite o título"
        />
      </div>

      <div>
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          value={data.subtitle || ''}
          onChange={e => handleUpdate('subtitle', e.target.value)}
          placeholder="Digite o subtítulo"
        />
      </div>
    </div>
  );
};
