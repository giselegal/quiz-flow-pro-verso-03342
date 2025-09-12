import React from 'react';
import { ScoreValuesProperty } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { ContextualTooltip } from './ContextualTooltip';

interface ScoreValue {
  value: number;
  label: string;
}

interface ScoreValuesEditorProps {
  property: ScoreValuesProperty;
  onChange: (value: ScoreValue[]) => void;
}

export const ScoreValuesEditor: React.FC<ScoreValuesEditorProps> = ({
  property,
  onChange
}) => {
  const values = property.value || [];

  const addScoreValue = () => {
    const newValues = [...values, { value: 0, label: 'Nova opção' }];
    onChange(newValues);
  };

  const updateScoreValue = (index: number, field: keyof ScoreValue, newValue: string | number) => {
    const newValues = [...values];
    newValues[index] = { ...newValues[index], [field]: newValue };
    onChange(newValues);
  };

  const removeScoreValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium">{property.label}</Label>
        <ContextualTooltip content="Configure os valores de pontuação para cada opção" />
      </div>

      <div className="space-y-2">
        {values.map((scoreValue, index) => (
          <div key={index} className="flex gap-2 items-center p-2 border rounded-md">
            <div className="flex-1">
              <Input
                value={scoreValue.label}
                onChange={(e) => updateScoreValue(index, 'label', e.target.value)}
                placeholder="Rótulo da opção"
                className="mb-2"
              />
              <Input
                type="number"
                value={scoreValue.value}
                onChange={(e) => updateScoreValue(index, 'value', Number(e.target.value))}
                placeholder="Valor da pontuação"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeScoreValue(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addScoreValue}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Opção
      </Button>
    </div>
  );
};