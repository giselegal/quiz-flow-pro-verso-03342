
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface HeaderPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const HeaderPropertyEditor: React.FC<HeaderPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="header-title">Título</Label>
        <Textarea
          id="header-title"
          rows={2}
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="Olá, seu Estilo Predominante é:"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="header-subtitle">Subtítulo</Label>
        <Textarea
          id="header-subtitle"
          rows={2}
          value={data.subtitle || ''}
          onChange={(e) => onDataUpdate({ subtitle: e.target.value })}
          placeholder="Subtítulo personalizado"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="header-logo">URL do Logo</Label>
        <Input
          id="header-logo"
          value={data.logo || ''}
          onChange={(e) => onDataUpdate({ logo: e.target.value })}
          placeholder="https://exemplo.com/seu-logo.png"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="header-logoAlt">Texto Alternativo do Logo</Label>
        <Input
          id="header-logoAlt"
          value={data.logoAlt || ''}
          onChange={(e) => onDataUpdate({ logoAlt: e.target.value })}
          placeholder="Logo Gisele Galvão"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label htmlFor="header-logoWidth">Largura do Logo</Label>
          <Input
            id="header-logoWidth"
            value={data.logoWidth || ''}
            onChange={(e) => onDataUpdate({ logoWidth: e.target.value })}
            placeholder="auto"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="header-logoHeight">Altura do Logo</Label>
          <Input
            id="header-logoHeight"
            value={data.logoHeight || ''}
            onChange={(e) => onDataUpdate({ logoHeight: e.target.value })}
            placeholder="auto"
          />
        </div>
      </div>
    </div>
  );
};
