import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ColorPicker } from "@/components/result/editor/ColorPicker";

interface StyleControlsProps {
  style: any;
  onUpdate: (style: any) => void;
  showLogoControls?: boolean;
  logoWidth?: string | number;
  logoHeight?: string | number;
  onLogoSizeChange?: (width: string, height: string) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({
  style,
  onUpdate,
  showLogoControls = false,
  logoWidth,
  logoHeight,
  onLogoSizeChange,
}) => {
  const handleChange = (property: string, value: string) => {
    onUpdate({
      ...style,
      [property]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Cor do Fundo</Label>
        <ColorPicker
          color={style.backgroundColor || '#FFFFFF'}
          onChange={color => handleChange('backgroundColor', color)}
        />
      </div>

      {showLogoControls && onLogoSizeChange && (
        <div>
          <Label>Tamanho do Logo</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Largura</Label>
              <Input
                value={logoWidth || ''}
                onChange={e => onLogoSizeChange(e.target.value, logoHeight?.toString() || '')}
                placeholder="auto"
              />
            </div>
            <div>
              <Label className="text-xs">Altura</Label>
              <Input
                value={logoHeight || ''}
                onChange={e => onLogoSizeChange(logoWidth?.toString() || '', e.target.value)}
                placeholder="auto"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <Label>Dimensões da Imagem</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Largura</Label>
            <Input
              value={style.width || ''}
              onChange={e => handleChange('width', e.target.value)}
              placeholder="100%"
            />
          </div>
          <div>
            <Label className="text-xs">Altura</Label>
            <Input
              value={style.height || ''}
              onChange={e => handleChange('height', e.target.value)}
              placeholder="auto"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Ajuste da Imagem</Label>
        <Select
          value={style.objectFit || 'cover'}
          onValueChange={value => handleChange('objectFit', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o ajuste" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cover">Cobrir</SelectItem>
            <SelectItem value="contain">Conter</SelectItem>
            <SelectItem value="fill">Preencher</SelectItem>
            <SelectItem value="none">Nenhum</SelectItem>
            <SelectItem value="scale-down">Escalar para baixo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Espaçamento</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Margem</Label>
            <Input
              value={style.margin || ''}
              onChange={e => handleChange('margin', e.target.value)}
              placeholder="0px"
            />
          </div>
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              value={style.padding || ''}
              onChange={e => handleChange('padding', e.target.value)}
              placeholder="0px"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Arredondamento das Bordas</Label>
        <Input
          value={style.borderRadius || ''}
          onChange={e => handleChange('borderRadius', e.target.value)}
          placeholder="0px"
        />
      </div>
    </div>
  );
};
