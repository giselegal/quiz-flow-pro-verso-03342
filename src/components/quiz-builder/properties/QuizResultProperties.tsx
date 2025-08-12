import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface QuizResultPropertiesProps {
  data: QuizComponentData['data'];
  onUpdate: (data: any) => void;
}

const QuizResultProperties: React.FC<QuizResultPropertiesProps> = ({ data = {}, onUpdate }) => {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Título do Resultado</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={e => onUpdate({ ...data, title: e.target.value })}
          placeholder="Seu Resultado"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={e => onUpdate({ ...data, description: e.target.value })}
          placeholder="Descrição do resultado"
          rows={3}
        />
      </div>

      <div className="border p-4 rounded-md space-y-4">
        <h3 className="font-medium">Seções Visíveis</h3>

        <div className="flex items-center justify-between">
          <Label htmlFor="showPrimaryStyle">Estilo Principal</Label>
          <Switch
            id="showPrimaryStyle"
            checked={data.showPrimaryStyle !== false}
            onCheckedChange={checked => onUpdate({ ...data, showPrimaryStyle: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showSecondaryStyles">Estilos Secundários</Label>
          <Switch
            id="showSecondaryStyles"
            checked={data.showSecondaryStyles !== false}
            onCheckedChange={checked => onUpdate({ ...data, showSecondaryStyles: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="showOfferSection">Seção de Oferta</Label>
          <Switch
            id="showOfferSection"
            checked={data.showOfferSection !== false}
            onCheckedChange={checked => onUpdate({ ...data, showOfferSection: checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizResultProperties;
