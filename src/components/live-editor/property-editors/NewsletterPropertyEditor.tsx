
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NewsletterPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const NewsletterPropertyEditor: React.FC<NewsletterPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newsletter-title">Título</Label>
        <Input
          id="newsletter-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Inscreva-se na newsletter"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newsletter-description">Descrição</Label>
        <Textarea
          id="newsletter-description"
          value={data.text || ''}
          onChange={(e) => onDataUpdate({ text: e.target.value })}
          placeholder="Receba nossas atualizações..."
          rows={3}
        />
      </div>
    </div>
  );
};
