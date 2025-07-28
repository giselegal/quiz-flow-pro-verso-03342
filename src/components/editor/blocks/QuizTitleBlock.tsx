import React from 'react';
import { cn } from '@/lib/utils';
import { InlineEditText } from './InlineEditText';
import type { BlockComponentProps } from '@/types/blocks';

interface QuizTitleBlockProps extends BlockComponentProps {
  onPropertyChange?: (key: string, value: any) => void;
  disabled?: boolean;
  className?: string;
}

const QuizTitleBlock: React.FC<QuizTitleBlockProps> = ({
  block,
  isSelected = false,
  onClick,
  onPropertyChange,
  disabled = false,
  className
}) => {
  const { 
    title = 'Teste de Estilo Pessoal',
    fontSize = 24,
    fontWeight = '700',
    textAlign = 'center',
    colors = { text: '#f29c68', background: 'transparent' },
    textStyle = '',
    spacing = 16,
    margin = 'mb-6'
  } = block.properties;

  const handlePropertyChange = (key: string, value: any) => {
    if (onPropertyChange) {
      onPropertyChange(key, value);
    }
  };

  // Convert fontSize to CSS
  const fontSizeClass = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
  
  // Convert textAlign to CSS class
  const textAlignClass = textAlign === 'left' ? 'text-left' : 
                        textAlign === 'right' ? 'text-right' : 
                        'text-center';

  // Convert fontWeight to CSS class
  const fontWeightClass = fontWeight === '400' ? 'font-normal' :
                         fontWeight === '500' ? 'font-medium' :
                         fontWeight === '600' ? 'font-semibold' :
                         'font-bold';

  return (
    <div
      className={cn(
        'relative w-full p-4 rounded-lg border-2 border-dashed',
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
        'cursor-pointer hover:border-gray-400 transition-colors',
        className
      )}
      onClick={onClick}
    >
      <InlineEditText
        value={title}
        onChange={(value) => handlePropertyChange('title', value)}
        placeholder="Título do quiz"
        className={cn(
          textAlignClass,
          fontWeightClass,
          textStyle?.includes('italic') ? 'italic' : '',
          textStyle?.includes('underline') ? 'underline' : '',
          margin
        )}
        style={{
          fontSize: fontSizeClass,
          color: colors.text,
          backgroundColor: colors.background,
          marginBottom: `${spacing}px`,
          textDecoration: textStyle?.includes('underline') ? 'underline' : 'none'
        }}
        disabled={disabled}
        as="h1"
        multiline={false}
      />
    </div>
  );
};

export default QuizTitleBlock;