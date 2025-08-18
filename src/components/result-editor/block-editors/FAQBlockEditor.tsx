import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { EditableContent } from '@/types/editor';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQBlockEditorProps {
  content: EditableContent;
  onUpdate: (content: Partial<EditableContent>) => void;
}

export const FAQBlockEditor: React.FC<FAQBlockEditorProps> = ({ content, onUpdate }) => {
  // Ensure faqItems is properly typed and has a default
  const faqItems: FAQItem[] = content.faqItems || [
    { id: '1', question: 'Pergunta 1', answer: 'Resposta 1' },
    { id: '2', question: 'Pergunta 2', answer: 'Resposta 2' },
  ];

  const updateFAQItems = (newItems: FAQItem[]) => {
    onUpdate({
      ...content,
      faqItems: newItems,
    });
  };

  const addFAQItem = () => {
    const newItem: FAQItem = {
      id: Date.now().toString(),
      question: 'Nova pergunta',
      answer: 'Nova resposta',
    };
    updateFAQItems([...faqItems, newItem]);
  };

  const updateFAQItem = (id: string, field: keyof FAQItem, value: string) => {
    const updatedItems = faqItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    updateFAQItems(updatedItems);
  };

  const deleteFAQItem = (id: string) => {
    const updatedItems = faqItems.filter(item => item.id !== id);
    updateFAQItems(updatedItems);
  };

  return (
    <div className="faq-block-editor space-y-4">
      <div className="header space-y-2">
        <Input
          value={content.title || ''}
          onChange={e => onUpdate({ ...content, title: e.target.value })}
          placeholder="Título da seção FAQ"
          className="text-lg font-medium"
        />
        <Textarea
          value={content.description || ''}
          onChange={e => onUpdate({ ...content, description: e.target.value })}
          placeholder="Descrição opcional"
          rows={2}
        />
      </div>

      <div className="faq-items space-y-3">
        {faqItems.map((item: FAQItem, index: number) => (
          <Card key={item.id} className="p-4">
            <CardContent className="space-y-3 p-0">
              <div className="flex items-start justify-between">
                <span style={{ color: '#8B7355' }}>Item {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFAQItem(item.id)}
                  style={{ color: '#432818' }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <Input
                value={item.question}
                onChange={e => updateFAQItem(item.id, 'question', e.target.value)}
                placeholder="Pergunta"
                className="font-medium"
              />

              <Textarea
                value={item.answer}
                onChange={e => updateFAQItem(item.id, 'answer', e.target.value)}
                placeholder="Resposta"
                rows={3}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={addFAQItem} variant="outline" className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Adicionar FAQ
      </Button>
    </div>
  );
};

export default FAQBlockEditor;
