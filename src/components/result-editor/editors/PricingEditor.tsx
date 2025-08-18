import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PricingEditorProps {
  content: {
    price?: string;
    regularPrice?: string;
    ctaText?: string;
    ctaUrl?: string;
    urgencyText?: string;
    paymentMethods?: string;
    [key: string]: any;
  };
  onUpdate: (content: any) => void;
}

const PricingEditor: React.FC<PricingEditorProps> = ({ content, onUpdate }) => {
  const handleChange = (key: string, value: any) => {
    onUpdate({
      ...content,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          value={content.price || ''}
          onChange={e => handleChange('price', e.target.value)}
          placeholder="39,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="regularPrice">Preço Regular</Label>
        <Input
          id="regularPrice"
          value={content.regularPrice || ''}
          onChange={e => handleChange('regularPrice', e.target.value)}
          placeholder="175,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaText">Texto do Botão</Label>
        <Input
          id="ctaText"
          value={content.ctaText || ''}
          onChange={e => handleChange('ctaText', e.target.value)}
          placeholder="Quero meu Guia + Bônus"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ctaUrl">URL do Botão</Label>
        <Input
          id="ctaUrl"
          value={content.ctaUrl || ''}
          onChange={e => handleChange('ctaUrl', e.target.value)}
          placeholder="https://pay.hotmart.com/..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="urgencyText">Texto de Urgência (opcional)</Label>
        <Input
          id="urgencyText"
          value={content.urgencyText || ''}
          onChange={e => handleChange('urgencyText', e.target.value)}
          placeholder="Oferta por tempo limitado!"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethods">Métodos de Pagamento (opcional)</Label>
        <Textarea
          id="paymentMethods"
          value={content.paymentMethods || ''}
          onChange={e => handleChange('paymentMethods', e.target.value)}
          placeholder="Aceitamos PIX, cartão de crédito e boleto"
          rows={2}
        />
      </div>
    </div>
  );
};

export default PricingEditor;
