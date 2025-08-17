import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Block } from '@/types/editor';
import { Image as ImageIcon } from 'lucide-react';
import React from 'react';

interface BlockProps {
  block: Block;
  onClick?: () => void;
  selected?: boolean;
}

const TextBlockPreview: React.FC<BlockProps> = ({ block }) => (
  <div className="prose max-w-none">{block.content.text || 'Texto vazio...'}</div>
);

const HeadlineBlockPreview: React.FC<BlockProps> = ({ block }) => (
  <div
    className={cn('prose max-w-none', {
      'text-center': block.content.alignment === 'center',
      'text-right': block.content.alignment === 'right',
    })}
  >
    <h1 className={cn('m-0', block.content.fontSize)}>{block.content.title || 'Título...'}</h1>
    {block.content.subtitle && (
      <p className="text-muted-foreground mt-2">{block.content.subtitle}</p>
    )}
  </div>
);

const ImageBlockPreview: React.FC<BlockProps> = ({ block }) => {
  if (!block.content.url) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative aspect-video">
      <img
        src={block.content.url}
        alt={block.content.alt || ''}
        className="object-cover rounded-lg"
        style={{
          width: block.content.width || '100%',
          height: block.content.height || 'auto',
        }}
      />
    </div>
  );
};

const ButtonBlockPreview: React.FC<BlockProps> = ({ block }) => (
  <div
    className={cn('flex', {
      'justify-center': block.content.alignment === 'center',
      'justify-end': block.content.alignment === 'right',
    })}
  >
    <Button variant={block.content.type === 'primary' ? 'default' : 'outline'}>
      {block.content.buttonText || 'Botão'}
    </Button>
  </div>
);

const LeadFormPreview: React.FC<BlockProps> = ({ block }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>{block.content.title || 'Campo de Entrada'}</Label>
      <Input placeholder={block.content.placeholder || 'Digite aqui...'} />
    </div>
    <Button className="w-full">{block.content.buttonText || 'Enviar'}</Button>
  </div>
);

const QuizHeaderPreview: React.FC<BlockProps> = ({ block }) => (
  <div className="text-center space-y-4">
    {block.properties?.logoUrl && (
      <img
        src={block.properties.logoUrl}
        alt="Logo"
        className="mx-auto"
        style={{
          width: block.properties.logoWidth || 96,
          height: block.properties.logoHeight || 96,
        }}
      />
    )}
    <h1 className="text-2xl font-bold">{block.content.title || 'Quiz Header'}</h1>
    {block.content.subtitle && <p className="text-muted-foreground">{block.content.subtitle}</p>}
  </div>
);

const BlockPreviews: Record<string, React.FC<BlockProps>> = {
  text: TextBlockPreview,
  'text-inline': TextBlockPreview,
  headline: HeadlineBlockPreview,
  image: ImageBlockPreview,
  'image-inline': ImageBlockPreview,
  'image-display-inline': ImageBlockPreview,
  button: ButtonBlockPreview,
  'button-inline': ButtonBlockPreview,
  'lead-form': LeadFormPreview,
  'quiz-header': QuizHeaderPreview,
  'quiz-intro-header': QuizHeaderPreview,
};

export const BlockRenderer: React.FC<BlockProps> = ({ block, onClick, selected }) => {
  const Preview =
    BlockPreviews[block.type] ||
    (() => (
      <div className="p-4 border border-dashed rounded">
        <p className="text-sm text-muted-foreground">
          Visualização não disponível para bloco do tipo: {block.type}
        </p>
      </div>
    ));

  return (
    <div
      onClick={onClick}
      className={cn(
        'block-preview transition-shadow hover:shadow-sm',
        selected && 'ring-2 ring-primary'
      )}
    >
      <Preview block={block} selected={selected} />
    </div>
  );
};
