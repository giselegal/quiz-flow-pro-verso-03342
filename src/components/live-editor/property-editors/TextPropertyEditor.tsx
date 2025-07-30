
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface TextPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
  onStyleUpdate: (updates: any) => void;
}

export const TextPropertyEditor: React.FC<TextPropertyEditorProps> = ({
  component,
  onDataUpdate,
  onStyleUpdate
}) => {
  const data = component.data || {};
  const style = component.style || {};

  return (
    <div className="space-y-6">
      {/* Content Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Conteúdo</h3>
        
        <div className="space-y-2">
          <Label htmlFor="text">Texto</Label>
          <Textarea
            id="text"
            value={data.text || ''}
            onChange={(e) => onDataUpdate({ text: e.target.value })}
            placeholder="Digite o texto aqui..."
            rows={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-size">Tamanho do Texto</Label>
          <Select 
            value={data.textSize || 'medium'} 
            onValueChange={(value) => onDataUpdate({ textSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-align">Alinhamento</Label>
          <Select 
            value={data.textAlign || 'left'} 
            onValueChange={(value) => onDataUpdate({ textAlign: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o alinhamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Esquerda</SelectItem>
              <SelectItem value="center">Centro</SelectItem>
              <SelectItem value="right">Direita</SelectItem>
              <SelectItem value="justify">Justificado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Style Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Estilo</h3>
        
        <div className="space-y-2">
          <Label htmlFor="bg-color">Cor de Fundo</Label>
          <Input
            id="bg-color"
            type="color"
            value={style.backgroundColor || '#ffffff'}
            onChange={(e) => onStyleUpdate({ backgroundColor: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Cor do Texto</Label>
          <Input
            id="text-color"
            type="color"
            value={style.textColor || '#000000'}
            onChange={(e) => onStyleUpdate({ textColor: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="padding">Espaçamento Interno</Label>
          <Select 
            value={style.paddingY || '16'} 
            onValueChange={(value) => onStyleUpdate({ paddingY: value, paddingX: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">Pequeno (8px)</SelectItem>
              <SelectItem value="16">Médio (16px)</SelectItem>
              <SelectItem value="24">Grande (24px)</SelectItem>
              <SelectItem value="32">Extra Grande (32px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
