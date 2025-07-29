
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BlockComponentProps {
  content: any;
  isSelected?: boolean;
  onSelect?: () => void;
  onUpdate?: (content: any) => void;
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
      <h3 className="font-semibold mb-2">
        {content?.question || 'Quiz Question'}
      </h3>
      <div className="space-y-2">
        {content?.options?.map((option: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <input type="radio" name="quiz-option" disabled />
            <span>{option.text}</span>
          </div>
        )) || (
          <div className="text-gray-500">No options available</div>
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
