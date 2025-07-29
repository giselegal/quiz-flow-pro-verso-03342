
import React, { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditableContent } from '@/types/editor';

export interface BlockComponentProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: EditableContent) => void;
  onSelect?: () => void;
  className?: string;
}

export const HeaderBlock: FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  isEditing, 
  onUpdate, 
  onSelect, 
  className 
}) => {
  if (isEditing && onUpdate) {
    return (
      <div className={`border-2 border-blue-500 rounded-lg p-4 ${className}`}>
        <Input
          value={content.title || ''}
          onChange={(e) => onUpdate({ ...content, title: e.target.value })}
          placeholder="Digite o título"
          className="text-2xl font-bold"
        />
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      <h1 className="text-2xl font-bold">{content.title || 'Título'}</h1>
    </div>
  );
};

export const TextBlock: FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  isEditing, 
  onUpdate, 
  onSelect, 
  className 
}) => {
  if (isEditing && onUpdate) {
    return (
      <div className={`border-2 border-blue-500 rounded-lg p-4 ${className}`}>
        <Textarea
          value={content.text || ''}
          onChange={(e) => onUpdate({ ...content, text: e.target.value })}
          placeholder="Digite o texto"
          rows={4}
        />
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      <p>{content.text || 'Texto'}</p>
    </div>
  );
};

export const ImageBlock: FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  isEditing, 
  onUpdate, 
  onSelect, 
  className 
}) => {
  if (isEditing && onUpdate) {
    return (
      <div className={`border-2 border-blue-500 rounded-lg p-4 ${className}`}>
        <Input
          value={content.imageUrl || ''}
          onChange={(e) => onUpdate({ ...content, imageUrl: e.target.value })}
          placeholder="URL da imagem"
          className="mb-2"
        />
        <Input
          value={content.imageAlt || ''}
          onChange={(e) => onUpdate({ ...content, imageAlt: e.target.value })}
          placeholder="Texto alternativo"
        />
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      {content.imageUrl ? (
        <img 
          src={content.imageUrl} 
          alt={content.imageAlt || 'Imagem'} 
          className="max-w-full h-auto rounded"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-gray-500">Imagem</span>
        </div>
      )}
    </div>
  );
};

export const ButtonBlock: FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  isEditing, 
  onUpdate, 
  onSelect, 
  className 
}) => {
  if (isEditing && onUpdate) {
    return (
      <div className={`border-2 border-blue-500 rounded-lg p-4 ${className}`}>
        <Input
          value={content.buttonText || ''}
          onChange={(e) => onUpdate({ ...content, buttonText: e.target.value })}
          placeholder="Texto do botão"
          className="mb-2"
        />
        <Input
          value={content.buttonUrl || ''}
          onChange={(e) => onUpdate({ ...content, buttonUrl: e.target.value })}
          placeholder="URL do botão"
        />
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      <Button>{content.buttonText || 'Botão'}</Button>
    </div>
  );
};

export const SpacerBlock: FC<BlockComponentProps> = ({ 
  isSelected, 
  onSelect, 
  className 
}) => {
  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      <div className="w-full h-8 bg-gray-100 rounded flex items-center justify-center">
        <span className="text-gray-500 text-sm">Espaçador</span>
      </div>
    </div>
  );
};

export const QuizQuestionBlock: FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  isEditing, 
  onUpdate, 
  onSelect, 
  className 
}) => {
  if (isEditing && onUpdate) {
    return (
      <div className={`border-2 border-blue-500 rounded-lg p-4 ${className}`}>
        <Input
          value={content.question || ''}
          onChange={(e) => onUpdate({ ...content, question: e.target.value })}
          placeholder="Digite a pergunta"
          className="mb-4"
        />
        <div className="space-y-2">
          {(content.options || []).map((option, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...(content.options || [])];
                  newOptions[index] = { ...option, text: e.target.value };
                  onUpdate({ ...content, options: newOptions });
                }}
                placeholder={`Opção ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      <Card className="p-4">
        <h3 className="font-medium mb-3">{content.question || 'Pergunta do Quiz'}</h3>
        <div className="space-y-2">
          {(content.options || []).map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input type="radio" name={`question-${Date.now()}`} disabled />
              <span>{option.text}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export const TestimonialBlock: FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  className 
}) => {
  return (
    <div 
      className={`cursor-pointer rounded-lg p-4 ${isSelected ? 'ring-2 ring-blue-500' : ''} ${className}`}
      onClick={onSelect}
    >
      <Card className="p-4">
        <Badge variant="secondary">Depoimento</Badge>
        <p className="mt-2">{content.text || 'Texto do depoimento'}</p>
      </Card>
    </div>
  );
};

export const blockComponents = {
  header: HeaderBlock,
  text: TextBlock,
  image: ImageBlock,
  button: ButtonBlock,
  spacer: SpacerBlock,
  'quiz-question': QuizQuestionBlock,
  testimonial: TestimonialBlock,
};
