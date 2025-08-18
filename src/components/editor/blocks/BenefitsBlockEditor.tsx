// @ts-nocheck
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { BlockEditorProps } from './types';

export // Função para converter valores de margem em classes Tailwind (Sistema Universal)
const getMarginClass = (value, type) => {
  const numValue = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(numValue) || numValue === 0) return '';

  const prefix = type === 'top' ? 'mt' : type === 'bottom' ? 'mb' : type === 'left' ? 'ml' : 'mr';

  // Margens negativas
  if (numValue < 0) {
    const absValue = Math.abs(numValue);
    if (absValue <= 4) return `-${prefix}-1`;
    if (absValue <= 8) return `-${prefix}-2`;
    if (absValue <= 12) return `-${prefix}-3`;
    if (absValue <= 16) return `-${prefix}-4`;
    if (absValue <= 20) return `-${prefix}-5`;
    if (absValue <= 24) return `-${prefix}-6`;
    if (absValue <= 28) return `-${prefix}-7`;
    if (absValue <= 32) return `-${prefix}-8`;
    if (absValue <= 36) return `-${prefix}-9`;
    if (absValue <= 40) return `-${prefix}-10`;
    return `-${prefix}-10`; // Máximo para negativas
  }

  // Margens positivas (expandido para suportar até 100px)
  if (numValue <= 4) return `${prefix}-1`;
  if (numValue <= 8) return `${prefix}-2`;
  if (numValue <= 12) return `${prefix}-3`;
  if (numValue <= 16) return `${prefix}-4`;
  if (numValue <= 20) return `${prefix}-5`;
  if (numValue <= 24) return `${prefix}-6`;
  if (numValue <= 28) return `${prefix}-7`;
  if (numValue <= 32) return `${prefix}-8`;
  if (numValue <= 36) return `${prefix}-9`;
  if (numValue <= 40) return `${prefix}-10`;
  if (numValue <= 44) return `${prefix}-11`;
  if (numValue <= 48) return `${prefix}-12`;
  if (numValue <= 56) return `${prefix}-14`;
  if (numValue <= 64) return `${prefix}-16`;
  if (numValue <= 80) return `${prefix}-20`;
  if (numValue <= 96) return `${prefix}-24`;
  if (numValue <= 112) return `${prefix}-28`;
  return `${prefix}-32`; // Máximo suportado
};

const BenefitsBlockEditor: React.FC<BlockEditorProps> = ({ block, onUpdate }) => {
  // Ensure items is always a string array for benefits
  const items = Array.isArray(block.content.items)
    ? block.content.items.filter((item): item is string => typeof item === 'string')
    : [];

  const addItem = () => {
    const newItems = [...items, ''];
    onUpdate({ items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onUpdate({ items: newItems });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ items: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ''}
          onChange={e => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Benefícios</Label>
        <div className="space-y-2 mt-2">
          {items.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={e => updateItem(index, e.target.value)}
                placeholder={`Benefício ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                style={{ color: '#432818' }}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addItem} className="mt-2 w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Benefício
          </Button>
        </div>
      </div>
    </div>
  );
};
