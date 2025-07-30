
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DividerPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
  onStyleUpdate: (updates: any) => void;
}

export const DividerPropertyEditor: React.FC<DividerPropertyEditorProps> = ({
  component,
  onDataUpdate,
  onStyleUpdate
}) => {
  const data = component.data || {};
  const style = component.style || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="divider-style">Estilo da Linha</Label>
        <Select 
          value={data.style || 'solid'} 
          onValueChange={(value) => onDataUpdate({ style: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solid">Sólida</SelectItem>
            <SelectItem value="dashed">Tracejada</SelectItem>
            <SelectItem value="dotted">Pontilhada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="divider-color">Cor da Linha</Label>
        <Input
          id="divider-color"
          type="color"
          value={style.backgroundColor || '#B89B7A'}
          onChange={(e) => onStyleUpdate({ backgroundColor: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="divider-width">Largura</Label>
        <Select 
          value={data.width || '100'} 
          onValueChange={(value) => onDataUpdate({ width: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="25">25%</SelectItem>
            <SelectItem value="50">50%</SelectItem>
            <SelectItem value="75">75%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
