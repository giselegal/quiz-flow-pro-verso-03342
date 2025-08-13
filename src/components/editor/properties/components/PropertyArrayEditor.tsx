import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PropertyInputProps } from '../interfaces/PropertyEditor';

interface ArrayItem {
  id: string;
  text: string;
  value?: string;
}

interface PropertyArrayEditorProps extends Omit<PropertyInputProps, 'value' | 'onChange'> {
  value: ArrayItem[] | string[];
  onChange: (value: ArrayItem[]) => void;
  itemLabel?: string;
  maxItems?: number;
}

export const PropertyArrayEditor: React.FC<PropertyArrayEditorProps> = ({
  label,
  value = [],
  onChange,
  itemLabel = 'Item',
  maxItems = 10,
  required = false,
  error = false,
  errorMessage,
  disabled = false,
}) => {
  // Converter value para formato consistente
  const items: ArrayItem[] = Array.isArray(value)
    ? value.map((item, index) => {
        if (typeof item === 'string') {
          return { id: `item-${index}`, text: item, value: item };
        }
        return item;
      })
    : [];

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddItem = useCallback(() => {
    if (items.length >= maxItems) return;

    const newItem: ArrayItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `${itemLabel} ${items.length + 1}`,
      value: `option_${items.length + 1}`,
    };

    onChange([...items, newItem]);
  }, [items, maxItems, itemLabel, onChange]);

  const handleRemoveItem = useCallback(
    (index: number) => {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleUpdateItem = useCallback(
    (index: number, field: keyof ArrayItem, value: string) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;

      const newItems = [...items];
      const draggedItem = newItems[draggedIndex];
      newItems.splice(draggedIndex, 1);
      newItems.splice(index, 0, draggedItem);

      onChange(newItems);
      setDraggedIndex(index);
    },
    [draggedIndex, items, onChange]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  return (
    <div className="space-y-2">
      <Label
        className={cn(
          'text-sm font-medium',
          required && "after:content-['*'] after:text-red-500 after:ml-1",
          error && 'text-red-600'
        )}
      >
        {label} ({items.length}/{maxItems})
      </Label>

      <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-2 bg-gray-50">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-center gap-2 p-2 bg-white rounded border',
              draggedIndex === index && 'opacity-50',
              'cursor-move hover:shadow-sm transition-shadow'
            )}
          >
            <GripVertical className="h-4 w-4 text-gray-400" />

            <div className="flex-1 space-y-1">
              <Input
                value={item.text}
                onChange={e => handleUpdateItem(index, 'text', e.target.value)}
                placeholder={`${itemLabel} ${index + 1}`}
                disabled={disabled}
                className="text-sm"
              />
              <Input
                value={item.value || ''}
                onChange={e => handleUpdateItem(index, 'value', e.target.value)}
                placeholder="Valor (opcional)"
                disabled={disabled}
                className="text-xs"
              />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(index)}
              disabled={disabled || items.length <= 1}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500">
            Nenhuma opção adicionada ainda
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddItem}
        disabled={disabled || items.length >= maxItems}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar {itemLabel}
      </Button>

      {error && errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
};
