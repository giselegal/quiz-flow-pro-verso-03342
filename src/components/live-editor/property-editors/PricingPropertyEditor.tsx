import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PricingPropertyEditorProps {
  properties: any;
  onPropertyChange: (key: string, value: any) => void;
}

const PricingPropertyEditor: React.FC<PricingPropertyEditorProps> = ({
  properties = {},
  onPropertyChange,
}) => {
  const handleChange = (key: string, value: any) => {
    onPropertyChange(key, value);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#432818]">Configurações do Preço</h3>

        <div className="space-y-2">
          <Label htmlFor="productTitle">Título do Produto</Label>
          <Input
            id="productTitle"
            value={properties.productTitle || ''}
            onChange={e => handleChange('productTitle', e.target.value)}
            placeholder="Guia de Estilo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="originalPrice">Preço Original</Label>
          <Input
            id="originalPrice"
            value={properties.originalPrice || ''}
            onChange={e => handleChange('originalPrice', e.target.value)}
            placeholder="R$ 97,00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="offerPrice">Preço da Oferta</Label>
          <Input
            id="offerPrice"
            value={properties.offerPrice || ''}
            onChange={e => handleChange('offerPrice', e.target.value)}
            placeholder="R$ 39,90"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Desconto</Label>
          <Input
            id="discount"
            value={properties.discount || ''}
            onChange={e => handleChange('discount', e.target.value)}
            placeholder="60% OFF"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="badge">Texto do Badge</Label>
          <Input
            id="badge"
            value={properties.badge || ''}
            onChange={e => handleChange('badge', e.target.value)}
            placeholder="OFERTA ESPECIAL"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="showBadge"
            checked={properties.showBadge !== false}
            onCheckedChange={checked => handleChange('showBadge', checked)}
          />
          <Label htmlFor="showBadge">Mostrar Badge</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardStyle">Estilo do Cartão</Label>
          <Select
            value={properties.cardStyle || 'standard'}
            onValueChange={value => handleChange('cardStyle', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Padrão</SelectItem>
              <SelectItem value="highlight">Destaque</SelectItem>
              <SelectItem value="minimal">Minimalista</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PricingPropertyEditor;
