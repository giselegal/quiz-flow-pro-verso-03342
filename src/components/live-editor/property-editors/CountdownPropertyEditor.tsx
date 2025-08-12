import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CountdownPropertyEditorProps {
  properties: any;
  onChange: (key: string, value: any) => void;
}

export const CountdownPropertyEditor: React.FC<CountdownPropertyEditorProps> = ({
  properties = {},
  onChange,
}) => {
  const {
    initialMinutes = 15,
    title = 'Oferta por tempo limitado',
    urgencyText = 'Esta oferta expira em:',
    backgroundColor = '#ffffff',
    textColor = '#432818',
    accentColor = '#B89B7A',
    gridColumns = 1,
    spacing = 'md',
  } = properties;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={e => onChange('title', e.target.value)}
          placeholder="Digite o título do countdown"
        />
      </div>

      <div>
        <Label htmlFor="urgencyText">Texto de Urgência</Label>
        <Textarea
          id="urgencyText"
          value={urgencyText}
          onChange={e => onChange('urgencyText', e.target.value)}
          placeholder="Digite o texto de urgência"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="initialMinutes">Minutos Iniciais</Label>
        <Input
          id="initialMinutes"
          type="number"
          value={initialMinutes}
          onChange={e => onChange('initialMinutes', parseInt(e.target.value) || 15)}
          min="1"
          max="120"
        />
      </div>

      <div>
        <Label htmlFor="backgroundColor">Cor de Fundo</Label>
        <Input
          id="backgroundColor"
          type="color"
          value={backgroundColor}
          onChange={e => onChange('backgroundColor', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="textColor">Cor do Texto</Label>
        <Input
          id="textColor"
          type="color"
          value={textColor}
          onChange={e => onChange('textColor', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="accentColor">Cor de Destaque</Label>
        <Input
          id="accentColor"
          type="color"
          value={accentColor}
          onChange={e => onChange('accentColor', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="gridColumns">Colunas</Label>
        <Select
          value={gridColumns.toString()}
          onValueChange={value => onChange('gridColumns', parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Coluna</SelectItem>
            <SelectItem value="2">2 Colunas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="spacing">Espaçamento</Label>
        <Select value={spacing} onValueChange={value => onChange('spacing', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum</SelectItem>
            <SelectItem value="sm">Pequeno</SelectItem>
            <SelectItem value="md">Médio</SelectItem>
            <SelectItem value="lg">Grande</SelectItem>
            <SelectItem value="xl">Extra Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CountdownPropertyEditor;
