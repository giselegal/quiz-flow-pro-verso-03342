
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface GuaranteePropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const GuaranteePropertyEditor: React.FC<GuaranteePropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="guarantee-title">Título da Garantia</Label>
        <Input
          id="guarantee-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Garantia de 30 dias"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="guarantee-text">Descrição</Label>
        <Textarea
          id="guarantee-text"
          value={data.text || ''}
          onChange={(e) => onDataUpdate({ text: e.target.value })}
          placeholder="Descrição da garantia..."
          rows={4}
        />
      </div>
    </div>
  );
};
