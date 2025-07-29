
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Trash2, Settings } from 'lucide-react';

export interface BlockComponentProps {
  content: any;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

export const TextBlock: React.FC<BlockComponentProps> = ({ content, onUpdate, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Texto</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Textarea
        placeholder="Digite o texto aqui..."
        value={content.text || ''}
        onChange={(e) => onUpdate({ ...content, text: e.target.value })}
        rows={4}
      />
    </div>
  );
};

export const QuestionBlock: React.FC<BlockComponentProps> = ({ content, onUpdate, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Pergunta</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Input
        placeholder="Digite a pergunta..."
        value={content.question || ''}
        onChange={(e) => onUpdate({ ...content, question: e.target.value })}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Opções:</label>
        {(content.options || ['', '']).map((option: string, index: number) => (
          <Input
            key={index}
            placeholder={`Opção ${index + 1}`}
            value={option}
            onChange={(e) => {
              const newOptions = [...(content.options || ['', ''])];
              newOptions[index] = e.target.value;
              onUpdate({ ...content, options: newOptions });
            }}
          />
        ))}
      </div>
    </div>
  );
};

export const ImageBlock: React.FC<BlockComponentProps> = ({ content, onUpdate, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="outline">Imagem</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <Input
        placeholder="URL da imagem"
        value={content.imageUrl || ''}
        onChange={(e) => onUpdate({ ...content, imageUrl: e.target.value })}
      />
      <Input
        placeholder="Texto alternativo"
        value={content.alt || ''}
        onChange={(e) => onUpdate({ ...content, alt: e.target.value })}
      />
      {content.imageUrl && (
        <div className="mt-4">
          <img 
            src={content.imageUrl} 
            alt={content.alt || 'Preview'} 
            className="max-w-full h-auto rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export const blockComponents = {
  text: TextBlock,
  question: QuestionBlock,
  image: ImageBlock,
};

// Export the main component for compatibility
export const BlockComponents = blockComponents;
