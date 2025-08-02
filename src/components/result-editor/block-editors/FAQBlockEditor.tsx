
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash } from 'lucide-react';
import { Block } from '@/types/editor';

interface FAQBlockEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQBlockEditor: React.FC<FAQBlockEditorProps> = ({
  block,
  onUpdate
}) => {
  const addItem = () => {
    const items = [...(block.content.items || []), { question: '', answer: '' }];
    onUpdate({ ...block.content, items });
  };

  const removeItem = (index: number) => {
    const items = [...(block.content.items || [])];
    items.splice(index, 1);
    onUpdate({ ...block.content, items });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const items = [...(block.content.items || [])];
    items[index] = { ...items[index], [field]: value };
    onUpdate({ ...block.content, items });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${block.id}-title`}>Título da Seção</Label>
        <Input
          id={`${block.id}-title`}
          value={block.content.title || ''}
          onChange={(e) => onUpdate({ ...block.content, title: e.target.value })}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Perguntas e Respostas</Label>
        <div className="space-y-4 mt-2">
          {(block.content.items || []).map((item: FAQItem, index: number) => (
            <div key={index} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">FAQ {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <div>
                <Label>Pergunta</Label>
                <Input
                  value={item.question || ''}
                  onChange={(e) => updateItem(index, 'question', e.target.value)}
                  placeholder="Digite a pergunta..."
                />
              </div>
              <div>
                <Label>Resposta</Label>
                <Textarea
                  value={item.answer || ''}
                  onChange={(e) => updateItem(index, 'answer', e.target.value)}
                  placeholder="Digite a resposta..."
                  rows={3}
                />
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={addItem}
            className="mt-2 w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};
