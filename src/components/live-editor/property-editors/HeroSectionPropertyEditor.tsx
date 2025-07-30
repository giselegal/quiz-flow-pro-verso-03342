
import React from 'react';
import { QuizComponentData } from '@/types/quizBuilder';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface HeroSectionPropertyEditorProps {
  component: QuizComponentData;
  onDataUpdate: (updates: any) => void;
}

export const HeroSectionPropertyEditor: React.FC<HeroSectionPropertyEditorProps> = ({
  component,
  onDataUpdate
}) => {
  const data = component.data || {};

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hero-title">Título</Label>
        <Textarea
          id="hero-title"
          rows={2}
          value={data.title || ''}
          onChange={(e) => onDataUpdate({ title: e.target.value })}
          placeholder="VOCÊ DESCOBRIU SEU ESTILO"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hero-subtitle">Subtítulo</Label>
        <Textarea
          id="hero-subtitle"
          rows={2}
          value={data.subtitle || ''}
          onChange={(e) => onDataUpdate({ subtitle: e.target.value })}
          placeholder="Agora é hora de aplicar com clareza — e se vestir de você"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hero-heroImage">Imagem Principal</Label>
        <Input
          id="hero-heroImage"
          value={data.heroImage || ''}
          onChange={(e) => onDataUpdate({ heroImage: e.target.value })}
          placeholder="URL da imagem principal"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="hero-heroImageAlt">Texto Alternativo da Imagem</Label>
        <Input
          id="hero-heroImageAlt"
          value={data.heroImageAlt || ''}
          onChange={(e) => onDataUpdate({ heroImageAlt: e.target.value })}
          placeholder="Descrição da imagem"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-quote">Depoimento</Label>
        <Textarea
          id="hero-quote"
          value={data.quote || ''}
          onChange={(e) => onDataUpdate({ quote: e.target.value })}
          placeholder="Digite o depoimento do cliente"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hero-quoteAuthor">Autor do Depoimento</Label>
        <Input
          id="hero-quoteAuthor"
          value={data.quoteAuthor || ''}
          onChange={(e) => onDataUpdate({ quoteAuthor: e.target.value })}
          placeholder="Nome e idade do cliente"
        />
      </div>
    </div>
  );
};
