import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColorPicker } from './ColorPicker';

interface StyleEditorProps {
  style: Record<string, any>;
  onChange: (style: Record<string, any>) => void;
}

export const StyleEditor: React.FC<StyleEditorProps> = ({ style, onChange }) => {
  // Ensure style is always an object
  const currentStyle = typeof style === 'object' && style !== null ? style : {};

  const updateStyle = (property: string, value: any) => {
    onChange({
      ...currentStyle,
      [property]: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Typography Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Tipografia</h3>

        <div className="space-y-2">
          <Label htmlFor="fontFamily">Família da Fonte</Label>
          <Select
            value={currentStyle.fontFamily || 'inherit'}
            onValueChange={value => updateStyle('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inherit">Padrão</SelectItem>
              <SelectItem value="Arial, sans-serif">Arial</SelectItem>
              <SelectItem value="Georgia, serif">Georgia</SelectItem>
              <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Tamanho da Fonte</Label>
          <Input
            id="fontSize"
            value={currentStyle.fontSize || ''}
            onChange={e => updateStyle('fontSize', e.target.value)}
            placeholder="16px"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontWeight">Peso da Fonte</Label>
          <Select
            value={currentStyle.fontWeight || 'normal'}
            onValueChange={value => updateStyle('fontWeight', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Negrito</SelectItem>
              <SelectItem value="lighter">Mais Leve</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lineHeight">Altura da Linha</Label>
          <Input
            id="lineHeight"
            value={currentStyle.lineHeight || ''}
            onChange={e => updateStyle('lineHeight', e.target.value)}
            placeholder="1.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="textAlign">Alinhamento</Label>
          <Select
            value={currentStyle.textAlign || 'left'}
            onValueChange={value => updateStyle('textAlign', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
              <SelectItem value="justify">Justificado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Spacing Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Espaçamento</h3>

        <div className="space-y-2">
          <Label htmlFor="margin">Margem</Label>
          <Input
            id="margin"
            value={currentStyle.margin || ''}
            onChange={e => updateStyle('margin', e.target.value)}
            placeholder="10px"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="padding">Preenchimento</Label>
          <Input
            id="padding"
            value={currentStyle.padding || ''}
            onChange={e => updateStyle('padding', e.target.value)}
            placeholder="10px"
          />
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Cores</h3>

        <div className="space-y-2">
          <Label>Cor do Texto</Label>
          <ColorPicker
            color={currentStyle.color || '#000000'}
            onChange={color => updateStyle('color', color)}
          />
        </div>

        <div className="space-y-2">
          <Label>Cor de Fundo</Label>
          <ColorPicker
            color={currentStyle.backgroundColor || 'transparent'}
            onChange={color => updateStyle('backgroundColor', color)}
          />
        </div>
      </div>

      {/* Border Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Borda</h3>

        <div className="space-y-2">
          <Label htmlFor="borderRadius">Raio da Borda</Label>
          <Input
            id="borderRadius"
            value={currentStyle.borderRadius || ''}
            onChange={e => updateStyle('borderRadius', e.target.value)}
            placeholder="4px"
          />
        </div>
      </div>
    </div>
  );
};

export default StyleEditor;
