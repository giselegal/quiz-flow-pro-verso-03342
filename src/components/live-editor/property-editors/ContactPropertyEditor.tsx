
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const ContactPropertyEditor: React.FC<ContactPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="contact-title">Título</Label>
        <Input
          id="contact-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Entre em contato"
        />
      </div>
    </div>
  );
};
