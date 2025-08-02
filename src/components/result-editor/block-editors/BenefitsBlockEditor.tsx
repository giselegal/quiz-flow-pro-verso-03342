
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Block } from '@/types/editor';

interface BenefitsBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

export const BenefitsBlockEditor: React.FC<BenefitsBlockEditorProps> = ({
  block,
  onUpdate
}) => {
  const addItem = () => {
    const items = [...(block.content.items || []), ''];
    onUpdate({ ...block.content, items });
  };

  const removeItem = (index: number) => {
    const items = [...(block.content.items || [])];
    items.splice(index, 1);
    onUpdate({ ...block.content, items });
  };

  const updateItem = (index: number, value: string) => {
    const items = [...(block.content.items || [])];
    items[index] = value;
    onUpdate({ ...block.content, items });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ''}
          onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Benefícios</Label>
        <div className="space-y-2 mt-2">
          {(block.content.items || []).map((item: string, index: number) => (
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
