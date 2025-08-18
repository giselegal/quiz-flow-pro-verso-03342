import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MultipleChoicePropertiesProps {
  component: QuizComponentData;
  onUpdate: (id: string, data: any) => void;
}

export const MultipleChoiceProperties: React.FC<MultipleChoicePropertiesProps> = ({
  component,
  onUpdate,
}) => {
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
        <Label htmlFor="question">Pergunta</Label>
        <Textarea
          id="question"
          value={data.question || ''}
          onChange={e => handleUpdate('question', e.target.value)}
          placeholder="Digite sua pergunta"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="options">Opções (uma por linha)</Label>
        <Textarea
          id="options"
          value={(data.options || []).join('\n')}
          onChange={e =>
            handleUpdate(
              'options',
              e.target.value.split('\n').filter(opt => opt.trim())
            )
          }
          placeholder="Opção 1\nOpção 2\nOpção 3"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="multiSelect">Máximo de seleções</Label>
        <Input
          id="multiSelect"
          type="number"
          min="1"
          value={data.multiSelect || 1}
          onChange={e => handleUpdate('multiSelect', parseInt(e.target.value) || 1)}
        />
      </div>
    </div>
  );
};
