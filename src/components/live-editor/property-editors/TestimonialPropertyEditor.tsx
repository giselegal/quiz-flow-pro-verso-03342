import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface TestimonialPropertyEditorProps {
  properties: Record<string, any>;
  onPropertyChange: (key: string, value: any) => void;
}

const TestimonialPropertyEditor: React.FC<TestimonialPropertyEditorProps> = ({
  properties,
  onPropertyChange,
}) => {
  const {
    name = 'Maria Silva',
    testimonial = 'Transformou completamente minha forma de me vestir!',
    avatar = 'https://via.placeholder.com/60x60',
    rating = 5,
    location = 'São Paulo, SP',
    cardSize = 'medium',
  } = properties;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Cliente</Label>
        <Input
          id="name"
          value={name}
          onChange={e => onPropertyChange('name', e.target.value)}
          placeholder="Nome do cliente"
        />
      </div>

      <div>
        <Label htmlFor="testimonial">Depoimento</Label>
        <Textarea
          id="testimonial"
          value={testimonial}
          onChange={e => onPropertyChange('testimonial', e.target.value)}
          placeholder="Texto do depoimento"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          value={location}
          onChange={e => onPropertyChange('location', e.target.value)}
          placeholder="Cidade, Estado"
        />
      </div>

      <div>
        <Label htmlFor="avatar">URL do Avatar</Label>
        <Input
          id="avatar"
          value={avatar}
          onChange={e => onPropertyChange('avatar', e.target.value)}
          placeholder="https://exemplo.com/avatar.jpg"
        />
      </div>

      <div>
        <Label htmlFor="rating">Avaliação (1-5 estrelas)</Label>
        <Select
          value={rating.toString()}
          onValueChange={value => onPropertyChange('rating', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Estrela</SelectItem>
            <SelectItem value="2">2 Estrelas</SelectItem>
            <SelectItem value="3">3 Estrelas</SelectItem>
            <SelectItem value="4">4 Estrelas</SelectItem>
            <SelectItem value="5">5 Estrelas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="cardSize">Tamanho do Card</Label>
        <Select value={cardSize} onValueChange={value => onPropertyChange('cardSize', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Pequeno</SelectItem>
            <SelectItem value="medium">Médio</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TestimonialPropertyEditor;
