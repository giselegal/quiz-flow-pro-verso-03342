
import React from 'react';
import { Block } from '@/types/editor';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContentPropertiesEditorProps {
  block: Block;
  onUpdate: (content: any) => void;
}

export function ContentPropertiesEditor({ block, onUpdate }: ContentPropertiesEditorProps) {
  switch (block.type) {
    case 'headline':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={block.content?.title || ''}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Digite o título..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input
              id="subtitle"
              value={block.content?.subtitle || ''}
              onChange={(e) => onUpdate({ subtitle: e.target.value })}
              placeholder="Digite o subtítulo..."
            />
          </div>
        </div>
      );
      
    case 'text':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Texto</Label>
            <Textarea
              id="text"
              value={block.content?.text || ''}
              onChange={(e) => onUpdate({ text: e.target.value })}
              placeholder="Digite o texto..."
              rows={6}
            />
          </div>
        </div>
      );
      
    case 'image':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem</Label>
            <Input
              id="imageUrl"
              value={block.content?.imageUrl || ''}
              onChange={(e) => onUpdate({ imageUrl: e.target.value })}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageAlt">Texto Alternativo</Label>
            <Input
              id="imageAlt"
              value={block.content?.imageAlt || ''}
              onChange={(e) => onUpdate({ imageAlt: e.target.value })}
              placeholder="Descrição da imagem para acessibilidade"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caption">Legenda</Label>
            <Input
              id="caption"
              value={block.content?.caption || ''}
              onChange={(e) => onUpdate({ caption: e.target.value })}
              placeholder="Legenda da imagem"
            />
          </div>
          
          {/* Add file upload button here later */}
        </div>
      );
      
    // Add more block types here...
      
    default:
      return (
        <div className="p-4 border border-[#B89B7A]/20 rounded-md bg-[#FAF9F7]">
          <p className="text-[#8F7A6A]">Editor não implementado para: {block.type}</p>
        </div>
      );
  }
}
