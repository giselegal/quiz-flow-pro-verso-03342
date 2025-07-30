
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FeatureGridPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const FeatureGridPropertyEditor: React.FC<FeatureGridPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="features-title">Título da Seção</Label>
        <Input
          id="features-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Principais características"
        />
      </div>
    </div>
  );
};
