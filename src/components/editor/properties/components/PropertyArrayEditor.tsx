import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { PropertyInputProps } from '../interfaces/PropertyEditor';
import { ImageUploadCell } from './ImageUploadCell';

interface ArrayItem {
  id: string;
  text: string;
  value?: string;
  description?: string;
  imageUrl?: string;
  imageFile?: File;
  category?: string;
  points?: number;
}

interface PropertyArrayEditorProps extends Omit<PropertyInputProps, 'value' | 'onChange'> {
  value: ArrayItem[] | string[];
  onChange: (value: ArrayItem[]) => void;
  itemLabel?: string;
  maxItems?: number;
  showImages?: boolean;
  showDescriptions?: boolean;
  layout?: 'simple' | 'detailed';
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
  showImages = true,
  showDescriptions = true,
  layout = 'detailed',
}) => {
  // Converter value para formato consistente
  const items: ArrayItem[] = Array.isArray(value)
    ? value.map((item, index) => {
        if (typeof item === 'string') {
          return {
            id: `item-${index}`,
            text: item,
            value: item,
            description: '',
            imageUrl: '',
            category: '',
            points: 0,
          };
        }
        return {
          id: item.id || `item-${index}`,
          text: item.text || '',
          value: item.value || '',
          description: item.description || '',
          imageUrl: item.imageUrl || '',
          imageFile: item.imageFile,
          category: item.category || '',
          points: item.points || 0,
        };
      })
    : [];

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleAddItem = useCallback(() => {
    if (items.length >= maxItems) return;

    const newItem: ArrayItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: `${itemLabel} ${items.length + 1}`,
      value: `option_${items.length + 1}`,
      description: '',
      imageUrl: '',
      category: '',
      points: 0,
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
    (index: number, field: keyof ArrayItem, value: string | number | File) => {
      const newItems = [...items];
      newItems[index] = { ...newItems[index], [field]: value };
      onChange(newItems);
    },
    [items, onChange]
  );

  const handleImageChange = useCallback(
    (index: number, imageUrl: string, imageFile?: File) => {
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        imageUrl,
        imageFile: imageFile || undefined,
      };
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

      <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-3 bg-card">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={e => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'flex items-start gap-3 p-3 bg-background rounded-lg border border-border',
              draggedIndex === index && 'opacity-50',
              'cursor-move hover:shadow-sm transition-all duration-200'
            )}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />

            {layout === 'detailed' && showImages && (
              <ImageUploadCell
                imageUrl={item.imageUrl}
                onImageChange={(imageUrl, imageFile) =>
                  handleImageChange(index, imageUrl, imageFile)
                }
                size={60}
                disabled={disabled}
                placeholder="Imagem"
              />
            )}

            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Input
                  value={item.text}
                  onChange={e => handleUpdateItem(index, 'text', e.target.value)}
                  placeholder="Título da opção"
                  disabled={disabled}
                  className="flex-1 font-medium"
                />
                <Input
                  value={item.value || ''}
                  onChange={e => handleUpdateItem(index, 'value', e.target.value)}
                  placeholder="Valor"
                  disabled={disabled}
                  className="w-20 text-xs"
                />
              </div>

              {layout === 'detailed' && showDescriptions && (
                <Textarea
                  value={item.description || ''}
                  onChange={e => handleUpdateItem(index, 'description', e.target.value)}
                  placeholder={`Descrição detalhada da opção (ex: "Amo roupas confortáveis e práticas para o dia a dia.")`}
                  disabled={disabled}
                  className="text-sm resize-none"
                  rows={2}
                />
              )}

              <div className="flex gap-2">
                <Input
                  value={item.category || ''}
                  onChange={e => {
                    const newCategory = e.target.value;
                    handleUpdateItem(index, 'category', newCategory);

                    // Auto-preenchimento inteligente da descrição baseado na categoria
                    if (newCategory && !item.description) {
                      const categoryDescriptions: { [key: string]: string } = {
                        Natural: 'Amo roupas confortáveis e práticas para o dia a dia',
                        Clássico: 'Prefiro peças atemporais e elegantes',
                        Contemporâneo: 'Gosto de combinar moderno com clássico',
                        Elegante: 'Valorizo sofisticação e refinamento',
                        Romântico: 'Adoro looks delicados e femininos',
                        Sexy: 'Prefiro roupas que valorizam minha silhueta',
                        Dramático: 'Gosto de looks marcantes e impactantes',
                        Criativo: 'Amo experimentar cores e estampas ousadas',
                      };

                      const suggestedDescription = categoryDescriptions[newCategory];
                      if (suggestedDescription) {
                        handleUpdateItem(index, 'description', suggestedDescription);
                      }
                    }
                  }}
                  placeholder="Categoria (Natural, Clássico, etc.)"
                  disabled={disabled}
                  className="flex-1 text-xs"
                />
                <Input
                  type="number"
                  value={item.points || 0}
                  onChange={e => handleUpdateItem(index, 'points', parseInt(e.target.value) || 0)}
                  placeholder="Pontos"
                  disabled={disabled}
                  className="w-20 text-xs"
                  min={0}
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(index)}
              disabled={disabled || items.length <= 1}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
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
