
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface TestimonialPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const TestimonialPropertyEditor: React.FC<TestimonialPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testimonial-text">Depoimento</Label>
        <Textarea
          id="testimonial-text"
          value={data.text || ''}
          onChange={(e) => onDataUpdate({ text: e.target.value })}
          placeholder="Digite o depoimento..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author-name">Nome do Autor</Label>
        <Input
          id="author-name"
          value={data.authorName || ''}
          onChange={(e) => onDataUpdate({ authorName: e.target.value })}
          placeholder="Nome do autor"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author-role">Cargo/Função</Label>
        <Input
          id="author-role"
          value={data.authorRole || ''}
          onChange={(e) => onDataUpdate({ authorRole: e.target.value })}
          placeholder="Cargo do autor"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author-image">Foto do Autor</Label>
        <Input
          id="author-image"
          value={data.authorImageUrl || ''}
          onChange={(e) => onDataUpdate({ authorImageUrl: e.target.value })}
          placeholder="https://exemplo.com/foto.jpg"
        />
      </div>
    </div>
  );
};
