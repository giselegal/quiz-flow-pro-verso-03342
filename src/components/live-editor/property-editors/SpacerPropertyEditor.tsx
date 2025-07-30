
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SpacerPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const SpacerPropertyEditor: React.FC<SpacerPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="spacer-height">Altura do Espaçador</Label>
        <Select 
          value={data.height || '24'} 
          onValueChange={(value) => onDataUpdate({ height: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="8">Extra Pequeno (8px)</SelectItem>
            <SelectItem value="16">Pequeno (16px)</SelectItem>
            <SelectItem value="24">Médio (24px)</SelectItem>
            <SelectItem value="32">Grande (32px)</SelectItem>
            <SelectItem value="48">Extra Grande (48px)</SelectItem>
            <SelectItem value="64">Muito Grande (64px)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
