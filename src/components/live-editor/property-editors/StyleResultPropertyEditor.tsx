
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface StyleResultPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const StyleResultPropertyEditor: React.FC<StyleResultPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="result-title">Título do Resultado</Label>
        <Input
          id="result-title"
          value={data.primaryStyleTitle || data.title || ''}
          onChange={(e) => onDataUpdate({ primaryStyleTitle: e.target.value, title: e.target.value })}
          placeholder="Seu estilo principal"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="result-description">Descrição</Label>
        <Textarea
          id="result-description"
          value={data.text || ''}
          onChange={(e) => onDataUpdate({ text: e.target.value })}
          placeholder="Descrição do resultado..."
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="result-layout">Layout do Resultado</Label>
        <Select 
          value={data.resultLayout || 'classic'} 
          onValueChange={(value) => onDataUpdate({ resultLayout: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="classic">Clássico</SelectItem>
            <SelectItem value="modern">Moderno</SelectItem>
            <SelectItem value="minimal">Minimalista</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-percentages"
          checked={data.showPercentages || false}
          onCheckedChange={(checked) => onDataUpdate({ showPercentages: checked })}
        />
        <Label htmlFor="show-percentages">Mostrar porcentagens</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-descriptions"
          checked={data.showDescriptions !== false}
          onCheckedChange={(checked) => onDataUpdate({ showDescriptions: checked })}
        />
        <Label htmlFor="show-descriptions">Mostrar descrições</Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-text">Texto do Call-to-Action</Label>
        <Input
          id="cta-text"
          value={data.callToActionText || ''}
          onChange={(e) => onDataUpdate({ callToActionText: e.target.value })}
          placeholder="Clique aqui para continuar"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cta-url">URL do Call-to-Action</Label>
        <Input
          id="cta-url"
          value={data.callToActionUrl || ''}
          onChange={(e) => onDataUpdate({ callToActionUrl: e.target.value })}
          placeholder="https://exemplo.com"
        />
      </div>
    </div>
  );
};
