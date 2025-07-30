
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface BenefitsPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const BenefitsPropertyEditor: React.FC<BenefitsPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};
  const benefits = data.benefits || [''];

  const addBenefit = () => {
    onDataUpdate({ benefits: [...benefits, ''] });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = benefits.filter((_: any, i: number) => i !== index);
    onDataUpdate({ benefits: newBenefits });
  };

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    onDataUpdate({ benefits: newBenefits });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="benefits-title">Título da Seção</Label>
        <Input
          id="benefits-title"
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Benefícios"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Lista de Benefícios</Label>
          <Button
            variant="outline"
            size="sm"
            onClick={addBenefit}
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar
          </Button>
        </div>

        {benefits.map((benefit: string, index: number) => (
          <div key={index} className="flex gap-2">
            <Input
              value={benefit}
              onChange={(e) => updateBenefit(index, e.target.value)}
              placeholder={`Benefício ${index + 1}`}
            />
            {benefits.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeBenefit(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
