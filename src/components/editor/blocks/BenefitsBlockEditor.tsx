
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { BlockEditorProps } from './types';

export const BenefitsBlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onUpdate
}) => {
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
          onChange={(e) => onUpdate({ title: e.target.value })}
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
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`Benefício ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="mt-2 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Benefício
          </Button>
        </div>
      </div>
    </div>
  );
};
