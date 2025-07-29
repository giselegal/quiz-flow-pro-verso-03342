import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlockComponentProps {
  content: EditableContent;
  isSelected?: boolean;
  isEditing?: boolean;
  onUpdate?: (content: any) => void;
  onSelect?: () => void;
  className?: string;
}

export const HeaderBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  return (
    <div 
      className={`border-2 p-4 rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <h2 className="text-2xl font-bold">
        {content?.text || 'Header Text'}
      </h2>
    </div>
  );
};

export const TextBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  return (
    <div 
      className={`border-2 p-4 rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <p className="text-gray-700">
        {content?.text || 'Text content goes here...'}
      </p>
    </div>
  );
};

export const ImageBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  return (
    <div 
      className={`border-2 p-4 rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
        {content?.src ? (
          <img 
            src={content.src} 
            alt={content.alt || 'Image'} 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-gray-500">Image placeholder</span>
        )}
      </div>
    </div>
  );
};

export const ButtonBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  return (
    <div 
      className={`border-2 p-4 rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <Button 
        className="w-full"
        style={{ backgroundColor: content?.backgroundColor || '#3b82f6' }}
      >
        {content?.text || 'Button Text'}
      </Button>
    </div>
  );
};

export const SpacerBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  const height = content?.height || 40;
  
  return (
    <div 
      className={`border-2 rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
      style={{ height: `${height}px` }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-400 text-sm">Spacer ({height}px)</span>
      </div>
    </div>
  );
};

export const QuizQuestionBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  isEditing,
  onUpdate, 
  onSelect,
  className 
}) => {
  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      } ${className}`}
      onClick={onSelect}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Pergunta do Quiz</h3>
          <Badge variant="outline">Quiz</Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-gray-700">{content.question || 'Qual é sua pergunta?'}</p>
          
          <div className="space-y-1">
            {content.options?.map((option: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-gray-300 rounded"></div>
                <span className="text-sm">{option.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {isEditing && (
          <div className="flex items-center space-x-2 pt-2 border-t">
            <Button size="sm" variant="outline">
              Editar Pergunta
            </Button>
            <Button size="sm" variant="outline">
              Adicionar Opção
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const TestimonialBlock: React.FC<BlockComponentProps> = ({ 
  content, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  return (
    <div 
      className={`border-2 p-4 rounded-lg cursor-pointer ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <Card>
        <CardContent className="p-6">
          <blockquote className="italic text-gray-700 mb-4">
            "{content?.text || 'Testimonial text goes here...'}"
          </blockquote>
          <footer className="text-sm text-gray-500">
            — {content?.author || 'Author Name'}
          </footer>
        </CardContent>
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
  testimonial: TestimonialBlock
};
