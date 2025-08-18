// @ts-nocheck
import { Block, FAQItem } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface BenefitsBlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
}

const BenefitsBlockEditor: React.FC<BenefitsBlockEditorProps> = ({ block, onUpdate }) => {
  const content = block.content || {};
  const items = content.items || [];

  // Type guard to ensure we're working with string array
  const isStringArray = (items: any[]): items is string[] => {
    return items.length === 0 || typeof items[0] === 'string';
  };

  // Ensure items is a string array for benefits
  const benefitItems: string[] = isStringArray(items) ? items : [];

  const handleTitleChange = (title: string) => {
    onUpdate({
      ...block,
      content: { ...content, title },
    });
  };

  const handleAddItem = () => {
    const newItems = [...benefitItems, 'Novo benefício'];
    onUpdate({
      ...block,
      content: { ...content, items: newItems },
    });
  };

  const handleUpdateItem = (index: number, value: string) => {
    const newItems = [...benefitItems];
    newItems[index] = value;
    onUpdate({
      ...block,
      content: { ...content, items: newItems },
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = benefitItems.filter((_, i) => i !== index);
    onUpdate({
      ...block,
      content: { ...content, items: newItems },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="benefits-title">Título</Label>
        <Input
          id="benefits-title"
          value={content.title || ''}
          onChange={e => handleTitleChange(e.target.value)}
          placeholder="Título da seção"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Benefícios</Label>
          <Button size="sm" variant="outline" onClick={handleAddItem}>
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-2">
          {benefitItems.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={e => handleUpdateItem(index, e.target.value)}
                placeholder={`Benefício ${index + 1}`}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveItem(index)}
                style={{ color: '#432818' }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {benefitItems.length === 0 && (
          <p style={{ color: '#8B7355' }}>
            Nenhum benefício adicionado. Clique em "Adicionar" para começar.
          </p>
        )}
      </div>
    </div>
  );
};

export default BenefitsBlockEditor;
