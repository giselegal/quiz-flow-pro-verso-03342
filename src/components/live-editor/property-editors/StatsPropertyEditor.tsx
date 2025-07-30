
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface StatsPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const StatsPropertyEditor: React.FC<StatsPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="stats-title">Título das Estatísticas</Label>
        <Input
          id="stats-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Estatísticas"
        />
      </div>
    </div>
  );
};
