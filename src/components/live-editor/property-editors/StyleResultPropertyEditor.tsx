import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColorPicker } from '@/components/result-editor/ColorPicker';

interface StyleResultPropertyEditorProps {
  properties: any;
  onPropertyChange: (key: string, value: any) => void;
}

export const StyleResultPropertyEditor: React.FC<StyleResultPropertyEditorProps> = ({
  properties = {},
  onPropertyChange,
}) => {
  const {
    styleName = 'Elegante',
    percentage = 85,
    description = 'Seu estilo único',
    showStars = true,
    showProgress = true,
    cardSize = 'medium',
    backgroundColor = 'white',
    borderColor = '#B89B7A',
  } = properties;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Conteúdo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="styleName">Nome do Estilo</Label>
            <Input
              id="styleName"
              value={styleName}
              onChange={e => onPropertyChange('styleName', e.target.value)}
              placeholder="Elegante"
            />
          </div>

          <div>
            <Label htmlFor="percentage">Porcentagem</Label>
            <Input
              id="percentage"
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={e => onPropertyChange('percentage', parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => onPropertyChange('description', e.target.value)}
              placeholder="Descrição do estilo..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Layout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

          <div className="flex items-center justify-between">
            <Label htmlFor="showProgress">Mostrar Progresso</Label>
            <Switch
              id="showProgress"
              checked={showProgress}
              onCheckedChange={checked => onPropertyChange('showProgress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="showStars">Mostrar Estrelas</Label>
            <Switch
              id="showStars"
              checked={showStars}
              onCheckedChange={checked => onPropertyChange('showStars', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cor de Fundo</Label>
            <ColorPicker
              color={backgroundColor}
              onChange={color => onPropertyChange('backgroundColor', color)}
            />
          </div>

          <div>
            <Label>Cor da Borda</Label>
            <ColorPicker
              color={borderColor}
              onChange={color => onPropertyChange('borderColor', color)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
