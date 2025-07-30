
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface ChecklistPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const ChecklistPropertyEditor: React.FC<ChecklistPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};
  const items = data.items || [''];

  const addItem = () => {
    onDataUpdate({ items: [...items, ''] });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    onDataUpdate({ items: newItems });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onDataUpdate({ items: newItems });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="checklist-title">Título do Checklist</Label>
        <Input
          id="checklist-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Lista de verificação"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Itens da Lista</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {items.map((item: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={`Item ${index + 1}`}
            />
            {items.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
