
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface PricingPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const PricingPropertyEditor: React.FC<PricingPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product-name">Nome do Produto</Label>
        <Input
          id="product-name"
          value={data.productName || ''}
          onChange={(e) => onDataUpdate({ productName: e.target.value })}
          placeholder="Nome do produto"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          value={data.price || ''}
          onChange={(e) => onDataUpdate({ price: e.target.value })}
          placeholder="R$ 99,00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="original-price">Preço Original (opcional)</Label>
        <Input
          id="original-price"
          value={data.originalPrice || ''}
          onChange={(e) => onDataUpdate({ originalPrice: e.target.value })}
          placeholder="R$ 199,00"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="highlight"
          checked={data.highlighted || false}
          onCheckedChange={(checked) => onDataUpdate({ highlighted: checked })}
        />
        <Label htmlFor="highlight">Destacar este plano</Label>
      </div>
    </div>
  );
};
