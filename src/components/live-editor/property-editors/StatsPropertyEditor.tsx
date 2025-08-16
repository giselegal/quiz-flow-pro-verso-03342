import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface StatsPropertyEditorProps {
  value: string;
  label: string;
  icon: string;
  valueColor: string;
  labelColor: string;
  backgroundColor: string;
  size: string;
  animated: boolean;
  onChange: (key: string, value: any) => void;
}

export const StatsPropertyEditor: React.FC<StatsPropertyEditorProps> = ({
  value,
  label,
  icon,
  valueColor,
  labelColor,
  backgroundColor,
  size,
  animated,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="value">Valor</Label>
        <Input
          id="value"
          value={value}
          onChange={e => onChange('value', e.target.value)}
          placeholder="95%"
        />
      </div>

      <div>
        <Label htmlFor="label">Rótulo</Label>
        <Input
          id="label"
          value={label}
          onChange={e => onChange('label', e.target.value)}
          placeholder="Satisfação"
        />
      </div>

      <div>
        <Label htmlFor="icon">Ícone</Label>
        <Select value={icon} onValueChange={value => onChange('icon', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trending-up">Tendência</SelectItem>
            <SelectItem value="users">Usuários</SelectItem>
            <SelectItem value="award">Prêmio</SelectItem>
            <SelectItem value="target">Alvo</SelectItem>
            <SelectItem value="zap">Raio</SelectItem>
            <SelectItem value="heart">Coração</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="size">Tamanho</Label>
        <Select value={size} onValueChange={value => onChange('size', value)}>
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

      <div>
        <Label htmlFor="valueColor">Cor do Valor</Label>
        <Input
          id="valueColor"
          type="color"
          value={valueColor}
          onChange={e => onChange('valueColor', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="labelColor">Cor do Rótulo</Label>
        <Input
          id="labelColor"
          type="color"
          value={labelColor}
          onChange={e => onChange('labelColor', e.target.value)}
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

      <div className="flex items-center space-x-2">
        <Switch
          id="animated"
          checked={animated}
          onCheckedChange={checked => onChange('animated', checked)}
        />
        <Label htmlFor="animated">Animação</Label>
      </div>
    </div>
  );
};
