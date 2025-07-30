
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface HeadlinePropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
  onStyleUpdate: (updates: any) => void;
}

export const HeadlinePropertyEditor: React.FC<HeadlinePropertyEditorProps> = ({
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
          <Label htmlFor="title">Título Principal</Label>
          <Input
            id="title"
            value={data.title || ''}
            onChange={(e) => onDataUpdate({ title: e.target.value })}
            placeholder="Digite o título principal..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Textarea
            id="subtitle"
            value={data.subtitle || ''}
            onChange={(e) => onDataUpdate({ subtitle: e.target.value })}
            placeholder="Digite o subtítulo..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-align">Alinhamento do Texto</Label>
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
          <Label htmlFor="padding-y">Espaçamento Vertical</Label>
          <Select 
            value={style.paddingY || '16'} 
            onValueChange={(value) => onStyleUpdate({ paddingY: value })}
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

        <div className="space-y-2">
          <Label htmlFor="border-radius">Arredondamento</Label>
          <Select 
            value={style.borderRadius || '0'} 
            onValueChange={(value) => onStyleUpdate({ borderRadius: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Sem arredondamento</SelectItem>
              <SelectItem value="4">Pequeno (4px)</SelectItem>
              <SelectItem value="8">Médio (8px)</SelectItem>
              <SelectItem value="16">Grande (16px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
