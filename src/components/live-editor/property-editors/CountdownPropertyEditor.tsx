
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CountdownPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const CountdownPropertyEditor: React.FC<CountdownPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="countdown-title">Título do Countdown</Label>
        <Input
          id="countdown-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Oferta por tempo limitado"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="countdown-date">Data de Expiração</Label>
        <Input
          id="countdown-date"
          type="datetime-local"
          value={data.expirationDate || ''}
          onChange={(e) => onDataUpdate({ expirationDate: e.target.value })}
        />
      </div>
    </div>
  );
};
