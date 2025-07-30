
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface FAQPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const FAQPropertyEditor: React.FC<FAQPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};
  const faqs = data.faqs || [{ question: '', answer: '' }];

  const addFAQ = () => {
    onDataUpdate({ faqs: [...faqs, { question: '', answer: '' }] });
  };

  const removeFAQ = (index: number) => {
    const newFAQs = faqs.filter((_: any, i: number) => i !== index);
    onDataUpdate({ faqs: newFAQs });
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const newFAQs = [...faqs];
    newFAQs[index] = { ...newFAQs[index], [field]: value };
    onDataUpdate({ faqs: newFAQs });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="faq-title">Título da Seção</Label>
        <Input
          id="faq-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Perguntas Frequentes"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Perguntas e Respostas</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addFAQ}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar FAQ
          </Button>
        </div>

        {faqs.map((faq: any, index: number) => (
          <div key={index} className="p-4 border border-[#B89B7A]/20 rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">FAQ {index + 1}</span>
              {faqs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFAQ(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Pergunta</Label>
              <Input
                value={faq.question}
                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                placeholder="Digite a pergunta..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Resposta</Label>
              <Textarea
                value={faq.answer}
                onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                placeholder="Digite a resposta..."
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
