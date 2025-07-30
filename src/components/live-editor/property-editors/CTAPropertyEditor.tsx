
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface CTAPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
  onStyleUpdate: (updates: any) => void;
}

export const CTAPropertyEditor: React.FC<CTAPropertyEditorProps> = ({
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
        <h3 className="text-sm font-medium text-[#432818]">Botão</h3>
        
        <div className="space-y-2">
          <Label htmlFor="button-text">Texto do Botão</Label>
          <Input
            id="button-text"
            value={data.buttonText || data.text || ''}
            onChange={(e) => onDataUpdate({ buttonText: e.target.value, text: e.target.value })}
            placeholder="Clique aqui"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button-url">Link de Destino</Label>
          <Input
            id="button-url"
            value={data.callToActionUrl || data.url || ''}
            onChange={(e) => onDataUpdate({ callToActionUrl: e.target.value, url: e.target.value })}
            placeholder="https://exemplo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="button-size">Tamanho do Botão</Label>
          <Select 
            value={data.buttonSize || 'medium'} 
            onValueChange={(value) => onDataUpdate({ buttonSize: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
              <SelectItem value="full">Largura Total</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="open-new-tab"
            checked={data.openInNewTab || false}
            onCheckedChange={(checked) => onDataUpdate({ openInNewTab: checked })}
          />
          <Label htmlFor="open-new-tab">Abrir em nova aba</Label>
        </div>
      </div>

      <Separator />

      {/* Style Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-[#432818]">Estilo</h3>
        
        <div className="space-y-2">
          <Label htmlFor="button-style">Estilo do Botão</Label>
          <Select 
            value={data.buttonStyle || 'primary'} 
            onValueChange={(value) => onDataUpdate({ buttonStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primário</SelectItem>
              <SelectItem value="secondary">Secundário</SelectItem>
              <SelectItem value="outline">Contorno</SelectItem>
              <SelectItem value="ghost">Transparente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bg-color">Cor de Fundo</Label>
          <Input
            id="bg-color"
            type="color"
            value={style.backgroundColor || data.backgroundColor || '#B89B7A'}
            onChange={(e) => {
              onStyleUpdate({ backgroundColor: e.target.value });
              onDataUpdate({ backgroundColor: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="text-color">Cor do Texto</Label>
          <Input
            id="text-color"
            type="color"
            value={style.textColor || data.textColor || '#ffffff'}
            onChange={(e) => {
              onStyleUpdate({ textColor: e.target.value });
              onDataUpdate({ textColor: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="border-radius">Arredondamento</Label>
          <Select 
            value={style.borderRadius || '8'} 
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
              <SelectItem value="50">Totalmente arredondado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
